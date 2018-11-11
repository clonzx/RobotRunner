
static function Map(_menu:GameObject,_gc:UpGS.Data.GameControllTA)
{
	var t:UI.Text;
	for (var v:Valuer in _menu.GetComponentsInChildren(Valuer)){
		var but:Button=v.GetComponent(Button);
		switch (v.nameVal){
			case "moveButton": 	
				v.sender=_gc.setMoveRotate;
				break;
			case "selectBot": 	
				v.sender=_gc.setCreatureSelect;
				v.senderStr=_gc.setCreatureType;
				break;				
			case "EventTrigger":
				var et:EventTriggerTowerAtack=v.GetComponent(EventTriggerTowerAtack);
				et.gameControll=_gc;
				break;
			case 'version':
				t=v.gameObject.GetComponent(UI.Text);
				if (t){
					t.text='version '+PlayerPrefs.GetString('version');
				}
				break;
			case 'Quit':
				but.onClick.AddListener(function() {
//					if (_gc.lastLoadedLevelName != "") {
						SceneManager.LoadScene("MainMenu");
						MainMenu.MainAnim.Play("openState");
//					}
				});
				break;
//			case 'ShelfClose':
//				ShelfButtonCount++;
//				break;
			case 'Shelf':
				//TODO:
				addShelfButton(v,but,_gc);
				break;
			case 'ShelfMenu':
				_gc.ShelfMenu=v.gameObject.GetComponent(Animator);
				break;
			case 'ShelfContent':
				_gc.ShelfContent=v.gameObject;
			case 'CamLight':
				addCamLight(v,but);
				break;
			case 'ShopButton':
				//but.onClick.RemoveAllListeners(); 
				but.onClick.AddListener(function() {
						MainMenu.ShopItemAnim.Play("Open");
				});

				break;
				
				
		}
	}
}


static function addShelfButton(_v:Valuer,_but:Button,_gc:UpGS.Data.GameControllTA)
{
	_but.onClick.AddListener(function() {
		if (_gc.ShelfMenu){
			var cg:CanvasGroup=_gc.ShelfMenu.GetComponent(CanvasGroup);
			if (cg.alpha==0){
				_gc.ShelfMenu.Play("Open");
				//if (ExtendedEvent) EventList.findEvent('ShelfOpen','','',""); 
			}else{
				_gc.ShelfMenu.Play("Close");
			}
		}
	});
}


static function addCamLight(_v:Valuer,_but:Button)
//TODO:
{
/*
	var bHash:Hashtable;
	var bundle:AssetBundle;
	var prefHash:Hashtable=getSettings('Light',_v.strVal);
	var location:Vector3=new Vector3(0,0,0);
	var rot:Quaternion=Quaternion.identity;
	rot.eulerAngles=location;
	if (!prefHash) return;
	if (Camera.main.gameObject.GetComponentInChildren(Light)) return; //Только 1 раз добавить
	//Camera.main.gameObject.
	bHash=ta.BundleList[prefHash['bundle']];
	bundle=bHash['AssetBundle'];

//		if (PlayerPrefs.GetInt('debug')==1) Debug.Log("bundleCfg="+obj['Tip']+"-"+obj['Obj']);
//		if (PlayerPrefs.GetInt('debug')==1) Debug.Log("bundle="+prefHash['bundle']+" Asset="+prefHash['pref']);
		
		try{
			var pG:GameObject=bundle.LoadAsset(prefHash['pref']);
			var mGO:GameObject=Instantiate(pG, location,  rot);
			setLightSettins(mGO,prefHash);
			mGO.transform.SetParent(Camera.main.transform);
			mGO.transform.localPosition=location;
			mGO.transform.localEulerAngles=location;
		}catch(e){
			Debug.LogError("levelCollection.addCamLight Instantiate Exception "+e);
		}
		_but.onClick.AddListener(function() {
			if (CamLight) CamLight.enabled=!CamLight.enabled;
		});
		CamLight=Camera.main.gameObject.GetComponentInChildren(Light);
		if (CamLight) CamLight.enabled=false;
*/
}

