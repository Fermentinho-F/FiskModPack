extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:sn/god/gw_l1",
    "layer2": "dmh:sn/god/gw_l2",
    "eyes": "dmh:sn/eyes/blue_eyes",
    "blank": "dmh:null"
});

var utils = implement("fiskheroes:external/utils");

var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("HELMET", "gw_0");
    renderer.setItemIcon("CHESTPLATE", "gw_1");
    renderer.setItemIcon("LEGGINGS", "gw_2");
    renderer.setItemIcon("BOOTS", "gw_3");

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "eyes";
        }
        return "blank";
    });

}

function initEffects(renderer) {
    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getData("fiskheroes:mask_open"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "dmh:invis", "body", 0xFFFFFF, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0]
            }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "dmh:impact_erase"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "dmh:invis", "body", 0xFFFFFF, [{
        "firstPerson": [0, 0, 0],
        "offset": [0, 0, 0],
        "size": [0, 0]
    }]);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "god.beam", "dmh:erase_existence").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(0, entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 2, 1) : 0);
        data.load(1, Math.max(charge - 0.5, 0) * 2);
    });

    utils.addFlightAnimation(renderer, "god.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "god.HOVER", "fiskheroes:flight/idle/neutral");

}

function render(entity, renderlayer) {
}
