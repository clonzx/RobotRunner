#pragma strict

var ldr:Loader;

public function OnGetProfilesVK(response:String)
{
//	VersionText.text=VersionText.text+response;
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("VkCallbacks.OnGetProfilesVK response="+response);
    var str:String=System.Text.RegularExpressions.Regex.Replace(response, '"', "");
    var userList:String[]=System.Text.RegularExpressions.Regex.Split(str, "/>");
 	var sa:String[]=System.Text.RegularExpressions.Regex.Split(userList[0], "\\s\\w+=");
 	var strcount:int=0;
 	
    var vk_id:String="";
    var vk_name:String="";
    var vk_fam:String="";
    var vk_foto:String="";
 	
 	for(var s in sa){
	 	if (strcount==1) vk_id=s;
	 	if (strcount==2) vk_name=s;
	 	if (strcount==3) vk_fam=s;
	 	if (strcount==4) vk_foto=s;
	 	strcount++;
 	}
	
	if (PlayerPrefs.GetInt("debug")==1) Debug.Log("VkCallbacks.OnGetProfilesVK 4");
 	ldr.social_user_set(vk_id,vk_name,vk_fam,vk_foto,true);
}

