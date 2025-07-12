extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/barry/isue40/layer1",
    "layer2": "tmhp:dc/flashfamily/barry/isue40/layer2",
    "lights": "tmhp:dc/flashfamily/barry/isue40/lights",
    "forward": "tmhp:dc/flashfamily/barry/isue40/forward",
    "lights_mask": "tmhp:dc/flashfamily/barry/isue40/lights_mask",
    "forward_mask": "tmhp:dc/flashfamily/barry/isue40/forward_mask"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

var lights;
var forward;
var lights_mask;
var forward_mask;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") || entity.isBookPlayer() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}
function initEffects(renderer) {
    speedster.init(renderer);
    utils.bindTrail(renderer, "tmhp:comics").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.getData('fiskheroes:dyn/steeled'));
    utils.bindTrail(renderer, "tmhp:forward").setCondition(entity => entity.getData('fiskheroes:dyn/steeled'));

    utils.bindTrail(renderer, "tmhp:flicker_yellow").setCondition(entity => entity.getData('fiskheroes:energy_charging') && !entity.getData('fiskheroes:dyn/steeled'));

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF4D00, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => !entity.getData('fiskheroes:dyn/steeled'));
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x8899FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData('fiskheroes:dyn/steeled'));

    lights = renderer.createEffect("fiskheroes:overlay");
    lights.texture.set(null, "lights");
    forward = renderer.createEffect("fiskheroes:overlay");
    forward.texture.set(null, "forward");
    lights_mask = renderer.createEffect("fiskheroes:overlay");
    lights_mask.texture.set(null, "lights_mask");
    forward_mask = renderer.createEffect("fiskheroes:overlay");
    forward_mask.texture.set(null, "forward_mask");
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
       lights.opacity = entity.getData('fiskheroes:speeding') && entity.getData("fiskheroes:speeding") && !entity.getData('fiskheroes:dyn/steeled');
       lights.render();
       forward.opacity = entity.getData('fiskheroes:dyn/steeled');
       forward.render();
       lights_mask.opacity = !entity.getData("fiskheroes:mask_open_timer2") && entity.getData("fiskheroes:speeding") && !entity.getData('fiskheroes:dyn/steeled');
       lights_mask.render();
       forward_mask.opacity = !entity.getData("fiskheroes:mask_open_timer2") && entity.getData('fiskheroes:dyn/steeled');
       forward_mask.render();
}
