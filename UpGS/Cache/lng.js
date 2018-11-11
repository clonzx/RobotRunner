#pragma strict
import UnityEngine.UI;

class lng extends MonoBehaviour {
	static var instance:lng;
	public var Slovar:Hashtable;
	public var UserSlovar:Hashtable;
	public var sysLang:SystemLanguage;
//	public var ol:OneLoad;


	function Awake()
	{
		Slovar= new Hashtable();
		UserSlovar= new Hashtable();
	}

	function Start()
	{
//		ol= OneLoad.Instance();
	}
	
	static function str2sys(lngStr:String):SystemLanguage
	{
		if (!lngStr){
			return Application.systemLanguage;
		}
		var sl:SystemLanguage=SystemLanguage.English;
		switch (lngStr)
		{
			case "English":	sl=SystemLanguage.English;
							break;
			case "Russian":	sl=SystemLanguage.Russian;
							break;
			case "Afrikaans":	sl=SystemLanguage.Afrikaans;
							break;
			case "Belarusian":	sl=SystemLanguage.Belarusian;
							break;
			case "Bulgarian":	sl=SystemLanguage.Bulgarian;
							break;
			case "Catalan":	sl=SystemLanguage.Catalan;
							break;
			case "Chinese":	sl=SystemLanguage.Chinese;
							break;
			case "Dutch":	sl=SystemLanguage.Dutch;
							break;
			case "Danish":	sl=SystemLanguage.Danish;
							break;
			case "Estonian":	sl=SystemLanguage.Estonian;
							break;
			case "Finnish":	sl=SystemLanguage.Finnish;
							break;
			case "French":	sl=SystemLanguage.French;
							break;
			case "German":	sl=SystemLanguage.German;
							break;
			case "Greek":	sl=SystemLanguage.Greek;
							break;
			case "Hebrew":	sl=SystemLanguage.Hebrew;
							break;
			case "Icelandic":	sl=SystemLanguage.Icelandic;
							break;
			case "Indonesian":	sl=SystemLanguage.Indonesian;
							break;
			case "Italian":	sl=SystemLanguage.Italian;
							break;
			case "Japanese":	sl=SystemLanguage.Japanese;
							break;
			case "Korean":	sl=SystemLanguage.Korean;
							break;
			case "Latvian":	sl=SystemLanguage.Latvian;
							break;
			case "Lithuanian":	sl=SystemLanguage.Lithuanian;
							break;
			case "Norwegian":	sl=SystemLanguage.Norwegian;
							break;
			case "Polish":	sl=SystemLanguage.Polish;
							break;
			case "Portuguese":	sl=SystemLanguage.Portuguese;
							break;
			case "Romanian":	sl=SystemLanguage.Romanian;
							break;
			case "SerboCroatian":	sl=SystemLanguage.SerboCroatian;
							break;
			case "Slovak":	sl=SystemLanguage.Slovak;
							break;
			case "Slovenian":	sl=SystemLanguage.Slovenian;
							break;
			case "Spanish":	sl=SystemLanguage.Spanish;
							break;
			case "Swedish":	sl=SystemLanguage.Swedish;
							break;
			case "Thai":	sl=SystemLanguage.Thai;
							break;
			case "Turkish":	sl=SystemLanguage.Turkish;
							break;
			case "Ukrainian":	sl=SystemLanguage.Ukrainian;
							break;
			case "Vietnamese":	sl=SystemLanguage.Vietnamese;
							break;
			case "ChineseSimplified":	sl=SystemLanguage.ChineseSimplified;
							break;
			case "ChineseTraditional":	sl=SystemLanguage.ChineseTraditional;
							break;
			case "Unknown":	sl=SystemLanguage.Unknown;
							break;
			case "Hungarian":	sl=SystemLanguage.Hungarian;
							break;
		}
		return sl;
	}
	
	static function Instance():lng
	{
			if (instance == null)
			{
				instance = FindObjectOfType (typeof (lng));
				var sls:String=PlayerPrefs.GetString("systemLanguage");
				if (!sls){
					 sls=""+Application.systemLanguage;
					 PlayerPrefs.SetString("systemLanguage",sls);
				}					 
				var sl:SystemLanguage;
				sl=lng.str2sys(sls);
				//if (sl!=SystemLanguage.Russian && sl!=SystemLanguage.English) sl=SystemLanguage.English;
				instance.ChangeLng(sl);
			}
			
			return instance;
	}	
	
	static function SetLng(_lng:String)
	{
		if (PlayerPrefs.GetInt("debug")==1) Debug.Log("lng.SetLng "+_lng);
//		PlayerPrefs.SetString("systemLanguage",_lng);
		if (!Instance()){
			if (PlayerPrefs.GetInt('debug')==1) Debug.Log ("lng manager not loaded");
			return;
		}
		Instance().ChangeLng(lng.str2sys(_lng));
	
	}

