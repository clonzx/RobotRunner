using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace UpGS.Data
{
	[System.Serializable]
	public class LevelCfg 
	{
		public string achievement;
		public string sprite;
		public string name;
		public string file;
		public string type;
		public string access;
		public string spriteClose;
	}
	[System.Serializable]
	public class AppData 
	{
		public int LanguageCountLimit;
		public LevelCfg[] run;
	}

    [System.Serializable]
    public class Apurch //Покупки для Android
    {
        public string itemId;
        public int order;
        public string itemName;
        public string photo;
        public bool UseProxyForWebGL;
		public float price;
        public float priceBonus;
        public string description;
        public bool subscription;
        public bool hideShop;
		[System.NonSerialized] public UnityEngine.UI.Button button;
    }

    [System.Serializable]
	public class VKpurch: Apurch //Покупки для VK
    {
        public string descriptionfixed;
    }

    [System.Serializable]
	public class FBpurch: VKpurch //Покупки для FB
    {
        public string addInfo;
    }

    [System.Serializable]
    public class AppDevelop //Конфигурация для разработчиков
    {
        public string hashtags;
        public string fb_app;
        public string guiBundle;
        public string guiAsset;
        public string name;
        public string settings;
        public string icon;
        public bool UseProxyForWebGL;
        public bool UseProxyForAndroid;
        public string vk_sekret;
        public string fb_sekret;
        

        public LevelCfg[] run;
        
        public VKpurch[] vkitem;
        public FBpurch[] fb;
        public Apurch[] yandex;

    }
    
    [System.Serializable]
	public class AppDescription 
	{
		public string _id;
		public string uname;
		public string name;
		public AppData data;
		public double modified;
    }
    

    [System.Serializable]
	public class AppResponse  
	{
		public int ecode;
		public AppDescription[] cmp;
	}

    [System.Serializable]
    public class ItemsVkResponse
    {
        public VKpurch[] items;
    }

    [System.Serializable]
    public class ItemsFbResponse
    {
        public FBpurch[] items;

    }
    [System.Serializable]
    public class ItemsAndroidResponse
    {
        public Apurch[] items;

    }
    [CreateAssetMenu(fileName = "UpGS app",menuName="UpGS/app data",order=0)]
public class AppContainer:BaseScriptable //TODO: вызвать AssetBundle2Dict после изменения массива AssetBundle
{
	public AppDescription[] apps;
    public AppDevelop   appDev;


        public void ParsePurch(string _cfg, string _shopType)
        {
            switch (_shopType)
            {
                case "yandex":
                    ItemsAndroidResponse ar = (ItemsAndroidResponse)JsonUtility.FromJson(_cfg, typeof(ItemsAndroidResponse));
                    appDev.yandex = ar.items;
                    break;
                case "fb":
                    ItemsFbResponse fb = (ItemsFbResponse)JsonUtility.FromJson(_cfg, typeof(ItemsFbResponse));
                    appDev.fb = fb.items;
                    break;
                case "vkitem":
                    ItemsVkResponse vk = (ItemsVkResponse)JsonUtility.FromJson(_cfg, typeof(ItemsVkResponse));
                    appDev.vkitem = vk.items;
                    break;
            }        
        }

        public void Parse(string _cfg)
		{
			AppResponse resp=(AppResponse)JsonUtility.FromJson(_cfg,typeof(AppResponse));
            apps = resp.cmp;
		//	apps=new AppDescription[] { (AppDescription)JsonUtility.FromJson(_cfg, typeof(AppDescription))};

        }
		
		public void SaveJSON()
		{
			AppResponse resp=new AppResponse();
			resp.cmp=apps;
			jsonText = JsonUtility.ToJson(resp);
			base.SaveJSON();
			jsonText="";
		}
		
		public void LoadJSON()
		{
			base.LoadJSON();
			if (jsonText!=""){
				Parse(jsonText);
			}
			jsonText="";
		}

		public Apurch[] GetPurchList(string _shopType)
		{
			switch (_shopType){
				case "yandex":
					return appDev.yandex;
				case "vkitem":
					return (Apurch[])(appDev.vkitem);
				case "fb":
					return (Apurch[])(appDev.fb);
				default:
					return appDev.yandex;
			}

		}

}
}