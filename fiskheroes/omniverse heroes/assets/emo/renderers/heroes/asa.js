extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "asa": "emo:asa1"
});

var utils = implement("fiskheroes:external/utils");

var asa;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE" && !entity.getData("fiskheroes:mask_open_timer2")) {
            return "layer1";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.fixHatLayer("CHESTPLATE");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    asa = renderer.createEffect("fiskheroes:model");
    asa.setModel(utils.createModel(renderer, "emo:asa3", "asa"));
    asa.anchor.set("rightArm");
    asa.mirror = false;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xAA00FF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "emo:asa");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:asa");

      // charged beam
      utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0xAA00FF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, -8.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
    utils.addFlightAnimation(renderer, "mmcw.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        asa.opacity = entity.getInterpolatedData("fiskheroes:shield");
        asa.render();
    }
}
