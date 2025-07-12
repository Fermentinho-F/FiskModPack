extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:flash/flash_dceu_layer1",
    "layer2": "jmctheroes:flash/flash_dceu_layer2"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {    
    utils.bindTrail(renderer, "jmctheroes:lightning_flash_dceu");
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "speedster.SPRINT", "jmctheroes:speedsters/dceu_sprint").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    });
}
