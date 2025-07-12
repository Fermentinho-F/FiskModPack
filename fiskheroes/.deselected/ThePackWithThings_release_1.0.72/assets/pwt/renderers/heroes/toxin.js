extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "pwt:toxin_layer1.tx.json",
    "layer2": "pwt:null",
	"suit": "pwt:toxin_suit.tx.json",
	"mask": "pwt:toxin_mask.tx.json",
	"unmask": "pwt:toxin_red_unmask",
	"unmask_rage": "pwt:toxin_red_rage_unmask",

	"head": "pwt:toxin_head",
	
	"chest": "pwt:toxin_chest.tx.json",
	
	"claws": "pwt:toxin_claws.tx.json",

	"segment": "pwt:tentacles/tentacle_toxin_small_red",
    "claw": "pwt:tentacles/claw_toxin_red",
		
	"web_small": "pwt:web/carnage_web",
	"web_large": "pwt:web/toxin_web_24",
	"web_rope": "pwt:web/toxin_web_rope",
	"web_rope_base": "pwt:web/toxin_web"
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
			var ability_timer = entity.getInterpolatedData('pwt:dyn/ability_timer');
			var cooldown_interp_1 = entity.getInterpolatedData('pwt:dyn/cooldown_interp_1');
            return timer == 0 ? "layer2" : timer < 1 ? "layer2" : cooldown_interp_1 == 0 ? "layer1" : ability_timer > 0 ? "unmask_rage" : "unmask";
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
	webs.textureRopeBase.set("web_rope_base");
	
	overlay_suit = renderer.createEffect("fiskheroes:overlay");
    overlay_suit.texture.set("suit");

    
	axe = renderer.createEffect("fiskheroes:shield");
    axe.texture.set("sword");
    axe.anchor.set("rightArm");
    axe.setOffset(2.0, 12.0, 0.0).setRotation(90.0, 0.0, 0).setCurve(20.0, 0.0);
	axe.large = true;
	
	var chest_model = renderer.createResource("MODEL", "pwt:chest_wide");
		chest_model.texture.set("chest");
		chest = renderer.createEffect("fiskheroes:model").setModel(chest_model);
		chest.anchor.set("body");
	
	var head_model = renderer.createResource("MODEL", "pwt:venom_head");
		head_model.bindAnimation("pwt:venom_head").setData((entity, data) => {
			data.load(0, entity.getInterpolatedData('pwt:dyn/cooldown_interp_1'));
			data.load(1, entity.loop(20));
		})
		.priority = -1;
		head_model.texture.set("head");
		head = renderer.createEffect("fiskheroes:model").setModel(head_model);
		head.anchor.set("head");
	
	var claws_model = renderer.createResource("MODEL", "pwt:riot_claws");
		claws_model.texture.set("claws");
		claws_model.generateMirror();
		claws = renderer.createEffect("fiskheroes:model").setModel(claws_model);
		claws.anchor.set("rightArm");	
		claws.mirror = true;
	
    var arm = utils.createModel(renderer, "pwt:tentacle_toxin_small", "segment");
    var claw = utils.createModel(renderer, "pwt:claw_toxin_small", "claw");
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
          "direction": [7.0, 15.0, -10.0]
        },
        {
          "offset": [-3.0, -3.5, -2.0],
          "direction": [-10.0, 16.0, -9.0]
        },
        {
          "offset": [1.5, -6.5, -2.0],
          "direction": [7.0, -10.0, -7.0]
        },
        {
          "offset": [-1.5, -6.5, -2.0],
          "direction": [-10.0, -11.0, -7.0]
		  
		  
		  
		},
        {
          "offset": [2.0, -2.0, -2.0],
          "direction": [0.0, -5.0, -6.0]
        },
        {
          "offset": [-0.5, -3.0, -2.0],
          "direction": [0.0, -4.0, -4.0]
        },
		
		
		
        {
          "offset": [0.7, -1.0, -2.0],
          "direction": [1.0, 7.0, -10.0]
        },
        {
          "offset": [-2.5, -0.5, -2.0],
          "direction": [-1.5, 4.0, -14.0]
        
		
		
		},
        {
          "offset": [2.5, -5.5, -2.0],
          "direction": [0.0, -5.0, 0.0]
        },
        {
          "offset": [-2.5, -6.0, -2.0],
          "direction": [3.0, -5.0, 0.0]
		}
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 1.7;
    tentacles.segments = 13;
	
	renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return entity.getData('pwt:dyn/symbiot_timer') == 1 ? entity.getInterpolatedData('pwt:dyn/cooldown_interp_1') == 0 ? 1 : entity.getInterpolatedData('fiskheroes:mask_open_timer2')>0 ? 1 : 0.9999 : 1;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.AIMING");

    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;
		
	utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
	
	addAnimationWithData(renderer, "symbiote.SUITUP", "pwt:toxin_suitup_body", "pwt:dyn/symbiot_timer")
        .priority = -8;

	
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
	
	addAnimationWithData(renderer, "toxin.ARMPOS", "pwt:riot_body", "pwt:dyn/ability_timer")
        .priority = 1;
	
	addAnimation(renderer, "punch.CLAWS", "pwt:riot_claws_punch")
        .setData((entity, data) => {
            data.load(entity.getPunchTimerInterpolated()>0 ? entity.getInterpolatedData('fiskheroes:blade_timer') : 0);
	})
	.priority = 1;
	
	renderer.reprioritizeDefaultAnimation("PUNCH", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	var symbiot_timer = entity.getInterpolatedData('pwt:dyn/symbiot_timer');
	var cooldown_interp_1 = entity.getInterpolatedData('pwt:dyn/cooldown_interp_1');
	
	if (renderLayer == 'CHESTPLATE') {
		claws.setOffset(0.0, 0.5, 0.0).setScale(0.9);
		claws.opacity = entity.getInterpolatedData('fiskheroes:blade_timer');
		claws.render();
	}
	
	if (entity.getInterpolatedData("pwt:dyn/ability_timer") > 0) {
		chest.setOffset(0.0, -0.3, -0.5).setRotation(7.5, 0.0, 0.0);
		chest.opacity = entity.getInterpolatedData('pwt:dyn/ability_timer')*symbiot_timer*1.7;
		chest.render();
	}
	if (entity.getData('fiskheroes:mask_open_timer2') == 0 ) {
		if (symbiot_timer == 1 && cooldown_interp_1 > 0) {
			head.render();
		}
	}
	overlay_suit.opacity = symbiot_timer*1.7;
	if (symbiot_timer < 1) {
		overlay_suit.render();
	}

}
