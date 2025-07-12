extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:sn/amara/amara",
    "layer2": "dmh:null",
    "eyes": "dmh:sn/eyes/black_eyes",
    "eyes1": "dmh:sn/amara/amara+eyes",
    "blank": "dmh:null"
});

var utils = implement("fiskheroes:external/utils");

var overlay;
var chest;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");

    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "eyes1";
        }
        return "layer1";
    });

}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getData("fiskheroes:mask_open"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "dmh:amara_beam", "body", 0xb31aff, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "dmh:invis", "body", 0xFFFFFF, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0]
            }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "dmh:impact_amara_erase"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "dmh:invis", "body", 0xFFFFFF, [{
        "firstPerson": [0, 0, 0],
        "offset": [0, 0, 0],
        "size": [0, 0]
    }]);

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "dmh:black");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "amara.beam", "dmh:erase_existence").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(0, entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 2, 1) : 0);
        data.load(1, Math.max(charge - 0.5, 0) * 2);
    });

    utils.addFlightAnimation(renderer, "amara.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "amara.HOVER", "fiskheroes:flight/idle/neutral");

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}
