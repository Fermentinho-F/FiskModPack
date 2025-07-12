extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:unipool",
    "layer2": "emo:unipool",
    "scabbard": "fiskheroes:deadpool_xmen_scabbard",
    "katana": "fiskheroes:deadpool_xmen_katana",
    "gun": "fiskheroes:deadpool_xmen_gun"
});

var utils = implement("fiskheroes:external/utils");

var scabbard;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x40E7F9);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    scabbard = renderer.createEffect("fiskheroes:model");
    scabbard.setModel(utils.createModel(renderer, "fiskheroes:deadpool_scabbard", "scabbard"));
    scabbard.anchor.set("body");

    utils.addLivery(renderer, "KATANA", "katana");
    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [-3.05, 0.52, 3.0], "rotation": [-148.0, 90.0, 0.0] },
        { "anchor": "body", "scale": 0.535, "offset": [3.05, 0.52, 3.0], "rotation": [-148.0, -90.0, 0.0] }
    ]).slotIndex = 0;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:cold_beam", "rightArm", 0x40E7F9, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] },
        { "firstPerson": [4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5], "anchor": "leftArm" }
    ]);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "body", 0x40E7F9, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    // charged beam
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0x40E7F9, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] },
        { "firstPerson": [4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:bf");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    utils.addFlightAnimation(renderer, "shazam.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "shazam.HOVER", "fiskheroes:flight/idle/default");
}


function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        scabbard.render();
    }
}
