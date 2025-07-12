extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:flash/flash_knightmare_layer1",
    "layer2": "jmctheroes:flash/flash_knightmare_layer2",
    "mask": "jmctheroes:flash/flash_knightmare_mask.tx.json"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
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
