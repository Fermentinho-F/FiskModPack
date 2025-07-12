extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:toji/toji_layer1",
    "layer2": "jjkp:toji/toji_layer2",
    "curse": "jjkp:toji/inventory_curse"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    if (entity => entity.getData("fiskheroes:speeding") && (entity.getData("fiskheroes:speed") == 3)) {
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        var timer = entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer");
        var partial = Math.min(Math.max(entity.motion().length() / 20, 0), 0.7);
        return 1 + (partial - 1) * timer;
    });
    }
    speedster.init(renderer);

    var model = renderer.createResource("MODEL", "jjkp:inventory_curse");
    model.texture.set("curse");
    curse = renderer.createEffect("fiskheroes:model").setModel(model);
    curse.setOffset(0, 0, 0)
    curse.setScale(1.0);
    curse.anchor.set("body");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        curse.render();
    }
}
