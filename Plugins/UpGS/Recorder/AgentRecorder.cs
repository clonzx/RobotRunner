using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace UpGS.Recorder{
	public class AgentRecorder : MonoBehaviour {
		string id;
		public ObjectType objectType;
		public AgentMode mode;
		public GameObject control;
		Recorder recorder;

		void Awake()
		{
			id = gameObject.name;
		}
		// Use this for initialization
		void Start () {
			RegisterAgentClass rac = new RegisterAgentClass ();
			rac.reg = onKeyEvents;

			control.SendMessage("OnRegisterAgent",rac);
			recorder = Recorder.Instance ();
			recorder.AddState (new Record (Time.time, id, RecEvent.Start, transform.localPosition, transform.localEulerAngles , objectType));
		}
		

		void FixedUpdate () {
			if (mode == AgentMode.fixedFrame) {
				recorder.AddState (new Record (Time.time, id, RecEvent.FixedUpdate, transform.localPosition, transform.localEulerAngles , null));
			}
		}

		void onKeyEvents(Record _record)
		{
			if (mode == AgentMode.keyState) {
				_record.id=id;
				recorder.AddState (_record);
			}
		}

		void onPlayRecord(Record _record)
		{
			control.SendMessage("onPlayRecord",_record);
		}
	}
}