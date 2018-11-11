// C# Example
// Builds an asset bundle from the selected objects in the project view.
// Once compiled go to "Menu" -> "Assets" and select one of the choices
// to build the Asset Bundle

using UnityEngine;
using UnityEditor;
using System;
using System.Collections;

namespace UpGS.Editor{
public class ExportAssetBundles {

	static void BuildRunnerAssetBundles (BuildTarget _buildTarget){
		AssetBundleBuild[] buildMap = new AssetBundleBuild[1];
        	buildMap[0].assetBundleName = "runner";
        	string[] assetsList = new string[3];
        	assetsList[0] = "Assets/Content/Terrain/Corridor.prefab";
			assetsList[1] = "Assets/Content/Thing/RunnerNextTrigger.prefab";
			assetsList[2] = "Assets/Content/Thing/RunnerLoopTrigger.prefab";
        	buildMap[0].assetNames = assetsList;

		BuildPipeline.BuildAssetBundles ("Assets/AssetBundles/Android",buildMap,BuildAssetBundleOptions.None,_buildTarget);
	}

	static void BuildGuiRunnerAssetBundles (BuildTarget _buildTarget){
		AssetBundleBuild[] buildMap = new AssetBundleBuild[1];
        	buildMap[0].assetBundleName = "guirunner";
        	string[] assetsList = new string[1];
        	assetsList[0] = "Assets/Content/Menu/MainMenuRunner.prefab";
        	buildMap[0].assetNames = assetsList;

		BuildPipeline.BuildAssetBundles ("Assets/AssetBundles/Android",buildMap,BuildAssetBundleOptions.None,_buildTarget);
	}

	
	[MenuItem("UpGS/Build runner AssetBundle Android")]
	static void BuildRunnerAssetBundlesAndroid (){
		ExportAssetBundles.BuildRunnerAssetBundles(BuildTarget.Android);
	}
		
	[MenuItem("UpGS/Build guiRunner AssetBundle Android")]
	static void BuildGuiRunnerAssetBundlesAndroid (){
		ExportAssetBundles.BuildGuiRunnerAssetBundles(BuildTarget.Android);
	}

}	
}