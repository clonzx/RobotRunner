#pragma strict


import System.Collections.Generic;

public class UpgsQueueElement
{
	public var go:GameObject;
	public var beforeCallback:Function; //Функция которой передается управление перед вызовом externalFunction
	public var callback:Function; //Функция которой передается управление
	public var localCallback:Function; //Может использоваться для вызова из callback
	public var obj:Object; // Произвольный объект
}

	private var q:Queue.<UpgsQueueElement>;
	public var externalFunction:Function; //Внешняя функция вызываемая из очереди
	public var externalCall:boolean; //Вызвана внешняя функция
	public var externalCallTime:float; //Время вызвана внешнего обработчика
	public var timeRerun:float; //Перезапустить внешний обработчик если прошло указанное время, если 0 не используется
	public var lastExtRun:UpgsQueueElement; //Последний элемент отправленный на обработку внешней функцией
	
	public static var instance:UpgsQueue;


	static function Instance():UpgsQueue
	{
				if (instance == null)
				{
					instance = FindObjectOfType (typeof (UpgsQueue));
				}
				return instance;
	}

	function Awake () {
		q = new Queue.<UpgsQueueElement>();
	}

	function Enqueue(el:UpgsQueueElement)
	//Добавим элемент в очередь
	{
		q.Enqueue (el);
		CheckEndRun();
	}

	function LateUpdate () {
		if (timeRerun && externalCall){
			if ((Time.time-externalCallTime)>timeRerun){
				externalCallback(); //Принудительно завершим обработку
			}
		}
	}

	function Count():int
	{
		return q.Count;
	}	

	function CheckEndRun()
	//Проверить очередь и запустить внешний обработчик
	{
		var runExt:boolean=false;
		
		if (q.Count>0 && !externalCall && externalFunction){
			while (!runExt){
				if (q.Count<1) return;
				lastExtRun=q.Dequeue();
				if (lastExtRun.go){ //Если объект еще существует обработаем
					externalCall=true;
					externalCallTime=Time.time;
					if (lastExtRun.beforeCallback){
						runExt=beforeCallbackRun();
					}else{
						runExt=ExternalRun(); 
					}
				}
			}
		}
	}
	
	function beforeCallbackRun():boolean
	//Функция для переопределения
	{
		lastExtRun.beforeCallback(lastExtRun,beforeCallbackEnd);
		return true;
	}
	
	function beforeCallbackEnd()
	{
		ExternalRun();
	}
	
	function ExternalRun():boolean
	//Переопределять если не совпали параметры
	{
		externalFunction(lastExtRun,externalCallback);
		return true;
	}
	
	
	function Clear()
	//Очистим очередь
	{
		q.Clear();
		externalCall=false;
		externalCallTime=0;
	}
	
	function externalCallback()
	//Внешний обработчик завершил выполнение
	{
		if (lastExtRun){
			if (lastExtRun.go && lastExtRun.callback){
				lastExtRun.callback(lastExtRun.localCallback);
			}
		}
		externalCall=false;
		externalCallTime=0;
		CheckEndRun(); 		
	}

	
