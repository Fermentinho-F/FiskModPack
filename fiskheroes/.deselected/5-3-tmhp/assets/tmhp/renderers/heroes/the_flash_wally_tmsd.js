extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/wally/tmsd/layer1",
    "layer2": "tmhp:dc/flashfamily/wally/tmsd/layer2",
    "mask": "tmhp:dc/flashfamily/wally/tmsd/mask.tx.json",
    "lights": "tmhp:dc/flashfamily/wally/tmsd/lights",
    "mask_lights": "tmhp:dc/flashfamily/wally/tmsd/mask_lights",

    "manhattan": "tmhp:dc/flashfamily/wally/tmsd/black",
    "manhattan_lights": "tmhp:dc/flashfamily/wally/tmsd/black_lights",
    "manhattan_mask": "tmhp:dc/flashfamily/wally/tmsd/black_mask.tx.json",
    "manhattan_mask_lights": "tmhp:dc/flashfamily/wally/tmsd/black_mask_lights",

    "flash": "tmhp:dc/flashfamily/wally/tmsd/flash",
    "flash_lights": "tmhp:dc/flashfamily/wally/tmsd/flash_lights",
    "flash_mask": "tmhp:dc/flashfamily/wally/tmsd/flash_mask.tx.json",
    "flash_mask_lights": "tmhp:dc/flashfamily/wally/tmsd/flash_mask_lights.tx.json"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

var mask;
var lights;
var manhattan;
var manhattan_lights;
var manhattan_mask;
var flash;
var flash_lights;
var flash_mask;

function init(renderer) {
    parent.init(renderer);
    mask = renderer.createEffect("fiskheroes:opening_mask");
    mask.setOffset(0.0, -3.0, -2.0).setRotation(-180.0, 0.0, 0.0);
    mask.texture.set("mask", "mask_lights");
    mask.anchor.set("head");
    manhattan_mask = renderer.createEffect("fiskheroes:opening_mask");
    manhattan_mask.setOffset(0.0, -3.0, -2.0).setRotation(-180.0, 0.0, 0.0);
    manhattan_mask.texture.set("manhattan_mask", "manhattan_mask_lights");
    manhattan_mask.anchor.set("head");
    flash_mask = renderer.createEffect("fiskheroes:opening_mask");
    flash_mask.setOffset(0.0, -3.0, -2.0).setRotation(-180.0, 0.0, 0.0);
    flash_mask.texture.set("flash_mask", "flash_mask_lights");
    flash_mask.anchor.set("head");
}
function initEffects(renderer) {
    speedster.init(renderer);
    utils.bindTrail(renderer, "tmhp:rebirth").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('fiskheroes:speed') <= 5);
    utils.bindTrail(renderer, "tmhp:black").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('fiskheroes:speed') > 5 && entity.getData('fiskheroes:speed') <= 10);
    utils.bindTrail(renderer, "tmhp:wally_flash").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('fiskheroes:speed') > 10);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF4D00, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData('fiskheroes:speed') <= 5);
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x8899FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData('fiskheroes:speed') > 5 && entity.getData('fiskheroes:speed') <= 10);
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x8899FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData('fiskheroes:speed') > 10);

    lights = renderer.createEffect("fiskheroes:overlay");
    lights.texture.set(null, "lights");
    manhattan = renderer.createEffect("fiskheroes:overlay");
    manhattan.texture.set("manhattan");
    manhattan_lights = renderer.createEffect("fiskheroes:overlay");
    manhattan_lights.texture.set("manhattan", "manhattan_lights");
    flash = renderer.createEffect("fiskheroes:overlay");
    flash.texture.set("flash");
    flash_lights = renderer.createEffect("fiskheroes:overlay");
    flash_lights.texture.set("flash", "flash_lights");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET" && entity.getData('fiskheroes:speed') <= 5) {
       mask.render();
       mask.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
    if (renderLayer == "HELMET" && entity.getData('fiskheroes:speed') > 5 && entity.getData('fiskheroes:speed') <= 10) {
       manhattan_mask.render();
       manhattan_mask.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
    if (renderLayer == "HELMET" && entity.getData('fiskheroes:speed') > 10) {
       flash_mask.render();
       flash_mask.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
       lights.opacity = entity.getData('fiskheroes:speeding') && entity.getData('fiskheroes:speed') <= 5;
       lights.render();
       manhattan.opacity = entity.getData('fiskheroes:speed') > 5 && entity.getData('fiskheroes:speed') <= 10;
       manhattan.render();
       flash.opacity = entity.getData('fiskheroes:speed') > 10;
       flash.render();
       manhattan_lights.opacity = entity.getData('fiskheroes:speeding') && entity.getData('fiskheroes:speed') > 5 && entity.getData('fiskheroes:speed') <= 10;
       manhattan_lights.render();
       flash_lights.opacity = entity.getData('fiskheroes:speeding') && entity.getData('fiskheroes:speed') > 10;
       flash_lights.render();
}
