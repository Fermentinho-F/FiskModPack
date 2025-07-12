extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:nightwing",
    "layer2": "emo:nightwing",
    "web_wings": "fiskheroes:spider_man_wings"
});

var web_wings;

function initEffects(renderer) {
    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 0.99;
   
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xFF0000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }
}
