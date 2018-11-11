#pragma strict
//////////////////////////////////////////////////////////////////////////////
//Детали покупки
//////////////////////////////////////////////////////////////////////////////
import UnityEngine.UI;

	public var shop:Shop;

	private var itemId:String;
	private var subscription:boolean;

	public var BonusBotton:Button;
	public var BonusInfo:Text;
	public var Icon:Image;
	public var TextArray:Text[];


	function Awake()
	{
		shop=Shop.Instance();
	}

	
	function setValue(_itemId:String,_subscription:boolean, _texts:Array, _icon:Sprite)
	{
		var i:int;
		itemId=_itemId;
		for ( i=0;i<_texts.length;i++){
			if (i<TextArray.length){
				TextArray[i].text=_texts[i];
			}
		}
		if (TextArray.length>_texts.length){
			for ( i=_texts.length;i<TextArray.length;i++){
				TextArray[i].text="";
			}
		}
		Icon.sprite=_icon;
		subscription=_subscription;
	}
	


function Bay()
//Купить вещь
{
	if (!shop) shop=Shop.Instance();
	//0.586 clonx 06.05.2016 -->
	if (itemId){
		if (subscription){
			shop.purchaseSubscription(itemId);
		}else{
	 		shop.purchaseProduct(itemId);
	 	}
	}else{
		Debug.LogError("ShopDetail.Bay itemId not defined" );
	}
//	if (FieldList){
//				for (var field:Hashtable in FieldList){
//					if (field['name']=='itemId'){
//						var uf:UiField=field['UiField'];
//						shop.purchaseProduct(uf.getValue());
//					}
//				}
//	}
	//0.586 clonx 06.05.2016 <--
}

function BayBonus()
//Купить вещь за бонусы
{
	if (!shop) shop=Shop.Instance();
	//0.586 clonx 06.05.2016 -->
	if (itemId){
			shop.purchaseProductBonus(itemId);
	}else{
		Debug.LogError("ShopDetail.BayBonus itemId not defined" );
	}
}



