extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/young_justice/artemis/default/layer1",
    "layer2": "tmhp:dc/young_justice/artemis/default/layer2",
    "arrow": "tmhp:dc/young_justice/artemis/default/arrow",
    "quiver": "tmhp:dc/young_justice/artemis/default/quiver"
});

var utils = implement("fiskheroes:external/utils");
var chest;

function init(renderer) {
    parent.init(renderer);
}
function initEffects(renderer) {
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.65).setYOffset(0.5);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}