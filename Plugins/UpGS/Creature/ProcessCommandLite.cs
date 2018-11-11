using UnityEngine.EventSystems;
using UnityEngine;
namespace UpGS.Creature{
	public class ProcessCommandLite : MonoBehaviour {
		public MovementMotorLite motor;
		public MonoBehaviour weaponBehaviours;


		public void Backward() {
			motor.movementDirection = new Vector3 (0, 0, -1);
		}

		public void Forward() {
			motor.movementDirection = new Vector3 (0, 0, 1);
		}

		public void Left() {
			motor.movementDirection = new Vector3 (-1, 0, 0);
		}

		public void Right() {
			motor.movementDirection = new Vector3 (1, 0, 0);
		}


		public void Stop() {
			motor.movementDirection = new Vector3 (0, 0, 0);
		}


		public void FireUI() {
			weaponBehaviours.SendMessage ("FireNull");
		}

		public void StopFireUI() {
			weaponBehaviours.SendMessage ("StopFire");
		}

	}

}