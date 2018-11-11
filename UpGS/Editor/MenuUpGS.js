@MenuItem("UpGS/settings")	
static function UpGSsettings()
{
/*
		var winds = Resources.FindObjectsOfTypeAll.<EditorWindow> ();

		var inspector=winds.Where (t => t.title == "UnityEditor.InspectorWindow").ToList();
		if (inspector.Count == 0) {
			EditorUtility.DisplayDialog("Hint","In order to edit vk setting open Inspector window","ok");
		}
*/
		var path:String="Assets/Content/Data/";
		var go:UpGS.Data.SettingsContainer = AssetDatabase.LoadAssetAtPath(path+"UpGS settings.asset", UpGS.Data.SettingsContainer);
		if (go){
			EditorUtility.FocusProjectWindow ();	
			Selection.activeObject = go;
		}
/*		
		if (Resources.Load("UpGS settings") == null) {
			//CreateVkSettingsItem ();
		} else {
			var asset:UpGS.Data.SettingsContainer= Resources.Load("UpGS settings");
			EditorUtility.FocusProjectWindow ();
			Selection.activeObject = asset;
		}
*/		

}