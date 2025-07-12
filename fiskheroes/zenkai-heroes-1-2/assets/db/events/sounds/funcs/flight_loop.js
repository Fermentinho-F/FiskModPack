function continuePlaying(entity, sound) {
    var vel = entity.motion().length();
    var f = sound.fadeProgress();
    var volume = 0.025;

    if (vel >= 0.01) {
        var t = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        volume += 0.975 * Math.min(Math.max(vel * vel / 8, 0), 1);
    }

    sound.setVolume(volume);
    return sound.ticksPlaying() < 10 || entity.getData("fiskheroes:flying");
}
