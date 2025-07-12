function addLivery(renderer, weaponType, texture, textureLights ) {
    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.weaponType = weaponType;

    if (typeof textureLights !== "undefined") {
        livery.texture.set(texture, textureLights);
    }
    else {
        livery.texture.set(texture);
    }

    return livery;
}
