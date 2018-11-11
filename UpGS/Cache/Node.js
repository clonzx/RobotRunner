	//Клиент для сервера на Node.JS
#pragma strict



//public class NodeJS
//{
	 //public static 
	 public var developerContainer:DeveloperContainer;
	 @HideInInspector
	 public var developerSettings:DeveloperSettings;
	 private var l:lng;
	 static var instance:Node;
	 //public static 
	 


	static function Instance():Node
	{
			if (instance == null)
			{
				instance = FindObjectOfType (typeof (Node));
			}
			return instance;
	}
	
function Awake()
{
//	DontDestroyOnLoad(gameObject);
	developerSettings=developerContainer.developerSettings;
	l=lng.Instance();
}



//public static 
function commandSig (cmd:String,key:String[],val:String[],callback:Function) {
	var addErr:String='';
	var form = new WWWForm();
	var sig:String="";
	if (key.length>1&&key[1]=="timestamp"){
		val[1]="~"+developerSettings.developerId;	
	}else{
		Debug.LogError("Node.commandSig command not supported "+cmd);
		return;
	}
	var params=new Dictionary.<String, String>();
	for (var i:int=0;i<key.length;i++){
		form.AddField( key[i], val[i] );
		params.Add(key[i], val[i]);
		if( 
			(cmd=='savecmp'&&(key[i]=="camp"||key[i]=="level"||key[i]=="cfg"||key[i]=="file"))
			||(cmd=='link'&&(key[i]=="name"||key[i]=="fam"||key[i]=="foto"))
			||((cmd=='connect'|| cmd=='getlevelstat')&&(key[i]=="timestamp"))
			)
		{
		}else{
			sig=sig+val[i];
		}
	}

	var cacheItem:CacheItem=developerSettings.GetCacheItem(cmd,CacheType.Config, params);
	var stored:String=developerSettings.ReadStored(cacheItem,params);
	if (stored){
		callback(stored,"");
		return;
	}

	if (cacheItem.source==CacheSource.server||cacheItem.source==CacheSource.cacheServer){
		// Create a download object
		var download:WWW;
		if (cacheItem.source==CacheSource.server){
			//Добавим подпись
			sig=sig+developerSettings.developerKey;
			sig=md5.md5Sum(sig);
			form.AddField( "sig", sig );

			if (PlayerPrefs.GetInt('debug')==1) Debug.Log(developerSettings.server+cmd);
			download= new WWW( developerSettings.server+cmd, form );
		}else{
			var cacheRequist:String=developerSettings.cacheServer+"Config/"+cacheItem.fileName+".json";
			if (PlayerPrefs.GetInt('debug')==1) Debug.Log(cacheRequist);
			download= new WWW(cacheRequist);
		}

		// Wait until the download is done
		yield download;
		try{ 
			if(download.error) {
				if (PlayerPrefs.GetInt('debug')==1) Debug.LogError( "Error downloading: " + download.error +" text="+download.text+" cmd="+cmd);
				addErr=download.error;
	//			#if UNITY_WEBGL
	//            	Application.ExternalEval("alert('node commandSig download.error ="+download.error+"');");
	//			#endif
		//		callback(download); //0.535 clonx 30.09.2015 Раньше возвращала null
			} else {
				//0.545 clonx 21.10.2015 Реализация передачи ошибки с кодом 200 так как для Android с кодом 400 и выше все интерпретируется как файл не найден-->
	//			#if UNITY_WEBGL
	//            	Application.ExternalEval('alert("node commandSig download.text ='+download.text+'");');
	//			#endif
				if (cmd in ["getcampaignid","getcampaign"]){
					if (PlayerPrefs.GetInt('debug')==1) Debug.Log( "Success downloading: "+cmd); //+ download.text );
				}else{
					if (cacheItem.source==CacheSource.server){
						var nr:NodeResponse=JsonUtility.FromJson(download.text,NodeResponse);
						if (nr.ecode!=0){
							switch (nr.ecode){
								case 10:
								case 12:
										addErr=nr.error+' '+nr.msg;
										break;
								case 1002:
										if (l){
											addErr=l.Translate(nr.error)+l.Translate("@limit")+nr.limit;
										}else{
											addErr=nr.error+" limit "+nr.limit;
										}
										break;
								default:
										if (l){
											addErr=l.Translate(nr.error);
										}else{
											addErr=nr.error;
										}
										break;
							}
							if (PlayerPrefs.GetInt('debug')==1) Debug.LogError( "Error downloading: " + download.error +" text="+download.text+" cmd="+cmd);
										
						}else{
						//0.545 clonx 21.10.2015 <--
							if (PlayerPrefs.GetInt('debug')==1) Debug.Log( "Success downloading: "+cmd); //+ download.text );
						} //if (dict['ecode']!=0 && dict['ecode']){
					}//if (cacheItem.source==CacheSource.server){
				} //if (cmd in ["getcampaignid","getcampaign"]){
				
			}
		}catch(e){
			addErr="commandSig exception! "+e;
		}
	//	#if UNITY_WEBGL
	//            Application.ExternalEval("alert('node commandSig cmd="+cmd+" addErr="+addErr+"');");
	//	#endif
		if (PlayerPrefs.GetInt('debug')==1) Debug.Log("node.js before callback cmd="+cmd);
		if (addErr)
		{
			var res:String=developerSettings.ReadResource(cacheItem,params);
			if (res){
				callback(res,"");
				return;
			}
		}
		callback(download.text,addErr);
		if (!addErr) developerSettings.StoreCache(cacheItem,System.Text.Encoding.UTF8.GetBytes(download.text), developerSettings.currentConfigVersion);
	}
}

