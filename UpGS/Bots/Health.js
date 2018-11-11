#pragma strict
import UpGS.Bullet;
import UpGS.Creature;

public var maxHealth : float = 100.0;
public var health : float = 100.0;
public var regenerateSpeed : float = 0.0;
public var invincible : boolean = false;
public var dead : boolean = false;

public var damagePrefab : GameObject;
public var damageEffectTransform : Transform;
public var damageEffectMultiplier : float = 1.0;
public var damageEffectCentered : boolean = true;

public var scorchMarkPrefab : GameObject = null;
private var scorchMark : GameObject = null;

public var damageSignals : SignalSender;
public var dieSignals : SignalSender;

private var lastDamageTime : float = 0;
private var damageEffect : ParticleEmitter; //TODO: заменить
private var damageEffectCenterYOffset : float;
//private var lc:LevelCollection;
//private var ta:TerrainAction;
private var diePlace:boolean=false; //Попали в место наносящее урон



@HideInInspector
public var ObjTipId:int; //Номер по порядку в конфигурации например номер бота



private var colliderRadiusHeuristic : float = 1.0;
public var MainForm:Transform; //Р“Р»Р°РІРЅР°СЏ С„РѕСЂРјР° РїРѕ РєРѕС‚РѕСЂРѕР№ Р±СЉСЋС‚ Р»СѓС‡Рё Рё СЂР°РєРµС‚С‹

//public var healthIndicator:Indicator;

//@HideInInspector
//public var stekSeeker:StekSeekerPath;

var rigidBody:Rigidbody; //Телу к которому приложить силу


function Awake () {
	enabled = false;
	if (damagePrefab) {
		if (damageEffectTransform == null)
			damageEffectTransform = transform;
//TODO:
/*			
		var effect : GameObject = Spawner.Spawn (damagePrefab, Vector3.zero, Quaternion.identity);
		effect.transform.parent = damageEffectTransform;
		effect.transform.localPosition = Vector3.zero;
		damageEffect = effect.GetComponent.<ParticleEmitter>();
		var tempSize : Vector2 = Vector2(GetComponent.<Collider>().bounds.extents.x,GetComponent.<Collider>().bounds.extents.z);
		colliderRadiusHeuristic = tempSize.magnitude * 0.5;
		damageEffectCenterYOffset = GetComponent.<Collider>().bounds.extents.y;
*/
	}
	if (scorchMarkPrefab) {
		scorchMark = GameObject.Instantiate(scorchMarkPrefab, Vector3.zero, Quaternion.identity);
		//0.052 clonx 21.05.2015 scorchMarkPrefab Рё РљСЌС€ СѓР±СЂР°Р» РёР· РєРѕСЂРЅСЏ РґРµСЂРµРІР° РѕР±СЉРµРєС‚РѕРІ-->
		var parent=GameObject.Find('Misc');
		if (parent){
			scorchMark.transform.parent=parent.transform;
		}
		//0.052 clonx 21.05.2015 scorchMarkPrefab Рё РљСЌС€ СѓР±СЂР°Р» РёР· РєРѕСЂРЅСЏ РґРµСЂРµРІР° РѕР±СЉРµРєС‚РѕРІ<--
		scorchMark.SetActive (false);
	}
	var go:GameObject=GameObject.Find('Main');
//	lc=LevelCollection.Instance(); //go.GetComponent(LevelCollection);
	
//	ta=lc.ta;//go.GetComponent(TerrainAction);
//	stekSeeker=lc.gameObject.GetComponent(StekSeekerPath); //go.GetComponent(StekSeekerPath);
}


function DestroyCurrent()
{
	GameObject.Destroy(gameObject);
}

function OnDamage (_damage:Damage)
//Нанести урон и приложить усилие
{
	OnDamage(_damage.damageAmount, _damage.fromDirection);
	if(invincible)
		return;
	if (dead)
		return;
	if (_damage.damageAmount <= 0)
		return;
	if (rigidBody)
	{
		var force : Vector3 = _damage.fromDirection * _damage.force;
		force.y = 0;
		rigidBody.AddForce (force, ForceMode.Impulse);
	}		
}

