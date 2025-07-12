extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "pwt:carnage_layer1",
    "layer2": "pwt:null",
	"suit_on": "pwt:carnage_suit_on",
	"suit": "pwt:carnage_suit.tx.json",
	"axe": "pwt:carnage_axe",
	"sword": "pwt:carnage_blade",
	"mask": "pwt:carnage_mask.tx.json",
	"mask1": "pwt:carnage_mask2.tx.json",
	"mask2": "pwt:carnage_mask3.tx.json",
	"segment": "pwt:tentacles/tentacle_carnage_wide",
    "claw": "pwt:tentacles/claw_carnage_wide",
	
	"web_small": "pwt:web/carnage_web",
	"web_large": "pwt:web/carnage_web_24",
	"web_rope": "pwt:web/carnage_web_rope"
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
            return timer == 0 ? "layer2" : timer < 1 ? "layer2" : "layer1";
        }
        return "layer1";
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
    
	axe = renderer.createEffect("fiskheroes:shield");
    axe.texture.set("axe");
    axe.anchor.set("rightArm");
    axe.setOffset(2.0, 12.0, 0.0).setRotation(90.0, 0.0, 0).setCurve(20.0, 0.0);
	axe.large = true;
	
	sword = renderer.createEffect("fiskheroes:shield");
    sword.texture.set("sword");
    sword.anchor.set("rightArm");
    sword.setOffset(1.2, 12.0, -1.0).setRotation(-10.0, 0.0, 0).setCurve(20.0, 0.0);
	sword.large = true;
	
    var arm = utils.createModel(renderer, "pwt:tentacle_carnage_wide", "segment");
    var claw = utils.createModel(renderer, "pwt:claw_carnage_wide", "claw");
    claw.bindAnimation("pwt:venom_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        {
          "offset": [3.0, -3.5, -2.0],
          "direction": [13.0, 10.0, -10.0]},
        {
          "offset": [-3.0, -3.5, -2.0],
          "direction": [-13.0, 10.0, -10.0]
        },
        {
          "offset": [3.0, -7.5, -2.0],
          "direction": [13.0, -7.0, -10.0]
        },
        {
          "offset": [-3.0, -7.5, -2.0],
          "direction": [-13.0, -7.0, -10.0]
		  
		  
		  
		},
        {
          "offset": [2.5, -5.0, -2.0],
          "direction": [8.0, 17.0, -17.0]
        },
        {
          "offset": [-2.5, -5.0, -2.0],
          "direction": [-5.0, 16.0, -17.0]
        }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 4;
    tentacles.segments = 7;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
	renderer.removeCustomAnimation("basic.AIMING");
	
	utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", ["fiskheroes:swing_default", "pwt:swing_default_symbiot"]);
	utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "pwt:swing_right_symbiot");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "pwt:swing_left_symbiot");
	
	addAnimationWithData(renderer, "symbiote.SUITUP", "pwt:carnage_suitup_body", "pwt:dyn/symbiot_timer")
        .priority = -8;

	addAnimation(renderer, "hero.FLIGHT", "fiskheroes:flight/default.anim.json")
        .setData((entity, data) => {
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
	if (renderLayer == 'CHESTPLATE') {
		axe.unfold = entity.getInterpolatedData("pwt:dyn/axe_timer");
		axe.render();
		
		sword.setOffset(1.2, 8.0+4*entity.getInterpolatedData("pwt:dyn/sword_timer")*entity.getInterpolatedData('fiskheroes:blade_timer'), -1.0)
		sword.unfold = entity.getInterpolatedData("pwt:dyn/sword_timer");
		sword.render();
	}
	
	overlay_suit.opacity = entity.getInterpolatedData('pwt:dyn/symbiot_timer')*1.7;
	if (entity.getInterpolatedData('pwt:dyn/symbiot_timer') < 1) {
		overlay_suit.render();
	}
	
}
