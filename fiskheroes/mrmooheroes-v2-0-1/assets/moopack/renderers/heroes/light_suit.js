extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:tron/light_suit_layer1",
    "layer2": "moopack:tron/light_suit_layer2",
    "layer1_lights": "moopack:tron/light_suit_lights1",
    "layer2_lights": "moopack:tron/light_suit_lights2",
    "visor": "moopack:tron/light_suit_visor",
    "shield": "moopack:tron/light_disc",
    "shield_lights": "moopack:tron/light_disc_lights"
});

var utils = implement("fiskheroes:external/utils");

var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("visor");

    var equipped = renderer.bindProperty("fiskheroes:equipped_item");
    equipped.setItems([
        { "anchor": "body", "scale": 1.0, "offset": [0.0, 5.0, 2.25], "rotation": [90.0, -180.0, 0.0] }
    ]);
    equipped.addOffset("QUIVER", -0.5, 0.0, 2.5);

    //utils.addLivery(renderer, "SHIELD", "shield");

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.weaponType = "SHIELD";
    livery.texture.set("shield", "shield_lights");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "HELMET") {
        overlay.opacity = 1 - 0.7 * entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        overlay.render();
    }
}