	static function file():String
	{
		if (SystemInfo.operatingSystem=="Windows 10  (10.0.0) 64bit") {
			//return 'file://c:/';
			return 'file://';
		}else{
			return 'file://';
		}
	}

	function ChangeLng(lang:SystemLanguage)
	{
/*		
		if (PlayerPrefs.GetInt("debug")==1) Debug.Log("lng.ChangeLng "+lang);
		Slovar=new Hashtable();
		UserSlovar=new Hashtable();
		var str:String='Lng/'+lang;
		//0.578.3 clonx 11.03.2016-->
		var ta:TextAsset=Resources.Load(str);
		if (ta){
			Slovar=JSONUtils.ParseJSON(ta.text);				
			//0.578.3 clonx 11.03.2016<--
		}else{
		//0.607 clonx 19.10.2016-->
			ta=Resources.Load('lng/English');
			Slovar=JSONUtils.ParseJSON(ta.text);				
		//0.607 clonx 19.10.2016<--
		}
		sysLang=lang;
		//Settings
		var lc:LevelCollection=LevelCollection.Instance();
		if (!lc){
			UserSlovar["#Title"]=(lang==SystemLanguage.Russian)?"Студия 'бЫстро иГры'":"'Upcoming games' studio";
		 	return;
		}
		if (!lc.Settings){
			UserSlovar["#Title"]=(lang==SystemLanguage.Russian)?"Студия 'бЫстро иГры'":"'Upcoming games' studio";
			return;
		}

		var count:int=0;
		var prefix:String=PopupDropDown.getPrefix('Translate');
		while (count>=0){
			var term:Hashtable=lc.Settings[prefix+count];
			if (!term) return; 
			if (!term[""+lang]){
				count++;
			 	continue;
			}
			UserSlovar[term["name"]]=term[""+lang]?term[""+lang]:term["English"]; //0.606 clonx 18.10.2016 убрал '#' //0.607 clonx 19.10.2016 добавил :term["English"]
			count++;
		}
*/	
	}
	
	static function GetName(_name:Hashtable):String
	{
		var nh:Hashtable;
		if (typeof(_name["name"])==System.String)
				return _name["name"];
	
		if (!Instance()){
				nh=_name["name"];
				return nh['def'];
		}
		nh=_name["name"];
		return nh[""+Instance().sysLang]?nh[""+Instance().sysLang]:nh['def'];
	}
	
	function OnApplicationQuit ()
	{
		instance = null;
	}
	
	static function Trans(term:String):String
	{
		if (!Instance()){
			if (PlayerPrefs.GetInt('debug')==1) Debug.Log ("lng manager not loaded");
			return;
		}
		var res:String;
		if (!term) return ''; //0.606 clonx 07.10.2016
		if (term.Substring(0,1)=="#"){ //0.592 clonx Перевод из пользовательского словаря
			res=Instance().UserSlovar[term];
		}else{
			res=Instance().Slovar[term];
		}
		res=res?res:term;
		res=Instance().MacroName(res);
		return res;
	} 		

	static function TransGUI(go:GameObject):String
	//0.606 clonx 07.10.2016 Перевод формы
	{
		if (!go) return '';
		if (PlayerPrefs.GetInt("debug")==1) Debug.Log("lng.TransGUI "+go.name);
		
		for (var t:Text in go.GetComponentsInChildren(Text)){

//			if (t.name=="#Bots and Towers: Beginning"){ 
//				t.text="Превед, Медвед!";
//			}

			var trans:String=lng.Trans(t.name);
			trans=(trans==t.name)?t.text:trans;
			trans=Instance().MacroName(trans);
			t.text=trans;
		}
		return '';
	} 		


	function Translate(term:String):String
	{
		var res:String;
		if (!term) return ''; //0.606 clonx 07.10.2016
		if (term.Substring(0,1)=="#"){ //0.592 clonx Перевод из пользовательского словаря
			res=UserSlovar[term];
		}else{
			res=Slovar[term];
		}
		res=res?res:term;
		res=Instance().MacroName(res);
		return res;
	} 
	
	function MacroName(_input:String):String
	//0.672 clonx 23.03.2017 Замена макро имен на текст
	{
		var res:String="";
		var pos:int;
		//var len:int;
		var term:String;
		var ind:int=0;
		var allterms:String[]=["~username~"];
		if (_input.IndexOf("~")<0) return _input; //Не содержится макроимен
		for (ind=0;ind<allterms.length;){
			term=allterms[ind];
			pos=_input.IndexOf(term);
			if (pos>=0){
				res=res+_input.Substring(0,pos);
				switch (term){
					case "~username~":
						res="";//TODO: ;ol.userProfile.name;
						break;
					default:
						res=res+term;
						break;
				}	 
				_input=_input.Substring(pos+term.length,_input.length-(pos+term.length));
			}else{
				ind++;
			}
		}
		res=res+_input;	
		
		return res;
		
	}
	
}	