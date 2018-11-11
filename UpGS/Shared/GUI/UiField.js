#pragma strict
import UnityEngine.UI;

public var Caption:Text;
public var intField:InputField;
public var textField:InputField;
public var slider:Slider;
public var dropdown:Dropdown;
public var toggle:Toggle;
public var source:String;
public var type:String;
public var resultType:String;

public var intField1:InputField;
public var slider1:Slider;

public var intField2:InputField;
public var slider2:Slider;
public var fieldName:String; //Название, используется для чтения и записи параметров


private var NoEdit:boolean; //Запрет редактирования полей

function setNoEdit(_no:boolean)
{
	NoEdit=_no;
}

function sliderChange(_nom:int)
{
	if (NoEdit) return;
	switch (_nom){
		case 0:
			 intField.text=''+slider.value;
			 break;
		case 1:
			 intField1.text=''+slider1.value;
			 break;
		case 2:
			 intField2.text=''+slider2.value;
			 break;
			 
	}
}

function inputFieldChange(_nom:int)
{
	if (NoEdit) return;
	switch (_nom){
		case 0:
			 inputFieldChange(intField,slider);
			 break;
		case 1:
			 inputFieldChange(intField1,slider1);
			 break;
		case 2:
			 inputFieldChange(intField2,slider2);
			 break;
	}
	sliderChange(_nom); // Не всегда вызывается
}

function inputFieldChange(_intField:InputField,_slider:Slider)
{
	if (NoEdit) return;
	try{
		if (type=='int'){
			_slider.value=parseInt(_intField.text);
		}else{
			_slider.value=parseFloat(_intField.text);
		}
	}catch(e){
		_slider.value=0;
	}
}


function initFieldVector3(_value:Vector3, onlyVal:boolean)
{
	if (!onlyVal&&!NoEdit){
		intField.gameObject.SetActive(true);
		slider.gameObject.SetActive(true);
		slider.wholeNumbers=false;
		textField.gameObject.SetActive(false);
		dropdown.gameObject.SetActive(false);
		toggle.gameObject.SetActive(false);

		intField1.gameObject.SetActive(true);
		slider1.gameObject.SetActive(true);
		intField2.gameObject.SetActive(true);
		slider2.gameObject.SetActive(true);
	}
	slider.value=_value.x;
	slider1.value=_value.y;
	slider2.value=_value.z;
}

