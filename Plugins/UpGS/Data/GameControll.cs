using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;


public delegate void RaycastHitProcesor(RaycastHit hit);

namespace UpGS.Data
{
	public delegate void VoidIntDelegate(int _nom); //Функция с параметром int и без возвращаемого значения
	public delegate void VoidNoParmDelegate(); //Функция без параметров и возвращаемого значения

public class GameControll:BaseScriptable //Базовый для всех типов игр
{
		[System.NonSerialized] public VoidNoParmDelegate mainMenuCloseLogo; //Функция скрывающая заставку главного меню
		[System.NonSerialized] public GameObject mainMenu; //Главное меню
		[System.NonSerialized] public Animator GameMenu; //Меню игры
		[System.NonSerialized] public  System.Collections.Generic.Dictionary<string, AssetBundleU> AssetBundleIndex;
		public RaycastHitProcesor raycastHitProcesor; //Обработчик нажатий
		public SettingsContainer settingsContainer;
		public LevelContainer levelContainer;
		public AppContainer	appContainer;
		public DeveloperContainer developerContainer;
		public BulletContainer	bulletContainer;
		public bool				useStoredData=false; //Использовать данные сохраненные в BaseScriptable контейнерах
		public LevelContainer[] levelContainers;
		[System.NonSerialized] public Vector3 rootShift=new Vector3(0,0,0); //#d Сдвиг положения всех объектов

		public void OnEnable()
		{
			AssetBundleIndex= new System.Collections.Generic.Dictionary<string, AssetBundleU> ();
		}

		public AssetBundle GetAssetBundle(string _name)
		{
			try{
				return AssetBundleIndex[_name].bundle;
			}catch
			{
				Debug.LogError("SettingsCfg.GetAssetBundle not defined name "+_name);
			}
			return null;
		}


		public virtual void CreateScene () //#d создание игровой сцены
		{
		}

		public virtual void UnloadScene() //#d выгрузка игровой сцены
		{
		}


}



[CreateAssetMenu(fileName = "UpGS GameControllTA",menuName="UpGS/GameControllTA",order=0)]
//[MenuItem("Assets/Create/UpGS/FloatVariable")]
public class GameControllTA:GameControll //TODO: вызвать AssetBundle2Dict после изменения массива AssetBundle
{
		public int CreatureSelect; //Выбор бота на панели
		public string CreatureType; //main,shelf Откуда выбраны
		public int MoveRotate;		//Выьор типа вращения камеры

		[System.NonSerialized] public Animator ShelfMenu;		//Меню полки
		[System.NonSerialized] public GameObject ShelfContent;
//		public string			lastLoadedLevelName;


		public void setMoveRotate(int _val)
		{
			MoveRotate = _val;		
		}

		public void setCreatureSelect(int _val)
		{
			CreatureSelect = _val;		
		}

		public void setCreatureType(string _val)
		{
			CreatureType = _val;		
		}


}



}
