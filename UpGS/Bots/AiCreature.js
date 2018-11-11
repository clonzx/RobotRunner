#pragma strict

#if UPGS_RECORD
	import UpGS.Recorder;
	var AgentRecorder:RegisterAgentDelegate;

#endif

private var StopInFind:float; // Время когда робот остановился и никого не атакует
public var MaxRadius:float=100;
 

//AiBase ------------------------------------------------------------------------->
public var behaviourOnSpotted : MonoBehaviour;
public var soundOnSpotted : AudioClip;
public var behaviourOnPatrol : MonoBehaviour;
//@HideInInspector
//public var lc:LevelCollection;
//@HideInInspector
//public var stekSeeker:StekSeekerPath;
//public var nav:NavMeshAgent;


// Private memeber data
//@HideInInspector
public var character : GameObject; //Сам объект на котором работает этот скрипт 
//@HideInInspector
//public var patrolTarget : Transform; //Конечная точка пути

@HideInInspector
public var insideInterestArea : boolean = true;
@HideInInspector
public var WallLayer :int= 12; //Слой стен

@HideInInspector
public var badTarget : Array; //Плохие цели - не удалось к ним подойти

//@HideInInspector
public var aiStrength : int=1; //Устойчивость к отуплению по умолчанию максимальная
//AiBase -------------------------------------------------------------------------<

//AiNonTarget ------------------------------------------------------------------------->
// Private memeber data
@HideInInspector
public var player : Transform; //Цель которую атакуем (не идем, а именно атакуем) при наличии отключаются триггеры обнаружения

//@HideInInspector
public var walk2Target : Transform; //Цель к которй идем
//@HideInInspector
//public var walk2Area : int; //область к которй идем
//public var transArea:int; //0.048 clonx 23/03/2015 Область по которой идем - область

function CanSeePlayer () : boolean {
	if (!player) return false;
	var playerDirection : Vector3 = (player.position - character.transform.position);
	var hit : RaycastHit;
	Physics.Raycast (character.transform.position, playerDirection, hit, playerDirection.magnitude);
	if (hit.collider && hit.collider.transform == player) {
		return true;
	}
	return false;
}

function CanSeePlayer (target:Transform) : boolean {
	player=target;
	var playerDirection : Vector3 = (player.position - character.transform.position);
	var hit : RaycastHit;
	Physics.Raycast (character.transform.position, playerDirection, hit, playerDirection.magnitude);
	if (hit.collider && hit.collider.transform == player) {
		return true;
	}
	return false;
}

function SwitchAtackPatrol(_target:Transform, _atack:boolean,next:int)
// Переключатель режима атаки и патрулирования 
{
	if (_atack){
		walk2Target=null;
	}else{
		if (walk2Target) {
			try{
//				walk2Area=AstarPath.active.GetNearest(walk2Target.position).node.Area;//0.048 clonx 20/03/2015
//				transArea=AstarPath.active.GetNearest(transform.position).node.Area;//0.048 clonx 23/03/2015 
			}catch(e){
				if (PlayerPrefs.GetInt('debug')==1) Debug.LogError('Exception walk2Target');
			}
		}
	}
		if (_atack) badTarget=new Array(); //Нашли хорошую цель список плохих сбросим
	if (behaviourOnSpotted){
		if (_target) behaviourOnSpotted.SendMessage("setPlayer",_target);
		behaviourOnSpotted.enabled=_atack;
	}
//	MoveAtackChangeObstacle(_atack);
	if (behaviourOnPatrol){
//TODO:		if (!_atack) behaviourOnPatrol.MakeRoute(next);
//TODO:			behaviourOnPatrol.motor.movementDirection=Vector3.zero;
		behaviourOnPatrol.enabled=!_atack;
	}

}

//AiNonTarget -------------------------------------------------------------------------<



public var Only2PointPath:boolean=false; // Путь только из начальной точки в конечную ( для летающих)

@HideInInspector
public var LastPoint:Vector3; // Куда прицеливались
public var CountTarget:int; // Сколько прицеливались
public var useBigTarget:boolean=true; //Использовать список больших целей
private var UseLastWay:boolean=false;
private var atackWall:boolean;
public var LastTarget:Transform=null; // Куда прицеливались
public var useLayers : LayerMask; //Какую маску использовать
public var oneBad:Transform=null; //Одна плохая цель (Попробуем снести стену если не поможет занесем в список плохих целей)
private var que:UpgsQueueAstar;



