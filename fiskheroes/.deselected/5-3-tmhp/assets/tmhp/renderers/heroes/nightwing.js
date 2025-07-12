extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/batfamily/nightwing/default/layer1",
    "layer2": "tmhp:dc/batfamily/nightwing/default/layer2",
    "electric_glow": "tmhp:dc/batfamily/nightwing/default/electric_glow",
    "web_wings": "tmhp:dc/batfamily/nightwing/default/wings"
});

var utils = implement("fiskheroes:external/utils");

var web_wings;
var overlay;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "electric_glow");

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 1.0;

    utils.bindTrail(renderer, "tmhp:electrical_suit").setCondition(entity => entity.getData("tmhp:dyn/electrical_timer") > 0);
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00DAFF);
    renderer.bindProperty("fiskheroes:night_vision");
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "scout.ROLL", "fiskheroes:falcon_dive_roll")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
            data.load(f > 0 ? Math.min((1 - f) * 2.5, 1) : 0);
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }
    if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
        overlay.opacity = entity.getInterpolatedData("tmhp:dyn/electrical_timer");
        overlay.texture.set(null, "electric_glow");
        overlay.render();
    }
}