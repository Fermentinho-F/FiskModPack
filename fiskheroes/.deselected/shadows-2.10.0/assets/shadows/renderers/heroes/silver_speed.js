extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:custom/silver_speed/silver_speed_layer1",
    "layer2": "shadows:custom/silver_speed/silver_speed_layer2"
});

var speedster = implement("fiskheroes:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("custom/silver_speed/%s_0", "custom/silver_speed/%s_1", "custom/silver_speed/%s_2", "custom/silver_speed/%s_3");

}

function initEffects(renderer) {
    speedster.init(renderer, "shadows:silver_speed");
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "shadows:invisible", "body", 0x000000, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [1, 1]
            }
        ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
}
