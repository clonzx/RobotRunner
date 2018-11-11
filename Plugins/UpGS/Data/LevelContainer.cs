using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace UpGS.Data
{
	[System.Serializable]
	public class CreatureU
	{
		public int count;
		public int level;
	}
	[System.Serializable]	
	public class LvlProperty
	{
		public float scaleX;
		public float scaleZ;
		public string startEvent; //TODO:Перейти на индексы
		public string TargetDesc;
		public Vector3 satrtRot;
		public string top1;
		public string top10;
		public string top100;
		public string settings;
		public string TowerControll;
		public string GameType;
		public int SwapHorizontal;//TODO: boolean
		public int SwapVertical;//TODO: boolean
		public int nextLvl;
		public string AudioListener;
		public string SkyBox;
		public string Target;
		public float timeAtack;
		public int CameraFixed;//TODO: boolean
		public string LastFileName;
		public int BonLvl;
		public int ExtendedEvent;//TODO: boolean
		public Vector3 satrtPos;
		public string Menu;
		public string Achievements; //TODO:Перейти на индексы
		public string GUID;
		public int TargetLayer;
		public string AmbientColor;
	}
	[System.Serializable]	
	public class LvlObject
	{
		public int id;
		public Vector3 scale;
		public Vector3 lacation;
		public Vector3 rot;
		public int Obj;
		public int Tip;
		public int NoGlobalAnim;
		public Vector3 animScale;
		public Vector3 animRot;
		public float animSpeed;
		public int anim;
	}
	[System.Serializable]
	public class LvlData
	{
		public int id;
		public LvlObject[] objs;
		public CreatureU[] creatures; // : {\"0\" : [30,1],\"1\" : [30,1]}}
		public LvlProperty property; // : {\"scaleX\" : 0.4,\"scaleZ\" : 0.4,\"startEvent\" : \"rebStart\",\"TargetDesc\" : \"#rebTarget\",\"satrtRot\" : {\"y\" : 180,\"z\" : 0,\"x\" : 45},\"top1\" : \"top1_1\",\"top10\" : \"top10_1\",\"settings\" : \"std\",\"TowerControll\" : \"1\",\"GameType\" : \"BotAtackTower\",\"SwapHorizontal\" : 0,\"nextLvl\" : 2,\"AudioListener\" : \"firstBot\",\"SkyBox\" : \"none\",\"Target\" : \"\",\"timeAtack\" : 4.5,\"CameraFixed\" : 0,\"LastFileName\" : \"rebAsteroid\",\"BonLvl\" : 0,\"ExtendedEvent\" : 0,\"terrain\" : 3,\"satrtPos\" : {\"y\" : 25,\"z\" : 25,\"x\" : 0},\"SwapVertical\" : 0,\"Menu\" : \"GameMenu\",\"top100\" : \"top100_1\",\"Achievements\" : \"none\",\"GUID\" : \"e2bde418-b79c-4250-8938-63899ddb09c0\",\"TargetLayer\" : 8192,\"AmbientColor\" : \"White\"}
	}
	[System.Serializable]
	public class LvlResponse
	{
		public string lvl;// LvlData;
		public string file;
	}


[CreateAssetMenu(fileName = "UpGS level",menuName="UpGS/level data",order=0)]
public class LevelContainer:BaseScriptable //TODO: вызвать AssetBundle2Dict после изменения массива AssetBundle
{
	public UpGS.Data.LvlData lvlData;

	public void SaveJSON()
	{
		jsonText = JsonUtility.ToJson(lvlData);
		base.SaveJSON();
		jsonText="";
	}
	
	public void Parse(string _lvl)
	{
		lvlData=(LvlData)JsonUtility.FromJson(_lvl,typeof(LvlData));

	}
	
	public void LoadJSON()
	{
		base.LoadJSON();
		if (jsonText!=""){
			lvlData=(LvlData)JsonUtility.FromJson(jsonText,typeof(LvlData));
		}
		jsonText="";
	}	
	
	
	
	public void ImportOldJSON(HashRequist _HashRequist, DehashRequist _DehashRequist)
	//F4
	{
		lvlData.objs=new LvlObject[]{};
		lvlData.creatures=new CreatureU[]{};
		base.ImportOldJSON(_HashRequist,_DehashRequist);	
		if (jsonText!=""){
//			_HashRequist(jsonText, delegate(Hashtable LvlOld1){
//				string file=(string)LvlOld1["file"];
//				jsonText=(string)LvlOld1["lvl"];
				_HashRequist(jsonText, delegate(Hashtable LvlOld){
					Hashtable bots=(Hashtable)LvlOld["bots"];
					int count=0;
					//Заполним список AssetBundle
					double _id=(double)LvlOld["id"];
					lvlData.id=Convert.ToInt32(_id);
					Hashtable objs=(Hashtable)LvlOld["objs"];
					foreach (string key in objs.Keys){
						if (PlayerPrefs.GetInt("debug")==1) Debug.Log("LvlCfg.ImportOldJSON key="+key);
						_DehashRequist((Hashtable)objs[key], delegate(string _str){
								LvlObject lo=(LvlObject)JsonUtility.FromJson(_str,typeof(LvlObject));
								System.Array.Resize(ref lvlData.objs, lvlData.objs.Length + 1);
								lvlData.objs[lvlData.objs.Length-1]=lo;
						});
					}
					
					for (int i=0;i<10;i++){
						CreatureU cu=new CreatureU();
						if (bots[""+i]!=null){	
							UnityScript.Lang.Array ba=(UnityScript.Lang.Array)bots[""+i];
							cu.count=Convert.ToInt32(ba[0]);
							cu.level=Convert.ToInt32(ba[1]);
						}else{
							cu.count=0;
							cu.level=0;
						}
						System.Array.Resize(ref lvlData.creatures, lvlData.creatures.Length + 1);
						lvlData.creatures[lvlData.creatures.Length-1]=cu;
					}
					_DehashRequist((Hashtable)LvlOld["property"], delegate(string _str){
						LvlObject lo=(LvlObject)JsonUtility.FromJson(_str,typeof(LvlObject));		
						lvlData.property=(LvlProperty)JsonUtility.FromJson(_str,typeof(LvlProperty)); 
					});
					
				});
//			});
			
		}
//		lvlData.objs=obja;
//		lvlData.creatures=creatures;
		jsonText="";
	}	

}
}