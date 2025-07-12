extend("fiskheroes:hero_basic");
loadTextures({
	"null": "pwt:null",
    "model": "pwt:scarecrow_boddy",
	"model_lights": "pwt:scarecrow_boddy_lights"
});
var utils = implement("pwt:external/utils");


function init(renderer) {
    parent.init(renderer);
	renderer.setTexture((entity, renderLayer) => {
        return "null";
    });
	renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");
}

function initEffects(renderer) {

	
	var rightArm_model = renderer.createResource("MODEL", "pwt:scarecrow_rightArm");
		rightArm_model.bindAnimation("pwt:halloween_scarecrow_model").setData((entity, data) => {
			var held_item = entity.getHeldItem();
			data.load(1, entity.getInterpolatedData("pwt:dyn/power_timer"));
			
			data.load(9, !held_item.isEmpty() ? 1 : 0);
			data.load(10, !held_item.isEmpty() && held_item.doesNeedTwoHands() ? 1 : 0);
		})
		.priority = -1;
		rightArm_model.texture.set("model");
		rightArm = renderer.createEffect("fiskheroes:model").setModel(rightArm_model);
		rightArm.anchor.set("rightArm");

		
	var leftArm_model = renderer.createResource("MODEL", "pwt:scarecrow_leftArm");
		leftArm_model.bindAnimation("pwt:halloween_scarecrow_model").setData((entity, data) => {
			var held_item = entity.getHeldItem();
			data.load(1, entity.getInterpolatedData("pwt:dyn/power_timer"));
			
			data.load(9, !held_item.isEmpty() ? 1 : 0);
			data.load(10, !held_item.isEmpty() && held_item.doesNeedTwoHands() ? 1 : 0);
		})
		.priority = -1;
		leftArm_model.texture.set("model");
		leftArm = renderer.createEffect("fiskheroes:model").setModel(leftArm_model);
		leftArm.anchor.set("leftArm");
		
	var leg_model = renderer.createResource("MODEL", "pwt:scarecrow_leg");
		leg_model.texture.set("model");
		leg = renderer.createEffect("fiskheroes:model").setModel(leg_model);
		leg.anchor.set("leftLeg");
		leg.mirror = true;
		
	var head_model = renderer.createResource("MODEL", "pwt:scarecrow_head");
		head_model.bindAnimation("pwt:halloween_scarecrow_model").setData((entity, data) => {
			var held_item = entity.getHeldItem();
			data.load(0, entity.loop(50));
			data.load(1, entity.getInterpolatedData("pwt:dyn/power_timer"));
			
		})
		.priority = -1;
		head_model.texture.set("model");
		head = renderer.createEffect("fiskheroes:model").setModel(head_model);
		head.anchor.set("head");
	
	var head_model_ov = renderer.createResource("MODEL", "pwt:scarecrow_head");
		head_model_ov.bindAnimation("pwt:halloween_scarecrow_model").setData((entity, data) => {
			var held_item = entity.getHeldItem();
			data.load(0, entity.loop(50));
			data.load(1, entity.getInterpolatedData("pwt:dyn/power_timer"));
			
		})
		.priority = -1;
		head_model_ov.texture.set(null, "model_lights");
		head_ov = renderer.createEffect("fiskheroes:model").setModel(head_model_ov);
		head_ov.anchor.set("head");
		
	var body_model = renderer.createResource("MODEL", "pwt:scarecrow_body");
		body_model.texture.set("model");
		body = renderer.createEffect("fiskheroes:model").setModel(body_model);
		body.anchor.set("body");
		
	renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 0.999 ;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimation(renderer, "scarecrow.ANIM", "pwt:halloween_scarecrow")
        .setData((entity, data) => {
			var held_item = entity.getHeldItem();
            data.load(0, entity.loop(75));
			data.load(1, entity.getInterpolatedData("pwt:dyn/power_timer"));
			data.load(2, entity.getPunchTimerInterpolated());
			data.load(4, 1);
			data.load(5, 0);
			
			
			data.load(9, !held_item.isEmpty() ? 1 : 0);
			data.load(10, !held_item.isEmpty() && held_item.doesNeedTwoHands() ? 1 : 0);
        })
        .priority = 1;
		
	addAnimation(renderer, "scarecrow.IDLE", "pwt:walking_cutom") 
		.setData((entity, data) => {
		var held_item = entity.getHeldItem();
		data.load(0, entity.getInterpolatedData("pwt:dyn/idle_timer"));
    })
	.priority = -8;
	
	renderer.reprioritizeDefaultAnimation("PUNCH", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	head.setOffset(0, 0, 0).setScale(0.7);
	head_ov.setOffset(0, 0, 0).setScale(0.7);
	body.setOffset(0, 0, 0).setScale(0.7);
	rightArm.setOffset(1.25, 0, 0).setScale(0.7);
	leftArm.setOffset(-1.25, 0, 0).setScale(0.7);
	leg.setOffset(0, 0, 0).setScale(0.7);
	
	head_ov.opacity = entity.getInterpolatedData('pwt:dyn/fire_timer');
	
	head.render();
	head_ov.render();
	body.render();
	rightArm.render();
	leftArm.render();
	leg.render();
	
}
