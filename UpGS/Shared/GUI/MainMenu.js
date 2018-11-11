public static var Menu:GameObject;
public static var instance:MainMenu;
public static var MainAnim:Animator; 
public static var LogoAnim:Animator;
public static var loadProgressAll:Indicator;
public static var loadProgressOne:Indicator;
private var node:Node;
public var gameControll:GameControll;
@HideInInspector
public var apps:AppDescription[];

public static var ShopItemAnim:Animator;

static function Instance():MainMenu
{
			if (instance == null)
			{
				instance = FindObjectOfType (typeof (MainMenu));
			}
			return instance;
}

function Awake()
{
	gameControll.mainMenuCloseLogo=MainMenu.CloseLogo;
	node=Node.Instance();
	apps=gameControll.appContainer.apps;
	if (typeof(gameControll)==typeof(GameControllRunner)){
		var gcr:GameControllRunner=gameControll;
		gcr.loader=OpenLevelNum;
	}
	
}

function Scale(_scaleFactor:float)
{
	var cs:CanvasScaler=MainMenu.Menu.GetComponent.<CanvasScaler>();
	if (cs) cs.scaleFactor=_scaleFactor;
}


static function CloseLogo()
{
	if (MainMenu.LogoAnim) MainMenu.LogoAnim.Play("Close");
}

