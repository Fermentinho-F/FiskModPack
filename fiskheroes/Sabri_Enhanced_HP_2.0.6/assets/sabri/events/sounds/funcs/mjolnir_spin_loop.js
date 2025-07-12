function continuePlaying(entity, sound) {
    sound.setVolume(Math.max(entity.getData("sabri:dyn/aiming_timer") - Math.min(entity.getData("fiskheroes:flight_boost_timer") * 4, 1), 0));

    return entity.getData("sabri:dyn/aiming");
}
