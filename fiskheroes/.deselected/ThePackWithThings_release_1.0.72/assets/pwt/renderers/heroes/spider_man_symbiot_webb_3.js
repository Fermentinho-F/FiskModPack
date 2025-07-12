extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "pwt:spider_man_webb_symbiot_layer1",
	"layer1_head": "pwt:spider_man_webb_symbiot_layer1_head",
    "layer2": "pwt:spider_man_webb_symbiot_layer2",
	"spike": "pwt:spiderman_webb_symbiot_whip.tx.json",
	
	"head": "pwt:spiderman_symbiot_webb_head.tx.json",
	
	"web_small": "pwt:web/web_webb_symbiote",
	"web_large": "pwt:web/web_24_webb_symbiote",
	"web_rope": "pwt:web/web_rope_webb_symbiote"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
		if (!entity.isDisplayStand() && renderLayer == "HELMET") {
            var cooldown_interp_1 = entity.getInterpolatedData('pwt:dyn/cooldown_interp_1');
			return cooldown_interp_1 == 0 ? "layer1" : "layer1_head";	
        } 
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });


    renderer.fixHatLayer("HELMET");
}

function initEffects(renderer) {
	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set("web_small");
	webs.textureLarge.set("web_large");
	webs.textureRope.set("web_rope");
	webs.textureRopeBase.set("web_small");
	
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00DAFF);
	
	var spike_tentacle = renderer.createResource("MODEL", "pwt:spike_whip");
		spike_tentacle.bindAnimation("pwt:spike_whip").setData((entity, data) => {
			data.load(0, 2*entity.loop(40) * entity.getInterpolatedData('pwt:dyn/cooldown_interp')*entity.getData('fiskheroes:blade_timer'));
			data.load(1, 1-entity.getInterpolatedData('pwt:dyn/cooldown_interp')*entity.getData('fiskheroes:blade_timer'));
		})
		.priority = -1;
		spike_tentacle.texture.set("spike");
		arm_tentacle = renderer.createEffect("fiskheroes:model").setModel(spike_tentacle);
		arm_tentacle.anchor.set("rightArm");	
	
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
        return entity.getInterpolatedData('pwt:dyn/cooldown_interp_1') == 0 ? 1 : entity.getInterpolatedData('fiskheroes:mask_open_timer2')>0 ? 1 : 0.9999 ;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);	
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
	
	addAnimation(renderer, "symbiot.BLADE", "pwt:tentacle_blade")
        .setData((entity, data) => {
            data.load(0, entity.getPunchTimerInterpolated());
            data.load(1, 1);
        })
        .setCondition(entity => entity.getData("fiskheroes:blade"))
        .priority = -10;
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
	
}

function render(entity, renderLayer, isFirstPersonArm) {
	var cooldown_interp_1 = entity.getInterpolatedData('pwt:dyn/cooldown_interp_1');
	arm_tentacle.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0);
	arm_tentacle.opacity = entity.getData('fiskheroes:blade_timer');
	arm_tentacle.render();
	
	if (renderLayer == "HELMET" && !isFirstPersonArm) {
		if (entity.getData('fiskheroes:mask_open_timer2') == 0 ) {
			if (cooldown_interp_1 > 0) {
				head.render();
			}
		}
	}
	
}