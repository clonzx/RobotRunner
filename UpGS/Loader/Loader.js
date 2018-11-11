#pragma strict

import UnityEngine.SceneManagement;
#if UPGS_VK
import VK.Core;
import VK.VKApi;
#endif



public class ConnectResponse extends System.Object 
{
	var sid:String;
	var timestamp:String;
	var kind:String;
	var email:String;
}

/*
public class LoaderParam extends System.Object 
{
	var apps:App[];
	var primariProvider:Provider;
	var platform:Platform;
	var selectedApps:int=-1;
	var menuLoad:LoadMenuType;
}

public class App extends System.Object 
{
	var appid:String;
	var provider:Provider;
}
*/

class Loader extends MonoBehaviour //jsonLoader //#d1 Загрузчик
{
	private var version:String="0.019";
//	var developerSettings:LoaderParam;
	public var VkApi4Mobile:GameObject;
	public var VkApi4Web:GameObject;
	public var FbApi:GameObject;

	public var vkCallbacks:VkCallbacks;
#if UPGS_VK		
	private var vc:VKCommunicator;
#else
	private var vc:GameObject=null;	
#endif	
	
	private var vk_find:boolean=true;// Нашли пользователя vk true чтобы не искали пока не определим что хостинг VK
	private var connectInfo:String=""; //Временно для тестирования
	public var AutoConnect:boolean; //Для мобильной версии автоматический вход
	private var node:Node;
	private var cache:UpCache;
	static public var mainMenuBundle:AssetBundle;
	
	//Определение завершения этапов
	private var CfgLoaded:boolean=false;
	private var PurchListLoaded:boolean=false;
	private var CacheVersionLoaded:boolean=false;
	private var ReadyLoadConfig:boolean=false;
	
//	public static var shopType:String;//"vkitem","fb","yandex"
	public static var sid:String="";
	public static var timestamp:String="";
	public static var social:String=""; //ID пользователя соцсети
	@HideInInspector
	public var settings:SettingsDataU;
//	public var settingsContainer:SettingsContainer;
	public var gameControll:GameControll; //TA;
	static var instance:Loader;

	private var developerSettings:DeveloperSettings;
	public var fixedMainMenu:GameObject; //#d Главное Меню предопределено и не будет измняться, не загружать из AssetBundle
	public var fixedGameMenu:GameObject; //#d Меню уровней предопределено и не будет измняться, не загружать из AssetBundle

	
//	static public var MainMenu:GameObject;

