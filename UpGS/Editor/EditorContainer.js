import UnityEditor;

@CustomEditor (typeof(UpGS.Data.AppContainer))
public class AppEditor extends Editor
{
		var container:UpGS.Data.AppContainer;
		public function  OnInspectorGUI () {
			super();
			container = target;

			if (GUILayout.Button(new GUIContent("ImportOld", "Import from file in old format"))) {
				container.ImportOldJSON(
					function(_jsonText:String,_callback: UpGS.Data.HashResponse){
						var Hash:Hashtable=JSONUtils.ParseJSON(_jsonText);
						_callback(Hash);
					},
					function(_hash:Hashtable,_callback: UpGS.Data.DehashResponse){
						var str:String=JSONUtils.HashtableToJSON(_hash);
						_callback(str);
					}
				);
			}
			if (GUILayout.Button(new GUIContent("Save", "Save JSON file"))) {
				container.SaveJSON();
			}
			if (GUILayout.Button(new GUIContent("Load", "Load JSON file"))) {
				container.LoadJSON();
			}
		}
}


@CustomEditor (typeof(UpGS.Data.SettingsContainer))
public class SettingsEditor extends Editor
{
		var container:UpGS.Data.SettingsContainer;
		public function  OnInspectorGUI () {
			super();
			container = target;

			if (GUILayout.Button(new GUIContent("ImportOld", "Import from file in old format"))) {
				container.ImportOldJSON(
					function(_jsonText:String,_callback: UpGS.Data.HashResponse){
						var Hash:Hashtable=JSONUtils.ParseJSON(_jsonText);
						_callback(Hash);
					},
					function(_hash:Hashtable,_callback: UpGS.Data.DehashResponse){
						var str:String=JSONUtils.HashtableToJSON(_hash);
						_callback(str);
					}
				);
			}
			if (GUILayout.Button(new GUIContent("Save", "Save JSON file"))) {
				container.SaveJSON();
			}
			if (GUILayout.Button(new GUIContent("Load", "Load JSON file"))) {
				container.LoadJSON();
			}
		}
}

@CustomEditor (typeof(UpGS.Data.LevelContainer))
public class LevelEditor extends Editor
{
		var container:UpGS.Data.LevelContainer;
		public function  OnInspectorGUI () {
			super();
			container = target;

			if (GUILayout.Button(new GUIContent("ImportOld", "Import from file in old format"))) {
				container.ImportOldJSON(
					function(_jsonText:String,_callback: UpGS.Data.HashResponse){
						var Hash:Hashtable=JSONUtils.ParseJSON(_jsonText);
						_callback(Hash);
					},
					function(_hash:Hashtable,_callback: UpGS.Data.DehashResponse){
						var str:String=JSONUtils.HashtableToJSON(_hash);
						_callback(str);
					}
				);
			}
			if (GUILayout.Button(new GUIContent("Save", "Save JSON file"))) {
				container.SaveJSON();
			}
			if (GUILayout.Button(new GUIContent("Load", "Load JSON file"))) {
				container.LoadJSON();
			}
		}
}


@CustomEditor (typeof(UpGS.Data.DeveloperContainer))
public class DeveloperEditor extends Editor
{
		var container:UpGS.Data.DeveloperContainer;
		public function  OnInspectorGUI () {
			super();
			container = target;

			if (GUILayout.Button(new GUIContent("Save", "Save JSON file"))) {
				container.SaveJSON();
			}
			if (GUILayout.Button(new GUIContent("Load", "Load JSON file"))) {
				container.LoadJSON();
			}
		}
}