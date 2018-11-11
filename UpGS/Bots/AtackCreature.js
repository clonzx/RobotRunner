#pragma strict

#if UPGS_RECORD
	import UpGS.Recorder;
	var AgentRecorder:RegisterAgentDelegate;
#endif


public var motor : UpGS.Creature.MovementMotor;


public var targetLayersMain : LayerMask; //Первоочередные цели
public var targetLayersAll : LayerMask; //Все цели
//public var atackParam:Hashtable; //параметы выстрела или удара
//public var atackParam:AtackParam;
public var child:MonoBehaviour; //Подчиненный компонент, который на самом деле отвечает за атаку


//Параметры из property.json Tower или Bot -->
public var bulletPrefab : GameObject; //0.639 clonx 09.01.2017 В интерфейсе не привязывать подгрузится через параметры
public var frequency : float = 1; //Частота выстрелов
public var targetDistanceMin : float = 3.0;
public var targetDistanceMax : float = 4.0;
public var NotUseMotor:boolean=true; //Не использовать мотор для приближенеия к цели Триггер сработал начинаем обстрел
//Параметры из property.json Tower или Bot <--

//Параметры из property.json Bullet -->
public var damageAmount:int;
public var radiusDetonation:int;
public var radiusDemage:int;
public var speed:int;
public var forceAmount:int;
public var lifeTime:float;
//Параметры из property.json Bullet <--


public var head : Transform;


public var weaponBehaviours : MonoBehaviour[];
//public var fireFrequency : float = 2;
public var fireSync:boolean=false; //Синхронная стрельба из всего оружия
//0.641 public var NotUseMotor:boolean=true; //Не использовать мотор для приближенеия к цели Триггер сработал начинаем обстрел
// Private memeber data
public var ai : AiCreature;

private var character : Transform;

var player : Transform;

private var inRange : boolean = false;
private var nextRaycastTime : float = 0;
private var lastRaycastSuccessfulTime : float = 0;
private var noticeTime : float = 0;

private var firing : boolean = false;
private var lastFireTime : float = -1;
private var nextWeaponToFire : int = 0;




function setPlayer(obj:Transform)
{
	player=obj;
}


function getPlayer():Object
{
	return player;
}

/*
function setParam(Param:String)
{
	super(Param);

	if (Param) {
		for (var i=0;i<weaponBehaviours.length;i++){
			weaponBehaviours[i].SendMessage("setParam",Param);
		} 
	}
}
*/
/*
function setParam(Param:AtackParam)
{
	for (var i=0;i<weaponBehaviours.length;i++){
			weaponBehaviours[i].SendMessage("setParam",Param);
	} 
}
*/
function SetBulletPrefab(_go:GameObject)
{
	bulletPrefab=_go;
	if (_go) {
		for (var i=0;i<weaponBehaviours.length;i++){
			weaponBehaviours[i].SendMessage("SetBulletPrefab",_go);
		} 
	}

}

function Awake () {
	if (motor){
		character = motor.transform;
	}else{
		character = transform;
	}
}

function OnEnable () {
	inRange = false;
	nextRaycastTime = Time.time;
	lastRaycastSuccessfulTime = Time.time;
	noticeTime = Time.time;
}

function OnDisable () {
	Shoot (false);
	for (var i=0;i<weaponBehaviours.length;i++){
			if (weaponBehaviours[i]) weaponBehaviours[i].SendMessage("StopFire",SendMessageOptions.DontRequireReceiver);
	}
}

function Shoot (state : boolean) {
	firing = state;
}

function FireNull (){
	Fire (null);
}

function Fire (target:Transform){
	//var par:Hashtable=new Hashtable();
	
//	setAtackParam();
	
	//atackParam['target']=target;
//	atackParam.targetLayers.value=targetLayersAll.value;
//	if (target) setParam(atackParam); //Для ненастраиваемых элементов target=null (сейчас для TowerLaser/AIAttackRocket)

	if (fireSync){
		for (var i=0;i<weaponBehaviours.length;i++){
			//weaponBehaviours[i].SendMessage("SetBulletPrefab", bulletPrefab);
			//weaponBehaviours[i].SendMessage("setParam", JSONUtils.HashtableToJSON(atackParam));
			if (target){
				weaponBehaviours[i].SendMessage("Fire", target);
			}else{
				weaponBehaviours[i].SendMessage("FireNull");
			}
		}
	}else{	
		if (weaponBehaviours[nextWeaponToFire]) {
			//weaponBehaviours[nextWeaponToFire].SendMessage ("SetBulletPrefab",bulletPrefab);
			//weaponBehaviours[nextWeaponToFire].SendMessage ("setParam",JSONUtils.HashtableToJSON(atackParam));
			if (target){
				weaponBehaviours[nextWeaponToFire].SendMessage ("Fire",target);
			}else{
				weaponBehaviours[nextWeaponToFire].SendMessage ("FireNull");
			}
			nextWeaponToFire = (nextWeaponToFire + 1) % weaponBehaviours.Length;
		}
	}
	lastFireTime = Time.time;
}