	static function Instance():Loader
	{
				if (instance == null)
				{
					instance = FindObjectOfType (typeof (Loader));
				}
				return instance;
	}


function Awake()
{
	developerSettings=gameControll.developerContainer.developerSettings;
	PlayerPrefs.SetString('version',version);
	DontDestroyOnLoad(gameObject);
//	if (jsonSourceFile) LoadJSON();
	node=Node.Instance();
	cache=UpCache.Instance();
	PlayerPrefs.SetInt("debug",1); //TODO: Сделать запись через параметры
#if UNITY_WEBGL
	developerSettings.platform=Platform.WebGL;
	if (VkApi4Web){
		VkApi4Web.SetActive(true);
		DontDestroyOnLoad(VkApi4Web);
		vc=VkApi4Web.GetComponent(VKCommunicator);
	    JSCore.GameObjName = VkApi4Web.name;
    }
#endif

#if UNITY_ANDROID
	developerSettings.platform=Platform.Android;
	if (VkApi4Mobile){
	 VkApi4Mobile.SetActive(true);
	 DontDestroyOnLoad(VkApi4Mobile);
	} 
	if (FbApi){
	 FbApi.SetActive(true);
	 DontDestroyOnLoad(FbApi);
	}
#endif

#if UNITY_IOS
	developerSettings.platform=Platform.iOS;
#endif
	settings=gameControll.settingsContainer.settings;
	StartCoroutine(developerSettings.GetCurrentCacheVersion(GetCacheVersion));
}


function Start () {
	if (developerSettings.platform==Platform.WebGL){
	#if UNITY_EDITOR
		//	GetUrl ("file:///F:/Clonx/Work/Eclipse/key4loggs/war/f/index.html?host=fb&appid=176476609610318"); //Sample
			GetUrl ("file:///F:/Clonx/Work/Eclipse/key4loggs/war/f/index.html?host=vk&appid=5739479"); //Sample
	#else
			Application.ExternalEval("SendMessage('Loader', 'GetUrl', document.URL);");
	#endif
	}else{
		developerSettings.shopType="yandex";
		ProviderChange();
		if (developerSettings.menuLoad==LoadMenuType.onStart){
			if (CacheVersionLoaded){
            	GetAllConfig();
            }else{
            	ReadyLoadConfig=true;
            }
		}				
		if (!developerSettings.useUserId){
			SetLevelSocial(developerSettings.apps[developerSettings.selectedApps].appid, developerSettings.primariProvider);
		}
		if (!AutoConnect) return;
		switch (developerSettings.primariProvider){
			case Provider.fb:
#if UPGS_FACEBOOK				
				var fbLogin:FBLogin=FBLogin.Instance ();
				fbLogin.InitOnDemand(developerSettings.apps[developerSettings.selectedApps].appid ,social_user_set);
#endif				
				break;
			case Provider.vk:
#if UPGS_VK				
				var vkLogin:VKLogin=VKLogin.Instance ();
				vkLogin.InitOnDemand(social_user_set);
#endif				
				break;
		}
	}
}

function GetAllConfig()
{
            var appid:String=developerSettings.apps[developerSettings.selectedApps].appid;
			//Скачаем меню
			if (fixedMainMenu){ //Фиксированное меню задано- качать не надо
				MainMenu.Menu=fixedMainMenu;
				gameControll.mainMenu=MainMenu.Menu;
				DontDestroyOnLoad(MainMenu.Menu);
				//Привязка кнопок mapMenu вызовется позже в GetAppConfig
			}else{ 
				node.commandSig ('assetbundle',["sid","timestamp",'bundle','asset','type'],["" , "",appid,'',developerSettings.primariProvider+'_api_id'],GetAppGui);
			}
			if (fixedGameMenu){
				gameControll.GameMenu=fixedGameMenu.GetComponent(Animator);
				GameObject.DontDestroyOnLoad(gameControll.GameMenu.gameObject);
				GameMenu.Instance().mapMenu(gameControll);
			}
			//Скачаем описание приложения
			if(gameControll.useStoredData){
				GetAppConfig("","");
			}else{
				node.commandSig("publiclevel",["sid","timestamp","type","filt","order"],
						["" , "","camp_"+developerSettings.primariProvider,appid,"0"],GetAppConfig);
			}
            if (developerSettings.primariProvider!=Provider.vk){
              for (var i:int;i<developerSettings.apps.length;i++){
                if (developerSettings.apps[i].provider==Provider.vk){
                    appid=developerSettings.apps[i].appid;
                    break;
                }
              }  
            }
            if (developerSettings.useShop){
		        node.commandSig("shopitemlist",["sid","timestamp", "type","place","vk_app"],
				        ["" , "",developerSettings.shopType,"menu",appid]  
				        ,GetShopitemlist);
			}else{
					PurchListLoaded=true;
			}			        

}

function Update()
//Требуется для WEBGL версии
{
//	super();
	if (!vk_find && vc){
#if UNITY_EDITOR
		social_user_set("220095948","Key","Ki","https://pp.userapi.com/c418528/v418528948/a750/fCpgsnIUVJ4.jpg", true);
		vk_find=true;
		return;
#endif
#if UPGS_VK
	  if (vc.Params)
		  try{	
	       var vk_invater:String=""+vc.Params["user_id"]; //Это любой юзер не обязательно владелец
	       var vk_user_id:String=""+vc.Params["viewer_id"];
		   var vk_app:String=""+vc.Params["api_id"];
		   if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.Update vk_invater="+vk_invater+" vk_user_id="+vk_user_id+" vk_app="+vk_app);
		   if (vk_user_id && vk_app){
		   		vk_find=true;
				if (developerSettings.apps[developerSettings.selectedApps].appid!=vk_app){
					Debug.LogError(String.Format("Loader.Update App id in url not correct! Url id={0} appid={1}",developerSettings.apps[developerSettings.selectedApps].appid,vk_app) );
					developerSettings.apps[developerSettings.selectedApps].appid="";
					return;
				}	   
				VKUsers.GetProfiles(vk_user_id, UsrFields.photo_rec, NameCase.nom_Default, vkCallbacks.OnGetProfilesVK);
		   }
		  }catch(e){
		  	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.Update try catch");
		  } 
	  }
#endif	  
	}
}

