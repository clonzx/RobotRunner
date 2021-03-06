#pragma strict
import  UnityEngine.UI;


static public var instance:ShopList;
public var shopDetail:ShopDetail;
var source:String;
var lineFormat:String;
private var glg:GridLayoutGroup; //Если есть на rt то размеры формы подстраиваются под экран и количество элементов
var rt:RectTransform;
var buttonPrefab:GameObject;


var rightShift:int; //Уменьшение области кнопок слева
var leftShift:int;  //Уменьшение области кнопок справа
var minWidth:int;  //Минимальная ширина области кнопок области кнопок справа

var dropdownSource:Dropdown;
public enum PlaceEnum{shop, editor};
var Place:PlaceEnum; //String; //Откуда вызвано: shop, editor

private var node:Node;
public var MsgAnim:Animator;
public var MsgText:Text;
public var HideButton:GameObject[];
//public var AndroidButton:GameObject[];
//public var Re
private var ItemList:UpGS.Data.Apurch[];
//private var ol:OneLoad;
private var forAngar:int=0;
public var hideArray:Array; //Скрыть покупки не для полки
public var hideArrayEvent:Array; //Скрыть покупки по событиям (на уровне) При открытии полки скрываются при закрытии открываются при выходе с уровня Очищаются


static function Instance():ShopList
{
			if (instance == null)
			{
				instance = FindObjectOfType (typeof (ShopList));
			}
			return instance;
}

static function hideArrayEventClear()
{
	var sl:ShopList=GameObject.FindObjectOfType(ShopList);
	if (sl) sl.hideArrayEvent=null;

}


function Awake()
{
	ItemList=new Array();
//	ol= OneLoad.Instance();
	glg=rt.GetComponent(GridLayoutGroup);
	if (glg){
		//rt.localPosition.x=leftShift;
		rt.sizeDelta.x=Screen.width-rightShift-leftShift-glg.padding.left-glg.padding.right; 
		if (minWidth&&rt.sizeDelta.x<minWidth) rt.sizeDelta.x=minWidth;
		glg.cellSize.x=Screen.width-rightShift-leftShift-50; //50 для кнопки удаления строки
	}
//	gk=GUIcampaign.Instance();
	node=Node.Instance();
//TODO:	gridDetail.Place=Place;
	if (Place==PlaceEnum.shop){
		for(var g:GameObject in HideButton){
			g.active=false;
		}
	}
/*	
	if (Place!=PlaceEnum.shop||Application.platform!=RuntimePlatform.Android){
		for(var g:GameObject in AndroidButton){
			g.active=false;
		}
	}
*/	
}

/*TODO:
function SourceChange()
//Выбран другой источник данных
{

	listSource=dropdownSource.options.Item[dropdownSource.value].text;
	var List:Array=gk.camp[listSource];
	GridFill(List,listSource,true);
}
*/

function GridFill(List:UpGS.Data.Apurch[], _destroy:boolean)
//Выбран другой источник данных
{
	var count:int=0;
	//clonx 0.580 05.04.2016 -->
	if (_destroy) ShowHide();
	for (var but:Button in rt.GetComponentsInChildren(Button)){
		if (_destroy){
			but.gameObject.SetActive(false);
			GameObject.Destroy(but.gameObject);
		}else{
			count++;
		}
	}

	ItemList=List;

	//0.578.3 clonx 11.03.2016-->
#if UNITY_ANDROID && UPGS_OPENIAB
	var arrItem:Array=new Array();
	var iab:clonxOpenIAB=FindObjectOfType (typeof (clonxOpenIAB));
	var itemstr:String;
#endif	

	for (var i:int=0;i<ItemList.length;i++){
#if UNITY_ANDROID && UPGS_OPENIAB
		arrItem.Push(ItemList[i].itemId);
#endif
		addNew(ItemList[i],count);
		count++;
	}
#if UNITY_ANDROID && UPGS_OPENIAB
		if (iab) iab.allItems=arrItem;		
#endif
	
//Не нужно посчитвет HideNotUse	SetHeight(count);
// Скроем удаленные объекты активностью	if (_destroy) yield; //Чтобы исчезли удаленные объекты иначе они посчитаются в гриде
	HideNotUse();
}


