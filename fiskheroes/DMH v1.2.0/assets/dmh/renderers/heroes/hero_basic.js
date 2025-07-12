extend("fiskheroes:hero_basic");
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("%s/helmet", "%s/chestplate", "%s/leggings", "%s/boots");

}

function initEffects(renderer) {
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function render(entity, renderLayer, isFirstPersonArm) {
}
