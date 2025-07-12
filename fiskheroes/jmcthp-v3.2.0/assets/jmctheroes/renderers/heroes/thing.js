extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:fantastic4/thing_layer1",
    "layer2": "jmctheroes:fantastic4/thing_layer2",
    "chest": "jmctheroes:fantastic4/thing_chest"
});

var utils = implement("fiskheroes:external/utils");

var chest;

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:model");
    chest.setModel(utils.createModel(renderer, "jmctheroes:chest", "chest", null));
    chest.anchor.set("body");
    
    utils.addCameraShake(renderer, 0.25, 0.5, "jmctheroes:dyn/charged_jump_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        chest.render();
    }
}
