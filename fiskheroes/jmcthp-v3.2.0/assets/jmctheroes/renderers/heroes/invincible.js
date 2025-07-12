extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:invincible/invincible_layer1",
    "layer2": "jmctheroes:invincible/invincible_layer2"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
	utils.addCameraShake(renderer, 0.5, 1.0, "fiskheroes:dyn/superhero_landing_timer");
    utils.bindParticles(renderer, "jmctheroes:sonic_boom").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && (entity.world().getDimension() == -1 || entity.world().getDimension() == 0 || entity.world().getDimension() == 1) && entity.getData("jmctheroes:dyn/flight_super_boost_timer") < 1);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    newutils.addNewFlightAnimation(renderer, "0mark.FLIGHT", "jmctheroes:flight/mark/0mark.anim.json").setCondition(entity => entity.getData('jmctheroes:dyn/random') == 0)
    newutils.addNewFlightAnimation(renderer, "1mark.FLIGHT", "jmctheroes:flight/mark/1mark.anim.json").setCondition(entity => entity.getData('jmctheroes:dyn/random') == 1)


    utils.addHoverAnimation(renderer, "mark.HOVER", "fiskheroes:flight/idle/neutral");
    addAnimationWithData(renderer, "mark.LAND", "jmctheroes:landing_soft", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE_ROLL", ["jmctheroes:dive_roll", "jmctheroes:left_dive_roll", "jmctheroes:right_dive_roll", "jmctheroes:left_dive_roll2", "jmctheroes:right_dive_roll2"]);
    addAnimationWithData(renderer, "mark.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}