function SetHeight(col:int)
//Установка высоты области скроллинга
{
	if (glg)
		rt.sizeDelta.y=(glg.cellSize.y+glg.spacing.y)*col+glg.padding.top+glg.padding.bottom;	
}

function addNew(val:UpGS.Data.Apurch, nom:int)
{

			var icon:Image;
			var download:WWW;
			var go:GameObject=GameObject.Instantiate(buttonPrefab);
			go.name="ButtonList"+nom; 
			go.transform.SetParent(rt.transform);
			go.transform.localScale=Vector3(1,1,1);
//			go.transform.localPosition=Vector3(0,0,0);
			var but:Button=go.GetComponent(Button);
			var text:Text=but.GetComponentInChildren(Text);
			go.SetActive(true);
			if (text){
				text.text="";			
				var price:String;
/*
				if (listSource=="vkitem"){
						var pricef:float=val.price;
						//price=""+(pricef*7)+" руб.";
						price=""+pricef+lng.Trans("@ голосов");
				}else{
*/
						price=lng.Trans(""+val.price);
//				}
				text.text=lng.Trans(""+val.description)+"\n"+price;
			}
			
				var imgTxt:String=val.photo;
//0.592 clonx 21.06.2016 -->
#if UNITY_WEBGL
				if (val.UseProxyForWebGL)
					imgTxt=node.commandProxy("url",["page","useRockld"],[imgTxt,"false"]);
#endif	
//0.592 clonx 21.06.2016 <--

#if UNITY_WEBPLAYER||UNITY_WEBGL
	//			VersionText.text='before new WWW(imgTxt)';	
				download = new WWW(imgTxt);
				yield download;
	//			VersionText.text='after new WWW(imgTxt)';
#else		
				var SaveName:String='www.'+md5.md5Sum(imgTxt);
				if (!System.IO.File.Exists(Application.persistentDataPath+'/'+SaveName)){
					download = new WWW(imgTxt);
					yield download;
					System.IO.File.WriteAllBytes(Application.persistentDataPath+'/'+SaveName,download.bytes);
				}
				download = new WWW(lng.file()+Application.persistentDataPath+'/'+SaveName);
				yield download;
				
#endif	
				try{	
	//				VersionText.text='before download.texture';	
					var imgTex:Texture2D=download.texture;
					var imgSprite=Sprite.Create(imgTex, Rect(0,0,imgTex.width,imgTex.height), Vector2(0.5,0.5));
					//0.618 clonx 21.11.2016-->
					GetButtonIcon(but).sprite=imgSprite;
					//0.618 clonx 21.11.2016<--
				}catch(e){
				}	

			
			AddListenerShop(but,nom);

			val.button=but;
			//if (val['hideShop']) but.gameObject.SetActive(false);
}

function GetButtonIcon(but:Button):Image
{
	var icon:Image;
	var iconT:Image;

					for (iconT in but.GetComponentsInChildren(Image)){
						if (!iconT.GetComponent(Button))
						{
						 	icon=iconT;
						}
					}
					if (icon){
						return icon;
					}else{
						return but.image;
					}
}


function AddListenerShop(b:Button, nom:int) 
//Редактирование строки
{
 	b.onClick.AddListener(function() {
 		if (nom<0||nom>=ItemList.Length)
 		{
 			Debug.LogError("ShopList.AddListenerShop Try to purh itemNom="+nom+" , ItemLength="+ItemList.Length);
 			return;
 		}
 		var val:UpGS.Data.Apurch=ItemList[nom];

		var texts:Array= new Array();
		texts.Push(lng.Trans(val.itemName));
		texts.Push(lng.Trans("@price")+" "+val.price);
		texts.Push(lng.Trans("@priceBonus")+" "+val.priceBonus);
		texts.Push(lng.Trans(val.description));


 		shopDetail.setValue(val.itemId,val.subscription, texts, GetButtonIcon(b).sprite);
 		shopDetail.GetComponent(Animator).Play("Open");
 	});
}