function GetUrl( _url:String){
//		_url = "file:///F:/Clonx/Work/Eclipse/key4loggs/war/f/index.html?host=fb&appid=1111111";
		var host:String=findParam(_url,"host");
		var appid:String=findParam(_url,"appid");;
		switch (host){
			case "fb":
				developerSettings.primariProvider=Provider.fb;
				FbApi.SetActive(true);
				DontDestroyOnLoad(FbApi);
				developerSettings.shopType="fb";
				break;
			case "vk":
				developerSettings.primariProvider=Provider.vk;
				vk_find=false; //Требуется найти логин VK
				developerSettings.shopType="vkitem";
				break;

		}
		for (var i:int=0;i<developerSettings.apps.length;i++){
			if (developerSettings.apps[i].provider==developerSettings.primariProvider){
				developerSettings.apps[i].appid=appid;
				developerSettings.selectedApps=i;
			}
		}
		if (host=="fb"){
#if UPGS_FACEBOOK		
			var fbLogin:FBLogin=FBLogin.Instance ();
			fbLogin.InitOnDemand(developerSettings.apps[developerSettings.selectedApps].appid ,social_user_set);
#endif			
		}

		if (PlayerPrefs.GetInt("debug")==1) Debug.Log(String.Format("Loader.GetUrl host={0} appid={1}",host,appid));
		if (developerSettings.menuLoad==LoadMenuType.onStart){
			if (CacheVersionLoaded){
            	GetAllConfig();
            }else{
            	ReadyLoadConfig=true;
            }

		}				
		
}

function findParam( _url:String, _param:String):String
{
		var res:String="";
		var place:int=_url.IndexOf ("?");
		if (place < 0)
			return "";
		res=_url.Substring(place+1,_url.Length-(place+1));
		place=res.IndexOf (_param);
		if (place > -1) {
			res = res.Substring (place + _param.Length+1, res.Length - (place + _param.Length+1));
			place = res.IndexOf ("&");
			if (place > 0) {
				res = res.Substring (0, place);
			}
			return res;
		} else {
			return "";
		}
}

function ProviderChange()
{
		for (var i:int=0;i<developerSettings.apps.length;i++){
			if (developerSettings.apps[i].provider==developerSettings.primariProvider){
				developerSettings.selectedApps=i;
			}
		}		
}

function OnGUI()
{
/*
	if (connectInfo){
		var vkLogin:VKLogin;
		GUI.TextArea(Rect(10,10,Screen.width-20,60),connectInfo);
#if !UNITY_WEBGL
		if (GUI.Button(Rect(10,90,200,60),"FB login")){
				if (developerSettings.primariProvider!=Provider.fb){
					developerSettings.primariProvider=Provider.fb;
					ProviderChange();
				}
				var fbLogin:FBLogin=FBLogin.Instance ();
				fbLogin.InitOnDemand(developerSettings.apps[developerSettings.selectedApps].appid ,social_user_set);
		}
		if (GUI.Button(Rect(210,90,200,60),"VK login")){
				if (developerSettings.primariProvider!=Provider.vk){
					developerSettings.primariProvider=Provider.vk;
					ProviderChange();
				}		
				vkLogin=VKLogin.Instance ();
				vkLogin.InitOnDemand(social_user_set);
		}
		if (GUI.Button(Rect(210,160,200,60),"VK logout")){
				vkLogin=VKLogin.Instance ();
				vkLogin.Logout();
		}
		
#endif		
	}
*/	
//	GUI.Label(Rect(Screen.width-150,Screen.height-20,140,20),"версия "+PlayerPrefs.GetString('version'));
}


