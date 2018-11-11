using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace UpGS.Creature{

[System.Serializable]
public class ReceiverItem {
	public GameObject receiver ;
	public string action  = "OnSignal";
	public float delay ;
	
	public IEnumerator SendWithDelay (MonoBehaviour sender ) {
		yield return new WaitForSeconds (delay);
		if (receiver)
				receiver.SendMessage (action,SendMessageOptions.RequireReceiver);
		else
			if (PlayerPrefs.GetInt("debug")==1) Debug.LogWarning ("No receiver of signal \""+action+"\" on object "+sender.name+" ("+sender.GetType().Name+")", sender);
	}
}

[System.Serializable]
public class SignalSender {
	public bool onlyOnce ;
	public ReceiverItem[] receivers ;
	
	private bool hasFired  = false;
	
		public void SendSignals (MonoBehaviour sender ) {
		if (hasFired == false || onlyOnce == false) {
			for (var i = 0; i < receivers.Length; i++) {
				if (receivers[i]!=null&&receivers[i].receiver!=null){
					//LevelCollection.log2File("_dbg.log","SignalSender.SendSignals sender.name="+sender.gameObject.name+" receivers.name= "+receivers[i].receiver.name+" action="+receivers[i].action);
					sender.StartCoroutine (receivers[i].SendWithDelay(sender));
				}else{
					if (PlayerPrefs.GetInt("debug")==1) Debug.LogWarning("SignalSender.SendSignals sender.name="+sender.gameObject.name+" receivers not find");
				}
				
			}
			hasFired = true;
		}
	}
}
}