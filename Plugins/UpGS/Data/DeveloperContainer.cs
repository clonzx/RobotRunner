using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

namespace UpGS.Data
{
	public delegate IEnumerator AssetBundleDelegate(AssetBundle _assetBundle); //, AppGuiResponse _appGui, CacheItem _cacheItem, AssetBundleBigDelegate _callback);
	public delegate void AssetBundleDelegateFunc(AssetBundle _assetBundle); 
	public delegate void AssetBundleBigDelegate (AssetBundle _assetBundle,string _asset,string _name);
	public enum Provider{fb,vk,email};
	public enum Platform{WebGL,Android,iOS};
	public enum LoadMenuType{onStart,onLogin};
	public enum CacheSource{server,cacheServer,resource}; // 
	//server Сервер создания конфигов heroku.com
	//cacheServer Сервер хранения кэша github.com
	//resource В ресурсах приложения
	public enum CacheStrategy{NoCache,Version};
	public enum CacheType{Image,Assetbundle,Data,Config}; //Для Assetbundle только параметр CacheStrategy и CacheSource.resource или нет.

	public delegate void versionRecived();
//Настройки кэша -->
	[System.Serializable]
	public class CacheItem
	{
		public string item; //item="" это группа
		public CacheType type;
		public bool fromGroup; //Брать настройки для группы(source,strategy) и только subKey отсюда
		public int firstParam; //Номер первого параметра, который надо учитывать, если <0 то не использовать. Если заполнен subKey игнорируется
		public string[] subKey;
		public CacheSource source;
		public CacheStrategy strategy;
		[System.NonSerialized] public string fileName;

		public void CreateName(Dictionary<string, string> _params)
		{
			fileName = item;
			int i=0;
			if (firstParam >= 0) {
				foreach(string key in _params.Keys){
					if (i>=firstParam){
						fileName = fileName + "_" + _params [key];
					}
					i++;
				}
			} else {
				for (i=0; i<subKey.Length; i++) {
					if (_params.ContainsKey (subKey [i])) {
						fileName = fileName + "_" + _params [subKey [i]];
					}
				}
			}
		}
		static public CacheItem From(CacheItem _from){
			CacheItem toItem=new CacheItem();
			toItem.item=_from.item; 
			toItem.type=_from.type; 
			toItem.fromGroup=_from.fromGroup; 
			toItem.firstParam=_from.firstParam; 
			toItem.subKey=_from.subKey; 
			toItem.source=_from.source; 
			toItem.strategy=_from.strategy; 
			return toItem;
		}
	}	
//Настройки кэша <--



	[System.Serializable]
	public class App
	{
		public string appid;
		public Provider provider;
	}

[System.Serializable]
public class DeveloperSettings
{
		public string developerId; //код разработчика в UpGS
		public string developerKey; //ключ разработчика в UpGS
		public string lvl_KEY; //Генерим вручную. Внутренний для контрольных сумм уровней меняться не должен в рамках приложения
		[System.NonSerialized] public string proxyKey; //Получаем с сервера после авторизации Внутренний ключ для proxy может меняться в версиях


		public string googlePublicKey; //ключ для покупок в Google play
		public string yandexPublicKey; //ключ для покупок в Yandex store

		public string server; //Основной сервер 
		public string proxyServer; //Прокси сервер для загрузки WebGL контента
		public string cacheServer; //Серер хранения кэша
		public string cacheVersionSource; //json файл с текущей версией кэша

		public CacheItem[] cacheSettings;
		[System.NonSerialized] private Dictionary<CacheType, object> cacheIndex;
		private Dictionary<string,int> cacheVersion;
		[System.NonSerialized] public int currentConfigVersion=1;
		[System.NonSerialized] public int currentImageVersion=1;

		public App[] apps;
		public Provider primariProvider;
		public Platform platform;
		public int selectedApps=-1;
		public LoadMenuType menuLoad;
		[System.NonSerialized] public string shopType; //Какой магазин "vkitem","fb","yandex"
		public bool useShop=false; //Посылать запрос покупок
		public bool useUserId=false; //Пытаться идентифицировать пользователя


