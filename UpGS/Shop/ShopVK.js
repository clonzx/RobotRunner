#pragma strict

private var node:Node;
//private var ol:OneLoad;


function Awake()
{
	node=Node.Instance();	
//	ol=OneLoad.Instance();
}

function purchaseProduct(_sku:String)
{
#if UNITY_WEBPLAYER
	if (PlayerPrefs.GetInt('debug')==1) Debug.LogWarning("purchaseProduct UNITY_WEBPLAYER "+_sku);
	Application.ExternalEval("document.getElementById('unityPlayer').style.visibility = 'hidden'; order('"+_sku+"');");
#else
	if (PlayerPrefs.GetInt('debug')==1) Debug.LogWarning("purchaseProduct UNITY_WEBGL "+_sku);
	Application.ExternalEval("document.getElementById('gameContainer').style.visibility = 'hidden'; var params = {type: 'item', item: '"+_sku+"'}; VK.callMethod('showOrderBox', params);");
#endif
}

function purchaseSubscription(_sku:String)
{

}

function OrderCallback(_order_id:String)
{
	if (PlayerPrefs.GetInt('debug')==1) Debug.LogWarning("OrderCallback "+_order_id);
	node.commandSig("checkorder",["sid","timestamp","user","order","store"],[Loader.sid , Loader.timestamp,Loader.social,_order_id,node.developerSettings.shopType],ProcessOrderWWW);
}


function ProcessOrderWWW(download:String,addErr:String)
//Обработка платежного заказа после проверки на сервере
{

	if (addErr!=''){
		if (PlayerPrefs.GetInt('debug')==1) Debug.LogError(lng.Trans("@ProcessOrderWWW error")+" "+addErr);
		node.developerContainer.err=addErr;
		return;
	}
	//if (PlayerPrefs.GetInt('debug')==1) Debug.LogWarning("ProcessOrderWWW Success! "+download.text);
	//Проверим достоверность покупки	
	var Objs:Hashtable=JSONUtils.ParseJSON(download);
	var sig:String=PlayerPrefs.GetString("sid")+Objs["order"]+Objs["time"]+node.developerSettings.developerKey;
	//if (PlayerPrefs.GetInt('debug')==1) Debug.Log(sig);
	//if (PlayerPrefs.GetInt('debug')==1) Debug.Log("Objs_sig="+Objs["purch"]);
	sig=md5.md5Sum(sig);
	//if (PlayerPrefs.GetInt('debug')==1) Debug.Log(sig);
	if (sig!=Objs["sig"]){
		if (PlayerPrefs.GetInt('debug')==1) Debug.LogError(lng.Trans("@Purchase not valid"));
		return;
	}
	if (Objs["bonus"]){
			var b3:int=Objs["b3"];
			PlayerPrefs.SetInt("BonHard",b3);
//TODO:			
/*			
			var lc:LevelCollection=LevelCollection.Instance();
			lc.BonusText();			
*/			
	}	
//TODO:	EventList.findEvent('Purch',Objs["product"],Objs["order"],PlayerPrefs.GetString("ShopType"));
	//if (PlayerPrefs.GetInt('debug')==1) Debug.Log(lng.Trans("@Purchase processed "+Objs["product"]));
}