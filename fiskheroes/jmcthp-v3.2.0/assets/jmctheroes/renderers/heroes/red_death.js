extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:dark_knights/red_death_layer1",
    "layer2": "jmctheroes:dark_knights/red_death_layer2",
    "layer1_lights": "jmctheroes:dark_knights/red_death_layer1_lights",
    "layer2_lights": "jmctheroes:dark_knights/red_death_layer2_lights"
});

var utils = implement("fiskheroes:external/utils");

var vibration;
var ears;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights";
    });
}

function initEffects(renderer) {
    ears = renderer.createEffect("fiskheroes:ears");
    ears.anchor.set("head");
    ears.angle = 15;
    ears.inset = 0.05;
    vibration = renderer.createEffect("fiskheroes:vibration");
    vibration.includeEffects(ears);
    var color = 0xFF0000
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", color, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 7.0, 0.0], "size": [1.5, 1.5] }
    ]);

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(color);

    utils.bindTrail(renderer, "fiskheroes:lightning_red");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "HELMET") {
        ears.render();
    }
    if (entity.getData('fiskheroes:intangible')) {
        vibration.render();
    }
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "speedster.SPRINT", "fiskheroes:speedster_sprint").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    });
}