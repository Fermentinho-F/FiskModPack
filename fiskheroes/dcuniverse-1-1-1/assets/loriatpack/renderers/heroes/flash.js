extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/flash/the_flash_layer1",
    "layer2": "loriatpack:justice_legaue/flash/the_flash_layer2",
	"lights": "loriatpack:justice_legaue/flash/the_flash_light",
	"lights_no_helmet": "loriatpack:justice_legaue/flash/the_flash_light_no_helmet"
});

var utils = implement("fiskheroes:external/utils");

var speedster = implement("fiskheroes:external/speedster_utils");

var speedster_powers = implement("loriatpack:external/speedster_utils");

var vibration;

var recoil;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("loriatpack:dyn/mask_open_timer") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
	renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:speeding") && !entity.getData("fiskheroes:mask_open")) {
            return renderLayer == "LEGGINGS" ? "lights" : "lights";
        }
		else if (entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:mask_open")) {
            return renderLayer == "LEGGINGS" ? "lights_no_helmet" : "lights_no_helmet";
        }
        return renderLayer == "CHESTPLATE" ? null : null;
    });

}

function initEffects(renderer) {

    var model_rarm = renderer.createResource("MODEL", "loriatpack:flash_rightarm");
    model_rarm.texture.set("layer1");
    model_rarm.generateMirror();    

	
	larm1 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm1.anchor.set("leftArm");
	larm1.setRotation(0, 0, -20);
	larm1.setOffset(-2.0, -1.0, -2.0);
	larm1.mirror = true;
	
	larm2 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm2.anchor.set("leftArm");
	larm2.setRotation(0, 20, -10);
	larm2.setOffset(0.0, 3.0, 2.0);
	larm2.mirror = true;
	
	larm3 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm3.anchor.set("leftArm");
	larm3.setRotation(0, 0, -20);
	larm3.setOffset(-3.0, -3.0, 4.0);
	larm3.mirror = true;
	
	larm4 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm4.anchor.set("leftArm");
	larm4.setRotation(0, -20, -10);
	larm4.setOffset(0.0, 4.0, -4.0);
	larm4.mirror = true;
	
	larm5 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm5.anchor.set("leftArm");
	larm5.setRotation(0, 0, -5);
	larm5.setOffset(-2.0, 1.0, 0.0);
	larm5.mirror = true;
	
	larm6 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm6.anchor.set("leftArm");
	larm6.setRotation(0, 15, -5);
	larm6.setOffset(0.0, -3.0, 0.0);
	larm6.mirror = true;
	
	larm7 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm7.anchor.set("leftArm");
	larm7.setRotation(0, 0, -5);
	larm7.setOffset(-2.0, -3.0, -4.0);
	larm7.mirror = true;
	
	larm8 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm8.anchor.set("leftArm");
	larm8.setRotation(0, -5, -15);
	larm8.setOffset(0.0, -4.0, 4.0);
	larm8.mirror = true;
	
	larm9 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm9.anchor.set("leftArm");
	larm9.setRotation(0, 10, 30);
	larm9.setOffset(-4.0, -3.5, -4.0);
	larm9.mirror = true;
	
	larm10 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm10.anchor.set("leftArm");
	larm10.setRotation(0, -30, 15);
	larm10.setOffset(-5.0, 2.5, 2.5);
	larm10.mirror = true;
	
	larm11 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm11.anchor.set("leftArm");
	larm11.setRotation(0, 15, 25);
	larm11.setOffset(-6.0, -1.5, -2.5);
	larm11.mirror = true;
	
	larm12 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm12.anchor.set("leftArm");
	larm12.setRotation(0, -20, 15);
	larm12.setOffset(-7.0, 1.5, -1.5);
	larm12.mirror = true;
	
	larm13 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm13.anchor.set("leftArm");
	larm13.setRotation(0, 35, 25);
	larm13.setOffset(-3.0, 3.5, 1.5);
	larm13.mirror = true;
	
	larm14 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm14.anchor.set("leftArm");
	larm14.setRotation(0, -25, 35);
	larm14.setOffset(-2.0, -1.5, 3.5);
	larm14.mirror = true;
	
	larm15 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm15.anchor.set("leftArm");
	larm15.setRotation(0, 10, 15);
	larm15.setOffset(-1.0, 2.0, -3.5);
	larm15.mirror = true;
	
	larm16 = renderer.createEffect("fiskheroes:model").setModel(model_rarm);;
    larm16.anchor.set("leftArm");
	larm16.setRotation(0, -25, 25);
	larm16.setOffset(0.0, -2.0, 3.0);
	larm16.mirror = true;
    

    recoil = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        recoil.factor = entity.loop(6);
        recoil.intensity = 0;
        return entity.getData("fiskheroes:heat_vision");
    });


    vibration = renderer.createEffect("fiskheroes:vibration");

    speedster.init(renderer, "fiskheroes:lightning_gold");

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:energy_discharge", "body", 0xFF4D00, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);

    speedster_powers.init(renderer, "loriatpack:lightning_gold", utils);

}
function initAnimations(renderer) {
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("loriatpack:dyn/mask_open_timer");
            data.load(f < 1 ? f : 0);
        });

       addAnimation(renderer, "flash.PUNCH", "loriatpack:punch")
        .setData((entity, data) => {
            data.load(0.5 + entity.loop(1));
        }).setCondition(entity => entity.getInterpolatedData("fiskheroes:heat_vision_timer") > 0.5);
	
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("loriatpack:dyn/charge_kinetic_cooldown") > 0.4 || entity.getData("fiskheroes:intangible")) {
        vibration.render();
    }

