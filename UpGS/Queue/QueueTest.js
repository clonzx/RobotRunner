#pragma strict

var que:UpgsQueue;

function Start () {
	que=FindObjectOfType (typeof (UpgsQueue));
	que.externalFunction=GlobalProcess;
	var el:UpgsQueueElement= new UpgsQueueElement();
	el.go=gameObject;
	el.callback=TestCallback1;
	el.localCallback=TestCallback2;
	for (var i:int=0;i<20;i++){
		que.Enqueue(el);	
	}
}

function TestCallback1(callback:Function)
{
	callback();
}

function TestCallback2()
{
	Debug.Log("success dounloaded");
}



function GlobalProcess(el:UpgsQueueElement, callback:Function)
{
	Debug.Log("GlobalProcess");
	GlobalProcessSubrun(el, callback);
}

function GlobalProcessSubrun(el:UpgsQueueElement, callback:Function)
{
	var download = new WWW( "https://sun9-1.userapi.com/c840735/v840735819/69d10/SAWJAh4s7wA.jpg" );
	yield download;
	callback();
}