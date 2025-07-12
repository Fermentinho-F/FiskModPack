extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:outlaws/red_hood_layer1",
    "layer2": "jmctheroes:outlaws/red_hood_layer2",
    "lights": "jmctheroes:outlaws/red_hood_lights",
    "head": "jmctheroes:outlaws/red_hood_head",
    "mask": "jmctheroes:outlaws/red_hood_mask",
    "gun": "jmctheroes:outlaws/red_hood_gun"
});

var utils = implement("fiskheroes:external/utils");
var night_vision;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            if (entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0.5) {
                return "layer1";
            } 
            else {
                return "head";
            }
        } 
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    }); 
}
function initEffects(renderer) {

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        night_vision.factor = !entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        night_vision.firstPersonOnly = true;
        return true;
    });
    var model = renderer.createResource("MODEL", "jmctheroes:helmet_model");
    model.texture.set("mask", "lights");
    model.bindAnimation("jmctheroes:remove_helmet").setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });
    helmet = renderer.createEffect("fiskheroes:model").setModel(model);
    helmet.setOffset(0.0, 0.1, 0.0);
    helmet.anchor.set("head");

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "red_hood.HELMET", "jmctheroes:remove_helmet")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
    });
}

function render(entity, renderLayer, isFirstPersonArm) { 
    var mask = entity.getInterpolatedData("fiskheroes:mask_open_timer2") < 0.825;  
    if (renderLayer == "HELMET" && mask) {
        helmet.render();
    }
}