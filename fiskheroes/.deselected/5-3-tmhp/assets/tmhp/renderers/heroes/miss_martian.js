extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/young_justice/miss_martian/layer1",
    "layer2": "tmhp:dc/young_justice/miss_martian/layer2",
    "cape": "tmhp:dc/young_justice/miss_martian/cape.tx.json",
    "hood": "tmhp:dc/young_justice/miss_martian/hood"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var hood;
var chest;

function initEffects(renderer) {
    hood = renderer.createEffect("fiskheroes:overlay");
    hood.texture.set("hood");

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.65).setYOffset(0.5);

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    cape = capes.createDefault(renderer, 20, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 12;

    utils.setOpacityWithData(renderer, 0.12, 1.0, "fiskheroes:dyn/nanite_timer");
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFFD3A8);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "mmcw.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmcw.HOVER", "fiskheroes:flight/idle/neutral");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
    else if (renderLayer == "HELMET") {
        hood.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer");
        hood.render();
    }
}
