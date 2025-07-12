extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1_classic": "fiskheroes:spider_man_webb_layer1",
    "layer2_classic": "fiskheroes:spider_man_webb_layer2",
	
	"layer1_symbiot": "pwt:spider_man_webb_symbiot_1",
	
	"suit": "pwt:spider_man_webb_symbiot_1_suit.tx.json",
	"suit_2": "pwt:spider_man_webb_symbiot_suit.tx.json",
	"suit_negative": "pwt:spider_man_webb_suit.tx.json",
	"mask": "pwt:spider_man_webb_symbiot_mask_1.tx.json",
	"mask_2": "pwt:spider_man_webb_symbiot_mask.tx.json",
	
	"web_small": "pwt:web/web_webb_symbiote",
	"web_large": "pwt:web/web_24_webb_symbiote",
	"web_rope": "pwt:web/web_rope_webb_symbiote"
});

var utils = implement("pwt:external/utils");
var overlay_suitup;

var overlay_cooldown;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
		if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("pwt:dyn/symbiot_timer");
			return timer == 0 ? (renderLayer == "LEGGINGS" ? "layer2_classic" : "layer1_classic") : (timer < 1 ? "suit_negative" : "layer1_symbiot");	
        } 
        return "layer1_symbiot";
		

    });


    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {

	
	overlay_cooldown = renderer.createEffect("fiskheroes:overlay");
    overlay_cooldown.texture.set("suit_2");
	
	overlay_mask_cooldown = renderer.createEffect("fiskheroes:overlay");
    overlay_mask_cooldown.texture.set("mask_2");
	
	overlay_suitup = renderer.createEffect("fiskheroes:overlay");
    overlay_suitup.texture.set("suit");
    
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:smg_shot", "rightArm", 0x000000, [
			{ "firstPerson": [-6.0, 3.0, -14.5], "offset": [-4.0, 12.0, 0.0], "size": [0.0, 0.0] }
	]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_bullets_2"));
		
	
    var arm = utils.createModel(renderer, "pwt:tentacle_symbiot_venom", "segment");
    var claw = utils.createModel(renderer, "pwt:claw_venom_3", "claw");
    claw.bindAnimation("pwt:venom_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
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
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
	
	utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", [
        "fiskheroes:swing_default", "fiskheroes:swing_default2", "pwt:swing_default_2_right", "pwt:swing_default_2_left"
    ]);
	
	utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", [
        "fiskheroes:swing_right", "pwt:swing_right_2", "pwt:swing_right_3"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", [
        "fiskheroes:swing_left", "pwt:swing_left_2", "pwt:swing_left_3"
    ]);
	
	
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", [
        "fiskheroes:swing_rotate_right", "fiskheroes:swing_rotate_right1" ,"pwt:swing_rotate_right2" , "pwt:swing_wheel_right"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", [
        "fiskheroes:swing_rotate_left", "fiskheroes:swing_rotate_left1" ,"pwt:swing_rotate_left2" , "pwt:swing_wheel_left"
    ]);
	
	utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
		"fiskheroes:swing_roll",
        "fiskheroes:swing_roll2",
        "fiskheroes:swing_roll5",
		"pwt:swing_barrel_roll",
		"pwt:swing_springboard_4"
    ]);
	
	utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
	"fiskheroes:swing_dive", "fiskheroes:swing_dive2", "pwt:swing_dive3", "pwt:swing_dive4", "pwt:swing_dive7"
	]);
	
	utils.addAnimationEvent(renderer, "WEBSWING_LEAP", [
		"fiskheroes:swing_springboard",
		"pwt:swing_springboard_4"
	]);

	renderer.reprioritizeDefaultAnimation("PUNCH", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	
	// arm_tentacle.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0);
	// arm_tentacle.opacity = 1;
	// arm_tentacle.render();
	

	
	overlay_cooldown.opacity = entity.getInterpolatedData('pwt:dyn/cooldown_1')*2;
	
	overlay_mask_cooldown.opacity = entity.getInterpolatedData('pwt:dyn/cooldown_1')*2;

	

	
	
	if (entity.getInterpolatedData('pwt:dyn/symbiot_timer') < 1) {
		overlay_suitup.opacity = 10*entity.getInterpolatedData('pwt:dyn/symbiot_timer');
		overlay_suitup.render();
	}

	if (entity.getInterpolatedData('pwt:dyn/symbiot_timer') > 0) {
	
		overlay_cooldown.render();

		if (renderLayer == "HELMET" && entity.getInterpolatedData('fiskheroes:mask_open_timer2') > 0 ) {
			overlay_mask_cooldown.render();
		}



	}
}
