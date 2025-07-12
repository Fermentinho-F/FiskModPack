extend("tmhp:green_lantern");
loadTextures({
    "base": "tmhp:dc/lanterns/green/tmsd/base",
    "lights": "tmhp:dc/lanterns/green/tmsd/lights",
    "suit": "tmhp:dc/lanterns/green/tmsd/suit.tx.json",
    "mask": "tmhp:dc/lanterns/green/tmsd/mask.tx.json",
    "cape": "tmhp:dc/lanterns/green/tmsd/cape.tx.json",
    "cape_lights": "tmhp:dc/lanterns/green/tmsd/cape_lights"
});

var capes = implement("fiskheroes:external/capes");
var collar;

function initEffects(renderer) {
    parent.initEffects(renderer);
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.99;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape", null);
    cape_lights = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape_lights.effect.texture.set(null, "cape_lights");
    collar = renderer.createEffect("fiskheroes:ears");
    collar.anchor.set("head");
    collar.angle = -4;
    collar.inset = -0.07;
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        collar.render();
    }
    if (entity.getInterpolatedData("tmhp:dyn/lantern_timer") && !entity.getInterpolatedData("fiskheroes:dyn/nanites") && !entity.getInterpolatedData("tmhp:dyn/mecha") || entity.is("DISPLAY")) {
        cape.render(entity);
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" && !entity.getInterpolatedData("fiskheroes:dyn/nanites") && !entity.getInterpolatedData("tmhp:dyn/mecha") && entity.getInterpolatedData("tmhp:dyn/lantern_timer") > 0.9 || entity.is("DISPLAY")) {
        cape_lights.render(entity);
    }
}