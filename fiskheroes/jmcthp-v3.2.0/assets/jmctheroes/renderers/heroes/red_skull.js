extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:skull/red_skull_layer1",
    "layer2": "jmctheroes:skull/red_skull_layer2",
    "pistol": "jmctheroes:skull/red_skull_gun",
    "gun": "fiskheroes:deadpool_xmen_gun"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    pistol = renderer.createEffect("fiskheroes:model");
    pistol.setModel(utils.createModel(renderer, "jmctheroes:HydraPistol", "pistol", null));
    pistol.anchor.set("rightArm");
    pistol.setScale(0.80);
    pistol.setRotation(90.0, 90.0, 0.0);
    pistol.setOffset(1.0, 10.2, -15.9);

    utils.bindCloud(renderer, "fiskheroes:teleportation", "fiskheroes:breach");
    
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "jmctheroes:lantern_blast", "rightArm", 0x00E9FF, [{
        "firstPerson": [-4.0, 2.1, -10.0],"offset": [-0.6, 14.5, -2.55],"size": [0.25, 0.25]
    }]).setCondition(entity => entity.getData("jmctheroes:dyn/stone"));

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "jmctheroes:gunshot", "rightArm", 0xCBC96B, [{
        "firstPerson": [-4.0, 2.1, -10.0],"offset": [-0.6, 14.5, -2.55],"size": [0.25, 0.25]
    }]).setCondition(entity => !entity.getData("jmctheroes:dyn/stone"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "basic.EQUIP", "jmctheroes:hamhammer").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData('jmctheroes:dyn/equip_timer')));
    });
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer")));
    });
}

function render(entity, renderLayer, isFirstPersonArm){
    if (renderLayer == "CHESTPLATE" && entity.getData("jmctheroes:dyn/equip_timer") > 0.5) {
        pistol.render();
    }
}