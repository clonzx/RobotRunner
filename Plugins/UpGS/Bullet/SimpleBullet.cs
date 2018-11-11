using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace UpGS.Bullet{
	public class Damage{
		public int damageAmount;
		public float force;
		public Vector3 fromDirection;

		public Damage(int _damageAmount, float _force, Vector3 _fromDirection)
		{
			damageAmount=_damageAmount;
			force=_force;
			fromDirection=_fromDirection;
		}
	}

	[RequireComponent(typeof(Rigidbody))]
	public class SimpleBullet : MonoBehaviour {

		public float force;
		public bool simple;
		private Transform target;
		public int damageAmount;
		public LayerMask useLayers; //Какую маску использовать
		public float liveTime=5; //Время жизни

		private GameObject character;
//TODO:		public SignalSender onTriggerEnter;
//TODO:		public SignalSender onTriggerExit;
		
		
		
		void setCharacter(GameObject _character)
		{
			character=_character;
		}
		
		void Start()
		{
			GameObject.Destroy(gameObject,liveTime);
		}

		void Fire(Transform _target)
		{
			target=_target;
			if (simple) ApplayDemage(target); //0.052 clonx 20.05.2015 Из-за переполнение кэша сразу попадем
			//TODO: попробовать создавать пули без спаунера
			GetComponent<Rigidbody>().velocity = transform.forward*force;
		}

		void FireNull()
		{
			GetComponent<Rigidbody>().velocity = transform.forward*force;
		}		
		
		void OnTriggerEnter (Collider other ) {
			if (other == null)
				return;
			if (((1<<other.gameObject.layer)&useLayers.value)!=0){
				if (other.gameObject.activeInHierarchy && character!=null && character.activeInHierarchy && !simple && other.transform!=character.transform ) 
						ApplayDemage(other.transform);
//TODO:				onTriggerEnter.SendSignals (this);
			}
		}
		
		void OnTriggerExit (Collider other) {
			if (((1<<other.gameObject.layer)&useLayers.value)!=0){
//TODO:				onTriggerExit.SendSignals (this);
			}
		}
		
		
		void ApplayDemage(Transform _target)
		{
			if (_target!=null&&_target.gameObject.activeInHierarchy){ 

				_target.SendMessage("OnDamage",new Damage(damageAmount,force,-_target.forward),SendMessageOptions.DontRequireReceiver); //clonx 07.09.2018 добавил SendMessageOptions.RequireReceiver
			}
		}

	}

}
