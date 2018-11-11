using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

namespace UpGS.Data
{


	[CreateAssetMenu(fileName = "UpGS GameControllRunner",menuName="UpGS/GameControllRunner",order=0)]
	public class GameControllRunner:GameControll //TODO: вызвать AssetBundle2Dict после изменения массива AssetBundle
	{
		[System.NonSerialized] public int loadNum=0;
		[System.NonSerialized] public int curentLevel=0;
		[System.NonSerialized] public List<int> loadedLevelList=new List<int>();

		public int needLevels=2; //Количество уровней включая текущий необходимое для загрузки
		[System.NonSerialized] public VoidIntDelegate	loader;
		[System.NonSerialized] public GameObject player; //#d Объект которым управляем



		public void CreateScene() //#d создание игровой сцены
		{
			Scene scLoaded = SceneManager.GetSceneByName ("Runner");
			Scene scNew = SceneManager.CreateScene ("Runner" + loadNum);
			SceneManager.MergeScenes (scLoaded, scNew);
			loadedLevelList.Add (loadNum);
			if (curentLevel == 0) {
				curentLevel = loadNum;
				//				gameControllRunner.mainMenuCloseLogo();
				//				gameControllRunner.mainMenu.SetActive(false);
			}

			if (loadedLevelList.Count < needLevels) {
				loadNum++;
				loader(loadNum);
			}
			if (loadedLevelList.Count > needLevels) {
				SceneManager.UnloadSceneAsync("Runner"+loadedLevelList.ToArray()[0]);
				loadedLevelList.RemoveAt(0);
			}
		}

		public void UnloadScene() //#d выгрузка игровой сцены
		{
			GameObject.Destroy (player);
			SceneManager.LoadScene("MainMenu");
			foreach(int ln in loadedLevelList){
				SceneManager.UnloadSceneAsync("Runner"+ln);
			}
			loadedLevelList.Clear ();
			curentLevel = 0;
			loadNum = 0;

		}

	}



}