function OnDamage (amount : float, fromDirection : Vector3) {
	// Take no damage if invincible, dead, or if the damage is zero
	if(invincible)
		return;
	if (dead)
		return;
	if (amount <= 0)
		return;

	// Decrease health by damage and send damage signals

	// @HACK: this hack will be removed for the final game
	//  but makes playing and showing certain areas in the
	//  game a lot easier
	/*
	#if !UNITY_IPHONE && !UNITY_ANDROID && !UNITY_WP8
	if(gameObject.tag != "Player")
		amount *= 10.0;
	#endif
	*/
	
	health -= amount;
//TODO:		
/*
	if (healthIndicator){
		if (!healthIndicator.transform.parent.gameObject.active) healthIndicator.transform.parent.gameObject.active=true;
		healthIndicator.staticHealth(maxHealth,health);
	}
*/	
	damageSignals.SendSignals (this);
	lastDamageTime = Time.time;

	// Enable so the Update function will be called
	// if regeneration is enabled
	if (regenerateSpeed > 0)
		enabled = true;

	// Show damage effect if there is one
	if (damageEffect) {
		damageEffect.transform.rotation = Quaternion.LookRotation (fromDirection, Vector3.up);
		if(!damageEffectCentered) {
			var dir : Vector3 = fromDirection;
			dir.y = 0.0;
			damageEffect.transform.position = (transform.position + Vector3.up * damageEffectCenterYOffset) + colliderRadiusHeuristic * dir;
		}
		// @NOTE: due to popular demand (ethan, storm) we decided
		// to make the amount damage independent ...
		//var particleAmount = Random.Range (damageEffect.minEmission, damageEffect.maxEmission + 1);
		//particleAmount = particleAmount * amount * damageEffectMultiplier;
//TODO:		damageEffect.Emit();// (particleAmount);
	}

	// Die if no health left
	if (health <= 0)
	{
		moveListener();
//		RetargetEnemy();
		//0.507 clonx 11.08.2015 -->
/*		
		if ((GameScore.GetEnemyLaers().value&1<<gameObject.layer)!=0){

			var mGO:GameObject;
			var obj:Hashtable=lc.Defence[gameObject.name];
			
			if (obj["Tip"]==2) {
//				Debug.Log("Health.OnDamage before stekSeeker.ClearOldTarget()");
				stekSeeker.ClearOldTarget(); //0.583 clonx сбросим старые пути
//				Debug.Log("Health.OnDamage after stekSeeker.ClearOldTarget()");
			}

			GameScore.RegisterDeath (gameObject,maxHealth,obj["Tip"]);
			switch (obj["Tip"]){
				case 0: //Башни
					lc.towerCount--;
					break;
				case 1: //Ресурсы
					lc.resCount--;
					break;
				case 2: //Стены
					lc.wallCount--;	
					break;
			}
		}else{
		//0.507 clonx 11.08.2015 <--
			lc.slotUse--;
			GameScore.RegisterDeath (gameObject,maxHealth,ObjTipId);
		}
*/		
//		lc.levelResult(); //0.585 clonx 28.04.2016
		health = 0;
		dead = true;
		
//		Debug.Log("Health.OnDamage before dieSignals.SendSignals gameObject.name="+gameObject.name);
		dieSignals.SendSignals (this);
//		Debug.Log("Health.OnDamage after dieSignals.SendSignals gameObject.name="+gameObject.name);
		
		enabled = false;
		

		// scorch marks
		if (scorchMark) {
			scorchMark.SetActive (true);
			// @NOTE: maybe we can justify a raycast here so we can place the mark
			// on slopes with proper normal alignments
			// @TODO: spawn a yield Sub() to handle placement, as we can
			// spread calculations over several frames => cheap in total
			var scorchPosition : Vector3 = GetComponent.<Collider>().ClosestPointOnBounds (transform.position - Vector3.up * 100);
			scorchMark.transform.position = scorchPosition + Vector3.up * 0.1;
			scorchMark.transform.eulerAngles.y = Random.Range (0.0, 90.0);
		}
//TODO:
/*		
		if (lc.ExtendedEvent){
			var objectSide:int = GameScore.FindObjectSide (gameObject);
			if (objectSide==1) EventList.findEvent("PlayerDeath","","","");
			if (objectSide==2) EventList.findEvent("EnemyDeath","","","");
		}
*/		
	}
	
}

function moveListener()
//
{
	var al:AudioListener=GetComponentInChildren(AudioListener);
	if (al){
		al.transform.SetParent(Camera.main.transform); //Перенесем на камеру временно
//		var lc:LevelCollection=LevelCollection.Instance();
//		lc.SetListener(gameObject,true);
	}
	var camera:Camera=GetComponentInChildren(Camera);
	if (camera){
		camera.transform.parent.SetParent(null);
	}
}

function OnEnable () {
	Regenerate ();
}

// Regenerate health

function Regenerate () {
	if (regenerateSpeed > 0.0f) {
		while (enabled) {
			if (Time.time > lastDamageTime + 3) {
				health += regenerateSpeed;

				yield;

				if (health >= maxHealth) {
					health = maxHealth;
					enabled = false;
				}
			}
			yield WaitForSeconds (1.0f);
		}
	}
}

function StartDamage(_amount:int,_fromDir:Vector3,_damageForce:float, _delay:float)
//Попали в место наносящее урон
{
	if (_delay==0) _delay=3;
	diePlace=true;
	while (diePlace){
		OnDamage (new Damage(_amount, _damageForce, _fromDir));
		yield WaitForSeconds (_delay);
	}
}

function EndDamage()
//Выщли из место наносящего урон
{
	diePlace=false;
}

/*
function RetargetEnemy()
//clonx 05/06/2014
// РџРµСЂРµРЅР°С†РµР»РёС‚СЊ РІСЃРµ РѕР±СЉРµРєС‚С‹ СЃС‚СЂРµР»СЏСЋС‰РёРµ РёР»Рё РёРґСѓС‰РёРµ СЃСЋРґР°
{
	var def:Array=['Towers','Walls','Resources'];
	var go:GameObject;
	var comps:Component[];
	var ai:AiBase;
	if (transform.parent.gameObject.name=='Atack'){
		for (var p in def){
			go=GameObject.Find(p);
			if (go){
				comps=go.GetComponentsInChildren(AiBase);
				for (ai in comps){
					ai.OnLostTrack();
				}
			}
		}	
	}else{
		go=GameObject.Find('Atack');
		if (go){
			comps=go.GetComponentsInChildren(AiBase);
			for (ai in comps){
				ai.OnLostTrack();
			}
		}
	}
}
*/