/*
function Open(_forAngar:int)
// _forAngar 1 Открыть список покупок для ангара
// 2 Для игрового меню
{
	//0.706 clonx 16.06.2017 В момент открытия webgl Screen.width=0-->
	if (glg){
		
//		rt.sizeDelta.x=Screen.width-rightShift-leftShift-glg.padding.left-glg.padding.right; 
//		if (minWidth&&rt.sizeDelta.x<minWidth) rt.sizeDelta.x=minWidth;

		glg.cellSize.x=Screen.width-rightShift-leftShift-50; //50 для кнопки удаления строки
	}
	//0.706 clonx 16.06.2017 В момент открытия webgl Screen.width=0<--
	var anim:Animator=gameObject.GetComponent(Animator);
	if (!anim) return;
	anim.Play('openState');
	if (_forAngar>0){
#if UNITY_ANDROID
//TODO:		var shop:Shop=Shop.Instance();
//TODO:		if (shop&&shop.cIAB) shop.cIAB.enabled=true;
#endif
		MainAnimDo(true,false);
	}
	forAngar=_forAngar;
	ShowHide();
	//if (forAngar==0) 
	HideNotUse();
}
*/
/*
static function ShowHideEventStatig(_show:boolean, _name:String)
{
	var sl:ShopList=GameObject.FindObjectOfType(ShopList);
	if (sl) sl.ShowHideEvent(_show, _name);
}

function ShowHideEvent(_show:boolean, _name:String)
{
	var bhide:GameObject;
	var indInt:int;
	var indStr:String;
	var Item:UpGS.Data.Apurch;
	if (_show){
		if (!hideArrayEvent) return;
		for (var i:int=0;i<hideArrayEvent.length;i++){
			var b:GameObject=hideArrayEvent[i];
			bhide=null;
			if (_name){
				if (b.name.Length>10){
					indStr=b.name.Substring(10,(b.name.Length-10));
					if (indStr){
						try{
							indInt= parseInt(indStr);
							if (indInt<ItemList.length){
								Item=ItemList[indInt];
								if (Item.itemId==_name){
									hideArrayEvent.Splice(i,1);
									i--;
								}
							}
						}catch(e){
						}
					}
				}
			}else{
				hideArrayEvent=null;
			}
		}
		
	}else{
		for (var but:Button in rt.GetComponentsInChildren(Button)){
			bhide=null;
			if (_name){
				indStr=but.name.Substring(10,(but.name.Length-10));
				if (indStr){
					try{
						indInt= parseInt(indStr);
						if (indInt<ItemList.length){
							Item=ItemList[indInt];
							if (Item.itemId==_name){
								bhide=but.gameObject;
							}
						}
					}catch(e){
					}
				}
			}else{
				bhide=but.gameObject;
			}
			if (bhide){
				 if (!hideArrayEvent) hideArrayEvent=new Array();
				 hideArrayEvent.Push(bhide.gameObject);
			}
		}
	}
}
*/


