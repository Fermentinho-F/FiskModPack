extend("sabri:thor");
loadTextures({
    "layer1": "sabri:thor_roadworn_layer1",
    "layer2": "sabri:thor_roadworn_layer2",
    "fakecape": "sabri:thor_roadworn_surtur_fakecape",
    "cape": "sabri:thor_roadworn_surtur_cape",
    "skull": "sabri:thor_roadworn_surtur_skull"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("thor_roadworn_0", "%s_1", "thor_roadworn_2", "thor_roadworn_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    skull = renderer.createEffect("fiskheroes:model");
    skull.setModel(utils.createModel(renderer, "sabri:thor_roadworn_surtur_skull", "skull"));
    skull.anchor.set("body");
    skull.setRotation(0, 180, 0);
    skull.setOffset(0, -12, 3);
}

function hasCape() {
    return false;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    
    if (renderLayer == "CHESTPLATE") {
        skull.render();
    }
}