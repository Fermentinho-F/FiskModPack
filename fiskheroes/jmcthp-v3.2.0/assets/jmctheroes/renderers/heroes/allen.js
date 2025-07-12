extend("fiskheroes:hero_basic");
loadTextures({
    "head": "jmctheroes:invincible/allen_head",
    "jacket": "jmctheroes:invincible/allen_jacket",
    "head_jacket": "jmctheroes:invincible/allen_head_jacket",
    "pants": "jmctheroes:invincible/allen_pants",
    "pants_jacket": "jmctheroes:invincible/allen_pants_jacket",
    "feet": "jmctheroes:invincible/allen_feet"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "head_jacket" : "head";
        }
        else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_jacket" : "pants";
        }
        return renderLayer == "BOOTS" ? "feet" : "jacket";
    });

    renderer.showModel("CHESTPLATE", "head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
	utils.addCameraShake(renderer, 0.5, 1.5, "fiskheroes:dyn/superhero_landing_timer");
    utils.bindParticles(renderer, "jmctheroes:sonic_boom").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && (entity.world().getDimension() == -1 || entity.world().getDimension() == 0 || entity.world().getDimension() == 1) && entity.getData("jmctheroes:dyn/flight_super_boost_timer") < 1);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    newutils.addNewFlightAnimation(renderer, "allen.FLIGHT", "jmctheroes:flight/superman.anim.json");
    utils.addHoverAnimation(renderer, "allen.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "allen.LAND", "jmctheroes:landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}