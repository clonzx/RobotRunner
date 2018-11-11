using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

// Произвести действи
namespace UpGS.Functions
{
	[System.Serializable]
	public class TriggerAction
	{
		public LayerMask 	layers;
		public Animator 	animator; //Какой аниматор использовать
		public string	 	state;	   //Какое состояние в аниматоре запустить	
		public GameObject 	prefab;
		public string		prefabName;
		public PreafabAction 	preafabAction;
		public bool	 	damageUse;  //Снимать здоровье
	}

	public enum PreafabAction {
		Deactivate=0,
		Activate=1,
		Spawn=2,
		SpawnDown=3, //
		DiePlaceEnter=4, //Зашли в место наносящее урон
		DiePlaceLive=5   //Покинули место наносящее урон  
	}

	public class TriggerAnimator : MonoBehaviour {
		public TriggerAction[]	enterAction;
		public TriggerAction[] exitAction;
		public bool oneTime; //Срабатывать 1 раз
private int enterCount=0;
private int exitCount=0;
		public float 	destroyDelay; // Через какое время уничтожать созданные префабы и через какое время уничтожить объект, если oneTime и все триггеры отработали
		public GameObject ownerToDestroy; //Если есть родительский элемент и он должен быть уничтожен
		public float damageAmount; //Сколько здоровья снимать
		public float damageRadius; //В каком радиусе наносить поражение если 0 то только тому на ком сработал триггер
		public float damageForce;  //В каком радиусе наносить поражение если 0 то только тому на ком сработал триггер
		public float damageDelay;  //Переодичность нанесения повреждений в режиме DiePlaceEnter



void OnTriggerEnter(Collider other ) {
	if (oneTime && enterCount>0) return;
	foreach ( TriggerAction trig in enterAction){
		if (trig.layers.value==0||(trig.layers.value&(1<<other.gameObject.layer))!=0){
			enterCount++;
			doAction(trig,other);
		}
	} 
	if (oneTime) CheckEnd(); 
}

void OnTriggerExit (Collider other) {
	if (oneTime&&exitCount!=0) return;
	foreach ( TriggerAction trig in exitAction){
		if (trig.layers.value==0||(trig.layers.value&(1<<other.gameObject.layer))!=0){
			exitCount++;
			doAction(trig,other);
		}
	} 
	if (oneTime) CheckEnd();
}

void CheckEnd()
//Проверить после срабытывание все ли триггеры отработали
{
	if (oneTime){
		if ((exitCount>0||exitAction.Length==0)&&(enterCount>0||enterAction.Length==0)){
			if (!ownerToDestroy) ownerToDestroy=gameObject;
			GameObject.Destroy(ownerToDestroy,destroyDelay);
		}
	}	
}

void doAction(TriggerAction action,  Collider other)
{
	GameObject go;
	if (action.animator!=null && action.state!="") action.animator.Play(action.state);
	if (action.prefabName!=""){
	 	action.prefab=GameObject.Find(action.prefabName); 
	 	action.prefabName="";
	}	 	
	if (action.prefab){
		switch (action.preafabAction){
			case PreafabAction.Deactivate:
	 			action.prefab.SetActive(false);
	 			break;		
			case PreafabAction.Activate:
	 			action.prefab.SetActive(true);
	 			break;
/*TODO:
			case PreafabAction.Spawn:
	 			go=Spawner.Spawn (action.prefab, transform.position, Quaternion.identity);
	 			go.SetActive(true);
	 			if (destroyDelay>0) GameObject.Destroy(go,destroyDelay);
	 			break;
			case PreafabAction.SpawnDown:
	 			go=Spawner.SpawnDown (action.prefab,gameObject, 100.0);
	 			go.SetActive(true);
	 			if (destroyDelay>0) GameObject.Destroy(go,destroyDelay);
	 			break;
*/	 			
			case PreafabAction.DiePlaceEnter:
				DiePlaceEnter(other.gameObject);	 			
				break;
			case PreafabAction.DiePlaceLive:				
				DiePlaceLive(other.gameObject);
				break;
	 	}
	}
	if (action.damageUse) ApplayDamage(other.gameObject,action);
}

void DiePlaceEnter(GameObject target)
{
/*todo:
	Health targetHealth = target.GetComponent.<Health> ();
	if (targetHealth) {
		targetHealth.StartDamage (damageAmount, -transform.forward, damageForce,damageDelay);
	}
*/	
}

void DiePlaceLive(GameObject target)
{
/*todo:
	Health targetHealth = target.GetComponent.<Health> ();
	if (targetHealth) {
		targetHealth.EndDamage ();
	}
*/	
}

void ApplayDamage(GameObject target, TriggerAction action)
{
/*todo:
	Health targetHealth ;
	if (damageRadius>0){
			Collider[] hitsDem   = Physics.OverlapSphere (transform.position, damageRadius, action.layers.value);
			foreach (Collider c  in hitsDem) {
				targetHealth  = c.GetComponent.<Health> ();
				if (targetHealth) {
					targetHealth.OnDamageForce (damageAmount, -transform.forward, damageForce);
				}
			}	
	}else{			
		targetHealth = target.GetComponent.<Health> ();
		if (targetHealth) {
				// Apply damage
				targetHealth.OnDamageForce (damageAmount, -transform.forward, damageForce);
		}
	}
*/	
}

void FindGO()
{
	//TriggerAction trig;
	foreach ( TriggerAction trig in enterAction){
		if (trig.prefab==null&&trig.prefabName!=""){
			trig.prefab=GameObject.Find(trig.prefabName);
			trig.prefabName="";
		}
	} 
	foreach (TriggerAction trig in exitAction){
		if (trig.prefab==null&&trig.prefabName!=""){
			trig.prefab=GameObject.Find(trig.prefabName);
			trig.prefabName="";
		}
	} 
	
}
}
}	
