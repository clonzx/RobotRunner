#pragma strict
//0.598 clonx  сдвиг мышкой пропорционально коэффициентам
//TODO: переделать на EventSystem

private var mult:float; //Коэффициент 
public var min:Vector2; //Коэффициент 
public var max:Vector2; //Коэффициент 
@HideInInspector
public var touchMoved:boolean;
@HideInInspector
public var downPosition:Vector2;
@HideInInspector
public var movePosition:Vector2;
private var rt:RectTransform;

function Awake()
{
	rt=GetComponent(RectTransform);
}

function InitParam(_mult:float)
{
	mult=_mult/100;
	UpdateMinMax();
}

function UpdateMinMax()
{
	min=Vector2(Screen.width*rt.pivot.x-rt.sizeDelta.x*rt.pivot.x+Screen.width*(rt.pivot.x-rt.anchorMax.x),Screen.height*rt.pivot.y-rt.sizeDelta.y*rt.pivot.y+Screen.height*(rt.pivot.y-rt.anchorMax.y));
	max=Vector2(rt.sizeDelta.x*rt.pivot.x-Screen.width*rt.pivot.x*(rt.anchorMax.x+rt.anchorMin.x),rt.sizeDelta.y*rt.pivot.y-Screen.height*rt.pivot.y*(rt.anchorMax.y+rt.anchorMin.y));
}

function Update () {
	UpdateMinMax(); //TODO: Привязать к событию изменения разрешения экрана
	if (Application.loadedLevelName!="loader"&&Application.loadedLevelName!="MainMenu") return;
	if (Application.platform == RuntimePlatform.WindowsPlayer||Application.platform == RuntimePlatform.WindowsEditor||Application.platform==RuntimePlatform.WebGLPlayer){
		Update4Win();
	}else{
		Update4Android ();
	}
}


function Update4Win()
//Для перемещения камеры в Windows
{
	
	if (Input.GetMouseButton(0)){
		var inGUI:boolean=false;
		if (!touchMoved){
			touchMoved=true;
			downPosition=Input.mousePosition;
			movePosition=Input.mousePosition;
		}
		rt.Translate((Input.mousePosition.x-movePosition.x)*mult,(Input.mousePosition.y-movePosition.y)*mult,0);
		FixMax();
		movePosition=Input.mousePosition;
	}
	if (Input.GetMouseButtonUp(0)){
		touchMoved=false;	
	}
}

function FixMax()
//Фиксируем крайние положения
{
		if (rt.anchoredPosition.x<min.x)  rt.anchoredPosition.x=min.x;
		if (rt.anchoredPosition.y<min.y) rt.anchoredPosition.y=min.y;
		if (rt.anchoredPosition.x>max.x)  rt.anchoredPosition.x=max.x;
		if (rt.anchoredPosition.y>max.y) rt.anchoredPosition.y=max.y;
}

function  Update4Android () 
//Для перемещения камеры в Android
// и для отлова нажатий
{
	var go:GameObject;
	
       if (Input.touchCount == 1)
       {
       		var touch:Touch = Input.touches[0];
                if (touch.phase == TouchPhase.Moved) {
	                rt.Translate((touch.position.x-movePosition.x)*mult,(touch.position.y-movePosition.y)*mult,0);
	                FixMax();
					movePosition=touch.position;
                }
                
                if (touch.phase == TouchPhase.Began) {
		       		if (!touchMoved){
						touchMoved=true;
						downPosition=touch.position;
						movePosition=touch.position;
					}
                }
                if (touch.phase == TouchPhase.Ended) {
                  touchMoved=false;
                }
       }
}
