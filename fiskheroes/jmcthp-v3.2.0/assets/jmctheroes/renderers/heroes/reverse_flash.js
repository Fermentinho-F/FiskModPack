extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:flash/reverse_flash_layer1",
    "layer2": "jmctheroes:flash/reverse_flash_layer2",
    "eyes": "fiskheroes:reverse_flash_eyes"
});

var utils = implement("fiskheroes:external/utils");

var vibration;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" && entity.getData("fiskheroes:speeding") ? "eyes" : null);
}

function initEffects(renderer) {
    vibration = renderer.createEffect("fiskheroes:vibration");
    
    utils.bindTrail(renderer, "fiskheroes:lightning_red");
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF0000, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 7.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!entity.isDisplayStand() && entity.getData("fiskheroes:speeding")) {
        vibration.render();
    }
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "speedster.SPRINT", "fiskheroes:speedster_sprint").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    });
}