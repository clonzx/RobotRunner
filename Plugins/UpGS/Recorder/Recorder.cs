using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UpGS.Data;

namespace UpGS.Recorder{

	public enum RecordMode{none,record,play};
	public enum AgentMode{fixedFrame,keyState};
	public enum RecEvent{Awake,Start,Fire,Die,Move,Atack,FixedUpdate,StartRoute,NextRoutePoint};
	public delegate void RegisterAgentDelegate(Record _record);

	public class RegisterAgentClass{
		public RegisterAgentDelegate reg;
	}


	public class RecorderSettings{
		public RecordMode mode;
	}

	[System.Serializable]
	public class StoreRecords{
		public Record[]	records;
		public StoreRecords(Record[]	_records)
		{
			records = _records;
		}
		public StoreRecords()
		{
		}
		public StoreRecords(string _filename)
		{
			Load (_filename);
		}

		public void Save(string _filename){
			string jsonText = JsonUtility.ToJson (this);
			byte[] bytes = System.Text.Encoding.UTF8.GetBytes (jsonText);
			System.IO.File.WriteAllBytes (Application.persistentDataPath + "/"+_filename, bytes);	
		}
		public void Load(string _filename){
			if (System.IO.File.Exists (Application.persistentDataPath + "/"+_filename)) { 
				byte[] bytes = System.IO.File.ReadAllBytes (Application.persistentDataPath + "/"+ _filename);
				string jsonText = System.Text.Encoding.UTF8.GetString (bytes);
				StoreRecords sr = JsonUtility.FromJson<StoreRecords> (jsonText);
				records=sr.records;
			}
		}


	}

	[System.Serializable]
	public class ObjectType{
		public int obj; //Тип объекта 
		public int tip; //Номер в конфигурации
	}

	[System.Serializable]
	public class Record : ISerializationCallbackReceiver{
		public float time;
		public string id;
		public RecEvent recEvent;
		public Vector3 place;
		public Vector3 face;
		public System.Object data;
		public ObjectType objType;

		public Record(float _time, string _id,RecEvent _recEvent, Vector3 _place, Vector3 _face, System.Object _data)
		{
			time = _time;
			id = _id;
			recEvent = _recEvent;
			place = _place;
			face = _face;
			data = _data;
		}
		public void OnBeforeSerialize()
		{
			switch(recEvent){
			case RecEvent.Start:
				objType = (ObjectType)data;
				break;
			}
		}
		

		public void OnAfterDeserialize()
		{
			switch(recEvent){
			case RecEvent.Start:
				data = objType;
				break;
			}
		}
	}

	public class Recorder : MonoBehaviour {

		public static Recorder instance;
		public Record[]	records;
		public int place=0;
		public float startTime;
		public GameControllTA gameControll;
		public Dictionary<string, GameObject> allObject;


		RecordMode mode=RecordMode.none;
		// Use this for initialization
		public static Recorder Instance()
		{
			if (instance == null) {
				instance=FindObjectOfType<Recorder>();
				if (instance==null) Debug.LogError("Recorder not find!");
			}
			return instance;
		}

		void Awake () {
			records = new Record[]{};
		}
		

		void FixedUpdate () {
			if (mode == RecordMode.play) {
				if (place>=records.Length){
					mode = RecordMode.none;
					return;
				}
				while ((Time.time-startTime)>records[place].time){
					ProcessRecord(records[place]);
					place++;
					if (place>=records.Length){
						mode = RecordMode.none;
						return;
					}
				}

			}
		}


		public void ProcessRecord(Record _record)
		{
			GameObject mGO;
			switch (_record.recEvent) {
			case RecEvent.Start:
				ObjectType obj=(ObjectType)_record.data;
				GameObject prefab=gameControll.settingsContainer.GetPrefab(obj.obj,obj.tip);
				if (prefab){
					mGO=Instantiate(prefab, _record.place,  Quaternion.identity); //TODO заменить Quaternion.identity
					mGO.transform.SetParent(transform);
					mGO.transform.localPosition=_record.place;
					mGO.transform.localEulerAngles=_record.face;
					allObject.Add(_record.id,mGO);
				}						
				break;
			case RecEvent.StartRoute:
			case RecEvent.NextRoutePoint:
				mGO=allObject[_record.id];
				mGO.SendMessage("onPlayRecord",_record);
				break;
			}
		}

		public void AddState(Record _record)
		{
			if (mode == RecordMode.record) {
				System.Array.Resize (ref records, records.Length + 1);
				_record.time-=startTime;
				records [records.Length - 1] = _record;
				place = records.Length - 1;
			}
		}

		void OnGUI()
		{
			string jsonText;
			if (GUI.Button (new Rect (100, 10, 100, 30), "Record")) {
				records = new Record[]{};
				mode=RecordMode.record;
				startTime=Time.time; 
			}
			if (GUI.Button (new Rect (210, 10, 100, 30), "RecordPlay")) {
				mode=RecordMode.play;
				place=0;
				startTime=Time.time;
				allObject=new Dictionary<string, GameObject>();
			}
			if (GUI.Button (new Rect (310, 10, 100, 30), "Save")) {
				new StoreRecords(records).Save("_record.json");
				mode=RecordMode.none;
				place=0;
				startTime=0;
			}
			if (GUI.Button (new Rect (410, 10, 100, 30), "Load")) {
				StoreRecords sr=new StoreRecords("_record.json");
				records=sr.records;
				mode=RecordMode.play;
				place=0;
				startTime=Time.time;
				allObject=new Dictionary<string, GameObject>();
			}
			if (GUI.Button (new Rect (510, 10, 100, 30), "RenameScene")) {
				Scene src=SceneManager.GetSceneByName("TowerAtack");
				Scene dst=SceneManager.CreateScene("NewTestScene");
				SceneManager.MergeScenes(src, dst);
			}



		}


	}
}