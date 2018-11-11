#pragma strict

public enum IndEnum{time, slot, loadProgressAll, loadProgressOne, health, staticHealth};
public enum Direction{forward, backward};
var Type:IndEnum; 
public var direction:Direction;

//private var lc:LevelCollection;
//private var mg:MenuGUI;
private var img:Image;
private var text:UI.Text;
private var ProgressCount:float;
private var OneTowerHealth:Health;
public var maxValue:float;
private var nextTimeUpdate:float;
private var step:float=0.5;


function Start () {
//	lc=LevelCollection.Instance();
//	mg=MenuGUI.Instance();
	img=gameObject.GetComponent(Image);
	text=gameObject.GetComponentInChildren(UI.Text);
	nextTimeUpdate=Time.time+step;
}

function Update () {
	if (Time.time>nextTimeUpdate){
		switch(Type){
			case IndEnum.time:
				updateTime();
				break;
			case IndEnum.slot:
				updateSlot();
				break;
			case IndEnum.health:
				updateHealth();
				break;

		}
		nextTimeUpdate=Time.time+step;
	}
}


function updateTime()
{
/*
	if (!mg) return;
	if (mg.TimerStarted){
		var ctime:float;
		ctime=Time.time-mg.timeStart;
		var allTime=mg.timeAtack+lc.addTime+mg.techTimeTotal;
		if (allTime==0) return;
		if (ctime>allTime) ctime=allTime;

		if (direction==Direction.forward){
			img.fillAmount=ctime/allTime;
		}else{
			img.fillAmount=1-ctime/allTime;
		}
		if (text){
			text.text=String.Format("{0}m {1}s", Mathf.FloorToInt((allTime-ctime) / 60), Mathf.RoundToInt((allTime-ctime) % 60));
		}
	}
*/
}

function updateHealth()
//TODO: Сделать так чтобы вызывалась только при смене слота (например запоминать старое значение)
{
/*
	if (!lc||!lc.Property) return;
	if (lc.Property['GameType']=='OneTower'){
		if (!OneTowerHealth){
			var go:GameObject=GameObject.Find(lc.Property['TowerControll']);
			if (go){
				OneTowerHealth=go.GetComponentInChildren(Health);
			}
			if (!OneTowerHealth) return;
		}

		if (direction==Direction.forward){
			img.fillAmount=OneTowerHealth.health/OneTowerHealth.maxHealth;
		}else{
			img.fillAmount=1-OneTowerHealth.health/OneTowerHealth.maxHealth;
		}
		if (text){
			text.text=String.Format("{0}/{1}",OneTowerHealth.health,OneTowerHealth.maxHealth);
		}

	}
*/
}

function staticHealth(_maxHealth:float,_health:float)
// Вызывается из Heelth
{
		if (img){
			if (direction==Direction.forward){
				img.fillAmount=_health/_maxHealth;
			}else{
				img.fillAmount=1-_health/_maxHealth;
			}
		}
		if (text){
			text.text=String.Format("{0}/{1}",_health,_maxHealth);
		}
}

function updateSlot()
//TODO: Сделать так чтобы вызывалась только при смене слота (например запоминать старое значение)
{
/*
		var ctime:float;
		if (!lc) return;
		ctime=lc.slotUse;
		var allTime=lc.maxSlot+lc.addSlot;
		if (allTime==0) return;
		if (ctime>allTime) ctime=allTime;

		if (direction==Direction.forward){
			img.fillAmount=ctime/allTime;
		}else{
			img.fillAmount=1-ctime/allTime;
		}
		if (text){
			text.text=String.Format("{0}/{1}({2})",lc.slotUse,lc.maxSlot+lc.addSlot,lc.addSlot);
		}
*/
}


function updateProgress(_all:float,_current:float)
{
	if (direction==Direction.forward){
			img.fillAmount=_current/_all;
	}else{
			img.fillAmount=1-_current/_all;
	}
}