function mapMenu(_onlyTranslate:boolean)
//Привязать к GUI загруженному из AsstBundle
// _settingsLoad Привязки после загрузки настроек
{
	var but:Button;
	var ls:LayerShift;
	var text:UI.Text;
	if (!MainMenu.Menu){
		Debug.LogError("MainMenu.mapMenu MainMenu.Menu not defined!");
	 	return;
	} 
	if (PlayerPrefs.GetFloat("ScaleGUI")) Scale(PlayerPrefs.GetFloat("ScaleGUI"));
	
	if (!_onlyTranslate){
		MainAnim=MainMenu.Menu.GetComponent(Animator);
		//Animator
/*		
		for (var anim:Animator in ol.MainMenu.GetComponentsInChildren(Animator)){
			switch (anim.gameObject.tag){
				case "Logo":
					var ind:Indicator=anim.gameObject.GetComponent(Indicator);
					if (!ind){
						LogoAnim=anim;
						ol.LogoAnim=anim;
						if (PlayerPrefs.GetInt("MenuCall")==1){
							anim.Play("closeState");
						}else{
							anim.Play("CloseSlow");
						}
						break; 
					}
					switch(ind.Type){
						case IndEnum.loadProgressAll: 
							ol.loadProgressAll=ind;
							//if (PlayerPrefs.GetInt('debug')==1) 
							Debug.LogWarning("loadProgressAll find!");
							break;
						case IndEnum.loadProgressOne: 
							ol.loadProgressOne=ind;
							Debug.LogWarning("loadProgressOne find!");
							break;
					}
					break;	
				case "popup":
					MsgAnim=anim;
					shop.MsgAnim=anim;
					break;	
				case "Back":
					BackAnim=anim;
					but=anim.GetComponent(Button);
					but.onClick.RemoveAllListeners(); //Подчистим стырые события так как класс мог удалятся , а главное меню и фиксированные кнопки на нем существуют всегда
					but.onClick.AddListener(BackMenu);
					break;
			}
		}
		//Text
		for (var text:Text in ol.MainMenu.GetComponentsInChildren(Text)){
			switch (text.gameObject.tag){
				case "Version":
					VersionText=text;
					break;	
				case "Msg":
					MsgText=text;
					shop.MsgText=text;
					break;	
			}
		}
		//RectTransform
		for (var rt:RectTransform in ol.MainMenu.GetComponentsInChildren(RectTransform)){
			switch (rt.gameObject.tag){
				case "ContentArea":
					canvasScrolRect=rt;
					break;	
				case "Settings":
					but=rt.GetComponent(Button);
					but.onClick.RemoveAllListeners(); 
					but.onClick.AddListener(function() {setOldGUI(true);});
					break;	
				case "Shop":
					ShopCanva=rt.gameObject;
					break;
				case "ShopItem":
					shop.ShopGrid=rt.GetComponent(Grid);
					break;
				case "ShopButton":		
					but=rt.GetComponent(Button);
					but.onClick.RemoveAllListeners(); 
					but.onClick.AddListener(function() {
						ShopCanvaShow(true);
						shop.openMenu();
						if (shop.ShopGrid) shop.ShopGrid.Open(0);
					});
					break;	
				case "Quit":
#if UNITY_WEBPLAYER||UNITY_WEBGL				
					rt.gameObject.SetActive(false);
#else
					but=rt.GetComponent(Button);
					but.onClick.RemoveAllListeners(); 
					but.onClick.AddListener(ApplicationQuit);
#endif					
					break;
			}
		}
	//Valuer
*/	
		for (var vr:Valuer in MainMenu.Menu.GetComponentsInChildren(Valuer)){
			but=vr.gameObject.GetComponent(Button);
			switch (vr.nameVal){
/*
				case "Shop":
					ShopCanva=rt.gameObject;
					break;
*/
				case "ShopItem":
					ShopItemAnim=vr.GetComponent(Animator);
					break;

				case "ShopButton":		
					but=vr.GetComponent(Button);
					but.onClick.RemoveAllListeners(); 
					but.onClick.AddListener(function() {
						ShopItemAnim.Play("Open");
//						ShopCanvaShow(true);
//						shop.openMenu();
//						if (shop.ShopGrid) shop.ShopGrid.Open(0);
					});
					break;	

				case "Version":
					text=vr.GetComponent(UI.Text);
					if (text) text.text=lng.Trans("@version")+" "+PlayerPrefs.GetString('version');
					break;	
			
				case "Logo":
					var ind:Indicator=vr.gameObject.GetComponent(Indicator);
					if (!ind){
						MainMenu.LogoAnim=vr.gameObject.GetComponent(Animator);
//						if (PlayerPrefs.GetInt("MenuCall")==1){
//							anim.Play("closeState");
//						}else{
//							anim.Play("CloseSlow");
//						}
						break; 
					}
					switch(ind.Type){
						case IndEnum.loadProgressAll: 
							MainMenu.loadProgressAll=ind;
							//if (PlayerPrefs.GetInt('debug')==1) 
							Debug.LogWarning("loadProgressAll find!");
							break;
						case IndEnum.loadProgressOne: 
							MainMenu.loadProgressOne=ind;
							Debug.LogWarning("loadProgressOne find!");
							break;
					}
					break;	
				case "LayerShift":
					ls=vr.gameObject.GetComponent(LayerShift);
					if (!ls){
						ls=vr.gameObject.AddComponent(LayerShift);
						ls.InitParam(vr.intVal);
					}
					break;
				case "LvlRun":
					but=vr.GetComponent(Button);
					but.onClick.RemoveAllListeners(); //Подчистим стырые события так как класс мог удалятся , а главное меню и фиксированные кнопки на нем существуют всегда
					but.onClick.AddListener(function(){
						OpenLevelNum(vr.intVal);
					});
//					AddListener(but,vr.intVal);
//TODO:					mapSubRun(but,vr.intVal, vr.strVal); //Примапим изображения доступности и закрытости уровня
					break;													
/*			
				case "VKFriend":
					VKFriend=vr;
					break;
				case "BriefingMail":
					BriefingMail=vr;
					break;
*/					
				case "fbLogin":
#if UNITY_WEBPLAYER||UNITY_WEBGL											
					vr.gameObject.SetActive(false);
					break;
#endif				
					if (!but) break;
					//but.onClick.RemoveAllListeners();
					if (vr.strVal!="done"){ 		
						but.onClick.AddListener(function() {
							//PlayerPrefs.SetString("MainUserIdType","fb");
#if UPGS_FACEBOOK							
							var fbLogin:FBLogin=FBLogin.Instance ();
//TODO:							fbLogin.InitOnDemand(ol.fb_app_id,social_user_set);
#endif
						});
					}						
					vr.strVal="done";
				
					break;
				case "vkLogin":
#if UNITY_WEBPLAYER||UNITY_WEBGL											
					vr.gameObject.SetActive(false);
					break;
#endif
					if (!but) break;
					//but.onClick.RemoveAllListeners();
					if (vr.strVal!="done"){ 		
						but.onClick.AddListener(function() {
#if UPGS_VK						
							var vkLogin:VKLogin=VKLogin.Instance ();
							//PlayerPrefs.SetString("MainUserIdType","vk");
//TODO:							vkLogin.InitOnDemand(social_user_set);
#endif
						});
					}						
					vr.strVal="done";
					break;
				case "Logout":
#if UNITY_WEBPLAYER||UNITY_WEBGL											
					vr.gameObject.SetActive(false);
#else				
					if (!but) break;
					//but.onClick.RemoveAllListeners();
					
					if (vr.strVal!="done"){ 		
						but.onClick.AddListener(function() {
							try{
#if UPGS_VK							
									VKLogin.Logout();
#endif									
							}catch(e){
							}
							try{
#if UPGS_FACEBOOK							
								FBLogin.Logout();
#endif								
							}catch(e){
							}
							PlayerPrefs.SetString("mail","");
							PlayerPrefs.SetString("mailPass","");
							PlayerPrefs.SetString("mailName","");
							PlayerPrefs.SetString("MainUserIdType","");
//TODO:							WaitLogin(3);
						});
					}						
					vr.strVal="done";
#endif				
					break;
				case "skeepLogin":
					if (!but) break;
					//but.onClick.RemoveAllListeners();
					if (vr.strVal!="done"){ 		
						but.onClick.AddListener(function() {
//TODO:							social_user_set("","","","", false);
//TODO:							closeLogin();
						});
					}
					vr.strVal="done";
					break;
				case "mailLogin":
					if (!but) break;
					//but.onClick.RemoveAllListeners();
					if (vr.strVal!="done"){ 		
						but.onClick.AddListener(function() {
//TODO:							mailLogin(vr.intVal==1);
						});
					}
					vr.strVal="done";
					break;
				case "loginSettings":
					if (!but) break;
					if (vr.strVal!="done"){ 		
						but.onClick.AddListener(function() {
//TODO:							loginSettings();
						});
					}
					break;
				case "RuntimePlatform":
#if !UNITY_EDITOR				
					switch (vr.strVal){
						case "Android":
							if (Application.platform!=RuntimePlatform.Android){
								vr.gameObject.SetActive(false);
							}
							break;
						case "WebGLPlayer":
							if (Application.platform!=RuntimePlatform.WebGLPlayer){
								vr.gameObject.SetActive(false);
							}
							break;
						case "IPhonePlayer":
							if (Application.platform!=RuntimePlatform.IPhonePlayer){
								vr.gameObject.SetActive(false);
							}
							break;
							
					}
#endif					
					break;
			}
		}
	} 
/*	
	else{
		if (!menuRedy.AchGet||!menuRedy.SettingsGet) return;
		//Запустим события
		try{ 
			if (mainMenu['startEvent']&&mainMenu['startEvent']!='none'){
						Debug.Log("GameCanvas.FindStartEvent EventList.findEventName mainMenu['startEvent']="+mainMenu['startEvent']);
						EventList.findEventName(mainMenu['startEvent']);   //0.671 clonx 20.03.2017
			}
		}catch(e)
		{
			Debug.LogError("GameCanvas.FindStartEvent exception!");	
		}	
		
		
		for (var vr:Valuer in ol.MainMenu.GetComponentsInChildren(Valuer)){
			but=vr.gameObject.GetComponent(Button);
			switch (vr.nameVal){
				case "LayerShift":
					ls=vr.gameObject.GetComponent(LayerShift);
					if (!ls){
						ls=vr.gameObject.AddComponent(LayerShift);
						ls.InitParam(vr.intVal);
					}
					break;
				case "LvlRun":
					but=vr.GetComponent(Button);
					but.onClick.RemoveAllListeners(); //Подчистим стырые события так как класс мог удалятся , а главное меню и фиксированные кнопки на нем существуют всегда
					AddListener(but,vr.intVal);
					mapSubRun(but,vr.intVal, vr.strVal); //Примапим изображения доступности и закрытости уровня
					break;
				case 'NextBrief':
				case 'NextEvent':
					if (!but) break;
					but.onClick.RemoveAllListeners(); 		
					but.onClick.AddListener(function() {
						EventList.nextEvent();
					});
					break;
				case 'BonusArea':
					ol.bonusText=vr.gameObject.GetComponent(UI.Text);
					break;
				case 'LoadingState':
					ol.loadingStateMsg=vr.gameObject.GetComponent(UI.Text);
					break;
				case 'InviteButton':
					if (!but) break;
					but.onClick.RemoveAllListeners(); //Подчистим стырые события так как класс мог удалятся , а главное меню и фиксированные кнопки на нем существуют всегда
									but.onClick.AddListener(function() {
										//TODO: переделать в зависимости от среды запуска

										switch (ol.host){
											case "vk":
												VKLogin.Invate();
												Debug.Log("GameCanvas.mapMenu Invite vk");
												break;
											case "fb":
												var st:String=EventList.getSocialText(vr.strVal);
												if (!st) st=vr.strVal;
												FBLogin.InvateScriptParam(st,function(_head:String,_msg:String){
													_head=lng.Trans(_head);
													_msg=lng.Trans(_msg);
													FBLogin.InvateScriptStatic(_head,_msg);
													Debug.Log("GameCanvas.mapMenu Invite fb");												
												});
												break;
										}
										Debug.Log("Invite ");
									});
					break;
				case 'ClearCache':
					if (!but) break;
					but.onClick.RemoveAllListeners(); 		
					but.onClick.AddListener(function() {
						CleanCache();
					});
					break;
				case 'SettingsWindow':
					SettingsWindow=vr.gameObject;
					break;
				case 'OpenSettings':
					if (!but) break;
					//but.onClick.RemoveAllListeners(); 		
					if (vr.strVal!="done"||FirstAfterMenuCall){
						but.onClick.AddListener(function() {
							ReadSettings();
						});
						vr.strVal="done";
					}
					break;
				case 'SaveSettings':
					if (!but) break;
					//but.onClick.RemoveAllListeners(); 		
					if (vr.strVal!="done"||FirstAfterMenuCall){
						but.onClick.AddListener(function() {
							WriteSettings();
						});
						vr.strVal="done";
					}
					break;
			}
			
		}
		FirstAfterMenuCall=false;
	}
*/
}



 
function OpenLevelNum(nom:int)
//Открыть уровень с номером
{
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("MainMenu.OpenLevelNum nom="+nom);
	var fileName:String;
	LogoAnim.Play("openState");
	if (loadProgressAll) loadProgressAll.GetComponent(Animator).Play("openState");
	if (loadProgressOne) loadProgressOne.GetComponent(Animator).Play("openState");
	//Загрузка описания уровня
	if (gameControll.useStoredData){
		if (nom>gameControll.levelContainers.length){
			return;
		}
		gameControll.levelContainer=gameControll.levelContainers[nom-1];
		SetLevelNom(nom);
		Loader.Instance().DownloadAssetBundles(RunLevel);
	}else{
		node.commandSig("loadlevel",["sid","timestamp","camp","num"],
												[Loader.sid , Loader.timestamp,""+apps[0]._id,""+nom],
			function (download:String,addErr:String){
					if (addErr){
						//TODO:VersionText.text=lng.Trans('@Пользователь не определен. Либо отсутствует подключение к Интернету ')+addErr+version;
						Debug.LogError("MainMenu.OpenLevelNum loadlevel error="+addErr);
						gameControll.developerContainer.err=addErr;
						return;
					}
					if (PlayerPrefs.GetInt("debug")==1) Debug.Log("MainMenu.OpenLevelNum loadlevel download.text="+download);
					var lvl:LvlResponse=JsonUtility.FromJson(download,LvlResponse);
					fileName=""+apps[0]._id+"_"+lvl.file;
					UpCache.Str2File(fileName,lvl.lvl);
					gameControll.levelContainer.jsonSourceFile=fileName+'.json';
					gameControll.levelContainer.fromResource=false;
					gameControll.levelContainer.ImportOldJSON(
						function(_jsonText:String,_callback: UpGS.Data.HashResponse){
							var Hash:Hashtable=JSONUtils.ParseJSON(_jsonText);
							_callback(Hash);
						},
						function(_hash:Hashtable,_callback: UpGS.Data.DehashResponse){
							var str:String=JSONUtils.HashtableToJSON(_hash);
							_callback(str);
						}
					);
						//Загрузка настроек уровня				
					node.commandSig("loadsettings",["sid","timestamp","camp","name"],
														[Loader.sid , Loader.timestamp,""+apps[0]._id,gameControll.levelContainer.lvlData.property.settings],
							function (download:String,addErr:String){
								if (addErr){
									//TODO:VersionText.text=lng.Trans('@Пользователь не определен. Либо отсутствует подключение к Интернету ')+addErr+version;
									Debug.LogError("MainMenu.OpenLevelNum  loadsettings error="+addErr);
									gameControll.developerContainer.err=addErr;
									return;
								}												
								if (PlayerPrefs.GetInt("debug")==1) Debug.Log("MainMenu.OpenLevelNum loadsettings download.text="+download);
								var Hash:Hashtable=JSONUtils.ParseJSON(download);
								var str:String=JSONUtils.HashtableToJSON(Hash["lvl"]);
		//						var cfg:SettingsResponse=JsonUtility.FromJson(download.text,SettingsResponse);
								fileName=""+apps[0]._id+"_"+gameControll.levelContainer.lvlData.property.settings+".cfg";
								UpCache.Str2File(fileName,str);
								gameControll.settingsContainer.jsonSourceFile=fileName+'.json';
								gameControll.settingsContainer.fromResource=false;
								gameControll.settingsContainer.ImportOldJSON(
									function(_jsonText:String,_callback: UpGS.Data.HashResponse){
										var Hash:Hashtable=JSONUtils.ParseJSON(_jsonText);
										_callback(Hash);
									},
									function(_hash:Hashtable,_callback: UpGS.Data.DehashResponse){
										var str:String=JSONUtils.HashtableToJSON(_hash);
										_callback(str);
									}
								);
								SetLevelNom(nom);
								Loader.Instance().DownloadAssetBundles(RunLevel);
							}
					);	
			});	
		}
}

function SetLevelNom(nom:int)
{
	if (typeof(gameControll)==typeof(GameControllRunner)){
		var gcr:GameControllRunner=gameControll;
		gcr.loadNum=nom;
	}						
}

function RunLevel()
{
				//TODO сделать совместимым: LvlCfg.Instance().Parse(download.text);
				//gameControll.lastLoadedLevelName="TowerAtack";
				switch (typeof(gameControll)){
					case typeof(GameControllRunner):
						var gcr:GameControllRunner=gameControll;
						if (gcr.curentLevel==0){
							SceneManager.LoadScene("Runner");
						}else{
							SceneManager.LoadSceneAsync("Runner",LoadSceneMode.Additive);
						}
						Debug.Log("--GameControllRunner--Runner--");
						break;
					case typeof(GameControllTA):
						SceneManager.LoadScene("TowerAtack");						
						Debug.Log("--GameControllTA--TowerAtack--");
						break;
					default:
						Debug.LogError("--GameControllTA--TowerAtack--");
						break;
				}
								//Application.LoadLevel("TowerAtack");
}

