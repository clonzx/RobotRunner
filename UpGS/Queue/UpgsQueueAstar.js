#pragma strict

class UpgsQueueAstar extends UpgsQueue
{

#if ASTAR_PATH
	function Awake () {
		super();
		externalFunction=ExternalRun; //Просто чтобы не была пустой- на самом деле вызывается жестко кодом.
	}

	function ExternalRun()
	//Переопределять если не совпали параметры
	{
		if (lastExtRun.obj){
			var target:Vector3=lastExtRun.obj;
			var p:Pathfinding.Path=seeker.StartPath (lastExtRun.go.transform, target, externalCallback);
			if (PlayerPrefs.GetInt('debug')==1) Debug.LogWarning("UpgsQueueAstar.ExternalRun after seeker.StartPath ");
			if (p.CompleteState == PathCompleteState.Error){
					externalCallback(null);
			}
			return true;
		}else{
			if (PlayerPrefs.GetInt('debug')==1) Debug.LogError("UpgsQueueAstar.ExternalRun lastExtRun.varr not defined!");
			return false;	
		}
	}

	function externalCallback(p:Pathfinding.Path)
	//Внешний обработчик завершил выполнение
	{
		if (lastExtRun){
			if (lastExtRun.go){
				lastExtRun.callback(p, lastExtRun.localCallback);
			}
		}
		externalCall=false;
		externalCallTime=0;
		CheckEndRun(); 		
	}
#endif

}