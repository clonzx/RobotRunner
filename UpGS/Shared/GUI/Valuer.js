#pragma strict

//Скрипт для хранеения переменных в GUI
	var nameVal:String;
	var intVal:int;
	var strVal:String;
	public var sender:Function ;
	public var senderStr:Function ;

	private var timeDelta:float=0;


	function setVal(_val:String)
	{
		strVal=_val;
		if (senderStr) senderStr(_val);
	} 

	function setVal(_val:int)
	{
		intVal=_val;
		if (sender) sender(_val);
	} 

	function set2Val(_valInt:int,_valStr:String)
	{
		intVal=_valInt;
		strVal=_valStr;
	} 

	function setSprite(_sprite:Sprite)
	{
		var ims:Image=gameObject.GetComponent(Image);
		if (!ims) return;
		ims.sprite=_sprite;
	}


