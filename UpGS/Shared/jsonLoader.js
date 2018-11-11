public var jsonSourceFile:String="test"; //Исходные данные
public var jsonText:String; //Исходные данные
public var fromResource:boolean=false; //Исходные данные
public var useHotKeysInEditor:boolean=false; //использовать горячие клавиши для сохранения и загрузки настроек
protected var NextButtonTime:float=0; //Время срабытывания, нужно для защиты от повторов
protected var CheckButtonDelay:float=1; 

#if UNITY_EDITOR
function Update()
{
	if (useHotKeysInEditor&&(Time.time>NextButtonTime)){ 	
		if  (Input.GetKey(KeyCode.F2)){
			SaveJSON();
		}
		if  (Input.GetKey(KeyCode.F3)){
			LoadJSON();
		}
		if  (Input.GetKey(KeyCode.F4)){
			ImportOldJSON();
		}
	}		
}
#endif

protected function OnlyLoadJson()
{
	if (!jsonSourceFile) return;
	if (fromResource){
		var txa:TextAsset=Resources.Load(jsonSourceFile);
		jsonText=txa.text;
	}else{
		if (System.IO.File.Exists(Application.persistentDataPath+'/'+jsonSourceFile)){ 
					var bytes:byte[]=System.IO.File.ReadAllBytes(Application.persistentDataPath+'/'+jsonSourceFile);
					jsonText=System.Text.Encoding.UTF8.GetString(bytes);
		}
	}
	NextButtonTime=Time.time+CheckButtonDelay;
}

function LoadJSON()
{
	OnlyLoadJson();
}

function ImportOldJSON()
{
	OnlyLoadJson();	
}


function SaveJSON()
{
	if (!jsonSourceFile) return;
	var bytes:byte[] = System.Text.Encoding.UTF8.GetBytes(jsonText);
	System.IO.File.WriteAllBytes(Application.persistentDataPath+'/'+jsonSourceFile,bytes);	
	NextButtonTime=Time.time+CheckButtonDelay;
}
