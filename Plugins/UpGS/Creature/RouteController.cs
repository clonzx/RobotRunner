using System.Collections;
using System.Collections.Generic;
using UnityEngine;
#if UPGS_RECORD
using UpGS.Recorder;
#endif

namespace UpGS.Creature{

	public class Route{
		public Vector3[] WayPoints;
	}


	public class RouteController: MonoBehaviour{

		#if UPGS_RECORD
			RegisterAgentDelegate AgentRecorder;
		#endif

		// Public member data
		public UpGS.Creature.MovementMotor motor ;


		public float patrolPointRadius = 0.5f;
		public Vector3[] WayPoints ;
		public bool CicleRouting=false; //Циклическое движение по маршруту 
		public SignalSender endSignals;                  
		public float LastMagnitude ; //Приближение к точке пути
		//public var CountStopMag : int; //Сколько циклов приближения нет
		public float MagTime; //Время когда перестали приближаться

		// Private memeber data
		private Transform character ;
		public int nextPatrolPoint  = 0;
		public int maxPatrolPoint  = 0;
		public bool pingPong = false;
		private int patrolDirection  = 1;

		void Start () {
			character = motor.transform;
			MakeRoute(0);
			MagTime=0;	
		}


		public void SetRoute(Route _route)
		{
			WayPoints = _route.WayPoints;
		}

		public void MakeRoute(int next){
			ActivateWayPoints();
			nextPatrolPoint=next;
		}


		private bool ActivateWayPoints()
		{
			maxPatrolPoint=WayPoints.Length;
			nextPatrolPoint=0;
			return true;
		}

		void OnEnable () {
			//CountStopMag=0;
			MagTime=0;
			LastMagnitude=999999999;
		}



		public void StopRouting()
		//Что выполнить при завершении не циклического маршрута
		{
			//CountStopMag=0;
			MagTime=0;
			LastMagnitude=999999999;

			motor.movementDirection=Vector3.zero;
			if (PlayerPrefs.GetInt("debug")==1) Debug.LogWarning("RouteControl.StopRouting "+gameObject.name);
		}

		public Vector3 nextPatrolVector()
		{
			if (nextPatrolPoint>=WayPoints.Length||nextPatrolPoint<0){
					StopRouting();
					return new Vector3(0,0,0);
			}
			return (WayPoints[nextPatrolPoint] - character.position);
		}

		void Update () {
			float newMag;
			// Early out if there are no patrol points
			if ( maxPatrolPoint == 0)
				return;
			
			// Find the vector towards the next patrol point.
			Vector3 targetVector  = nextPatrolVector();
			targetVector.y = 0;
			
			newMag=targetVector.sqrMagnitude;
			//Проверка, если не можем сократить дистанцию к точке, пропустить ее
			if (newMag>=LastMagnitude){
				//TODO сделать проверку по времени пока чисто заглушка
		//		CountStopMag++;
				if ((Time.time-MagTime)>2&&MagTime!=0){
					StopRouting();
					return;
				}
		/*		
				if (CountStopMag>40){ 
					StopRouting();
					return;
				}
		*/		
			}else{
				LastMagnitude=newMag;
				MagTime=Time.time;
			}
			
			// If the patrol point has been reached, select the next one.		
			if (targetVector.sqrMagnitude < patrolPointRadius * patrolPointRadius) {

				nextPatrolPoint += patrolDirection;
		#if UPGS_RECORD
				if (nextPatrolPoint<WayPoints.Length&&nextPatrolPoint>=0){
					AgentRecorder(new Record (Time.time, "", RecEvent.NextRoutePoint, character.localPosition, WayPoints[nextPatrolPoint], null));
											
				}
		#endif
				
				//CountStopMag=0;
				MagTime=0;
				LastMagnitude=999999999;
				
				if (nextPatrolPoint < 0) {
					nextPatrolPoint = 1;
					patrolDirection = 1;
				}
				if (nextPatrolPoint >= maxPatrolPoint) {
					if (pingPong) {
						patrolDirection = -1;
						nextPatrolPoint = nextPatrolPoint - 2;
					}
					else {
						if (CicleRouting){
							nextPatrolPoint = 0;
						}else{
							nextPatrolPoint=nextPatrolPoint-1;
							StopRouting();
						}
					}
				}
			}
			
			// Make sure the target vector doesn't exceed a length if one
			if (targetVector.sqrMagnitude > 1)
				targetVector.Normalize ();
			
			// Set the movement direction.
			motor.movementDirection = targetVector;
			// Set the facing direction.
			motor.facingDirection = targetVector;
		}

		#if UPGS_RECORD
		void OnRegisterAgent(RegisterAgentClass _rac)
		{
			AgentRecorder=_rac.reg;
		}
		#endif
	}
}