if (entity.getInterpolatedData("fiskheroes:heat_vision_timer") > 0.5) {
		//LEFT_ARM
		
		if (entity.loop(3) > 0 && entity.loop(5) < 0.05) {
			larm1.opacity = entity.loop(5);
			larm1.render();
		}
		if (entity.loop(2) > 0 && entity.loop(4) < 0.1) {
			larm2.opacity = entity.loop(6);
			larm2.render();
		}
		if (entity.loop(8) > 0 && entity.loop(10) < 0.15) {
			larm3.opacity = entity.loop(7);
			larm3.render();
		}
		if (entity.loop(7) > 0 && entity.loop(9) < 0.2) {
			larm4.opacity = entity.loop(4);
			larm4.render();
		}
		if (entity.loop(6) > 0 && entity.loop(8) < 0.25) {
			larm5.opacity = entity.loop(1);
			larm5.render();
		}
		if (entity.loop(1) > 0 && entity.loop(3) < 0.3) {
			larm6.opacity = entity.loop(2);
			larm6.render();
		}
		if (entity.loop(2) > 0 && entity.loop(5) < 0.35) {
			larm7.opacity = entity.loop(3);
			larm7.render();
		}
		if (entity.loop(5) > 0 && entity.loop(7) < 0.4) {
			larm8.opacity = entity.loop(8);
			larm8.render();
		}
		
		if (entity.loop(1) > 0 && entity.loop(4) < 0.45) {
			larm9.opacity = entity.loop(9);
			larm9.render();
		}
		if (entity.loop(2) > 0 && entity.loop(6) < 0.5) {
			larm10.opacity = entity.loop(10);
			larm10.render();
		}
		if (entity.loop(8) > 0 && entity.loop(4) < 0.55) {
			larm11.opacity = entity.loop(11);
			larm11.render();
		}
		if (entity.loop(6) > 0 && entity.loop(3) < 0.6) {
			larm12.opacity = entity.loop(12);
			larm12.render();
		}
		if (entity.loop(5) > 0 && entity.loop(1) < 0.65) {
			larm13.opacity = entity.loop(13);
			larm13.render();
		}
		if (entity.loop(2) > 0 && entity.loop(7) < 0.45) {
			larm14.opacity = entity.loop(14);
			larm14.render();
		}
		if (entity.loop(7) > 0 && entity.loop(9) < 0.5) {
			larm15.opacity = entity.loop(15);
			larm15.render();
		}
		if (entity.loop(4) > 0 && entity.loop(7) < 0.4) {
			larm15.opacity = entity.loop(16);
			larm15.render();
		}
		

}

}

