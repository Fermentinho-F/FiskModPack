extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:zod/zod_dceu_layer1",
    "layer2": "jmctheroes:zod/zod_dceu_layer2",
    "cape": "jmctheroes:zod/zod_dceu_cape",
    "eyes": "jmctheroes:superman/heat_eyes"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");
    overlay.opacity = 1.0;

    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 0.7;
    physics.flareDegree = 1.0;
    physics.flareFactor = 1.0;
    physics.flareElasticity = 2;

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("cape");
    
	utils.addCameraShake(renderer, 0.25, 0.25, "jmctheroes:dyn/sneaking_timer");
	utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
    utils.bindParticles(renderer, "jmctheroes:sonic_boom").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && (entity.world().getDimension() == -1 || entity.world().getDimension() == 0 || entity.world().getDimension() == 1) && entity.getData("jmctheroes:dyn/flight_super_boost_timer") < 1);
    utils.bindParticles(renderer, "fiskheroes:black_manta_dceu_eyes").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") < 1);
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0xFF0000, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.1, -3.3, -3.5], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.1, -3.3, -3.5], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision")).setCondition(entity => entity.getData("jmctheroes:dyn/moon_timer") < 0.4);
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "jmctheroes:heat_vision", "head", 0xFF0000, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision")).setCondition(entity => entity.getData("jmctheroes:dyn/moon_timer") > 0.4);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:super_heat_vision", "head", 0xFF0000, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [0.75, 0.75] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [0.75, 0.75] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    newutils.addNewFlightAnimation(renderer, "zod.FLIGHT", "jmctheroes:flight/supergirl/supergirl.anim.json");
    utils.addHoverAnimation(renderer, "zod.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "zod.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "zod.POSE", "fiskheroes:superhero_landing", "jmctheroes:dyn/sneaking_timer")
        .priority = 1;
    addAnimation(renderer, ".SOLAR", "jmctheroes:pose/solar_charge").setData((entity, data) => {
         data.load(entity.getInterpolatedData('jmctheroes:dyn/pose_timer'));
    }).priority = -9;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        overlay.render();
    }
    if (renderLayer == "CHESTPLATE") {
        if (!isFirstPersonArm) {
            var f = entity.getInterpolatedData("fiskheroes:flight_timer");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
        }
    }
}