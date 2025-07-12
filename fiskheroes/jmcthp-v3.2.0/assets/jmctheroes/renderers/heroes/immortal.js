extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:invincible/immortal_layer1",
    "layer2": "jmctheroes:invincible/immortal_layer2"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

function init(renderer) {
    parent.init(renderer);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "lincon.FLIGHT", "jmctheroes:flight/rarm.anim.json");
    utils.addHoverAnimation(renderer, "lincon.HOVER", "fiskheroes:flight/idle/neutral");
}
