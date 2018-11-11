import UpGS.Data;
public static var instance:GameMenu;

static function Instance():GameMenu
{
			if (instance == null)
			{
				instance = FindObjectOfType (typeof (GameMenu));
			}
			return instance;
}


function mapMenu(gameControll:GameControllRunner)
{
	var but:Button;
	var ls:LayerShift;
	var text:UI.Text;
	if (!gameControll.GameMenu){
		Debug.LogError("MainMenu.mapMenu MainMenu.Menu not defined!");
	 	return;
	} 
		for (var vr:Valuer in gameControll.GameMenu.GetComponentsInChildren(Valuer)){
			but=vr.gameObject.GetComponent(Button);
			switch (vr.nameVal){
				case "Quit":
					if (!but) break;
					//but.onClick.RemoveAllListeners();
					if (vr.strVal!="done"){ 		
						vr.strVal="done";
						but.onClick.AddListener(function() {
							GoMainMenu(gameControll);
						});
					}
			} 
		}
}

function GoMainMenu(gameControll:GameControllRunner)
{
	gameControll.GameMenu.Play("closeState");
	MainMenu.MainAnim.Play("openState");
	gameControll.UnloadScene();
}




 
