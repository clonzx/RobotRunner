using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

namespace UpGS.Data
{
	public delegate void HashResponse(Hashtable _hash);	
	public delegate void HashRequist(string _jsonText,HashResponse _callback);
	public delegate void DehashResponse(string _str);	
	public delegate void DehashRequist(Hashtable _hash,DehashResponse _callback);

	public class BaseScriptable:ScriptableObject
	{
		public string jsonSourceFile;
		public bool fromResource;
		public string jsonText;

		public void OnlyLoadJson()
		{
			if (jsonSourceFile=="") return;
			if (fromResource){
				TextAsset txa=(TextAsset)Resources.Load(jsonSourceFile);
				jsonText=txa.text;
			}else{
				if (System.IO.File.Exists(Application.persistentDataPath+'/'+jsonSourceFile)){ 
					byte[] bytes=System.IO.File.ReadAllBytes(Application.persistentDataPath+'/'+jsonSourceFile);
					jsonText=System.Text.Encoding.UTF8.GetString(bytes);
				}
			}
		}
		
		public void LoadJSON()
		{
			OnlyLoadJson();
		}
		
		public void ImportOldJSON(HashRequist _HashRequist, DehashRequist _DehashRequist)
		{
			OnlyLoadJson();	
		}
		
		
		public void SaveJSON()
		{
			if (jsonSourceFile=="") return;
			byte[] bytes = System.Text.Encoding.UTF8.GetBytes(jsonText);
			System.IO.File.WriteAllBytes(Application.persistentDataPath+'/'+jsonSourceFile,bytes);	
		}
	}

}