/*
//public static 
function commandRun (cmd:String,key:String[],val:String[],callback:Function) {
	var form = new WWWForm();
	var sig:String="";
	if (key.length>1&&key[1]=="timestamp"){
		val[1]="~"+developerSettings.developerId;	
	}else{
		Debug.LogError("Node.commandRun command not supported "+cmd);
		return;
	}
	for (var i:int=0;i<key.length;i++){
		form.AddField( key[i], val[i] );
		if( 
			(cmd=='savecmp'&&(key[i]=="camp"||key[i]=="level"||key[i]=="cfg"||key[i]=="file"))
			||(cmd=='link'&&(key[i]=="name"||key[i]=="fam"||key[i]=="foto") )
			)
		{
		}else{
			sig=sig+val[i];
		}
	}
	
	//Добавим подпись
	sig=sig+developerSettings.developerKey;
	sig=md5.md5Sum(sig);
	form.AddField( "sig", sig );

	// Create a download object
	if (PlayerPrefs.GetInt('debug')==1) Debug.Log(developerSettings.server+cmd);
	var download = new WWW( developerSettings.server+cmd, form );

	// Wait until the download is done
	yield download;

	if (PlayerPrefs.GetInt('debug')==1) Debug.Log("node.js before callback cmd="+cmd);
	callback(download);

}
*/

function commandProxy (cmd:String,key:String[],val:String[]):String 
{
	var addErr:String='';
	var sig:String="";
	var param:String='';
	for (var i:int=0;i<key.length;i++){
		if (param!=''){
			param=param+'&';
		}
		param=param+key[i]+"="+val[i];	
		sig=sig+val[i];
	}
	
	//Добавим подпись
	sig=sig+developerSettings.proxyKey;
	sig=md5.md5Sum(sig);
	param=param+'&kod='+sig;

	// Create a download object
	if (PlayerPrefs.GetInt('debug')==1) Debug.Log( developerSettings.proxyServer+cmd+"?"+param);
	return developerSettings.proxyServer+cmd+"?"+param;
	//return "http://127.0.0.1:8003/"+cmd+"?"+param;
}

//}