function HideNotUse()
{
	hideArray=new Array();
//	var lc:LevelCollection=LevelCollection.Instance();
//	if (!lc) return;
	var i:int;
	var Item:UpGS.Data.Apurch;
	var count:int=0;
	var itemId:String;
	var goName:String;
	var indStr:String;

	switch(forAngar){
		case 0:
			for (var but:Button in rt.GetComponentsInChildren(Button)){
				if (but.name.Length>10){
					indStr=but.name.Substring(10,(but.name.Length-10));
					i=parseInt(indStr);
					if (i<ItemList.length){
						Item=ItemList[i];
						if (Item.hideShop){
							 hideArray.Push(but.gameObject);
							 but.gameObject.SetActive(false);
						}else{
							count++;
						}
					}
				}
			}
			SetHeight(count);
			break;
		case 2:
//			var prefix:String=PopupDropDown.getPrefix("ShelfShop");
			for (var but:Button in rt.GetComponentsInChildren(Button)){
				indStr=but.name.Substring(10,(but.name.Length-10));
				i=parseInt(indStr);
				if (i<ItemList.length){
					Item=ItemList[i];
					itemId=Item.itemId;
					goName=but.gameObject.name;

//					if (!lc.getSettings("ShelfShop",itemId)){
//						 hideArray.Push(but.gameObject);
//						 but.gameObject.SetActive(false);
//					}else{
//						count++;
//					}

					i++;
				}
			}
			SetHeight(count);
			break;
	}


}


function ShowHide()
{	
	var go:GameObject;
	if (hideArray){
		for (var i:int;i<hideArray.length;i++){
			go=hideArray[i];
			if (go) go.SetActive(true);
		}
		hideArray=null;
	}
	if (hideArrayEvent){
		for (var j:int;j<hideArrayEvent.length;j++){
			go=hideArrayEvent[j];
			if (go) go.SetActive(false);
		}
	}
	
}

/*
function Close()
{
	var anim:Animator=gameObject.GetComponent(Animator);
	if (!anim) return;
	anim.Play('closeState');
	if(forAngar>0){
		 MainAnimDo(false,false);
		 if (forAngar==1){
//TODO:
//			 var lc:LevelCollection=LevelCollection.Instance();
//			 if (lc){
//				 anim=lc.AngarMenu.gameObject.GetComponent(Animator);
//				 anim.Play('openState');
//			 }

		 }
		 forAngar=0;
	}
	if (hideArrayEvent){
		for (var j:int;j<hideArrayEvent.length;j++){
			var go:GameObject=hideArrayEvent[j];
			if (go) go.SetActive(true);
		}
	}
}

*/
/*

function MainAnimDo(open:boolean,_timescale:boolean)
{
	if (_timescale && Time.timeScale!=0) return;

//	if (!ol.MainMenu|| !ol.LogoAnim) return;
//	var MainAnim:Animator=ol.MainMenu.GetComponent(Animator);
//	if (!MainAnim) return;

	if (_timescale){
		if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Grid.MainAnimDo 1 Time.timeScale=1");
		Time.timeScale=1;
	}		 

//	if (open){
//		MainAnim.Play('openState');
//		ol.LogoAnim.Play('closeState');
//		ol.GameAnim.Play('closeState');
//	}else{
//		MainAnim.Play('closeState');
//		ol.LogoAnim.Play('openState');
//		ol.GameAnim.Play('openState');
//	}

	if (_timescale) {
		yield WaitForSeconds(1);
		Time.timeScale=0;
		if (PlayerPrefs.GetInt("debug")==1) Debug.Log("Grid.MainAnimDo 2 Time.timeScale=0");
	}
}
*/
/*
function MainAnimClick(open:boolean)
{
	MainAnimDo(open,true);
}
*/

/*
function AddNew() 
//Добавление строки
{
//TODO:	gridDetail.setValue(listSource,FieldList,null,-1);
	shopDetail.GetComponent(Animator).Play("Open");
}

function wwwResult(download:WWW,addErr:String)
//Пустая заглушка если результат не нужен
{
	if (addErr){
		MsgText.text=lng.Trans('@Error! ')+addErr+' '+download.text;
	}else{
		MsgText.text=lng.Trans('@WWW ok! ')+download.text;
	}
	MsgAnim.Play('Open');
}

*/

function QueryInventory()
{

	var shop:Shop=Shop.Instance();
	if (!shop) return;
	shop.QueryInventory();
}