#pragma strict


var audioSource : AudioSource;

private var physicMaterial : PhysicMaterial;

function OnCollisionEnter (collisionInfo : Collision) {
	physicMaterial = collisionInfo.collider.sharedMaterial;
}

function OnFootstep () {
	if (!audioSource.enabled)
	{
		return;
	}
	var sound : AudioClip=MaterialAudio.GetSound (physicMaterial, SoundType.Creature, 0);
	audioSource.pitch = Random.Range (0.98, 1.02);
	audioSource.PlayOneShot (sound, Random.Range (0.8, 1.2));
}

function OnFootstep (_step:int ) {
	if (!audioSource.enabled)
	{
		return;
	}
	var sound : AudioClip=MaterialAudio.GetSound (physicMaterial, SoundType.Creature, _step);
	audioSource.pitch = Random.Range (0.98, 1.02);
	audioSource.PlayOneShot (sound, Random.Range (0.8, 1.2));
}
