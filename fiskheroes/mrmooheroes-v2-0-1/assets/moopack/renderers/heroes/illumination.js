extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:illumination/illumination_layer1",
    "layer2": "moopack:illumination/illumination_layer2",
    "layer1_lights": "moopack:illumination/illumination_lights",
    "layer2_lights": "moopack:illumination/illumination_lights2",
    "cape": "moopack:illumination/illumination_cape"
});

var speedster = implement("fiskheroes:external/speedster_utils");

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights");
}

function initEffects(renderer) {

    speedster.init(renderer, "moopack:blur_yellow");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

   var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:mysterio_beam");
   utils.bindBeam(renderer, "fiskheroes:energy_projection", beam, "body", 0xDDAC17, [
       { "firstPerson": [0.2, 4, -4.0], "offset": [0.2, 2, -4.0], "size": [5, 1.5] },
   ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "vision.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "vision.HOVER", "fiskheroes:flight/idle/neutral");
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
