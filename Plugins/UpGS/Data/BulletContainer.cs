using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;


namespace UpGS.Data
{
//Пока не используется- разобраться как задействовать

[System.Serializable]
public class BulletSettings 
{
//SimpleBullet
	public float 	shotForce; //Ускорение для выстрела пули
	public bool  	damageOnShot; //Урон в момент выстрела без учета попалп или нет по траектории
	public int 		damageAmount; //Урон
	public int 		forceAmount;//Ударное усилие
	public LayerMask 	useLayers; //Какую маску использовать
	public float 	lifeTime; //Время жизни

	public float radiusDetonation;
	public float radiusDemage;

//BulletSender
	public float	coneAngle; //Отклонение выстрела
	public GameObject	bulletPrefab; //GameObject пули
//AtackCreature
	public float frequency; // = 1; //Частота выстрелов

}


[CreateAssetMenu(fileName = "UpGS bullet",menuName="UpGS/bullet data",order=0)]
//[MenuItem("Assets/Create/UpGS/FloatVariable")]
public class BulletContainer:BaseScriptable //TODO: вызвать AssetBundle2Dict после изменения массива AssetBundle
{
	public BulletSettings bulletSettings;

}



	

}
