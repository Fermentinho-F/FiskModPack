extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sl:snowflame_layer1",
    "layer1_maskless": "sl:snowflame_layer1_maskless",
    "layer2": "sl:snowflame_layer2"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            var maskOpen = entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? 
                           entity.getData("fiskheroes:mask_open") : 
                           entity.getData("fiskheroes:mask_open_timer2");

            if (maskOpen > 0.35) {
                return "layer1_maskless";
            }
        }

        if (renderLayer == "LEGGINGS") {
            return "layer2";
        }

        return "layer1";
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
  addAnimationWithData(renderer, "snowflame.USE", "sl:inhale", "sl:dyn/kryptonite_timer").setCondition(entity => { 
    return entity.getData("sl:dyn/kryptonite_cooldown") < 0.5 && entity.getData("sl:dyn/kryptonite");
  }).priority = -10;
    addAnimation(renderer, "snowflame.MASK", "sl:remove_mask")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });
}

function initEffects(renderer) {
   utils.bindParticles(renderer, "sl:snowflame").setCondition(entity => entity.getData("sl:dyn/kryptonite_timer") == 1);
}
