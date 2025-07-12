extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:outlaws/bizarro_layer1",
    "layer2": "jmctheroes:outlaws/bizarro_layer2"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    
	utils.addCameraShake(renderer, 0.25, 0.25, "jmctheroes:dyn/sneaking_timer");
	utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
    utils.bindParticles(renderer, "jmctheroes:sonic_boom").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && (entity.world().getDimension() == -1 || entity.world().getDimension() == 0 || entity.world().getDimension() == 1) && entity.getData("jmctheroes:dyn/flight_super_boost_timer") < 1);
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0x4CB5FF, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.1, -3.3, -4], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.1, -3.3, -4], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "jmctheroes:frost_vision"));
        
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "jmctheroes:heat_breath", "head", 0xF56B3D, [
        { "firstPerson": [0.0, 1.5, 0.0], "offset": [0.0, -1.0, -4.0], "size": [0.75, 0.75] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    newutils.addNewFlightAnimation(renderer, "clark.FLIGHT", "jmctheroes:flight/biz/biz.anim.json");
    utils.addHoverAnimation(renderer, "clark.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "clark.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "clark.POSE", "fiskheroes:superhero_landing", "jmctheroes:dyn/sneaking_timer")
        .priority = 1;
}
