import UpGS.Data;

private var loader:Loader;
public var StartPlacePrefab:GameObject;
public var PathFindPlacePrefab:GameObject;
public var TerrainGroup:GameObject;
private var cache:UpCache;
public var gameControll:UpGS.Data.GameControllTA;
@HideInInspector
public var settings:SettingsDataU;
@HideInInspector
public var lvlData:LvlData;

function Awake()
{
//	lvlCfg=LvlCfg.Instance();
	loader=Loader.Instance();
	cache=UpCache.Instance();
	gameControll.raycastHitProcesor=RaycastHitPrc;
	settings=gameControll.settingsContainer.settings;
	lvlData=gameControll.levelContainer.lvlData;
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
#if UNITY_EDITOR
	var path:String="Assets/Content/";
	var menu:GameObject = AssetDatabase.LoadAssetAtPath(path+"Menu/GameMenu.prefab", GameObject);
	menu=Instantiate(menu,Vector3(0,0,0),  Quaternion.identity);
	gameControll.GameMenu=menu.GetComponent("Animator");
	gameControll.GameMenu.Play("openState");
	GameMenuMaper.Map(menu,gameControll);
#endif	
}

function CreateScene()
{
	LoadCreatures();
	LoadObjects();
	SetCamera();
	LoadGameMenu();
	MainMenu.LogoAnim.Play("closeState");
	MainMenu.MainAnim.Play("closeState");
}


function LoadGameMenu()
{
	if (lvlData.property.Menu){
		for (var i:int=0;i<settings.menus.length;i++){
			if (settings.menus[i].name==lvlData.property.Menu){
					var bu:BaseU=settings.menus[i];
					var mGO:GameObject=cache.InstallAssetFromBundle(gameControll.GetAssetBundle(bu.bundle),bu.pref,Vector3(0,0,0), Quaternion.identity, AssetType.menu);
					gameControll.GameMenu=mGO.GetComponent(Animator);
					gameControll.GameMenu.Play("openState");
					GameMenuMaper.Map(mGO,gameControll);
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
	}
}


function RaycastHitPrc(hit:RaycastHit)
{
	if (PlayerPrefs.GetInt('debug')==1) Debug.Log("TowerAtack.RaycastHitPrc hit="+hit);
	//TODO: проверить попадания в область высадки на примере AddAtack
	AddCreature(gameControll.CreatureSelect,hit.point);
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
					break;
			}
			if (mGO){
				mGO.transform.SetParent(place);
				mGO.transform.localScale=obj.scale;
			}
		}else{
			prefab=gameControll.settingsContainer.GetPrefab(obj.Tip,obj.Obj);
			if (prefab){
					mGO=Instantiate(prefab, obj.lacation,  rot);
					mGO.transform.SetParent(transform);
					mGO.transform.localScale=obj.scale;
			}
		}			
	}catch(e){
		Debug.LogError("TerrainAction AddLevel2Screen exception!!"+e);
	}
}
