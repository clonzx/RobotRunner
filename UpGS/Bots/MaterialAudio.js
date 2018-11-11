#pragma strict

class MaterialSound {
	var physicMaterial : PhysicMaterial;
	var FootstepSounds : AudioClip[];
	var bulletSounds : AudioClip[];
}

enum SoundType {
	Creature,
	Bullet
}

class MaterialAudio extends MonoBehaviour {
	var materialSounds : MaterialSound[];
	private static var dict : System.Collections.Generic.Dictionary.<PhysicMaterial, MaterialSound>;
	private static var defaultSound : MaterialSound;
	
	function Awake () {
		defaultSound = materialSounds[0];
		
		dict = new System.Collections.Generic.Dictionary.<PhysicMaterial, MaterialSound> ();
		for (var i : int = 0; i < materialSounds.Length; i++) {
			dict.Add (materialSounds[i].physicMaterial, materialSounds[i]);
		}
	}
		
	static function GetMaterialSound (_mat : PhysicMaterial) : MaterialSound {
		if (_mat && dict.ContainsKey (_mat))
			return dict[_mat];
		return defaultSound;
	}

	static function GetSound (_mat : PhysicMaterial, _soundType:SoundType, _num:int ) : AudioClip {
		var ms : MaterialSound = GetMaterialSound (_mat);
		if (!ms) return null;
		switch (_soundType){
			case SoundType.Bullet:
				if (_num<ms.bulletSounds.Length){
					return ms.bulletSounds[_num];
				}else{
					if (ms.bulletSounds.Length>0){
						return ms.bulletSounds[0];
					}else{
						return null;
					}
				}
				break;
			case SoundType.Creature:
				
				if (_num<ms.FootstepSounds.Length){
					return ms.FootstepSounds[_num];
				}else{
					if (ms.FootstepSounds.Length>0){
						return ms.FootstepSounds[0];
					}else{
						return null;
					}
				}
		}
		return null;
	}		
}