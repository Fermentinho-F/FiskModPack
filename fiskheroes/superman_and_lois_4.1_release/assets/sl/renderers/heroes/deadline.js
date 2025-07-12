extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sl:deadline_layer1",
    "layer2": "sl:deadline_layer2",
    "logo_lights": "sl:deadline_logo_lights.tx.json"
});

var lights1;
var vibration;

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "deadline.EQUIP", "sl:equip", "sl:dyn/peia_anim_timer").setCondition(entity => entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getByte("Count") == 0);
    addAnimationWithData(renderer, "deadline.SLASH", "sl:slash", "sl:dyn/punch_timer").setCondition(entity => entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard" || entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard");
}

function initEffects(renderer) {
    vibration = renderer.createEffect("fiskheroes:vibration");

    lights1 = renderer.createEffect("fiskheroes:overlay");
    lights1.texture.set(null, "logo_lights");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [3.4, 10.0, -0.8], "rotation": [0.0, 90.0, 0.0] }
    ]).slotIndex = 0;
}

function render(entity, renderLayer, isFirstPersonArm) {
    lights1.opacity = entity.getInterpolatedData("sl:dyn/speedup_timer") / 2;
    if (entity.getData("sl:dyn/speedup_timer") > 0) {
        lights1.render();
    }
    if (entity.getData("fiskheroes:intangible")) {
        vibration.render();
    }
}
