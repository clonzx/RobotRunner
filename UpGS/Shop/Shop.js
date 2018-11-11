#pragma strict
//******************************************************************
// Внутри игровые покупки
//******************************************************************

//TODO: Пока WEB магазин только VK потом надо будет делить

@HideInInspector
#if UPGS_OPENIAB
	public var cIAB:clonxOpenIAB;
#endif
private var sVK:ShopVK;
#if UPGS_FACEBOOK
private var sFB:FBService;
#endif
//public var CanvasVK:GameObject;
//public var CanvasAndroid:GameObject;
public var MsgText:Text;
public var MsgAnim:Animator;
public var ShopGrid:Grid;
private var node:Node;
@HideInInspector
public var ButtonLoaded=false; //Кнопки загружены
//private var ol:OneLoad;

static var instance:Shop;

static function Instance():Shop
{
			if (instance == null)
			{
				instance = FindObjectOfType (typeof (Shop));
			}
			return instance;
}
	
function Awake()
{
//	ol=OneLoad.Instance();
	if (!ShopGrid)	ShopGrid=FindObjectOfType (typeof (Grid)); //0.618 clonx 22.11.2016
	node=Node.Instance();
#if UNITY_WEBPLAYER||UNITY_WEBGL
	sVK=gameObject.GetComponent(ShopVK);
	sFB=FBService.Instance();
#endif

#if UNITY_ANDROID && UPGS_OPENIAB
	cIAB=gameObject.GetComponent(clonxOpenIAB);
#endif
}

function purchaseProductBonus(_sku:String)
//Оплата покупки бонусами
{
//TODO:
/*
	var lc:LevelCollection=LevelCollection.Instance();
	var bonus:int=lc.Property["BonLvl"]?lc.Property["BonLvl"]:0;
	var purchStr:String='{"orderId": "nonum", "purchaseToken": "notoken", "purchaseTime": 0, "purchaseState": 0, "packageName": "com.bntm.bntb", "productId": "'+_sku+'"}';
	node.commandSig("purch",["sid","timestamp","purch","store","lvlb","type"], [PlayerPrefs.GetString("sid") , PlayerPrefs.GetString("timestamp"),purchStr,"sgames",""+bonus,"item"],bonusResult);
*/	
}

function bonusResult(download:String,addErr:String)
{
	if (addErr){
		if (!MsgText){
			node.developerContainer.err=addErr;
		}else{
			MsgText.text=lng.Trans('@Error! ')+lng.Trans(addErr)+' '+download;
			MsgAnim.Play('Open');
		}
		return;
	}
	if (MsgText && MsgAnim){
		MsgText.text=lng.Trans('@Success');
		MsgAnim.Play('Open');
	}else{
		//TODO: Как то оповестить об успехе
	}
	var purchResult:Hashtable=JSONUtils.ParseJSON(download);
	var	sig:String=""+PlayerPrefs.GetString('timestamp')+purchResult["productId"]+purchResult["purchId"]+ purchResult["lvlb"]+node.developerSettings.developerKey;
	sig=md5.md5Sum(sig);
	if (sig!=purchResult['param']){
		Debug.Log("Shop.bonusResult wrong param");
	}else{
//TODO:	
/*	
		var lc:LevelCollection=LevelCollection.Instance();
		var b2:int=purchResult["b2"];
		var b3:int=purchResult["b3"];
		PlayerPrefs.SetInt("BonLight",b2);
		PlayerPrefs.SetInt("BonHard",b3);
		lc.Property["BonLvl"]=purchResult["lvlb"];
		lc.BonusText();
		EventList.findEvent('Purch',purchResult["productId"],purchResult["purchId"],'sgames');
*/		
	}
}

function purchaseProduct(_sku:String)
{
#if UNITY_WEBPLAYER||UNITY_WEBGL
	switch (ol.host){
		case "vk":
			sVK.purchaseProduct(_sku);
			break;
		case "fb":
			_sku=node.server+"fbproduct?appid="+ol.fb_app_id+"&item="+_sku;
			if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Shop.purchaseProduct _sku="+_sku);
			sFB.Pay(_sku,sVK.OrderCallback );
			break;		
	}
#endif


#if UNITY_ANDROID && UPGS_OPENIAB
	cIAB.purchaseProduct(_sku);
#endif
}



function purchaseSubscription(_sku:String)
{
#if UNITY_WEBPLAYER||UNITY_WEBGL
	sVK.purchaseSubscription(_sku);
#endif

#if UNITY_ANDROID && UPGS_OPENIAB
	cIAB.purchaseSubscription(_sku);
#endif
}

function QueryInventory()
{
#if UNITY_ANDROID && UPGS_OPENIAB
	cIAB.QueryInventory();
#endif
}
/*
function openMenu()
{
//0.623 clonx 02.12.2016-->
#if UNITY_ANDROID
	cIAB.enabled=true;
#endif
//0.623 clonx 02.12.2016<--
	if (ButtonLoaded) return; //clonx 0.580 05.04.2015
	var menuType:String='';
	var node_sid:String=PlayerPrefs.GetString('sid'); //Идентификатор доступр
	var node_timestamp:String=PlayerPrefs.GetString('timestamp'); //Идентификатор доступр
	
	menuType=PlayerPrefs.GetString("ShopType");

	//TODO: Сделать загрузку из кэша
	var app_id:String;
	switch (menuType){
		case "vkitem":
			app_id=PlayerPrefs.GetString("vk_api_id");
			break;
		case "fb":
			app_id=PlayerPrefs.GetString("fb_app_id");
			break;
		default:			
			app_id=PlayerPrefs.GetString("vk_api_id");
			if (!app_id) app_id=PlayerPrefs.GetString("fb_app_id");
	}			
	node.commandSig("shopitemlist",["sid","timestamp",
			"type","place","vk_app"],
			[node_sid , node_timestamp,menuType,'menu',app_id]  //0.612 clonx 11.11.2016 PlayerPrefs.GetInt("vk_app")]
			,openMenuResult);

}
*/
/*
function openMenuResult(download:WWW,addErr:String)
{
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Shop.openMenuResult addErr="+addErr); //TODO Скрыть толко для точки останова при отладке
	
	if (addErr){
//0.629 clonx --> Не выводим сообщение достает при отсутствии инета
//		MsgText.text=lng.Trans('@Error! ')+lng.Trans(addErr)+' '+download.text;
//		MsgAnim.Play('Open');
//0.629 clonx <-- Не выводим сообщение достает при отсутствии инета
		return;
	}
	ButtonLoaded=true;
	var menuType:String=PlayerPrefs.GetString("ShopType");;

	try{
		var property=JSONUtils.ParseJSON(download.text);
//TODO:		ShopGrid.GridFill(property['items'],menuType,true); //0.615 clonx 16.11.2016 false);
	}catch(e){
		MsgText.text=lng.Trans('@Error Exception! ')+e;
		MsgAnim.Play('Open');
		return;
	}
}

*/
