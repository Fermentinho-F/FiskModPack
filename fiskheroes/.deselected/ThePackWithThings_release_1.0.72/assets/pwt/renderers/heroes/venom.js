extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "pwt:venom_layer1",
	"layer1_head": "pwt:venom_eyes.tx.json",
    "layer2": "pwt:null",
	"suit": "pwt:venom_suit.tx.json",
	"mask": "pwt:venom_mask.tx.json",
	"head": "pwt:venom_head.tx.json",
	
	"segment": "pwt:tentacles/tentacle_venom_wide_2",
    "claw": "pwt:tentacles/claw_venom_4x4",
	
	"web_small": "pwt:web/venom_web",
	"web_large": "pwt:web/venom_web_24",
	"web_rope": "pwt:web/venom_web_rope"
});

var utils = implement("pwt:external/utils");

var overlay_suit;


function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData('pwt:dyn/symbiot_timer');
			var cooldown_interp_1 = entity.getInterpolatedData('pwt:dyn/cooldown_interp_1');
            return timer == 0 ? "layer2" : timer < 1 ? "layer2" : cooldown_interp_1 == 0 ? "layer1_head" : "layer1";
        }
        return "layer1_head";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set("web_small");
	webs.textureLarge.set("web_large");
	webs.textureRope.set("web_rope");
	webs.textureRopeBase.set("web_small");
	
	overlay_suit = renderer.createEffect("fiskheroes:overlay");
    overlay_suit.texture.set("suit");
    
    var arm = utils.createModel(renderer, "pwt:tentacle_symbiot_venom", "segment");
    var claw = utils.createModel(renderer, "pwt:claw_venom_4x4", "claw");
    claw.bindAnimation("pwt:symbiot_4x4_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
		data.load(4, entity.loop(90));
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.5, -3.5, -1.5], "direction": [13.0, 10.0, -15.0] },
        { "offset": [-2.5, -3.5, -1.5], "direction": [-14.0, 7.0, -15.0] },
        { "offset": [2.0, -7.5, -1.5], "direction": [12.0, -7.0, -15.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 5.8;
    tentacles.segments = 9;
	
	var head_model = renderer.createResource("MODEL", "pwt:venom_head");
		head_model.bindAnimation("pwt:venom_head").setData((entity, data) => {
			data.load(0, entity.getInterpolatedData('pwt:dyn/cooldown_interp_1'));
			data.load(1, entity.loop(20));
		})
		.priority = -1;
		head_model.texture.set("head");
		head = renderer.createEffect("fiskheroes:model").setModel(head_model);
		head.anchor.set("head");
	
	renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return entity.getData('pwt:dyn/symbiot_timer') == 1 ? entity.getInterpolatedData('pwt:dyn/cooldown_interp_1') == 0 ? 1 : entity.getInterpolatedData('fiskheroes:mask_open_timer2')>0 ? 1 : 0.9999 : 1;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.AIMING");

	utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", ["fiskheroes:swing_default", "pwt:swing_default_symbiot"]);
	utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "pwt:swing_right_symbiot");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "pwt:swing_left_symbiot");
	
	addAnimationWithData(renderer, "symbiote.SUITUP", "pwt:venom_suitup_body", "pwt:dyn/symbiot_timer")
        .priority = -8;
	addAnimation(renderer, "basic.AIMING", "pwt:aiming_swing") 
		.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('fiskheroes:aiming_timer'));
		data.load(1, entity.loop(20) * entity.getInterpolatedData('fiskheroes:energy_projection_timer'));
    })
	.priority = 10;
	
	addAnimation(renderer, "hero.FLIGHT", "fiskheroes:flight/default.anim.json")
        .setData((entity, data) => {
			var trick = entity.getData('pwt:dyn/trick');
			
            data.load(0, entity.getInterpolatedData("pwt:dyn/levitate_timer"));
        })
	.priority = -10;
	
	addAnimation(renderer, "hero.HOVER", "fiskheroes:flight/idle/default")
        .setData((entity, data) => {
			
            data.load(0, entity.getInterpolatedData("pwt:dyn/levitate_timer"));
            data.load(1, entity.loop(20 * Math.PI) + 0.4);
        })
	.priority = -9.5;
	
	renderer.reprioritizeDefaultAnimation("PUNCH", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	var symbiot_timer = entity.getInterpolatedData('pwt:dyn/symbiot_timer');
	var cooldown_interp_1 = entity.getInterpolatedData('pwt:dyn/cooldown_interp_1');
	overlay_suit.opacity = entity.getInterpolatedData('pwt:dyn/symbiot_timer')*1.7;
	if (symbiot_timer < 1) {
		overlay_suit.render();
	}
	
	if (entity.getData('fiskheroes:mask_open_timer2') == 0 ) {
		if (symbiot_timer == 1 && cooldown_interp_1 > 0) {
			///head.setOffset(0.0, 0.05, 0.0).setScale(1.0105);
			head.render();
		}
	}
}
