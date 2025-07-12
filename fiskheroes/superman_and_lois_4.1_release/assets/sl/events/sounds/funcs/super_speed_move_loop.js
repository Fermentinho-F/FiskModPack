function continuePlaying(entity, sound) {
    var vel = entity.motion().length();
    var volume = 0.25;
    var pitch = 0.85;

    if (vel > 0) {
        volume += 0.75 * Math.min(Math.max(vel * vel / 6, 0), 1);
        pitch += 0.3 * Math.min(Math.max(vel * vel / 6, 0), 1);
    }

    pitch -= Math.random() * 0.25;

    var v = sound.volume();
    var p = sound.pitch();

    if (entity.isInWater()) {
        v += (volume - v) / 8;
        p += (pitch - p) / 8;
    }
    else {
        v += (volume - v) / 2;
        p += (pitch - p) / 2;
    }

    sound.setVolume(v);
    sound.setPitch(p);

    return entity.isSprinting() && entity.getData('fiskheroes:moving');
}
