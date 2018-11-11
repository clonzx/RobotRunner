import UnityEngine.EventSystems;


public class EventTriggerTowerAtack extends EventTrigger {
public var gameControll:UpGS.Data.GameControllTA;
private var SwapHorizontal:float=1;
private var SwapVertical:float=1;



	public override function OnBeginDrag(data: PointerEventData) {
		Debug.Log("OnBeginDrag called.");
	}
	public override function OnCancel(data: BaseEventData) {
		Debug.Log("OnCancel called.");
	}
	public override function OnDeselect(data: BaseEventData) {
		Debug.Log("OnDeselect called.");
	}
	public override function OnDrag(data: PointerEventData) {
//		Debug.Log("EventTriggerTowerAtack.OnDrag called."+data);
		
				switch (gameControll.MoveRotate){
					case 0: Camera.main.transform.parent.Translate((SwapHorizontal*data.delta.x)/10,0,0);
							Camera.main.transform.parent.Translate(Camera.main.transform.parent.forward*(SwapVertical*data.delta.y)/10,Space.World);
							break;
					case 1:		
							Camera.main.transform.parent.Rotate(Vector3(0,(-data.delta.x)/10,0));
							Camera.main.transform.parent.Translate(Camera.main.transform.parent.forward*(SwapVertical*data.delta.y)/10,Space.World);
//							if (SkyBoxCameraRuller) SkyBoxCameraRuller.Rotate(Vector3(0,-(data.delta.x)/10,0));
							break;
					case 2:		
							Camera.main.transform.parent.Rotate(Vector3(0,(-data.delta.x)/10,0));
							Camera.main.transform.Rotate(Vector3((data.delta.y)/10,0,0));
//							if (SkyBoxCameraRuller) SkyBoxCameraRuller.Rotate(Vector3(-(data.delta.y)/10,-(data.delta.x)/10,0));
							break;
			}
	}
		
	public override function OnDrop(data: PointerEventData) {
		Debug.Log("OnDrop called. ");
	}
	public override function OnEndDrag(data: PointerEventData) {
		Debug.Log("OnEndDrag called.");
	}
	public override function OnInitializePotentialDrag(data: PointerEventData) {
		Debug.Log("OnInitializePotentialDrag called.");
	}
	public override function OnMove(data: AxisEventData) {
		Debug.Log("OnMove called.");
	}
	public override function OnPointerClick(data: PointerEventData) {
		Debug.Log("OnPointerClick called.");
	}
	public override function OnPointerDown(data: PointerEventData) {
		//StartPoint=data.pressPosition
		Debug.Log("OnPointerDown called. data="+data);
	}
	public override function OnPointerEnter(data: PointerEventData) {
		Debug.Log("OnPointerEnter called.");
	}
	public override function OnPointerExit(data: PointerEventData) {
		Debug.Log("OnPointerExit called.");
	}
	public override function OnPointerUp(data: PointerEventData) {
//		Debug.Log("OnPointerUp called. data="+data);
//		Debug.Log("OnPointerUp called. pressPosition="+data.pressPosition);
		if ((data.pressPosition-data.position).magnitude<3){
       		var ray:Ray  = Camera.main.ScreenPointToRay(data.position);
			var hit:RaycastHit ;
			if (Physics.Raycast (ray, hit)) {
				gameControll.raycastHitProcesor(hit);
			}
		}
	}
	
	public override function OnScroll(data: PointerEventData) {
		Debug.Log("OnScroll called.");
	}
	public override function OnSelect(data: BaseEventData) {
		Debug.Log("OnSelect called.");
	}
	public override function OnSubmit(data: BaseEventData) {
		Debug.Log("OnSubmit called.");
	}
	public override function OnUpdateSelected(data: BaseEventData) {
		Debug.Log("OnUpdateSelected called.");
	}

	
	
}