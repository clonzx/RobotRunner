import UpGS.Data;

private var loader:Loader;
public var StartPlacePrefab:GameObject;
public var PathFindPlacePrefab:GameObject;
public var TerrainGroup:GameObject;
public var root:GameObject;
private var cache:UpCache;
public var gameControll:UpGS.Data.GameControll;
@HideInInspector
public var gameControllRunner:UpGS.Data.GameControllRunner=null;
@HideInInspector
public var settings:SettingsDataU;
@HideInInspector
public var lvlData:LvlData;
public var cameraPrefab:GameObject;

function Awake()
{
//	lvlCfg=LvlCfg.Instance();
	loader=Loader.Instance();
	cache=UpCache.Instance();
	gameControll.raycastHitProcesor=RaycastHitPrc;
	settings=gameControll.settingsContainer.settings;
	lvlData=gameControll.levelContainer.lvlData;
	if (typeof(gameControll)==typeof(UpGS.Data.GameControllRunner)){
		gameControllRunner=gameControll;
	}
	
}


function Start()
{
	if (!loader){
		startDefault();
	}else{
		loader.CheckAssetBundleComlete(CreateScene);
	}
}

function startDefault()
//Запуск без загрузчика
{
	if (gameControll.GameMenu){
		GameMenu.Instance().mapMenu(gameControll);
		gameControll.GameMenu.Play("openState");
		return;
	}		
#if UNITY_EDITOR	
	var path:String="Assets/Content/";
	var menu:GameObject = AssetDatabase.LoadAssetAtPath(path+"Menu/GameMenu.prefab", GameObject);
	menu=Instantiate(menu,Vector3(0,0,0),  Quaternion.identity);
	gameControll.GameMenu=menu.GetComponent("Animator");
	GameMenu.Instance().mapMenu(gameControll);
	gameControll.GameMenu.Play("openState");
	GameObject.DontDestroyOnLoad(gameControll.GameMenu.gameObject);
	//TODO: GameMenuMaper.Map(menu,gameControll);
#endif	
}

function CreateScene()
{
	if (gameControllRunner!=null){ //Для уровня Runner зададим сдвиг контейнера всех объектов
		//root.transform.localPosition.z=(gameControllRunner.loadNum-1)*50;
		root.transform.localPosition=gameControllRunner.rootShift+lvlData.property.satrtPos;
	}


	LoadCreatures();
	LoadObjects();
	SetCamera();
	LoadGameMenu();
	MainMenu.LogoAnim.Play("closeState");
	MainMenu.MainAnim.Play("closeState");
	RunnerSceneCreate();
}

function RunnerSceneCreate()
{
	if (typeof(gameControll)!=typeof(GameControllRunner)) return;
	var gcr:GameControllRunner=gameControll;
	gcr.CreateScene();
}



function LoadGameMenu()
{
	if (gameControll.GameMenu){
		gameControll.GameMenu.Play("openState");
		GameMenu.Instance().mapMenu(gameControll);
		return;
	}
	if (lvlData.property.Menu){
		for (var i:int=0;i<settings.menus.length;i++){
			if (settings.menus[i].name==lvlData.property.Menu){
					var bu:BaseU=settings.menus[i];
					var mGO:GameObject=cache.InstallAssetFromBundle(gameControll.GetAssetBundle(bu.bundle),bu.pref,Vector3(0,0,0), Quaternion.identity, AssetType.menu);
					gameControll.GameMenu=mGO.GetComponent(Animator);
					GameMenu.Instance().mapMenu(gameControll);
					gameControll.GameMenu.Play("openState");
					GameObject.DontDestroyOnLoad(gameControll.GameMenu.gameObject);
					//TODO: GameMenuMaper.Map(menu,gameControll);
				return;
			}
			Debug.LogError("TowerAtack.LoadGameMenu menu not find in settings "+lvlData.property.Menu);
		}
	}else{
		Debug.LogWarning("TowerAtack.LoadGameMenu menu not defined");
	}
}

