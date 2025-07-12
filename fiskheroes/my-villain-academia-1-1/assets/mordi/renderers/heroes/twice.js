extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "mordi:twice_layer1",
    "layer2": "mordi:twice_layer2",
    "staff": "mordi:twice_staff"
});

var utils = implement("fiskheroes:external/utils");

var scabbard;

function initEffects(renderer) {
    scabbard = renderer.createEffect("fiskheroes:model");
    scabbard.anchor.set("body");

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;


    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("staff");
    livery.weaponType = "BO_STAFF";
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        scabbard.render();
    }
}

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
        });
    }

    function initAnimations(renderer) {
        parent.initAnimations(renderer);
        addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });
    }