extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:invincible/conquest_layer1",
    "layer2": "jmctheroes:invincible/conquest_layer2",
    "lights": "jmctheroes:invincible/conquest_lights",
    "chest": "jmctheroes:invincible/conquest_chest"
});

var newutils = implement("jmctheroes:external/utils1");
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
    renderer.setLights((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? null : "lights";
    });

    chest = renderer.createEffect("fiskheroes:model");
    chest.setModel(utils.createModel(renderer, "jmctheroes:LargeChest", "chest", null));
    chest.anchor.set("body");
}

function initEffects(renderer) {

	utils.addCameraShake(renderer, 0.75, 0.75, "jmctheroes:dyn/sneaking_timer");
	utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
    utils.bindParticles(renderer, "jmctheroes:sonic_boom").setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && (entity.world().getDimension() == -1 || entity.world().getDimension() == 0 || entity.world().getDimension() == 1) && entity.getData("jmctheroes:dyn/flight_super_boost_timer") < 1);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    newutils.addNewFlightAnimation(renderer, "conquest.FLIGHT", "jmctheroes:flight/superman3.anim.json");
    utils.addHoverAnimation(renderer, "conquest.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "conquest.LAND", "jmctheroes:landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "conquest.POSE", "fiskheroes:superhero_landing", "jmctheroes:dyn/sneaking_timer")
        .priority = 1;
    addAnimation(renderer, "conquest.SUIT", "jmctheroes:bigchest").setData((entity, data) => {
        data.load(Math.max(entity.isAlive()));
    });
}

function render(entity, renderLayer, isFirstPersonArm){
    var stand = entity.isAlive() || entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
    if (renderLayer == "CHESTPLATE" && stand) {
        chest.render();
    }
}