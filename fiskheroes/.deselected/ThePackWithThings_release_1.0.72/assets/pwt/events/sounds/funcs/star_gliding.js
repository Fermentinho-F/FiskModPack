function continuePlaying(entity, sound) {
    if (!entity.getData("fiskheroes:flying")) {
        return false;
    }
    
    var vel = entity.motion().length();
    var ticks = sound.ticksPlaying();
    var volume = 0;
    
	
    if (ticks < 40) {
        volume *= ticks / 40;
    }
    
    ///if (volume > 0.2) {
        ///sound.setPitch(0.4 * vel);
    ///}
    else {
        sound.setPitch(0.7 * (0.8*vel));
    }
    
    sound.setVolume( Math.min(Math.max(vel * vel / 4, 0), 1) * 2.6);
    return true;
}
