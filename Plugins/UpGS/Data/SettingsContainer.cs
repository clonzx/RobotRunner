using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;


namespace UpGS.Data
{

//public delegate void ObjConfigResponse(BaseU _obj);

[System.Serializable]
public class BaseU 
{
	public string name;
	public string bundle;
	public string pref;
}

[System.Serializable]
public class AnyU : BaseU
{
	public int ReplaceLayer;
	public int AddCollider;
}

[System.Serializable]
public class TerrainU : AnyU
{
}

[System.Serializable]
public class HealthU : AnyU
{
	public int health;
}

[System.Serializable]
public class WarriorU : HealthU
{
	public int range;
	public string bullet;
	public int bulletInd; //TODO:   Новое поле - перейти на него
	public float frequency;
	public float targetDistanceMin;
	public float targetDistanceMax;
}

[System.Serializable]
public class TowerU : WarriorU
{
}

[System.Serializable]
public class BotU  :  WarriorU
{
	public int aiStrength;
	public int valute; //","type"  "Valcount"},
	public bool NotUseMotor;
	public string description;
}

[System.Serializable]
public class ResourceU : HealthU
{
}

[System.Serializable]
public class WallU : HealthU
{
}

[System.Serializable]
public class ThingU : AnyU
{
}

[System.Serializable]
public class BulletU : BaseU
{
	public int damageAmount;
	public int radiusDetonation;
	public int radiusDemage;
	public int speed;
	public int forceAmount;
	public int lifeTime;
	public int spawnLimit;
}

[System.Serializable]
public struct AssetBundleU 
{
	public string name;
	[System.NonSerialized] public AssetBundle bundle;
//Не требуется проверяется наличием в AsstBundleIndex	[System.NonSerialized] public bool downloaded;
}

[System.Serializable]
public class SettingsDataU 
{
	public AssetBundleU[] AssetBundles;
	public TerrainU[] terrains;
	public TowerU[] towers;
	public BotU[] bots;
	public ResourceU[] resources;
	public WallU[] walls;
	public ThingU[] things;
	public BulletU[] bullets;
	public BaseU[] menus;
//	[System.NonSerialized] public  System.Collections.Generic.Dictionary<string, AssetBundleU> AssetBundleIndex;
}

[System.Serializable]
public class BundleResponse 
{
	public string name;
	public string Android;
	public string iOS;
	public string WebGL;
	public int version;
	public string asset;
	public bool UseProxyForWebGL;
	public bool useRockld;
	public bool UseProxyForAndroid;
}

[System.Serializable]
public class AppGuiResponse 
{
	public int ecode;
	public BundleResponse bundle;
	public AssetBundleU[] AssetBundles;
}

[System.Serializable]
public class SettingsResponse
{
	public string lvl;// LvlData;
	public string file;
}

[CreateAssetMenu(fileName = "UpGS settings",menuName="UpGS/settings data",order=0)]
//[MenuItem("Assets/Create/UpGS/FloatVariable")]
public class SettingsContainer:BaseScriptable //TODO: вызвать AssetBundle2Dict после изменения массива AssetBundle
{
	public SettingsDataU settings;
	public GameControll	gameControll;
	//[HideInInspector]
//	[System.NonSerialized] public string[] LoadedAssetBundles={}; //Список загруженных AssetBundle нужен при чтениии новых настроек
//	private  System.Collections.Generic.Dictionary<string, AssetBundleU> AsstBundleIndex;

//	public void OnEnable()
//	{
//		settings.AssetBundleIndex= new System.Collections.Generic.Dictionary<string, AssetBundleU> ();
//	}

	public int BulletIndex(string _name)
	{
			for (int i=0;i<settings.bullets.Length;i++)
			{
				if (settings.bullets[i].name==_name) return i;
			}
			Debug.LogError("SettingsCfg.BulletIndex not found name="+_name);
			return 0;
	}


	public void Parse(string _cfg)
	{
		settings=(SettingsDataU)JsonUtility.FromJson(_cfg,typeof(SettingsDataU));
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
			jsonText = JsonUtility.ToJson(settings);
			base.SaveJSON ();
			jsonText="";
	}