function SetCamera()
{
	if (!Camera.main && cameraPrefab){
		var mGO=Instantiate(cameraPrefab, Vector3(0,0,0),  Quaternion.identity);
		GameObject.DontDestroyOnLoad(mGO);
		if (typeof(gameControll)==typeof(GameControllRunner)){
			var gcr:GameControllRunner=gameControll;
			gcr.player=mGO;
		}
	}
	if (typeof(gameControll)==typeof(GameControllRunner)) return;
	Camera.main.transform.parent.position=lvlData.property.satrtPos;
	Camera.main.transform.localEulerAngles=lvlData.property.satrtRot;
}

function LoadCreatures()
{
}

function LoadObjects()
{
	for (var i:int=0;i<lvlData.objs.length;i++){
		Object2Scene(lvlData.objs[i]);
		if (gameControllRunner!=null){
			if ( gameControllRunner.loadedLevelList.Count>gameControllRunner.needLevels){
				yield; //чтобы не мешать игре
			}
		}
	}
}


function RaycastHitPrc(hit:RaycastHit)
{
	if (PlayerPrefs.GetInt('debug')==1) Debug.Log("TowerAtack.RaycastHitPrc hit="+hit);
	//TODO: проверить попадания в область высадки на примере AddAtack
//	AddCreature(gameControll.CreatureSelect,hit.point);
}


function AddCreature(_nom:int,_place:Vector3)
{
	if (lvlData.creatures.length>_nom && _nom>-1){
			var prefab:GameObject=gameControll.settingsContainer.GetPrefab(5,_nom);
			if (prefab){
					var mGO:GameObject=Instantiate(prefab, _place,  Quaternion.identity);
					mGO.transform.SetParent(transform);
			}
	}else{
		Debug.LogError("TowerAtack.AddCreature not find in lvlData.creatures _nom="+_nom+" lvlData.creatures.length="+lvlData.creatures.length);
	}
}




function Object2Scene(obj:LvlObject)
//Добавитиьт объект на сцену
{
	var towerU:TowerU;
	var resourceU:ResourceU;
	var wallU:WallU;
	var thingU:ThingU;
	var prefab:GameObject;
	var bundle:AssetBundle;
	try{
		var rot:Quaternion=Quaternion.identity;
		rot.eulerAngles=obj.rot;
		var mGO:GameObject;
	//	if (PlayerPrefs.GetInt('debug')==1) Debug.Log(obj['Tip']);
	//	var setHash=LevelCollection.GetData('settings');
	//	prefHash=setHash[obj['Tip']+"-"+obj['Obj']];

		//TODO: Вывод сообщения если prefHash не найден
	//	if (PlayerPrefs.GetInt('debug')==1) Debug.Log("TowerAtack.Object2Scene before if (obj['Tip']==8){");
		if (obj.Tip==8){
			var place:Transform;
			switch (obj.Obj){
				case 0:
					mGO=Instantiate(StartPlacePrefab, obj.lacation,  rot);
#if UPGS_TOWER
					place=TerrainGroup.GetComponentInChildren(BaseAtackPlace).transform;
#endif					
					break;
				case 1:
#if UPGS_TOWER				
					place=TerrainGroup.GetComponentInChildren(PathPlace).transform;
#endif					
					mGO=Instantiate(PathFindPlacePrefab, obj.lacation,  rot);
					//if (Application.loadedLevelName=='Atack'){
					var zone : MeshRenderer = mGO.GetComponent(MeshRenderer);
					zone.enabled=false;
					//}
					break;
				default:
					place=root.transform;
					break;
			}
			if (mGO){
				mGO.transform.SetParent(place);
				mGO.transform.localScale=obj.scale;
				mGO.transform.localPosition=obj.lacation;
			}
		}else{
			prefab=gameControll.settingsContainer.GetPrefab(obj.Tip,obj.Obj);
			if (prefab){
					mGO=Instantiate(prefab, obj.lacation,  rot);
					mGO.transform.SetParent(root.transform);
					mGO.transform.localScale=obj.scale;
					mGO.transform.localPosition=obj.lacation;
			}
		}			
	}catch(e){
		Debug.LogError("TerrainAction AddLevel2Screen exception!!"+e);
	}
}
