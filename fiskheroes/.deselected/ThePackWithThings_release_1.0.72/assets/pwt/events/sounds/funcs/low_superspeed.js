function continuePlaying(entity, sound) {
    var vel = entity.motion().length();
    var f = sound.fadeProgress();
    var volume = 0.6;
    var pitch = 0.1 + f * 0.4 ;
	
	if (!entity.getData("fiskheroes:moving")) {
        return false;
    }
	else {

		if (vel >= 0.01) {
			///var t = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
			volume += 0.7 * Math.min(Math.max(vel * vel / 6, 0), 1);
			pitch += 0.4 * Math.min(vel, 1);
		}
		
		sound.setVolume(volume);
		sound.setPitch(pitch);
		return entity.getData("fiskheroes:speeding");
	}
}
