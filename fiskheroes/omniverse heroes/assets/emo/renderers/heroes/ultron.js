extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:ultron",
    "layer2": "emo:ultron",
    "cape": "emo:vision_cape",
    "stone": "fiskheroes:vision_stone"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var overlay;

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.opacity = 0.85;

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "stone");

    utils.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:intangibility_timer");

    // charged beam
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0xAA00FF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
    utils.addFlightAnimation(renderer, "vision.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "vision.HOVER", "fiskheroes:flight/idle/neutral");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:bf");
}

function getBeamColor() {
    return 0xFFFF6D;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
            overlay.render();
        }
        else if (renderLayer == "CHESTPLATE") {
            cape.render(entity);
        }
    }
}
