extend("fiskheroes:hero_basic");
loadTextures({
    "skin": "sl:red_tornado_cw",
    "layer1": "sl:red_tornado_cw_layer",
    "layer2": "sl:red_tornado_cw_layer",
    "hands": "sl:red_tornado_cw_hands"
});

var utils = implement("fiskheroes:external/utils");
var rightArm;
var leftArm;
var rightHand;
var leftHand;

function init(renderer) {
  parent.init(renderer);
    renderer.setItemIcons("steel_0", "steel_1", "steel_2", "steel_3");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function initEffects(renderer) {

   utils.bindParticles(renderer, "sl:arm_vortex").setCondition(entity => entity.getData("fiskheroes:beam_shooting") > 0);
   utils.bindParticles(renderer, "sl:tornado_flight").setCondition(entity => entity.getData("fiskheroes:flying"));

  utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:null", "body", 0xFF0000, [
      { "offset": [0.0, 0.0, 0.0], "size": [0.0, 0.0] }
  ]);

    leftArm = renderer.createEffect("fiskheroes:model");
    leftArm.setModel(utils.createModel(renderer, "sl:red_tornado_leftArm", "skin", null));
    leftArm.anchor.set("leftArm");
    leftArm.setOffset (5.0, -2.0, 0.0);

    rightArm = renderer.createEffect("fiskheroes:model");
    rightArm.setModel(utils.createModel(renderer, "sl:red_tornado_rightArm", "skin", null));
    rightArm.anchor.set("rightArm");
    rightArm.setOffset (-5.0, -2.0, 0.0);
	
    var model2 = renderer.createResource("MODEL","sl:red_tornado_rightHand");
    model2.texture.set("hands");
    model2.bindAnimation("sl:red_tornado_hand_spin").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:beam_shooting"));
    });
    rightHand = renderer.createEffect("fiskheroes:model").setModel(model2);
    rightHand.anchor.set("rightArm");
    rightHand.setOffset (-5.0, -2.0, 0.0);

    utils.setOpacityWithData(renderer, 0.999, 0.999, "fiskheroes:intangibility_timer");

    var model = renderer.createResource("MODEL","sl:red_tornado_leftHand");
    model.texture.set("hands");
    model.bindAnimation("sl:red_tornado_hand_spin").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:beam_shooting"));
    });
    leftHand = renderer.createEffect("fiskheroes:model").setModel(model);
    leftHand.anchor.set("leftArm");
    leftHand.setOffset (5.0, -2.0, 0.0);

    utils.setOpacityWithData(renderer, 0.999, 0.999, "fiskheroes:intangibility_timer");


    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [3.4, 10.0, -0.8], "rotation": [0.0, 90.0, 0.0] }
    ]).slotIndex = 0;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    utils.addHoverAnimation(renderer, "redtornado.HOVER", "sl:flight/idle/red_tornado");

    utils.addFlightAnimation(renderer, "redtornado.FLIGHT", "sl:redtornado_boost.anim.json");

    addAnimationWithData(renderer, "rt.TORNADO", "sl:red_tornado_aim", "fiskheroes:beam_charge");

    addAnimation(renderer, "legspin.TORNADO", "sl:leg_spin").setData((entity, data) => data.load(entity.loop(10)))
    .setCondition(entity => entity.getData("fiskheroes:flying"));

}

function render(entity, renderLayer, isFirstPersonArm) {
	if (renderLayer == "CHESTPLATE") {
        leftHand.render();
        rightHand.render();
        leftArm.render();
        rightArm.render();
    }

		
}