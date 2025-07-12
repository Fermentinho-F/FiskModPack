extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/batfamily/robin/tim/layer1",
    "layer2": "tmhp:dc/batfamily/robin/tim/layer2",
    "cape": "tmhp:dc/batfamily/robin/yj/cape",
    "stealth": "tmhp:dc/batfamily/robin/tim/stealth"
});

var capes = implement("fiskheroes:external/capes");

var overlay;

function initEffects(renderer) {

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("stealth");

    cape = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape.effect.texture.set("cape");

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xFF0000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]).slotIndex = 1;
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
        cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
    }
    if (renderLayer == "CHESTPLATE" || renderLayer == "LEGGINGS") {
        overlay.opacity = entity.getInterpolatedData("tmhp:dyn/stealth_timer");
        overlay.texture.set("stealth");
        overlay.render();
    }
}