	public GameObject GetPrefab(int _type, int _nom)
	{
		string path="Assets/Content/";
		GameObject prefab=null;
		BaseU bu = GetObjConfig (_type, _nom);
		if (bu==null){
				Debug.LogError("SettingsContainer.GetPrefab not find in settings Tip="+_type+" Obj="+_nom);
				return null;
		}else{
				if (bu.pref=="Reb" && Application.platform==RuntimePlatform.WindowsEditor) return null; //TODO: убрать- просто надоела
				switch (_type){
					case 5:
						path=path+"Bots/";
						break;
					case 0:
					case 1:
					case 2:
						path=path+"Buildings/";
						break;
					case 3:
						path=path+"Thing/";
						break;
					case 4:
						path=path+"Terrain/";
						break;

				}
#if UNITY_EDITOR
				prefab = (GameObject)AssetDatabase.LoadAssetAtPath(path+bu.pref+".prefab", typeof(GameObject));
#endif
				if (!prefab){
					AssetBundle bundle=gameControll.GetAssetBundle(bu.bundle);
					prefab=(GameObject)bundle.LoadAsset(bu.pref);
				}
				return prefab;
		}
	}

	

/*
	public AssetBundle GetAssetBundle(string _name)
	{
			try{
				return settings.AssetBundleIndex[_name].bundle;
			}catch
			{
				Debug.LogError("SettingsCfg.GetAssetBundle not defined name "+_name);
			}
			return null;
	}
*/	

