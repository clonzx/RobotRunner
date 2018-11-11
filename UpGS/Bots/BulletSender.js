#pragma strict

public var character : GameObject; //Сам объект на котором работает этот скрипт 
var coneAngle : float = 1.5;
var bulletPrefab:GameObject;
//var atackParam:AtackParam; //String;

function SetBulletPrefab(_prefab:GameObject)
{
	bulletPrefab=_prefab;
}

/*
function setParam(_param:AtackParam)
{
	atackParam=_param.param();
}
*/

function FireNull () {
	Fire (null);
}

function Fire (_target:Transform) {
	var coneRandomRotation = Quaternion.Euler (Random.Range (-coneAngle, coneAngle), Random.Range (-coneAngle, coneAngle), 0);
	//var bullet:GameObject=Spawner.Spawn (bulletPrefab, transform.position, transform.rotation * coneRandomRotation);
	var bullet:GameObject=Instantiate(bulletPrefab, transform.position, transform.rotation * coneRandomRotation);
		
	bullet.active=true;
	//bullet.SendMessage ("setParam",atackParam);
	if (_target){
		bullet.SendMessage ("Fire",_target);
		bullet.SendMessage ("setCharacter",character);
	}else{
		bullet.SendMessage ("FireNull");
		bullet.SendMessage ("setCharacter",character);
	}
		
}

function StopFire()
{
}


