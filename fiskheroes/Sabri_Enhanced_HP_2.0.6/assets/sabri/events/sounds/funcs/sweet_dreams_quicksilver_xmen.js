function continuePlaying(entity, sound) {
    return entity.getData("fiskheroes:mask_open") == 1 && entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:moving");
}