function OnTriggerEnter (other : Collider) {
//Кто то попал в коллайдер
	if (!player){
	  switch(aiStrength){
	  	case 0:
	  	case 1:
	  	case 2:
	  	case 3:
	  	case 5:
	  	  //Атакуем 
		  if ((useLayers.value&(1<<other.gameObject.layer))){ 
				player=other.transform;
				SwitchAtackPatrol(player, true,0);
		  }
		  break;
	  	case 4:
	  	  //Атакуем только выбранную цель
	  	  if (LastTarget){
			  if (LastTarget==other.transform){
					player=other.transform;
					SwitchAtackPatrol(player, true,0);
			  }
		  }
		  //TODO: Отработать потерю LastTarget
		  break;
	  }
	  
	}
}

/*
function QueBefore(el:UpgsQueueElement,callback:Function)
{
//		var seeker:Seeker = GetComponent(Seeker);
		var i:int;
		var distance:float=1000;//TODO: lc.MaxWorldRadius;
		var dist:float;
		var hitColliders: Collider[];
		var target:Transform=null;
		//0.047 clonx 05.03.2015 Учет целей на текущей области рассчитанной AstarPath-->
		var targetLight:Transform=null; //Цель в той же области (нет на пути стен)
		
		var CurrentArea:uint=AstarPath.active.GetNearest(transform.position).node.Area;
		var targetArea:uint;
		//0.047 clonx 05.03.2015 Учет целей на текущей области рассчитанной AstarPath<--
		var targetSelected:boolean=false;
		
			if (behaviourOnSpotted.targetLayersMain.value){
				// надо переделывать вызов без возврата параметров yield; //16.03.2018 clonx Подождем чтобы снизить нагрузку
				hitColliders = Physics.OverlapSphere(transform.position, lc.MaxWorldRadius,behaviourOnSpotted.targetLayersMain.value);
				for (i = 0; i < hitColliders.Length; i++) {
				try{
					dist=Vector3.Distance(hitColliders[i].transform.position,transform.position);
					if (dist<distance && hitColliders[i].gameObject.GetComponent(Health).health>0){
							distance=dist;
							target=hitColliders[i].transform;
							//0.047 clonx 05.03.2015 Учет целей на текущей области рассчитанной AstarPath-->
							targetArea=AstarPath.active.GetNearest(target.position).node.Area;
							if (targetArea==CurrentArea) targetLight=target;
							//0.047 clonx 05.03.2015 Учет целей на текущей области рассчитанной AstarPath<--
							useLayers=behaviourOnSpotted.targetLayersMain;
					}
				}catch(e){
				}	 
				}
			}
			if (!target){
				// надо переделывать вызов без возврата параметров yield; //16.03.2018 clonx Подождем чтобы снизить нагрузку
				hitColliders = Physics.OverlapSphere(transform.position, lc.MaxWorldRadius,behaviourOnSpotted.targetLayersAll.value);
				for (i = 0; i < hitColliders.Length; i++) {
				try{
					dist=Vector3.Distance(hitColliders[i].transform.position,transform.position);
					if (dist<distance && hitColliders[i].gameObject.GetComponent(Health).health>0){
							distance=dist;
							target=hitColliders[i].transform;
							//0.047 clonx 05.03.2015 Учет целей на текущей области рассчитанной AstarPath-->
							targetArea=AstarPath.active.GetNearest(target.position).node.Area;
							if (targetArea==CurrentArea) targetLight=target;
							//0.047 clonx 05.03.2015 Учет целей на текущей области рассчитанной AstarPath<--
							useLayers=behaviourOnSpotted.targetLayersAll;
					}
				}catch(e){
				}	 
				}
			}
			if (target) el.obj=target;
			callback();
}
*/

function Add2PathQueue():boolean
{
#if UPGS_QUEUE
			var que:UpgsQueueAstar=UpgsQueueAstar.Instance();
			if (que){
				var el:UpgsQueueElement=new UpgsQueueElement();
				el.go=gameObject;
				el.callback=OnPathComplete;
				el.beforeCallback=QueBefore;
				//el.localCallback
				//el.obj
				que.Enqueue(el);
				return true;
			}
#endif
	return false;	
}


function Start()
{
	//старый вариант SelectAtack();
//	aiStrength=0;
//	AiBot01();
//	return;
	switch (aiStrength){
		case 0:
		case 1:
			AiBot01();
			break;
		case 2:
			AiToPoint();
			break;			
		default:
			Add2PathQueue();
	}
}

function AiToPoint()
{
	var findDist:float;
	var selectDist:float=MaxRadius;
	var selectTarget:Transform;
	var hitColliders:Collider[] = Physics.OverlapSphere(transform.position, MaxRadius,useLayers.value);
	for (var i:int = 0; i < hitColliders.Length; i++) {
		findDist=Vector3.Distance(hitColliders[i].transform.position,transform.position);
		if (findDist<=selectDist && character.transform!=hitColliders[i].transform){
			selectDist=findDist;
			selectTarget=hitColliders[i].transform;
		}
	}		
	walk2Target=selectTarget;
	StartDirectPath(transform.position,selectTarget.position);
}

