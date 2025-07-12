extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:he_who_remains",
    "layer2": "zaro:he_who_remains"
});


function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "hewhoremains.TELEPORT", "zaro:who").setData((entity, data) => {
        var tp = entity.getInterpolatedData("fiskheroes:teleport_timer");
        data.load(0, tp);
    });
}