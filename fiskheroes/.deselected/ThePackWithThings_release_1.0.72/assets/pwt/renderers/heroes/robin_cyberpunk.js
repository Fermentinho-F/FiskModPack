extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "pwt:robin_cyberpunk_layer1",
	"layer1_gauntlets": "pwt:robin_cyberpunk_gauntlets_layer1",
	"layer2": "pwt:robin_cyberpunk_layer2",
	"mask": "pwt:robin_cyberpunk_mask",
	"layer1_lights": "pwt:robin_cyberpunk_lights_layer1",
	
	"colar_back": "pwt:robin_cyberpunk_colar_back",
	"colar_back_lights": "pwt:robin_cyberpunk_colar_back_lights",
	"colar_sideL": "pwt:robin_cyberpunk_colar_sideL",
	"colar_sideL_lights": "pwt:robin_cyberpunk_colar_sideL_lights",
	"colar_sideR": "pwt:robin_cyberpunk_colar_sideR",
	"colar_sideR_lights": "pwt:robin_cyberpunk_colar_sideR_lights",
	
	"hoverboard": "pwt:hoverboard",
	"hoverboard_lights": "pwt:hoverboard_lights",
	
	"backpack": "pwt:robin_cyberpunk_backpack",
	
	"grappling_arm": "pwt:grappling_arm",
	"grappling_arm_lights": "pwt:grappling_arm_lights",
	
	"web_small": "pwt:web/electric_web",
	"web_base": "pwt:web/ninja_rope_base",
	"web_rope": "pwt:web/ninja_rope"
});

var utils = implement("pwt:external/utils");
var colar_back
var colar_sideL
var colar_sideR

function init(renderer) {
    parent.init(renderer);
	renderer.setTexture((entity, renderLayer) => {
		var gauntlet_timer = entity.getData('pwt:dyn/web_shooters_timer');
		if (renderLayer == "HELMET") {
			return "mask";
		}
        else if (renderLayer == "CHESTPLATE") {
            return gauntlet_timer >0.5 ? "layer1_gauntlets" : "layer1";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
	renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set("web_small", "web_small");
	webs.textureRope.set("web_rope");
	webs.textureRopeBase.set("web_base");
	
	var equipment_wheel = renderer.bindProperty("fiskheroes:equipment_wheel");
	equipment_wheel.setCondition(entity => {
		if (entity.getData('pwt:dyn/web_shooters_timer')>0.5) {
			equipment_wheel.color.set(0x00DAFF);
		}
		else {
			equipment_wheel.color.set(0x000000);
		}
        return true;
    });
	
	colar_back = renderer.createEffect("fiskheroes:shield");
    colar_back.texture.set("colar_back", "colar_back_lights");
    colar_back.anchor.set("head");
    colar_back.setCurve(-60.0, 0.0);
	colar_back.large = true;
	
	colar_sideL = renderer.createEffect("fiskheroes:shield");
	colar_sideL.texture.set("colar_sideL", "colar_sideL_lights");
    colar_sideL.anchor.set("head");
    colar_sideL.setCurve(-25.0, 0.0);
	colar_sideR = renderer.createEffect("fiskheroes:shield");
	colar_sideR.texture.set("colar_sideR" , "colar_sideR_lights");
    colar_sideR.anchor.set("head");
    colar_sideR.setCurve(25.0, 0.0);
	
	eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set(null, "layer1_lights");
	
	///NightVison
	night_vision = renderer.bindProperty("fiskheroes:night_vision");
	night_vision.firstPersonOnly = true;
    night_vision.setCondition(entity => {
		night_vision.factor = 0.6*(1-entity.getInterpolatedData('fiskheroes:mask_open_timer2'));
		
        return true;
    });
	///BACKPACK
	var backpack = renderer.createResource("MODEL", "pwt:backpack_robin");
	
	backpack.texture.set("backpack");
	backpack_body = renderer.createEffect("fiskheroes:model").setModel(backpack);
	backpack_body.anchor.set("body");	

	var grappling = renderer.createResource("MODEL", "pwt:grappling_arm");
	
	grappling.texture.set("grappling_arm", "grappling_arm_lights");
	grappling.generateMirror();
	grappling_arm = renderer.createEffect("fiskheroes:model").setModel(grappling);
	grappling_arm.anchor.set("rightArm");	
		
	///HOVERBOARD
	var hoverboard = renderer.createResource("MODEL", "pwt:hoverboard_4");
	hoverboard.bindAnimation("pwt:hoverboard_animation").setData((entity, data) => {
		var flight_timer = entity.getInterpolatedData("pwt:dyn/dash_timer");
		data.load(0, Math.max(1 - (1 - flight_timer) * 4, 0) );
		
	})
	.priority = 1;
	hoverboard.texture.set("hoverboard", "hoverboard_lights");
	hoverboard_leg = renderer.createEffect("fiskheroes:model").setModel(hoverboard);
	hoverboard_leg.anchor.set("leftLeg");	

	
	var blue_fire = renderer.createResource("ICON", "pwt:muzzle/blue_flash_layer_%s");
	
    booster_front_1 = renderer.createEffect("fiskheroes:booster");
    booster_front_1.setIcon(blue_fire).setOffset(0.0, 12.5, 5.5).setRotation(10.0, 45.0, 0.0).setSize(3.0, 0.5);
    booster_front_1.anchor.set("leftLeg", hoverboard.getCubeOffset("front_booster_1_rot"));
    booster_front_1.mirror = false;
	
	booster_front_2 = renderer.createEffect("fiskheroes:booster");
    booster_front_2.setIcon(blue_fire).setOffset(0.0, 13.5, 5.5).setRotation(10.0, 45.0, 0.0).setSize(2.0, 0.5);
    booster_front_2.anchor.set("leftLeg", hoverboard.getCubeOffset("front_booster_2_rot"));
    booster_front_2.mirror = false;
	
	booster_back_1 = renderer.createEffect("fiskheroes:booster");
    booster_back_1.setIcon(blue_fire).setOffset(0.0, 10.5, -5.0).setRotation(-10.0, 45.0, 0.0).setSize(3.0, 0.5);
    booster_back_1.anchor.set("leftLeg", hoverboard.getCubeOffset("back_booster_1_rot"));
    booster_back_1.mirror = false;
	
	booster_back_2 = renderer.createEffect("fiskheroes:booster");
    booster_back_2.setIcon(blue_fire).setOffset(0.0, 9.5, -5.0).setRotation(-10.0, 45.0, 0.0).setSize(2.0, 0.5);
    booster_back_2.anchor.set("leftLeg", hoverboard.getCubeOffset("back_booster_2_rot"));
    booster_back_2.mirror = false;
	
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.935, "offset": [-3.5, 2.5, 3.75], "rotation": [90.0, 160.0, 0.0] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.PROP_FLIGHT");

	addAnimation(renderer, "hoverboard.FLIGHT", "pwt:flight/hoverboard.anim.json") 
		.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("pwt:dyn/dash_timer"));
		data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    })
	.priority = -10;
	
	addAnimationWithData(renderer, "robin.BACKPACK_EQUIP", "pwt:robin_backpack", "pwt:dyn/web_shooters_timer")
        .priority = 2;
	
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
	
	addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:aiming", "fiskheroes:web_aim_right_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:aiming_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;

    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
        "fiskheroes:swing_roll",
        "fiskheroes:swing_roll2",
        "fiskheroes:swing_roll5"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
}


