extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/barry/default/layer1",
    "layer2": "tmhp:dc/flashfamily/barry/default/layer2",
	"red_lights": "tmhp:dc/flashfamily/barry/default/red_lights",
	"yellow_lights": "tmhp:dc/flashfamily/barry/default/yellow_lights",
	"red_lights_mask": "tmhp:dc/flashfamily/barry/default/red_lights_mask",
	"yellow_lights_mask": "tmhp:dc/flashfamily/barry/default/yellow_lights_mask"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

var red_lights;
var yellow_lights;
var red_lights_mask;
var yellow_lights_mask;

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
    utils.bindTrail(renderer, "tmhp:new52_red").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('fiskheroes:speed') <= 2);
    utils.bindTrail(renderer, "tmhp:new52_yellow").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('fiskheroes:speed') > 2);

    utils.bindTrail(renderer, "tmhp:flicker_red").setCondition(entity => entity.getData('fiskheroes:energy_charging') && entity.getData('fiskheroes:speed') <= 2);
    utils.bindTrail(renderer, "tmhp:flicker_yellow").setCondition(entity => entity.getData('fiskheroes:energy_charging') && entity.getData('fiskheroes:speed') > 2);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF0000, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData('fiskheroes:speed') <= 2);
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFFFF00, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData('fiskheroes:speed') > 2);

    red_lights = renderer.createEffect("fiskheroes:overlay");
    red_lights.texture.set(null, "red_lights");
    yellow_lights = renderer.createEffect("fiskheroes:overlay");
    yellow_lights.texture.set(null, "yellow_lights");
    red_lights_mask = renderer.createEffect("fiskheroes:overlay");
    red_lights_mask.texture.set(null, "red_lights_mask");
    yellow_lights_mask = renderer.createEffect("fiskheroes:overlay");
    yellow_lights_mask.texture.set(null, "yellow_lights_mask");
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
       red_lights.opacity = entity.getData('fiskheroes:speeding') && entity.getData('fiskheroes:speed') <= 2;
       red_lights.render();
       yellow_lights.opacity = entity.getData('fiskheroes:speeding') && entity.getData('fiskheroes:speed') > 2;
       yellow_lights.render();
       red_lights_mask.opacity = !entity.getData("fiskheroes:mask_open_timer2") && entity.getData('fiskheroes:speeding') && entity.getData('fiskheroes:speed') <= 2;
       red_lights_mask.render();
       yellow_lights_mask.opacity = !entity.getData("fiskheroes:mask_open_timer2") && entity.getData('fiskheroes:speeding') && entity.getData('fiskheroes:speed') > 2;
       yellow_lights_mask.render();
}
