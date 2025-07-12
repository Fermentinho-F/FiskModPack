extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:toji/toji_revived_layer1",
    "layer2": "jjkp:toji/toji_revived_layer2"
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
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function render(entity, renderLayer, isFirstPersonArm) {
}
