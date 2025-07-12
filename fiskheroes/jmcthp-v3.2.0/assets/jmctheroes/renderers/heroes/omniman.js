extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:invincible/omniman_layer1",
    "layer2": "jmctheroes:invincible/omniman_layer2",
    "cape": "jmctheroes:invincible/omniman_cape"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

function init(renderer) {
    parent.init(renderer);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 1;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.5;
    physics.flareElasticity = 5;

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("cape");

	utils.addCameraShake(renderer, 0.25, 0.25, "jmctheroes:dyn/sneaking_timer");
	utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
    utils.bindParticles(renderer, "jmctheroes:sonic_boom").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && (entity.world().getDimension() == -1 || entity.world().getDimension() == 0 || entity.world().getDimension() == 1) && entity.getData("jmctheroes:dyn/flight_super_boost_timer") < 1);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    newutils.addNewFlightAnimation(renderer, "nolan.FLIGHT", "jmctheroes:flight/superman3.anim.json");
    utils.addHoverAnimation(renderer, "nolan.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "nolan.LAND", "jmctheroes:landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "nolan.POSE", "fiskheroes:superhero_landing", "jmctheroes:dyn/sneaking_timer")
        .priority = 1;
}

function render(entity, renderLayer, isFirstPersonArm) {
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