function Update () {
	// Calculate the direction from the player to this character
	lastRaycastSuccessfulTime=Time.time; //TODO: убрать добавил для тестирования
  if (player){
	var playerDirection : Vector3 = (player.position - character.position);
	playerDirection.y = 0;
	var playerDist : float = playerDirection.magnitude;
	playerDirection /= playerDist;
	
	// Set this character to face the player,
	// that is, to face the direction from this character to the player
	motor.facingDirection = playerDirection;
	
	if (!NotUseMotor){
	// Если используется управление мотором, приблизимся к игроку
		// For a short moment after noticing player,
		// only look at him but don't walk towards or attack yet.
/*		
		if (Time.time < noticeTime + 1.5) {
			motor.movementDirection = Vector3.zero;
			return;
		}
*/	
		//+5 Так как коллайдер срабатывает на краю объекта а тут вычисление до центра объекта	
		if (playerDist > (targetDistanceMax+5)){ //TODO вместо 5 надо определять размеры коллайдера на объекте (но +5 или поменьше лучше оставить)
			inRange = false;
		}else{
			inRange = true;
		}
			
		
		if (playerDist < targetDistanceMin)
			motor.movementDirection = Vector3.zero;
		else
			motor.movementDirection = playerDirection;
	}else{
		motor.movementDirection = Vector3.zero;
		inRange=true; //clonx 04/03/2015
	}
	
	if (inRange||NotUseMotor){  //clonx 06.12.2017 добавил параметр чтобы для ботов с циркуляркой у них маленький range и они не могут атаковать большие предметы NotUseMotor
		if (Time.time > nextRaycastTime) {
	//Видит- не видит - стреляет	
			if (!firing){
			nextRaycastTime = Time.time + frequency;
	//		if (ai.CanSeePlayer (player)) {
				lastRaycastSuccessfulTime = Time.time;
				//if (IsAimingAtPlayer ())
					Shoot (true);
				//else
				//	Shoot (false);
	//		}
	//		else{
	//Видит- не видит - стреляет		
	//			player=null; 
	//			Shoot (false);
	//			if (Time.time > lastRaycastSuccessfulTime + 5) {
	//				ai.OnLostTrack ();
	//			}
	//		}
			}
		}
		
		if (firing) {
			if (Time.time > nextRaycastTime) {
				nextRaycastTime=Time.time + frequency;
				Fire (player);
			}
		}
	}else{
		enabled=ReScanEnemy();
		
	}
  }else{ // if (player){
  	enabled=ReScanEnemy();
  }	
}

function ScanInHits(hits : Collider[]):boolean
//Подфункция для ReScanEnemy
{
	var collided : boolean = false;
	for (var c : Collider in hits) {
		var parent:Transform=c.transform.parent;		
		if (player){
			if (parent){
					if (Vector3.Distance(c.transform.position,transform.position)<Vector3.Distance(player.transform.position,transform.position)){
						player=c.transform;
						collided=true;
					}
			}
		}else{
			if (parent){
					player=c.transform;
					collided=true;
			}		
		}
	}
	return collided;
}

function ReScanEnemy():boolean
//Поиск новых целей
{
	ai.OnLostTrack();
/*
	var collided : boolean = false;
	var sphColl:SphereCollider=ai.gameObject.GetComponent(SphereCollider);
	//clonx для исключения ~
	// var hits : Collider[] = Physics.OverlapSphere (sphColl.center, sphColl.radius, ~ignoreLayers.value);
	var hits : Collider[]=Physics.OverlapSphere (sphColl.center, sphColl.radius, targetLayersMain.value);
	collided=ScanInHits(hits);

	if (!collided){
		hits= Physics.OverlapSphere (sphColl.center, sphColl.radius, targetLayersAll.value);
		collided=ScanInHits(hits);
	}
	return collided;
*/	
}


function IsAimingAtPlayer () : boolean {
	var playerDirection : Vector3 = (player.position - head.position);
	playerDirection.y = 0;
	return Vector3.Angle (head.forward, playerDirection) < 15;
}


#if UPGS_RECORD
function OnRegisterAgent(_rac: RegisterAgentClass)
{
	AgentRecorder=_rac.reg;
}
#endif