function AiBot01()
//Поиск цели для бота с AI=0,1
//Движение в произвольном направлении
// AI 0 робот может самопроизвольно взорваться
{
	var x:float;
	var y:float;
	var z:float;

	//useLayers= behaviourOnSpotted.targetLayersMain.value?behaviourOnSpotted.targetLayersMain:behaviourOnSpotted.targetLayersAll;
//TODO:	useLayers=behaviourOnSpotted.targetLayersAll.value|(1<<WallLayer); //Атакуем все что можем + стены
	x=Random.Range(-1000,1000); 
	y=character.transform.position.y; 
	z=Random.Range(-1000,1000); 
	StartDirectPath(character.transform.position,Vector3(x,y,z));

	if (aiStrength==0){
		if (Random.Range(-1000,1000)<500){  //самопроизвольно взорваться
			var go:GameObject=transform.parent?transform.parent.gameObject:transform.gameObject;
			var health:Health=go.GetComponentInChildren(Health);
			if (health) health.OnDamage(health.health,character.transform.position);
		}
	}

}



function Update()
//0.049 clonx 03.04.2015 Добавил для оживления замерших ботов
{
	//Исправим тупо замерших ботов
	//TODO: разобраться когда происходит и попытаться исправить
//	if (lc && lc.mg && lc.mg.levelComplite) return; //Игра закончена
	
	if (que){
		if (!behaviourOnSpotted.enabled && !behaviourOnPatrol.enabled && que.Count()<1)
		{
			Add2PathQueue();
		}
	}
}



function StartDirectPath(start:Vector3,end:Vector3)
//Прямой путь от точки к точке 
{
	var route:UpGS.Creature.Route=new UpGS.Creature.Route();
	route.WayPoints=new Vector3[2];
	route.WayPoints[0]=start;
	route.WayPoints[1]=end;
	behaviourOnPatrol.SendMessage("SetRoute",route);
	
	walk2Target=LastTarget; //0.048 clonx 20.03.2015
	SwitchAtackPatrol(null, false,0);
#if UPGS_RECORD
	AgentRecorder(new Record (Time.time, "", RecEvent.StartRoute, character.transform.localPosition, route.WayPoints[1], null));
#endif	
}

/*
function PathGood(p:Pathfinding.Path):boolean
// Пришел ли путь в конечную точку
// если нет перенацелимся
{
	try{
		// Проверка на разрушение текущего объекта
		var sc:SphereCollider=gameObject.GetComponent(SphereCollider);
	}catch(e){ 
		return false;	
	}

	//TODO Сделать настраиваемым dist>1
	if (p){
		if (!LastTarget){
		//Цель уничтожена ищем новую
		 //TODO: Раскоментировать SelectAtack(); 
		 return false;
		}
	}
	return true;
}
*/


function findTargetWallBefore(fromPoint:Vector3) //clonx 0.584 19.04.2016 ,toPoint:Vector3)
//Поиск стен до начала движения
{
	var hitColliders: Collider[];
	var i:int;
	var dist1:float;
	//var dist2:float;
	var target:Transform;
	var sc:SphereCollider=gameObject.GetComponent(SphereCollider);
	var MaxRadius:float=sc.radius;
	
	if (MaxRadius<3) MaxRadius=3; //Патч для близко подходящих типа (с пилой например)
	// Меньше почему то не получается- видимо расходится запланированная конечная
	
	var tekDist:float=MaxRadius;
	
	//var targetDist:float=Vector3.Distance(toPoint,fromPoint);
	
	hitColliders = Physics.OverlapSphere(fromPoint, MaxRadius,1<<WallLayer);
	for (i = 0; i < hitColliders.Length; i++) {
		dist1=Vector3.Distance(hitColliders[i].transform.position,fromPoint);
		if (dist1<=tekDist){
			tekDist=dist1;
			target=hitColliders[i].transform;
		}
	}
	if (target){
		if (LastTarget==oneBad){
		//Стену снесли 1 раз не помогло
			oneBad=null;
			return false; 
		}else{
			oneBad=LastTarget;
			
			LastTarget=target;
			useLayers=useLayers.value|(1<<WallLayer); //0.049 Clonx 24.03.2015 добавил "ai.useLayers|("
			return true;// behaviourOnPatrol.patrolWayPoints[behaviourOnPatrol.patrolWayPoints.length-1]=target.position;
		}
	}
	return false;
}