function render(entity, renderLayer, isFirstPersonArm) {
	var hoverboard = entity.getInterpolatedData("pwt:dyn/dash_timer");
   if (!isFirstPersonArm && renderLayer == "HELMET") {
		eyes.opacity = 1-entity.getInterpolatedData("fiskheroes:mask_open_timer2")
		eyes.render();
    }
	else if (renderLayer == "CHESTPLATE") {
		if (!isFirstPersonArm) {
		colar_back.unfold = 1;
        colar_back.setOffset(0.0, -7.0, 5.25).setRotation(85.0, 0.0, 90.0);
        colar_back.render();
		
		colar_sideL.unfold = 1;
        colar_sideL.setOffset(3.98, -5.03, 4.86).setRotation(85.0, 0.0, 165.0);
        colar_sideL.render();
		colar_sideR.unfold = 1;
        colar_sideR.setOffset(-3.98, -5.03, 4.86).setRotation(85.0, 0.0, -165.0);
        colar_sideR.render();
		
		backpack_body.render();
		grappling_arm.mirror = true;
		}
		else {
			grappling_arm.mirror = false;
			
		}
		
		if (entity.getData('pwt:dyn/web_shooters_timer')>0.5) {
			grappling_arm.setScale(1.01);
			grappling_arm.render();	
		}
		
	}
	
	else if (!isFirstPersonArm && renderLayer == "LEGGINGS") {
		
		
		
		if (hoverboard > 0) {
			
			booster_front_1.progress = booster_front_2.progress = booster_back_1.progress = booster_back_2.progress = hoverboard;
			booster_front_1.opacity = booster_front_2.opacity = booster_back_1.opacity = booster_back_2.opacity = Math.max(1 - (1 - hoverboard) * 4, 0);
			booster_front_1.speedScale = booster_front_2.speedScale = booster_back_1.speedScale = booster_back_2.speedScale = hoverboard/8;
			
			booster_front_1.render();
			booster_front_2.render();
			booster_back_1.render();
			booster_back_2.render();
		
			hoverboard_leg.setOffset(5.0, 11.5, 0.0).setRotation(0.0, 0.0, 10.0);
			hoverboard_leg.render();
		}
	}
}