function social_user_set(_id:String,_fname:String,_lname:String,_foto:String, _success:boolean)
//Подключение с пользователем fb или vk
{
	if (!_success){
		Debug.LogError("Loader.social_user_set no sucess!!!");
/*	
		PlayerPrefs.SetString("MainUserIdType","");
		node.commandSig("connect",["email","eacc","ename","sid","prov","foto","app","aprov","shop"],[loginStrings[0] , loginStrings[1],loginStrings[2],SystemInfo.deviceUniqueIdentifier,"devid","",(ol.host=="vk")?ol.vk_api_id:ol.fb_app_id,ol.host,PlayerPrefs.GetString("shopType")],connectWWW);
			if (PlayerPrefs.GetString('GuiGame')==''){ 
				if (ol.host=="vk"){
					SetLevelSocial(PlayerPrefs.GetString("vk_api_id")); //Студия в зависимости от OneLoad
				}else{
					SetLevelSocial(PlayerPrefs.GetString("fb_app_id")); //Студия в зависимости от OneLoad
				}
			}else{
				PlayerPrefs.SetString("mainMenu",PlayerPrefs.GetString('GuiGame'));
				inNet=true; //0.599 clonx 11.08.2016
				Debug.Log("Start inNet="+inNet);
				openMenu();
			}
*/
		return;
	}
	if (Application.platform == RuntimePlatform.Android) {
				developerSettings.shopType="yandex"; //Для совместимости со старой серверной частью
			}

	Loader.social=_id;
	node.commandSig("connect",["email","timestamp","eacc","ename","sid","sname","prov","foto","app","aprov","shop"],["" ,"", "","",_id,_fname+" "+_lname,"vk",_foto,developerSettings.apps[developerSettings.selectedApps].appid,""+developerSettings.primariProvider,developerSettings.shopType],connectWWW);



	connectInfo=String.Format("{0}: {1} {2} {3} {4}",developerSettings.primariProvider,_id,_fname,_lname,_foto);
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.social_user_set _id="+_id+" _fname="+_fname+" _lname="+_lname+" _foto="+_foto);
}

function connectWWW(download:String,addErr:String)
{
	if (addErr){
		//TODO:VersionText.text=lng.Trans('@Пользователь не определен. Либо отсутствует подключение к Интернету ')+addErr+version;
		Debug.LogError("Loader.connectWWW error="+addErr);
		gameControll.developerContainer.err=addErr;
		return;
	}

	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.connectWWW download.text="+download);
	var cr:ConnectResponse=JsonUtility.FromJson(download,ConnectResponse);
	Loader.sid=cr.sid;
	Loader.timestamp=cr.timestamp;
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.connectWWW sid="+Loader.sid+" timestamp="+Loader.timestamp);
	SetLevelSocial(developerSettings.apps[developerSettings.selectedApps].appid, developerSettings.primariProvider);
}



function SetLevelSocial(_appid:String, _provider:Provider)
{
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.SetLevelSocial "+_provider+_appid);
	var providerStr:String=""+_provider;
	Debug.Log("Loader.SetLevelSocial providerStr="+providerStr);
	if (developerSettings.menuLoad==LoadMenuType.onLogin){
   			if (CacheVersionLoaded){
            	GetAllConfig();
            }else{
            	ReadyLoadConfig=true;
            }

	}				
}

function GetCacheVersion()
{
   			if (ReadyLoadConfig){
            	GetAllConfig();
            }else{
            	CacheVersionLoaded=true;
            }
}

