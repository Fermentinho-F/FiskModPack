function continuePlaying(entity, sound) {
    var vel = entity.motion().length();
    var f = sound.fadeProgress();
    var volume = 0.2;
    var pitch = 0.9 + f * 0.3;

    if (vel >= 0.01) {
        volume += 0.4 * Math.min(Math.max(vel * vel / 4, 0), 1);
    }
    
    volume *= entity.getInterpolatedData("fiskheroes:jetpacking_timer");

    if (volume > 0.2) {
        pitch += (volume - 0.2) * 0.4;
    }
    
    sound.setVolume(volume);
    sound.setPitch(pitch);
    return sound.ticksPlaying() < 10 || entity.getData("fiskheroes:gliding");
}
