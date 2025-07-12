extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:arkham/arkham_knight_layer1",
    "layer2": "jmctheroes:arkham/arkham_knight_layer2",
    "lights": "jmctheroes:arkham/arkham_knight_lights",
    "mask": "jmctheroes:arkham/arkham_knight_mask.tx.json"
});

var opening_mask;

function initEffects(renderer) {
    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        night_vision.factor = !entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        night_vision.firstPersonOnly = true;
        return true;
    });
    opening_mask = renderer.createEffect("fiskheroes:opening_mask");
    opening_mask.texture.set("mask");
    opening_mask.anchor.set("head");
    opening_mask.setOffset(0.0, -3.5, -7.0).setRotation(-80.0, 0.0, 0.0);

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x6EFF00);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-3.5, 2.0, 3.0], "rotation": [0.0, -90.0, 60.0] }
    ]).slotIndex = 0;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;
}

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return !entity.getData('fiskheroes:mask_open_timer') == 0 ? null : "lights";
        }
        return renderLayer == "CHESTPLATE" ? null : "lights";
    });
}

function render(entity, renderLayer, isFirstPersonArm) {    
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            opening_mask.progress = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            opening_mask.render();
        }
    }
}