function GetAppGui(download:String, addErr:String)
{
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.GetAppGui download.text="+download);
	if (addErr){
		Debug.LogError("Loader.GetAppGui error: " + addErr);
		gameControll.developerContainer.err=addErr;
		return;
	}
	cache.DownloadAssetBundle(download,function(ab:AssetBundle,_name:String,_bundleName:String ){
		if (ab){
			Loader.mainMenuBundle=ab;
			var rotation:Quaternion=Quaternion.identity;
			rotation.eulerAngles=Vector3(0,0,0);
			MainMenu.Menu=cache.InstallAssetFromBundle(ab,_name,Vector3(0,0,0),rotation,AssetType.menu);
			gameControll.mainMenu=MainMenu.Menu;
			DontDestroyOnLoad(MainMenu.Menu);
			if (CfgLoaded){
				MainMenu.Instance().mapMenu(false);
				MainMenu.CloseLogo();
			}
			if (PurchListLoaded){
				if (developerSettings.useShop){
					ShopList.Instance().GridFill(gameControll.appContainer.GetPurchList(developerSettings.shopType),true);
				}
			}
			


		}
	});
}


function GetAppConfig(download:String,addErr:String)
{
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.GetAppConfig download.text="+download);
	if (addErr){
		Debug.LogError("Loader.GetAppConfig error: " + addErr);
		gameControll.developerContainer.err=addErr;
		return;
	}

	if (!gameControll.useStoredData) gameControll.appContainer.Parse(download);
	CfgLoaded=true;	
	if (MainMenu.Menu){
		MainMenu.Instance().mapMenu(false);
		MainMenu.CloseLogo();
	}
	
}


function GetShopitemlist(download:String,addErr:String)
{
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.GetShopitemlist download.text="+download);
	if (addErr){
		Debug.LogError("Loader.GetShopitemlist error: " + addErr);
		gameControll.developerContainer.err=addErr;
		return;
	}
	gameControll.appContainer.ParsePurch(download,developerSettings.shopType);

	if (MainMenu.Menu){
		ShopList.Instance().GridFill(gameControll.appContainer.GetPurchList(developerSettings.shopType),true);
	}else{
		PurchListLoaded=true;
	}
}

    public function DownloadAssetBundles(_callback:Function)
    {
    	var allCount:int=settings.AssetBundles.length;
    	var loaded:int=0;
		for (var i:int=0; i<settings.AssetBundles.length;i++)
		if (!settings.AssetBundles[i].bundle && !gameControll.AssetBundleIndex.ContainsKey(settings.AssetBundles[i].name)){
			node.commandSig ('assetbundle',["sid","timestamp",'bundle','asset','type'],[PlayerPrefs.GetString("sid") , PlayerPrefs.GetString("timestamp"),settings.AssetBundles[i].name,"","head"],
				function (download:String,addErr:String){
					loaded++;
					if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.DownloadAssetBundles download.text="+download);
					if (addErr){
						Debug.LogError("Loader.DownloadAssetBundles error: " + addErr);
						gameControll.developerContainer.err=addErr;
						if (loaded>=allCount) _callback();
						return;
					}
					cache.DownloadAssetBundle(download,function(ab:AssetBundle,_name:String,_bundleName:String ){
						if (ab){
							for (var j:int=0; j<settings.AssetBundles.length;j++){
								if (settings.AssetBundles[j].name==_bundleName){
									if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.DownloadAssetBundles complete "+_bundleName);
									settings.AssetBundles[j].bundle=ab;
									gameControll.AssetBundleIndex.Add(_bundleName,settings.AssetBundles[j]);
								}
							}
						}
						if (loaded>=allCount) _callback();
					});
			});
		}else{
			loaded++;
			if (loaded>=allCount) _callback();
		}			
	}
	
	public function CheckAssetBundleComlete(_callback:Function)
	//Корутина ожидающая загрузки AssetBundle
	{
		var complete:boolean=false;
		while (!complete){
			complete=true;
			for (var i:int=0; i<settings.AssetBundles.length;i++){
				if (!gameControll.AssetBundleIndex.ContainsKey(settings.AssetBundles[i].name)) complete=false;
			}
			yield WaitForSeconds(0.5);
		} 
		_callback();
	}


}