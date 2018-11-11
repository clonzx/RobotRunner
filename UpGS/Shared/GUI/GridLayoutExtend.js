#pragma strict
//Автоматическое изменение размера от количества добавленных кнопок


class GridLayoutExtend extends GridLayoutGroup
{

	function Start()
	{
		super();
		Resize();
	}

	function Resize()
	{
		var Buttons:Component[]=gameObject.GetComponentsInChildren(Button);
		var rt:RectTransform=gameObject.GetComponent(RectTransform);
		if (startAxis==Axis.Vertical){
			rt.sizeDelta.y=(cellSize.y+spacing.y)*Buttons.length;
		}else{
			rt.sizeDelta.x=(cellSize.x+spacing.x)*Buttons.length;
		}
	}


}