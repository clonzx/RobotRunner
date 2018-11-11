using UnityEngine.EventSystems;
using UnityEngine;

namespace UpGS.Creature{
	public class EventTriggerLite : EventTrigger {
		public ProcessCommandLite[] process;
/*
		public override void OnBeginDrag(PointerEventData data ) {
			Debug.Log("OnBeginDrag called.");
		}
		public override void OnCancel(BaseEventData data) {
			Debug.Log("OnCancel called.");
		}

		public override void OnDeselect(BaseEventData data) {
			Debug.Log("OnDeselect called.");
		}
*/
		public override void OnDrag(PointerEventData data) {
//			Debug.Log("EventTriggerTowerAtack.OnDrag called."+data);
			for (int i=0; i<process.Length; i++) {
//TODO:				process[i].OnDrag(data);
			}
		}
/*		
		public override void OnDrop(PointerEventData data) {
			Debug.Log("OnDrop called. ");
		}

		public override void OnEndDrag(PointerEventData data) {
			Debug.Log("OnEndDrag called.");
		}

		public override void OnInitializePotentialDrag(PointerEventData data) {
			Debug.Log("OnInitializePotentialDrag called.");
		}

		public override void OnMove(AxisEventData data) {
			Debug.Log("OnMove called.");
		}

		public override void OnPointerClick(PointerEventData data) {
			Debug.Log("OnPointerClick called.");
		}

		public override void OnPointerDown(PointerEventData data) {
			//StartPoint=data.pressPosition
			Debug.Log("OnPointerDown called. data="+data);
		}

		public override void OnPointerEnter(PointerEventData data) {
			Debug.Log("OnPointerEnter called.");
		}

		public override void OnPointerExit(PointerEventData data) {
			Debug.Log("OnPointerExit called.");
		}

		public override void OnPointerUp(PointerEventData data) {
			//		Debug.Log("OnPointerUp called. data="+data);
		}
		
		public override void OnScroll(PointerEventData data) {
			Debug.Log("OnScroll called.");
		}

		public override void OnSelect(BaseEventData data) {
			Debug.Log("OnSelect called.");
		}

		public override void OnSubmit(BaseEventData data) {
			Debug.Log("OnSubmit called.");
		}

		public override void OnUpdateSelected(BaseEventData data ) {
			Debug.Log("OnUpdateSelected called.");
		}
*/		
	}

}