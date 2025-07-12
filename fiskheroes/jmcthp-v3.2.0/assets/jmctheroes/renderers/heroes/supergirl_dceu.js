extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:supergirl/supergirl_dceu_layer1",
    "layer2": "jmctheroes:supergirl/supergirl_dceu_layer2",
    "cape": "jmctheroes:supergirl/supergirl_dceu_cape",
    "eyes": "jmctheroes:superman/heat_eyes"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var chest;
var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1.2).setYOffset(1);

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
    utils.bindParticles(renderer, "jmctheroes:cold_breath1").setCondition((entity) => entity.getData("fiskheroes:energy_projection"));
    
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
    
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "head", 0x4CB5FF, [
        { "firstPerson": [0.0, 1.5, 0.0], "offset": [0.0, -1.0, -4.0], "size": [0.75, 0.75] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "jmctheroes:cold_breath"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    newutils.addNewFlightAnimation(renderer, "kara.FLIGHT", "jmctheroes:flight/supergirl/supergirl.anim.json");
    utils.addHoverAnimation(renderer, "kara.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "kara.LAND", "jmctheroes:landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "kara.POSE", "fiskheroes:superhero_landing", "jmctheroes:dyn/sneaking_timer")
        .priority = 1;
    addAnimation(renderer, "kara.SOLAR", "jmctheroes:pose/solar_charge").setData((entity, data) => {
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
            chest.render();
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