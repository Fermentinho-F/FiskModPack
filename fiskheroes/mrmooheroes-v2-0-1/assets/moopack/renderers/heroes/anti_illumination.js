extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:anti_illumination/anti_illumination_layer1",
    "layer2": "moopack:anti_illumination/anti_illumination_layer2",
    "layer1_lights": "moopack:anti_illumination/anti_illumination_lights",
    "layer2_lights": "moopack:anti_illumination/anti_illumination_lights2",
    "cape": "moopack:anti_illumination/anti_illumination_cape"
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

    speedster.init(renderer, "moopack:lightning_yellow");

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    utils.bindTrail(renderer, "moopack:anti_illumination_trail").setCondition(entity => entity.getData("fiskheroes:flying"));

    renderer.bindProperty("fiskheroes:gravity_manipulation").color.set(0x000000);

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "moopack:telekinesis_anti_illumination");
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
