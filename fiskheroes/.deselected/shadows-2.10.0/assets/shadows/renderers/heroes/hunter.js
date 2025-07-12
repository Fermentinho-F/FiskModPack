extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:nothing",
    "layer2": "shadows:nothing",
    "hat": "shadows:hunter/hat",
    "arrow": "fiskheroes:arrow/prometheus",
    "quiver": "fiskheroes:quiver/prometheus"
});
var utils = implement("fiskheroes:external/utils");
var hat;
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("HELMET", "%s");
    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "shadows:invisible", "head", 0x000000, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0, 0]
            }
        ]);

    hat = renderer.createEffect("fiskheroes:model");
    hat.setModel(utils.createModel(renderer, "shadows:hunter/hat", "hat"));
    hat.anchor.set("head");

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
}

function render(entity, renderLayer, isFirstPersonArm) {
    hat.render();
}
