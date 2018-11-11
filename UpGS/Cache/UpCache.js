#pragma strict

import UnityEngine.SceneManagement;
//import VK.Core;
//import VK.VKApi;

public enum AssetType{menu};

class UpCache extends jsonLoader
{
	static var instance:UpCache;
	private var node:Node;
	

static function Instance():UpCache
{
	if (instance == null)
	{
				instance = FindObjectOfType (typeof (UpCache));
	}
	return instance;
}

function Awake()
{
	node=Node.Instance();
}

static function Str2File (fileName:String,str:String) {
	var bytes:byte[] = System.Text.Encoding.UTF8.GetBytes(str);
	try 
	{
#if UNITY_WEBPLAYER||UNITY_WEBGL
	PlayerPrefs.SetString(fileName+'.json',str);
#else
	System.IO.File.WriteAllBytes(Application.persistentDataPath+'/'+fileName+'.json',bytes);
#endif
	}catch(e){
	}
}

function InstallAssetFromBundle(_bundle:AssetBundle,_name:String,_location:Vector3,_rotation:Quaternion,_type:AssetType):GameObject
{
		var go:GameObject;
#if UNITY_EDITOR		
		var place:String;
		switch (_type){
			case AssetType.menu:
				place="Assets/Content/Menu/";
				break;
			default:
				Debug.LogError("UpCache.InstallAssetFromBundle AssetType temporary not supported "+AssetType);
				return null; 						
		}
	    go = AssetDatabase.LoadAssetAtPath(place+_name+".prefab", GameObject);
	    
	    if (!go){ 
		if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Loader.GetAppGuiProcess asset not found "+place+_name+".prefab");
	    }else{
		 go=Instantiate(go,_location,  _rotation);
	    }
#endif
	 	if (!go){
			try{
				go=Instantiate(_bundle.LoadAsset(_name),_location,  _rotation);
			}catch(e){
				Debug.Log("UpCache.InstallAssetFromBundle exception MainMenu=Instantiate e="+e); 
			}
	 	}
	 	return go;			
}


function DownloadAssetBundle(_cfg:String, _callback:AssetBundleBigDelegate)
{
	if (PlayerPrefs.GetInt("debug")==1)  Debug.Log("UpCache.DownloadAssetBundle _cfg="+_cfg);
	var appGui:AppGuiResponse=JsonUtility.FromJson(_cfg,AppGuiResponse);
	if (appGui.ecode!=0){
		Debug.LogError("UpCache.DownloadAssetBundle Error code="+appGui.ecode+" text="+_cfg);
		_callback(null,"","");
		return;
	}
	
	var cacheItem:CacheItem=node.developerSettings.GetCacheItem(appGui.bundle.name,CacheType.Assetbundle, new Dictionary.<String,String>());
	
		
		StartCoroutine(node.developerSettings.ReadStored(cacheItem, appGui, (this as MonoBehaviour ),function(_assetBundle:AssetBundle):IEnumerator{
		if 	(_assetBundle){
			_callback(_assetBundle,appGui.bundle.asset,appGui.bundle.name);
		}else{
			if (cacheItem.source==CacheSource.resource){
					//Только из ресурсов - не читать с сервера
					appGui.bundle.version=-1;
					StartCoroutine(node.developerSettings.ReadStored(cacheItem, appGui,(this as MonoBehaviour ),function(_assetBundle:AssetBundle):IEnumerator{
							if 	(_assetBundle){
								_callback(_assetBundle,appGui.bundle.asset,appGui.bundle.name);
							}else{					
								_callback(null,"",""); 
							}
							yield null;
					}));
					return;
			}					
			var url:String;
			var  www:WWW;
			try{
					switch (Application.platform){
								case RuntimePlatform.Android:
									url=appGui.bundle.Android;
									if (appGui.bundle.useRockld||appGui.bundle.UseProxyForAndroid) url=node.commandProxy("url",["page","useRockld"],[url,appGui.bundle.useRockld]); 
									break;
								case RuntimePlatform.IPhonePlayer:
									url=appGui.bundle.iOS;
									if (appGui.bundle.useRockld) url=node.commandProxy("url",["page","useRockld"],[url,""+appGui.bundle.useRockld]); 
									break;
								case RuntimePlatform.WebGLPlayer:
									url=appGui.bundle.WebGL;
									if (appGui.bundle.UseProxyForWebGL||appGui.bundle.useRockld) url=node.commandProxy("url",["page","useRockld"],[url,appGui.bundle.useRockld]); //0.592 clonx 16.06.2016
									break;
								case RuntimePlatform.WindowsEditor:
									url=appGui.bundle.Android;
									if (appGui.bundle.useRockld||appGui.bundle.UseProxyForAndroid) url=node.commandProxy("url",["page","useRockld"],[url,""+appGui.bundle.useRockld]); 
									break;
								default:
									url=appGui.bundle.Android;
									if (appGui.bundle.useRockld) url=node.commandProxy("url",["page","useRockld"],[url,""+appGui.bundle.useRockld]); 
					}
			}catch(e){
					Debug.LogError("UpCache.GetAssetBundle exception "+e);
			}

			if (Application.platform==RuntimePlatform.WebGLPlayer || cacheItem.strategy==CacheStrategy.NoCache){
				if (PlayerPrefs.GetInt("debug")==1) Debug.Log("UpCache.DownloadAssetBundle url="+url);
				www = WWW.LoadFromCacheOrDownload(url,appGui.bundle.version);
				yield www;

				if (www.error != null){
					Debug.LogError("UpCache.DownloadAssetBundle www exception  "+www.error);
					_callback(null,"","");
					return;
				}		
			}else{
				Debug.Log("UpCache.DownloadAssetBundle !useCache before url="+url);
				www = new WWW(url);
				yield www;
				if (www.error == null){
					node.developerSettings.StoreCache(cacheItem,www.bytes, appGui.bundle.version);
				}else{
					Debug.LogError("UpCache.DownloadAssetBundle useCache error WriteAllBytes url="+url+" error="+www.error);
					//Возьмем из кэша без контроля версии
					appGui.bundle.version=-1;
					StartCoroutine(node.developerSettings.ReadStored(cacheItem, appGui,(this as MonoBehaviour ),function(_assetBundle:AssetBundle):IEnumerator{
							if 	(_assetBundle){
								_callback(_assetBundle,appGui.bundle.asset,appGui.bundle.name);
							}else{					
								_callback(null,"",""); 
							}
							yield null;
					}));
					return;
				}
			}	
			_callback(www.assetBundle,appGui.bundle.asset,appGui.bundle.name);
		}
	}));
	
}

}