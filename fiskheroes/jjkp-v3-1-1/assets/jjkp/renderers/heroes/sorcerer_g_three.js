extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:sorcerer/sorcerer_layer1",
    "layer2": "jjkp:sorcerer/sorcerer_layer2"
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("fiskheroes:external/flames");

var hand_flames;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var fire = renderer.createResource("ICON", "jjkp:cursed_energy_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);
    head_flames = flames.createHead(renderer, fire);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x5EA4FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
}