function initField(_source:String,_value:String, _type:String, _array:Array, _max:int, useNegative:boolean)
{
	source=_source;
	Caption.text=lng.Trans('@'+source);
	type=_type;
	slider.maxValue=_max;
	slider1.maxValue=_max;
	slider2.maxValue=_max;
	
	if (useNegative){	
		slider.minValue=-slider.maxValue;
		slider1.minValue=-slider1.maxValue;
		slider2.minValue=-slider2.maxValue;	
	}				
				
	intField1.gameObject.SetActive(false);
	slider1.gameObject.SetActive(false);
	intField2.gameObject.SetActive(false);
	slider2.gameObject.SetActive(false);
	
	switch (_type){
		case 'int':
			intField.gameObject.SetActive(true);
			if (NoEdit) {
			  slider.gameObject.SetActive(false);
			  intField.text=""+_value; //0.616 clonx 17.11.2016
			}else{
			  slider.gameObject.SetActive(true);
			  slider.wholeNumbers=true;
			  try{
				slider.value=parseInt(_value);
			  }catch(e)
			  {
				slider.value=0;
			  }
			}
			intField.contentType=InputField.ContentType.IntegerNumber;
			textField.gameObject.SetActive(false);
			dropdown.gameObject.SetActive(false);
			toggle.gameObject.SetActive(false);
			break;
		case 'float':
			intField.gameObject.SetActive(true);
			if (NoEdit) {
			  slider.gameObject.SetActive(false);
			  intField.text=""+_value; //0.620 clonx 25.11.2016
			}else{
			  slider.gameObject.SetActive(true);
			  slider.wholeNumbers=false;
			  try{
				slider.value=parseFloat(_value);
			  }catch(e)
			  {
				slider.value=0;
			  }
			}
			intField.contentType=InputField.ContentType.DecimalNumber;
			textField.gameObject.SetActive(false);
			dropdown.gameObject.SetActive(false);
			toggle.gameObject.SetActive(false);
			break;
			
		case 'str':
			intField.gameObject.SetActive(false);
			slider.gameObject.SetActive(false);
			textField.gameObject.SetActive(true);
			dropdown.gameObject.SetActive(false);
			toggle.gameObject.SetActive(false);
			textField.text=_value;
			break;
		case 'arr':
		case 'arrint':
			intField.gameObject.SetActive(false);
			slider.gameObject.SetActive(false);
			textField.gameObject.SetActive(false);
			dropdown.gameObject.SetActive(true);
			toggle.gameObject.SetActive(false);
			dropdown.options.Clear();
			for (var str:String in _array){
				dropdown.options.Add(Dropdown.OptionData(str));
			}
			if (_type=='arrint'){ //Массив с хранением данных в виде индекса массива, а не значения
				dropdown.value=_value?parseInt(_value):0;
			}else{
				dropdown.captionText.text=_value;
				dropdown.value= dropdown.options.FindIndex(function(opt:Dropdown.OptionData){if(opt.text==_value)return true; else return false;});
			}
			break;
		case 'label':
			intField.gameObject.SetActive(false);
			slider.gameObject.SetActive(false);
			textField.gameObject.SetActive(false);
			dropdown.gameObject.SetActive(false);
			toggle.gameObject.SetActive(false);
			break;	
		case 'check':
		case 'bit':
			intField.gameObject.SetActive(false);
			slider.gameObject.SetActive(false);
			textField.gameObject.SetActive(false);
			dropdown.gameObject.SetActive(false);
			toggle.gameObject.SetActive(true);
			toggle.isOn=_value=='1';
			break;
		case 'vector3':
				intField.gameObject.SetActive(true);
				if (NoEdit) {
				  slider.gameObject.SetActive(false);
				  intField1.gameObject.SetActive(false);
				  slider1.gameObject.SetActive(false);
				  intField2.gameObject.SetActive(false);
				  slider2.gameObject.SetActive(false);
				}else{
				  slider.gameObject.SetActive(true);
				  slider.wholeNumbers=false;
				  intField1.contentType=InputField.ContentType.DecimalNumber;
				  intField2.contentType=InputField.ContentType.DecimalNumber;
				  intField1.gameObject.SetActive(true);
				  slider1.gameObject.SetActive(true);
				  slider1.wholeNumbers=false;
				  intField2.gameObject.SetActive(true);
				  slider2.gameObject.SetActive(true);
				  slider2.wholeNumbers=false;
				  try{
						Debug.LogError("UiField.initFieldVector3 vector3 temporary not supported"); 	
//TODO:						var hash:Hashtable=JSONUtils.ParseJSON(_value);
						var vec:Vector3=Vector3(0,0,0); //TODO:JSONUtils.HashtableToVector3(hash);
						slider.value=vec.x;
						slider1.value=vec.y;
						slider2.value=vec.z;
				  }catch(e)
				  {
						slider.value=0;
						slider1.value=0;
						slider2.value=0;
				  }
				  sliderChange(0);
				  sliderChange(1);
				  sliderChange(2);
				}
				intField.contentType=InputField.ContentType.DecimalNumber;
				textField.gameObject.SetActive(false);
				dropdown.gameObject.SetActive(false);
				toggle.gameObject.SetActive(false);
				break;
				
	}
	
}

function setValue(_val:String)
{
	if (textField.gameObject.activeInHierarchy) textField.text=_val;
	if (intField.gameObject.activeInHierarchy){
	 intField.text=_val;
	 inputFieldChange(0);
	}	 
	if (toggle.gameObject.activeInHierarchy) toggle.isOn=_val=='1';
	if (dropdown.gameObject.activeInHierarchy){
		if (type=='arrint'){
			try{
				dropdown.value=parseInt(_val);
			}catch(e){
			}
		}else{
			if (dropdown.options.Count>0){
				dropdown.captionText.text=_val;
				dropdown.value= dropdown.options.FindIndex(function(opt:Dropdown.OptionData){if(opt.text==_val)return true; else return false;});
			}
		}
	} 
}

function getValue():String
{
	if (slider.gameObject.activeInHierarchy) return ''+slider.value; 
	if (textField.gameObject.activeInHierarchy) return textField.text;
	if (dropdown.gameObject.activeInHierarchy){
		if (type=='arrint'){
			return ''+dropdown.value;
		}else{
			if (dropdown.options.Count>0){
				return dropdown.options.Item[dropdown.value].text;
			}
		}
	} 
	return '';
}

function getValueInt():int
{
	if (slider.gameObject.activeInHierarchy) return slider.value; 
	if (textField.gameObject.activeInHierarchy) return 0;
	if (dropdown.gameObject.activeInHierarchy) return dropdown.value;
	if (toggle.gameObject.activeInHierarchy) return toggle.isOn?1:0;
	return 0;
}

function getValueFloat():float
{
	if (slider.gameObject.activeInHierarchy) return slider.value; 
	if (textField.gameObject.activeInHierarchy) return 0;
	if (dropdown.gameObject.activeInHierarchy) return dropdown.value;
	return 0;
}

function getValueBit():boolean
{
	return toggle.isOn;
}

function getHash():Hashtable
{
//	if (type=='vector3'){
		var vec:Vector3=Vector3(slider.value,slider1.value,slider2.value);
		Debug.LogError("UiField.getHash vector3 temporary not supported"); 	
		var hash:Hashtable=null;//TODO: JSONUtils.Vector3ToHashtable(vec);
		return hash;
/*		
	}else{
		return null;
	}
*/	
}
