extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:flash/flash_layer1",
    "layer2": "jmctheroes:flash/flash_layer2"
});

var utils = implement("fiskheroes:external/utils");

var vibration;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    vibration = renderer.createEffect("fiskheroes:vibration");
    
    utils.bindTrail(renderer, "jmctheroes:lightning_flash");
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF4D00, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 7.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!entity.isDisplayStand() && entity.getData("fiskheroes:intangible")) {
        vibration.render();
    }
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "speedster.SPRINT", "fiskheroes:speedster_sprint").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    });
}
