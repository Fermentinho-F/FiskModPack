extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:superman/superman_god_layer1",
    "layer2": "jmctheroes:superman/superman_dceu_layer2",
    "light_cape": "jmctheroes:superman/superman_light_cape",
    "cape": "jmctheroes:superman/superman_dceu_cape",
    "cape_glow": "jmctheroes:superman/superman_god_cape",
    "eyes": "jmctheroes:superman/god_moustache"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var cape;
var overlay, layer2, light;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");
    overlay.opacity = 1.0;

    layer2 = renderer.createEffect("fiskheroes:overlay");
    layer2.texture.set("layer2", null);
    layer2.opacity = 1.0;

    light = renderer.createEffect("fiskheroes:overlay");
    light.texture.set(null, "light_cape");
    light.opacity = 1.0;

    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 0.7;
    physics.flareDegree = 1.0;
    physics.flareFactor = 1.0;
    physics.flareElasticity = 2;

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("cape");
    cape_glow = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape_glow.effect.texture.set(null, "cape_glow");
    
	utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
    utils.bindParticles(renderer, "jmctheroes:sonic_boom").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && (entity.world().getDimension() == -1 || entity.world().getDimension() == 0 || entity.world().getDimension() == 1) && entity.getData("jmctheroes:dyn/flight_super_boost_timer") < 1);
    utils.bindParticles(renderer, "fiskheroes:black_manta_dceu_eyes").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") < 1);
    utils.bindParticles(renderer, "jmctheroes:cold_breath1").setCondition((entity) => entity.getData("fiskheroes:energy_projection"));
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0xFBBF6A, [
        { "firstPerson": [0.0, 3.0, 0.0], "offset": [1.0, -1.0, -4.0], "size": [2.0, 1.0] },
        { "firstPerson": [0.0, 3.0, 0.0], "offset": [-1.0, -1.0, -4.0], "size": [2.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision")).setCondition(entity => entity.getData("jmctheroes:dyn/moon_timer") < 0.4);
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "jmctheroes:heat_vision", "head", 0xFBBF6A, [
        { "firstPerson": [0.0, 3.0, 0.0], "offset": [1.0, -1.0, -4.0], "size": [2.0, 1.0] },
        { "firstPerson": [0.0, 3.0, 0.0], "offset": [-1.0, -1.0, -4.0], "size": [2.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision")).setCondition(entity => entity.getData("jmctheroes:dyn/moon_timer") > 0.4);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:super_heat_vision", "head", 0xFBBF6A, [
        { "firstPerson": [0.0, 3.0, 0.0], "offset": [1.0, -1.0, -4.0], "size": [2.0, 1.0] },
        { "firstPerson": [0.0, 3.0, 0.0], "offset": [-1.0, -1.0, -4.0], "size": [2.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "head", 0x4CB5FF, [
        { "firstPerson": [0.0, 1.5, 0.0], "offset": [0.0, -1.0, -4.0], "size": [0.75, 0.75] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "jmctheroes:cold_breath"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    newutils.addNewFlightAnimation(renderer, "clark.FLIGHT", "jmctheroes:flight/superman.anim.json");
    utils.addHoverAnimation(renderer, "clark.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "clark.LAND", "jmctheroes:landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge") || entity.getInterpolatedData("fiskheroes:heat_vision_timer") || entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        overlay.render();
        light.opacity = entity.getInterpolatedData("fiskheroes:flight_boost_timer") > 0;
        light.render();
        layer2.render();
        if (!isFirstPersonArm) {
            var f = entity.getInterpolatedData("fiskheroes:flight_timer");
            cape.effect.opacity = !entity.getInterpolatedData("fiskheroes:flight_boost_timer") == 1;
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity),
            });
            cape_glow.effect.opacity = entity.getInterpolatedData("fiskheroes:flight_boost_timer") > 0;
            cape_glow.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
        }
    }
}