		public IEnumerator GetCurrentCacheVersion (versionRecived _callback)
		{
			if (cacheVersionSource!=""){
				WWW requist=new WWW(cacheVersionSource);
				yield return requist;
				if (requist.error!=null&&requist.error!=""){
					Debug.LogError("DeveloperContainer.GetCurrentCacheVersion error="+requist.error);
				}else{
					try{
						Dictionary<string,object> cvo= (Dictionary<string,object>)MiniJSON.Json.Deserialize(requist.text);
						if (cvo.ContainsKey("currentConfigVersion")){
							currentConfigVersion=System.Convert.ToInt32(cvo["currentConfigVersion"]);
						}
						if (cvo.ContainsKey("currentImageVersion")){
							currentImageVersion=System.Convert.ToInt32(cvo["currentImageVersion"]);
						}
					}catch{};
				}
			}
			_callback ();
		}

		public void StoreVersion()
		{
			string str = MiniJSON.Json.Serialize(cacheVersion); //JsonUtility.ToJson(cvs);
			#if UNITY_WEBGL
				PlayerPrefs.SetString("/cache/version.json',str);
			#else
				byte[] bytes = System.Text.Encoding.UTF8.GetBytes(str);
				System.IO.Directory.CreateDirectory(Application.persistentDataPath+"/cache");
				System.IO.File.WriteAllBytes(Application.persistentDataPath+"/cache/version.json",bytes);
			#endif

		}

		public void RestoreVersion()
		{
			
			string str="";
			//Найдем версии в кэше
			#if UNITY_WEBGL
					str=PlayerPrefs.GetString("/cache/version.json');
					if (str!="" && PlayerPrefs.GetInt("debug")==1) Debug.Log("DeveloperContainer.RestoreVersion version get from cache");
			#else
				try	{
					if (System.IO.File.Exists(Application.persistentDataPath+"/cache/version.json")){ 
						byte[] bytes=System.IO.File.ReadAllBytes(Application.persistentDataPath+"/cache/version.json"); 
						str=System.Text.Encoding.UTF8.GetString(bytes);
						if (PlayerPrefs.GetInt("debug")==1) Debug.Log("DeveloperContainer.RestoreVersion version get from cache");
					}else{
						str="";
					}
				}catch{}
			#endif
			//Не нашли в кэше - найдем версии в ресурсах
			if (str==""){
					TextAsset ta=(TextAsset)Resources.Load("cache/version");
					if (ta!=null){
						str=ta.text;
						if (PlayerPrefs.GetInt("debug")==1) Debug.Log("DeveloperContainer.RestoreVersion version get from resource");
					}
			}

			cacheVersion=new Dictionary<string,int>();	
			if (str!=""){
				Dictionary<string,object> cvo= (Dictionary<string,object>)MiniJSON.Json.Deserialize(str);
				foreach (string key in  cvo.Keys){
					cacheVersion.Add(key,System.Convert.ToInt32(cvo[key]));
				}	
			}

		}


		public void CreateCacheIndex()
		{
			cacheIndex=new  Dictionary<CacheType, object>();
			Dictionary<string, int> cacheConfig=new  Dictionary<string, int>();
			Dictionary<string, int> cacheAssetBundle=new  Dictionary<string, int>();
			for (int i=0;i<cacheSettings.Length;i++){
				switch (cacheSettings[i].type){ 
					case CacheType.Config:
						cacheConfig.Add(cacheSettings[i].item,i);
						break;
					case CacheType.Assetbundle:
						cacheAssetBundle.Add(cacheSettings[i].item,i);
						break;
				}
			}
			cacheIndex.Add(CacheType.Config,cacheConfig);
			cacheIndex.Add(CacheType.Assetbundle,cacheAssetBundle);

		}

		public CacheItem GetCacheItem(string _item, CacheType _type, Dictionary<string, string> _params)
		{
			CacheItem tmpCache = null;
			CacheItem groupCache = null;
			if (cacheIndex.ContainsKey (_type)) {
				Dictionary<string, int> cacheS = (Dictionary<string, int>)cacheIndex [_type];
				if (cacheS.ContainsKey (_item)) { //Частное правило для элемента
					tmpCache = cacheSettings [cacheS [_item]];
				}
				if (tmpCache == null || tmpCache.fromGroup){
					if (cacheS.ContainsKey ("")) {//Общее правило для всех
						groupCache = cacheSettings [cacheS [""]];
					}

					if (groupCache!=null&&tmpCache!=null){
						tmpCache.source=groupCache.source;
						tmpCache.strategy=groupCache.strategy;
					}
					if (groupCache!=null && tmpCache==null){
						tmpCache=CacheItem.From(groupCache);
						tmpCache.item=_item;
					}
				}
			}
			if (tmpCache==null) tmpCache= new CacheItem();
//			Debug.Log ("DeveloperContainer.GetCacheItem tmpCache.strategy=" + tmpCache.strategy + " tmpCache.item=" + tmpCache.item);
			tmpCache.CreateName (_params);
			return tmpCache;
		}

		public void StoreCache(CacheItem _config,byte[] _bytes, int _version)
		//Сохраним AssetBundle
		{
				if (_config==null||_config.strategy==CacheStrategy.NoCache||Application.platform==RuntimePlatform.WebGLPlayer) return;
				try 
				{
						string extension="";
						switch (_config.type){
							case CacheType.Assetbundle:
								extension=".unity3d";
								break;
							case CacheType.Config:
								extension=".json";
								break;
						}
						System.IO.Directory.CreateDirectory(Application.persistentDataPath+"/cache");
						System.IO.Directory.CreateDirectory(Application.persistentDataPath+"/cache/"+_config.type);
						System.IO.File.WriteAllBytes(Application.persistentDataPath+"/cache/"+_config.type+"/"+_config.fileName+extension,_bytes);

					if (cacheVersion.ContainsKey(_config.fileName)){
						cacheVersion.Remove(_config.fileName);
					}
					cacheVersion.Add(_config.fileName, _version);
					StoreVersion();
				}catch{
				}
		}

		public string ReadStored (CacheItem _config,Dictionary<string, string> _param)
		{
			string res = "";
			if (_config==null) return "";
			if (PlayerPrefs.GetInt ("debug") == 1)
				Debug.Log ("DeveloperContainer.ReadStored _config.strategy=" + _config.strategy + " _config.item=" + _config.item);
			if (_config.strategy==CacheStrategy.Version){
				if (cacheVersion.ContainsKey(_config.fileName)){
					if (currentConfigVersion>cacheVersion[_config.fileName]) return "";
				}else{
					return "";
				}
			}

			if (_config.strategy != CacheStrategy.NoCache) {
				res = ReadCache (_config, _param);
			}
			if (res==""&&(_config.strategy != CacheStrategy.NoCache||_config.source == CacheSource.resource)){
				res = ReadResource (_config, _param);
			}
			return res;
		}

		
		public IEnumerator ReadStored (CacheItem _config, AppGuiResponse _appGui, MonoBehaviour _component, AssetBundleDelegate _callback) //AssetBundleBigDelegate _callbackParam
		{
			AssetBundle res = null;
			bool complete = false;
			if (_config == null) {
				yield return _component.StartCoroutine(_callback (res));//,_appGui,_config, _callbackParam);
			} else {
				if (PlayerPrefs.GetInt ("debug") == 1)Debug.Log ("DeveloperContainer.ReadStored _config.strategy=" + _config.strategy + " _config.item=" + _config.item+" _config.type"+_config.type);
				if (_config.strategy == CacheStrategy.Version) {
					if (cacheVersion.ContainsKey (_config.fileName)) {
						if (_appGui.bundle.version > cacheVersion [_config.fileName]){
							yield return _component.StartCoroutine(_callback(res));//,_appGui,_config, _callbackParam));
							complete=true;
						}
					} else {
							yield return _component.StartCoroutine(_callback(res));//,_appGui,_config, _callbackParam));
						complete=true;
					}
				}
				if (complete==false) {
					if (_config.strategy == CacheStrategy.NoCache){
						ReadResource (_config,_appGui,_component, _callback);
					}else{
						yield return _component.StartCoroutine(ReadCache (_appGui,_component, _callback, delegate(AssetBundle _assetBundle){
							if (_assetBundle==null){ 
								ReadResource (_config,_appGui,_component, _callback);
							}
						}));
					}
					complete=true;
				}
				if (!complete) 
					yield return _component.StartCoroutine(_callback (res));//,_appGui,_config, _callbackParam));
			}
		}

		public string ReadCache (CacheItem _config,Dictionary<string, string> _param)
		{
			if (_config==null) return "";
			string str="";
			try 
			{
				#if UNITY_WEBGL
					str=PlayerPrefs.GetString("/cache/'+_config.type+_config.fileName+'.json');
				#else
				try	{
					if (System.IO.File.Exists(Application.persistentDataPath+"/cache/"+_config.type+"/"+_config.fileName+".json")){ 
						byte[] bytes=System.IO.File.ReadAllBytes(Application.persistentDataPath+"/cache/"+_config.type+"/"+_config.fileName+".json"); 
						str=System.Text.Encoding.UTF8.GetString(bytes);
					}else{
						str="";
					}
				}catch{
					Debug.LogError("DeveloperContainer.ReadCache exception");
				}
				#endif
			}catch{
				str="";
			}
			return str;
		}


		public IEnumerator ReadCache (AppGuiResponse _appGui,  MonoBehaviour _component, AssetBundleDelegate _callback, AssetBundleDelegateFunc _callback2)
		{
			AssetBundle res=null;
				#if UNITY_WEBGL
					yield return _component.StartCoroutine(_callback(res));
				#else
					WWW www=null;
					if (System.IO.File.Exists(Application.persistentDataPath+"/cache/"+CacheType.Assetbundle+"/"+_appGui.bundle.name+".unity3d")){ 
						www = WWW.LoadFromCacheOrDownload("file://"+Application.persistentDataPath+"/cache/"+CacheType.Assetbundle+"/"+_appGui.bundle.name+".unity3d",_appGui.bundle.version);
						yield return www;
					}
					if (www==null||(www.error!=null&&www.error!="")){
						if (www!=null) Debug.LogError("DeveloperContainer.ReadCache error="+www.error);
						_callback2(null);
					}else{
						_callback2(www.assetBundle);	
						yield return _component.StartCoroutine(_callback(www.assetBundle));
					}
				#endif
		}

		public void ReadResource (CacheItem _config, AppGuiResponse _appGui,MonoBehaviour _component, AssetBundleDelegate _callback)
		{
			_component.StartCoroutine (ReadResourceCor (_config, _appGui, _component, _callback));
		}

		public IEnumerator ReadResourceCor (CacheItem _config, AppGuiResponse _appGui,MonoBehaviour _component, AssetBundleDelegate _callback)
		{
			if (_config == null) {
				yield return _component.StartCoroutine (_callback (null));
			} else {
				AssetBundle ab=null;
				try{
					TextAsset fileAsText  = Resources.Load( "cache/" + _config.type + "/" + _appGui.bundle.name) as TextAsset;
					if ( fileAsText != null )
					{
						byte[] bundleData  = fileAsText.bytes.Clone() as byte[];
						AssetBundleCreateRequest  abcr= AssetBundle.LoadFromMemoryAsync( bundleData );
						ab=abcr.assetBundle;
					}
				}catch{
				}
				yield return _component.StartCoroutine (_callback (ab));
			}
		}

		public string ReadResource (CacheItem _config,Dictionary<string, string> _param)
		{
			if (_config==null) return "";	
			string str="";
				try	{
					TextAsset ta=(TextAsset)Resources.Load("cache/"+_config.type+"/"+_config.fileName);
					if (ta==null) return "";
					str=ta.text;
				}catch{
					Debug.LogError("DeveloperContainer.ReadResource exception");
				}

			return str;
		}
}


[CreateAssetMenu(fileName = "UpGS developer",menuName="UpGS/developer data",order=0)]
public class DeveloperContainer:BaseScriptable //TODO: вызвать AssetBundle2Dict после изменения массива AssetBundle
{
	public bool LoadOnEnabled;
	public DeveloperSettings developerSettings;
	public string msg;
	public string err;

		public void OnEnable()
		{

			if (LoadOnEnabled)
				LoadJSON ();
			developerSettings.CreateCacheIndex();
			developerSettings.RestoreVersion();
		}


	public void Parse(string _cfg)
	{
		developerSettings=(DeveloperSettings)JsonUtility.FromJson(_cfg,typeof(DeveloperSettings));
	}
		
		public void LoadJSON()
		{
			base.LoadJSON();
			if (jsonText!=""){
				Parse(jsonText);
			}
			jsonText="";
		}
		
		public void SaveJSON()
		{
			jsonText = JsonUtility.ToJson(developerSettings);
			base.SaveJSON ();
			jsonText="";
		}


}

}