function StartLastWay(way:Vector3[])
{
//TODO:	behaviourOnPatrol.patrolWayPoints=new Vector3[way.length];
	var currentPlace:int=0;
	var MaxDist:float=Vector3.Distance(transform.position,way[0]);
	var dist:float;
	
	for(var i = 0; i < way.length; i++)
	{
		dist=Vector3.Distance(transform.position,way[i]);
		if (dist<MaxDist) currentPlace=i;
//TODO:	    behaviourOnPatrol.patrolWayPoints[i] = way[i];
	}
		walk2Target=LastTarget; //0.048 clonx 20.03.2015
		SwitchAtackPatrol(null, false,currentPlace+1);
		
}

/*
function OnPathComplete (p:Pathfinding.Path) 
// Путь найден добавим его в маршрут
{
	//We got our path back
	atackWall=false;
	if (!p) {
		if (PlayerPrefs.GetInt('debug')==1) Debug.LogWarning("AiBot.OnPathComplete Not find 1!!!");
		return;
	}
	if (p.error) {
		if (PlayerPrefs.GetInt('debug')==1) Debug.LogWarning("AiBot.OnPathComplete Not find 2!!!");
	} else {
	
//TODO:		if (PathGood(p)){
			if(true){
			    	    	    
		    // Create an array of points which is the length of the number of corners in the path + 2.
		    behaviourOnPatrol.patrolWayPoints=new Vector3[p.path.Count-1];
		    
				    	
				    for(var i = 1; i < p.path.Count; i++)
				    {
				        behaviourOnPatrol.patrolWayPoints[i-1] = p.vectorPath[i];
				    }
				    
				    
				    if (!useBigTarget){
				    	try{ //0.049 clonx 01.04.2015 добавил обработку исключительных ситуаций
				    		behaviourOnPatrol.patrolWayPoints[p.path.Count-2] = LastTarget.position;
				    	}catch(e){
				    		if (PlayerPrefs.GetInt('debug')==1) Debug.LogError('Exception LastTarget.position'); //TODO: можно убрать Error после отладки
				    	}
				    }
					SwitchAtackPatrol(null, false,0);
					
		}
	}
}
*/




function OnEnable () {
//	behaviourOnLostTrack.enabled = true;
//	behaviourOnSpotted.enabled = false;
}

function OnEnterInterestArea () {
//	insideInterestArea = true;
}

function OnExitInterestArea () {
//	insideInterestArea = false;
//	OnLostTrack ();
}

function OnSpotted () {
//TODO: Вызывается когда стреляют по объекту
//Нужно найти стреляющего и присвоить его behaviourOnSpotted.player
//Так же лучше добавить параметр надо или нет реагировать на это событие
/*
	if (!insideInterestArea)
		return;
	if (!behaviourOnSpotted.enabled) {
		behaviourOnSpotted.enabled=true;
		behaviourOnPatrol.enabled=false;
		
		if (audio && soundOnSpotted) {
			audio.clip = soundOnSpotted;
			audio.Play ();
		}
	}
*/	
}

function OnLostTrack () {
	if (LostAtackTarget()){
		player=null;
		
		if (behaviourOnSpotted){
			behaviourOnSpotted.enabled=false;
		}
		if (behaviourOnPatrol){
//TODO:			behaviourOnPatrol.motor.movementDirection=Vector3.zero;
			behaviourOnPatrol.enabled=false;
		}
	}
}

function LostAtackTarget():boolean
//Проверка потерял цель или нет модуль атаки
{
	return true;
}

function OnStopRouting () {
//Маршрут завершен, а к цели не пришли
	//Объета текущей цели уже нет
	atackWall=findTargetWallBefore(transform.position); //0.584	clonx 19.04.2016 Попробуем атаковать стены
 	if (atackWall){
		SwitchAtackPatrol(LastTarget, true,0);
		return;
	}
	//0.052 clonx 15.05.2015 вставил LastTarget вместо player-->
	if (LastTarget) {
		// Добавим в список плохих целей
		badTarget.Push(LastTarget);
	}
	//15.05.2015 LastTarget=null;
	//0.052 clonx 15.05.2015 вставил LastTarget вместо player<--
	OnLostTrack(); 
}

#if UPGS_RECORD
function OnRegisterAgent(_rac: RegisterAgentClass)
{
	behaviourOnSpotted.SendMessage("OnRegisterAgent",_rac);
	behaviourOnPatrol.SendMessage("OnRegisterAgent",_rac);
	AgentRecorder=_rac.reg;
}

function onPlayRecord( _record:Record)
{
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("AiCreature.onPlayRecord Time="+_record.time+" recEvent="+_record.recEvent);
}

#endif

