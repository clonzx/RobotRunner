using System.Collections;
using System.Collections.Generic;
using UnityEngine;


namespace UpGG.Bullet{

	public enum FireProcessorType{Resend,Send};

//	[RequireComponent(typeof(Animator))]
	public class FireProcessor : MonoBehaviour {
		public Animator anim; 
		public MonoBehaviour[] weaponBehaviours;
		public bool fireSync;
		public FireProcessorType type;
		public float coneAngle  = 1.5f;
		public GameObject bulletPrefab;
		public GameObject character; //Кто стреляет, чтобы не сработал триггер на пуле
		private int nextWeaponToFire=0;


		private Transform target;
		// Use this for initialization
		void Start () {
			
		}
		
		// Update is called once per frame
		void Update () {
			
		}
	//Управление блоком подготовки выстрела -->
		void FireNull(){
			if (anim) {
				anim.SetBool ("Fire", true);
			} else {
				if (type==FireProcessorType.Resend){
					NextFire();
				}
			}
		}

		void Fire(Transform _target)
		{
			target=_target;				
			if (anim) {
				anim.SetBool ("Fire", true);
			} else {
//				if (type==FireProcessorType.Resend){
					NextFire();
//				}
			}
		}

		void StopFire()
		{
			if (anim) {
				anim.SetBool ("Fire", false);
			} else {
				if (type==FireProcessorType.Resend){
					for (var i=0; i<weaponBehaviours.Length; i++) {
							weaponBehaviours [i].SendMessage ("StopFire");
					}
				}
			}
		}
	//Управление блоком подготовки выстрела <--

		void BulletSend () {
			var coneRandomRotation = Quaternion.Euler (Random.Range (-coneAngle, coneAngle), Random.Range (-coneAngle, coneAngle), 0);
			//var bullet:GameObject=Spawner.Spawn (bulletPrefab, transform.position, transform.rotation * coneRandomRotation);
			GameObject bullet=Instantiate(bulletPrefab, transform.position, transform.rotation * coneRandomRotation);
			bullet.active=true;
			//bullet.SendMessage ("setParam",atackParam);
			if (target){
				bullet.SendMessage ("Fire",target);
				bullet.SendMessage ("setCharacter",character);
			}else{
				bullet.SendMessage ("FireNull");
				bullet.SendMessage ("setCharacter",character);
			}
		}

		void NextFire(){
			if (type == FireProcessorType.Send) {
				BulletSend();
			} else {
				if (fireSync) {
					for (var i=0; i<weaponBehaviours.Length; i++) {
						if (target) {
							weaponBehaviours [i].SendMessage ("Fire", target);
						} else {
							weaponBehaviours [i].SendMessage ("FireNull");
						}
					}
				} else {
//					Debug.Log(gameObject.name);
					if (weaponBehaviours [nextWeaponToFire]) {
						if (target) {
							weaponBehaviours [nextWeaponToFire].SendMessage ("Fire", target);
						} else {
							weaponBehaviours [nextWeaponToFire].SendMessage ("FireNull");
						}
						nextWeaponToFire = (nextWeaponToFire + 1) % weaponBehaviours.Length;
					}
				}	
			}
		}

	}
}