var Arsenal = {
    "Claws": "claws",
    "Axe": "axe",
    "Sword": "sword"
};

extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "pwt:riot_layer1",
	"layer1_head": "pwt:riot_eyes.tx.json",
    "layer2": "pwt:null",
	"suit": "pwt:riot_suit.tx.json",
	"mask": "pwt:riot_layer1",
	"head_mask": "pwt:riot_head_mask",
	"head": "pwt:riot_head.tx.json",
	"chest": "pwt:riot_chest.tx.json",
	"claws": "pwt:riot_claws.tx.json",
	"axe": "pwt:riot_axe",
	"sword": "pwt:riot_sword",
	"flail": "pwt:riot_flail",
	
	"thorns": "pwt:riot_thorns.tx.json",
	
	"segment": "pwt:tentacles/tentacle_venom_wide_2",
    "claw": "pwt:tentacles/claw_venom_4x4",
	
	"web_small": "pwt:web/riot_web",
	"web_large": "pwt:web/riot_web_24",
	"web_rope": "pwt:web/riot_web_rope"
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
    
	axeR = renderer.createEffect("fiskheroes:shield");
    axeR.texture.set("axe");
    axeR.anchor.set("rightArm");
	
	axeL = renderer.createEffect("fiskheroes:shield");
    axeL.texture.set("axe");
    axeL.anchor.set("leftArm");

	
	axeR.large = axeL.large = true;
	
	sword = renderer.createEffect("fiskheroes:shield");
    sword.texture.set("sword");
    sword.anchor.set("rightArm");
	sword.large = true;
	
    var arm = utils.createModel(renderer, "pwt:tentacle_symbiot_venom", "segment");
    var claw = utils.createModel(renderer, "pwt:claw_venom_4x4", "claw");
    claw.bindAnimation("pwt:symbiot_4x4_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
		data.load(4, t.getStrikeTimer() > 0 ?  entity.loop(90) : 0);
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
		
	var head_mask_model = renderer.createResource("MODEL", "pwt:riot_head_mask");
		head_mask_model.bindAnimation("pwt:riot_mask").setData((entity, data) => {
			data.load(0, entity.getInterpolatedData('fiskheroes:mask_open_timer2'));
		})
		.priority = -1;
		head_mask_model.texture.set("head_mask");
		head_mask = renderer.createEffect("fiskheroes:model").setModel(head_mask_model);
		head_mask.anchor.set("head");
	
	var chest_model = renderer.createResource("MODEL", "pwt:chest_wide");
	chest_model.texture.set("chest");
	chest = renderer.createEffect("fiskheroes:model").setModel(chest_model);
	chest.anchor.set("body");
	
	var thorns_model = renderer.createResource("MODEL", "pwt:riot_thorns");
	thorns_model.texture.set("thorns");
	thorns = renderer.createEffect("fiskheroes:model").setModel(thorns_model);
	thorns.anchor.set("body");
	
	var thorns_arms_model = renderer.createResource("MODEL", "pwt:riot_thorns_arms");
	thorns_arms_model.texture.set("thorns");
	thorns_arms_model.generateMirror();
	thorns_arms = renderer.createEffect("fiskheroes:model").setModel(thorns_arms_model);
	thorns_arms.anchor.set("rightArm");	
	thorns_arms.mirror = true;
	

	var claws_model = renderer.createResource("MODEL", "pwt:riot_claws");
		claws_model.texture.set("claws");
		claws_model.generateMirror();
		claws = renderer.createEffect("fiskheroes:model").setModel(claws_model);
		claws.anchor.set("rightArm");	
		claws.mirror = true;
		
	var flail_model = renderer.createResource("MODEL", "pwt:riot_flail");
		flail_model.bindAnimation("pwt:riot_flail").setData((entity, data) => {
			data.load(0, entity.getInterpolatedData('pwt:dyn/flail_timer'));
			data.load(1, entity.getInterpolatedData('pwt:dyn/punch_interp'));
		})
		.priority = 1;
		flail_model.texture.set("flail");
		flail = renderer.createEffect("fiskheroes:model").setModel(flail_model);
		flail.anchor.set("rightArm");	
	
	renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return entity.getData('pwt:dyn/symbiot_timer') == 1 ? entity.getInterpolatedData('pwt:dyn/cooldown_interp_1') == 0 ? 1 : entity.getInterpolatedData('fiskheroes:mask_open_timer2')>0 ? 1 : 0.9999 : 1;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
	renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.AIMING");
	
	utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", ["fiskheroes:swing_default", "pwt:swing_default_symbiot"]);
	utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "pwt:swing_right_symbiot");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "pwt:swing_left_symbiot");
	
	addAnimationWithData(renderer, "symbiote.SUITUP", "pwt:carnage_suitup_body", "pwt:dyn/symbiot_timer")
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
	
	addAnimationWithData(renderer, "riot.SHIELDING", "pwt:riot_thorns_sneak", "pwt:dyn/thorns_timer")
        .priority = 0;
		
		
	addAnimation(renderer, "riot.ARMPOS", "pwt:riot_body")
        .setData((entity, data) => {
            data.load(!entity.is("DISPLAY") ? entity.getInterpolatedData("pwt:dyn/symbiot_timer") : 1);
        })
	.priority = 1;
	
		
	addAnimation(renderer, "punch.AXE", "pwt:riot_axe_punch")
        .setData((entity, data) => {
            data.load(entity.getInterpolatedData("pwt:dyn/punch_interp")*entity.getInterpolatedData("pwt:dyn/axe_timer"));
	})
	.priority = 1;
	
	addAnimation(renderer, "punch.CLAWS", "pwt:riot_claws_punch")
        .setData((entity, data) => {
            data.load(entity.getInterpolatedData("pwt:dyn/punch_interp")*entity.getInterpolatedData("pwt:dyn/claws_timer"));
	})
	.priority = 1;
	
	renderer.reprioritizeDefaultAnimation("PUNCH", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	var symbiot_timer = entity.getInterpolatedData('pwt:dyn/symbiot_timer');
	var cooldown_interp_1 = entity.getInterpolatedData('pwt:dyn/cooldown_interp_1');
	var blade_timer = entity.getInterpolatedData('fiskheroes:blade_timer');
	
	overlay_suit.opacity = entity.getInterpolatedData('pwt:dyn/symbiot_timer')*1.7;
	if (renderLayer == 'CHESTPLATE') {
		axeR.setOffset(2.0, 10.0+2.5*entity.getInterpolatedData('pwt:dyn/punch_interp')+0.5*entity.getInterpolatedData("fiskheroes:cryo_charge"), 0.5*entity.getInterpolatedData('pwt:dyn/punch_interp')).setRotation(90.0+30*entity.getInterpolatedData('pwt:dyn/punch_interp'), 0.0, 20*entity.getInterpolatedData('pwt:dyn/punch_interp')).setCurve(20.0, 0.0).setScale(1.0+0.5*entity.getInterpolatedData('pwt:dyn/punch_interp')+0.25*entity.getInterpolatedData("fiskheroes:cryo_charge"));
		axeR.unfold =  entity.getInterpolatedData("pwt:dyn/axe_timer")*blade_timer;
		axeR.render();
		
		sword.setOffset(1.2, 8.0+8*entity.getInterpolatedData("pwt:dyn/sword_timer")*blade_timer+1.75*entity.getInterpolatedData("fiskheroes:cryo_charge"), 0.0).setRotation(-7.0, 0.0, 0).setCurve(7.0, 0.0).setScale(1.0+0.25*entity.getInterpolatedData("fiskheroes:cryo_charge"));
		sword.unfold = entity.getInterpolatedData("pwt:dyn/sword_timer")*blade_timer;
		sword.render();
		
		claws.setOffset(-0.25*entity.getInterpolatedData("fiskheroes:cryo_charge"), -1.0*entity.getInterpolatedData("fiskheroes:cryo_charge"), 0.0).setScale(1.0+0.12*entity.getInterpolatedData("fiskheroes:cryo_charge"));
		claws.opacity = entity.getInterpolatedData('pwt:dyn/claws_timer')*1.7*blade_timer;
		claws.render();
		
		flail.opacity = entity.getInterpolatedData('pwt:dyn/flail_timer')*1.7*blade_timer;
		flail.render();
		if (isFirstPersonArm) {
			
		}
		else {
			axeL.setOffset(-2.0, 10.0+2.5*entity.getInterpolatedData('pwt:dyn/punch_interp')+0.5*entity.getInterpolatedData("fiskheroes:cryo_charge"), 0.5*entity.getInterpolatedData('pwt:dyn/punch_interp')).setRotation(90.0+30*entity.getInterpolatedData('pwt:dyn/punch_interp'), 0.0, -20*entity.getInterpolatedData('pwt:dyn/punch_interp')).setCurve(-20.0, 0.0).setScale(1.0+0.5*entity.getInterpolatedData('pwt:dyn/punch_interp')+0.25*entity.getInterpolatedData("fiskheroes:cryo_charge"));
			axeL.unfold =  entity.getInterpolatedData("pwt:dyn/axe_timer")*blade_timer;
			axeL.render();
			
			thorns.setOffset(0.0, -0.5*entity.getInterpolatedData('pwt:dyn/thorns_timer'), 0.0).setScale(1+0.1*entity.getInterpolatedData('pwt:dyn/thorns_timer')+0.05*entity.getInterpolatedData("fiskheroes:cryo_charge"));
			thorns_arms.setScale(1+0.1*entity.getInterpolatedData('pwt:dyn/thorns_timer')+0.05*entity.getInterpolatedData("fiskheroes:cryo_charge"));
			thorns.opacity = thorns_arms.opacity = entity.getInterpolatedData('pwt:dyn/ability_timer')*1.7;
			thorns.render();
			thorns_arms.render();
		
			if (symbiot_timer > 0 || entity.isDisplayStand() || entity.as("DISPLAY").getDisplayType() === "HOLOGRAM" ) {
				chest.setOffset(0.0, -0.3, -0.5).setRotation(7.5, 0.0, 0.0);
				chest.opacity = entity.isDisplayStand() || entity.as("DISPLAY").getDisplayType() === "HOLOGRAM" ? 1 : entity.getInterpolatedData('pwt:dyn/symbiot_timer')*symbiot_timer*1.7;
				chest.render();
			}
		}
		
	}
	if (symbiot_timer < 1) {
		overlay_suit.render();
	}
	
	
	if (entity.getData('fiskheroes:mask_open_timer2') == 0 ) {
		if (symbiot_timer == 1 && cooldown_interp_1 > 0) {
			///head.setOffset(0.0, 0.05, 0.0).setScale(1.0105);
			head.render();
		}
	}
	else {
		head_mask.render();
	}
	
}
