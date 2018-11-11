using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UpGS.Data;

namespace UpGS.Runner{
	public class RunnerNextTrigger : MonoBehaviour { //#d1 Триггер на загрузку уровней

		public GameControllRunner gameControll;
		public int nextLevel=0; //#d Загрузить указанный уровень, если 0 то следующий
		public Vector3 rootShift; //#d Сдвиг положения всех объектов

		public void setGameControll(GameControllRunner _controll)
		{
			gameControll = _controll;
		}

		// Use this for initialization
		void Start () {
			
		}
		
		// Update is called once per frame
		void Update () {
		}
		
		void OnTriggerEnter(Collider other)
			//Todo: доработать
		{
			if (other.gameObject.layer == LayerMask.NameToLayer ("RunnerUpGS")) {
				if (nextLevel>0){
					gameControll.curentLevel=nextLevel;
					gameControll.loadNum=nextLevel;
				}else{
					gameControll.curentLevel++;
					gameControll.loadNum++;
				}
				gameControll.rootShift+=rootShift;
				gameControll.loader (gameControll.loadNum);
			}
		}

	}
}
