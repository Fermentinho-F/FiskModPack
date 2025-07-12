extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:red",
    "layer2": "emo:red",
    "suit": "emo:red.tx.json"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}


function initEffects(renderer) {
    speedster.init(renderer, "fiskheroes:lightning_red");
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xFF0000, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:lightning_cast", "rightArm", 0xFF0000, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
}
