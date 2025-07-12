extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/miles/default/layer1",
    "layer2": "tmhp:marvel/spider_verse/miles/default/layer2"
});

function initEffects(renderer) {
    utils.bindTrail(renderer, "tmhp:miles").setCondition(entity => entity.getData("fiskheroes:energy_charging") > 0);
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xFF0000);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x0059FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "fiskheroes:swing_dive",
        "tmhp:swing_leap_of_fate",
        "tmhp:swing_and_relax"
    ]);
}