	public void ImportOldJSON(HashRequist _HashRequist, DehashRequist _DehashRequist)
	{
			int i=0;
			Hashtable obj;
			AssetBundleU[] abs= new AssetBundleU[]{};
			TerrainU[] terrains= new TerrainU[]{};
			TowerU[] towers= new TowerU[]{};
			BotU[] bots= new BotU[]{};
			ResourceU[] resources= new ResourceU[]{};
			WallU[] walls= new WallU[]{};
			ThingU[] things= new ThingU[]{};
			BulletU[] bullets= new BulletU[]{};
			BaseU[] menus= new BaseU[]{};

			BaseU bs;
			base.ImportOldJSON (_HashRequist, _DehashRequist);
			if (jsonText!=""){
			_HashRequist(jsonText, delegate(Hashtable SettingsOld){
				int count=0;
				//Заполним список AssetBundle
				obj=(Hashtable)SettingsOld["AssetBundle"];
				Hashtable ab=(Hashtable)obj[""+count];
				while (ab!=null)
				{
					AssetBundleU au=new AssetBundleU();
					au.name=(string)ab["name"];
//					au.downloaded=false;
					System.Array.Resize(ref abs, abs.Length + 1);
					abs[abs.Length-1]=au;
					count++;
					ab=(Hashtable)obj[""+count];
				}
				//Заполним настройки
				string[] prefixs=new string[]{"4-","0-","5-","1-","2-","3-","6-","10-"};
				for (i=0;i<prefixs.Length;i++){
					count=0;
					string prefix=prefixs[i];
					try{
						obj=(Hashtable)SettingsOld[prefix+count];
						while (obj!=null)
						{	
							switch (i)
							{
							case 0:
								//if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.MapSettings terrains="+obj);
								_DehashRequist(obj, delegate(string _str){
										TerrainU tn=(TerrainU)JsonUtility.FromJson(_str,typeof(TerrainU));
										System.Array.Resize(ref terrains, terrains.Length + 1);
										terrains[terrains.Length-1]=tn;
								});
								break;	
							case 1:
								//if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.MapSettings towers="+obj);
								_DehashRequist(obj, delegate(string _str){
									TowerU tr=(TowerU)JsonUtility.FromJson(_str,typeof(TowerU)); 
									System.Array.Resize(ref towers, towers.Length + 1);
									towers[towers.Length-1]=tr;
								});
								break;	
							case 2:
								//if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.MapSettings bots="+obj);
								_DehashRequist(obj, delegate(string _str){
									BotU bt=(BotU)JsonUtility.FromJson(_str,typeof(BotU)); 
									System.Array.Resize(ref bots, bots.Length + 1);
									bots[bots.Length-1]=bt;
								});
								break;	
							case 3:
								//if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.MapSettings bots="+obj);
								_DehashRequist(obj, delegate(string _str){
									ResourceU re=(ResourceU)JsonUtility.FromJson(_str,typeof(ResourceU)); 
									System.Array.Resize(ref resources, resources.Length + 1);
									resources[resources.Length-1]=re;
								});
								break;	
							case 4:
								//if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.MapSettings bots="+obj);
								_DehashRequist(obj, delegate(string _str){
									WallU wl=(WallU)JsonUtility.FromJson(_str,typeof(WallU)); 
									System.Array.Resize(ref walls, walls.Length + 1);
									walls[walls.Length-1]=wl;
								});
								break;	
							case 5:
								_DehashRequist(obj, delegate(string _str){
								//if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.MapSettings bots="+obj);
									ThingU tg=(ThingU)JsonUtility.FromJson(_str,typeof(ThingU)); 
									System.Array.Resize(ref things, things.Length + 1);
									things[things.Length-1]=tg;
								});
								break;	
							case 6:
								_DehashRequist(obj, delegate(string _str){
								//if (PlayerPrefs.GetInt("debug")==1) Debug.Log("SettingsCfg.MapSettings bots="+obj);
									BulletU bu=(BulletU)JsonUtility.FromJson(_str,typeof(BulletU)); 
									System.Array.Resize(ref bullets, bullets.Length + 1);
									bullets[bullets.Length-1]=bu;
								});
								break;
							case 7:	
								_DehashRequist(obj, delegate(string _str){
									bs=(BaseU)JsonUtility.FromJson(_str,typeof(BaseU)); 
									System.Array.Resize(ref menus, menus.Length + 1);
									menus[menus.Length-1]=bs;
								});
								break;
							}
							count++;
							obj=(Hashtable)SettingsOld[prefix+count];
						}
						
					}catch
					{
					}
					
				}
			});
			}
			jsonText="";
			settings.AssetBundles=abs;

			settings.terrains=terrains;
			settings.towers=towers;
			settings.bots=bots;
			settings.resources=resources;
			settings.walls=walls;
			settings.things=things;
			settings.bullets=bullets;
			settings.menus=menus;

			for (i=0;i<settings.towers.Length;i++)
			{
				settings.towers[i].bulletInd=BulletIndex(settings.towers[i].bullet);
				settings.towers[i].bullet="";
			}
			for (i=0;i<settings.bots.Length;i++)
			{
				settings.bots[i].bulletInd=BulletIndex(settings.bots[i].bullet);
				settings.bots[i].bullet="";
			}
	}

		public BaseU GetObjConfig(int _tip,int _obj)
		{
			switch (_tip)
			{
			case 0:
				if (_obj>=settings.towers.Length||_obj<0){
					return null;
				}
				return settings.towers[_obj];
			case 4:
				if (_obj>=settings.terrains.Length||_obj<0){
					return null;
				}
				return settings.terrains[_obj];
			case 5:
				if (_obj>=settings.bots.Length||_obj<0){
					return null;
				}
				return settings.bots[_obj];
			case 1:
				if (_obj>=settings.resources.Length||_obj<0){
					return null;
				}
				return settings.resources[_obj];
			case 2:
				if (_obj>=settings.walls.Length||_obj<0){
					return null;
				}
				return settings.walls[_obj];
			case 3:
				if (_obj>=settings.things.Length||_obj<0){
					return null;
				}
				return settings.things[_obj];
			case 6:
				if (_obj>=settings.bullets.Length||_obj<0){
					return null;
				}
				return settings.bullets[_obj];
			case 10:
				if (_obj>=settings.menus.Length||_obj<0){
					return null;
				}
				return settings.menus[_obj];
			}
			return null;
		}

}



	

}
