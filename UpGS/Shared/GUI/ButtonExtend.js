#pragma strict
//Вызвать изменение размера объекта владельца

class ButtonExtend extends Button
{
	function Start()
	{
		var gle:GridLayoutExtend=transform.parent.gameObject.GetComponent(GridLayoutExtend);
		if (gle){
			gle.Resize();
		}
	}

	function OnDestroy()
	{
		var gle:GridLayoutExtend=transform.parent.gameObject.GetComponent(GridLayoutExtend);
		if (gle){
			gle.Resize();
		}
	}	

	
}