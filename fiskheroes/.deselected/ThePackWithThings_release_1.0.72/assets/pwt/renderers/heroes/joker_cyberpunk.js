extend("fiskheroes:hero_basic");
loadTextures({
    "head": "pwt:joker_cyberpunk_head",
	"jacket": "pwt:joker_cyberpunk_jacket",
	"jacket_pants": "pwt:joker_cyberpunk_jacket_pants",
    "layer2": "pwt:joker_cyberpunk_layer2",
    "boots": "pwt:joker_cyberpunk_boots",
	"lights": "pwt:joker_cyberpunk_lights",
	"chest": "pwt:joker_cyberpunk_chest",
	"chest_lights": "pwt:joker_cyberpunk_chest_lights.tx.json",
	"reaper": "pwt:joker_gun_reaper",
	"reaper_heat": "pwt:ninja_advanced_arm_gun_reaper_heat",
	"mantis_blade": "pwt:joker_mantis_blade",
	"gun": "fiskheroes:deathstroke_dceu_gun"
});

var utils = implement("pwt:external/utils");
var muzzle_flash = implement("pwt:external/muzzle_flash");

var hair;
var gun_reaper;
var gun_reaper_heat;
var mantis_blade;

var recoil;

function init(renderer) {
    parent.init(renderer);
	renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? null : "lights");
    renderer.setTexture((entity, renderLayer) => {
		if (renderLayer == "HELMET") {
            return "head";
        }
		else if (renderLayer == "CHESTPLATE") {
            return entity.getWornLeggings().suitType() == $SUIT_NAME ? "jacket_pants" : "jacket";
        }
        return renderLayer == "BOOTS" ? "boots" : "layer2";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");
}

function initEffects(renderer) {
	var trail = renderer.bindProperty("fiskheroes:trail");
	
	var trail_1 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_1");
	var trail_2 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_2");
	var trail_3 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_3");
	var trail_4 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_4");
	var trail_5 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_5");
	var trail_6 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_6");
	var trail_7 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_7");
	var trail_8 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_8");
	var trail_9 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_9");
	var trail_10 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_10");
	var trail_11 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_11");
	var trail_12 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_12");
	
	trail.setCondition(entity => {
		var ticks = entity.ticksExisted();
		var mod = 24;
		if (ticks % mod >= 0 && ticks % mod < 2) {
			trail.setTrail(trail_1);
		}
		else if (ticks % mod >= 2 && ticks % mod < 4) {
			trail.setTrail(trail_2);
		}
		else if (ticks % mod >= 4 && ticks % mod < 6) {
			trail.setTrail(trail_3);
		}
		else if (ticks % mod >= 6 && ticks % mod < 8) {
			trail.setTrail(trail_4);
		}
		else if (ticks % mod >= 8 && ticks % mod < 10) {
			trail.setTrail(trail_5);
		}
		else if (ticks % mod >= 10 && ticks % mod < 12) {
			trail.setTrail(trail_6);
		}
		else if (ticks % mod >= 12 && ticks % mod < 14) {
			trail.setTrail(trail_7);
		}
		else if (ticks % mod >= 14 && ticks % mod < 16) {
			trail.setTrail(trail_8);
		}
		else if (ticks % mod >= 16 && ticks % mod < 18) {
			trail.setTrail(trail_9);
		}
		else if (ticks % mod >= 18 && ticks % mod < 20) {
			trail.setTrail(trail_10);
		}
		else if (ticks % mod >= 20 && ticks % mod < 22) {
			trail.setTrail(trail_11);
		}
		else if (ticks % mod >= 22) {
			trail.setTrail(trail_12);
		}
		
		return entity.getData('pwt:dyn/ability');
	});
	
    hair = renderer.createEffect("fiskheroes:model");
    hair.setModel(utils.createModel(renderer, "pwt:joker_mohawk", "head"));
    hair.anchor.set("head");
	
	eyes_model = renderer.createResource("MODEL", "pwt:eyes_cyberpsycho");
	eyes_model.bindAnimation("pwt:eyes_cyberpsycho").setData((entity, data) => {
		data.load(0, entity.loop(500) >0.9 && !(entity.loop(500) >0.94 && entity.loop(500) <0.96) ? (Math.random()*10)/8 : 0);
		data.load(1, Math.random()>0.5 ? -1 : 1);
	})
	.priority = -1;
	eyes_model.texture.set("head", "head");
	eyes = renderer.createEffect("fiskheroes:model").setModel(eyes_model);
	eyes.anchor.set("head");
	
	bullets = renderer.createEffect("fiskheroes:model");
    bullets.setModel(utils.createModel(renderer, "pwt:joker_arm_bullets", "head"));
    bullets.anchor.set("leftArm");
	
	var chest_model = renderer.createResource("MODEL", "pwt:joker_cyberpunk_chest");
	chest_model.texture.set("chest", "chest_lights");
	chest = renderer.createEffect("fiskheroes:model").setModel(chest_model);
	chest.anchor.set("body");
	
	///REAPER
	gun_reaper = renderer.createResource("MODEL", "pwt:arm_gun_reaper");
	gun_reaper.bindAnimation("pwt:arm_gun_reaper_left").setData((entity, data) => {
		var nanite_timer = entity.getInterpolatedData('pwt:dyn/crab_cannon_timer')
		var aimed_timer = entity.getInterpolatedData('fiskheroes:aimed_timer')
		var held_item_empty = entity.getHeldItem().isEmpty()
		data.load(0, held_item_empty ? Math.max(1 - (1 - nanite_timer) * 1.0, 0) : 0);
		data.load(1, Math.max(1 - (1 - nanite_timer) * 2, 0) );
		data.load(2, entity.getInterpolatedData('fiskheroes:energy_projection_timer') );
		data.load(3, entity.loop(20) );
		data.load(4, entity.loop(5)*entity.getInterpolatedData('fiskheroes:energy_projection_timer') );
	})
	.priority = -1;
	gun_reaper.texture.set("reaper");
	arm_gun_reaper = renderer.createEffect("fiskheroes:model").setModel(gun_reaper);
	arm_gun_reaper.anchor.set("leftArm");
	
		gun_reaper_heat = renderer.createResource("MODEL", "pwt:arm_gun_reaper");
		gun_reaper_heat.bindAnimation("pwt:arm_gun_reaper").setData((entity, data) => {
			var nanite_timer = entity.getInterpolatedData('pwt:dyn/crab_cannon_timer')
			var aimed_timer = entity.getInterpolatedData('fiskheroes:aimed_timer')
			var held_item_empty = entity.getHeldItem().isEmpty()
			data.load(0, held_item_empty ? Math.max(1 - (1 - nanite_timer) * 1.0, 0) : 0);
			data.load(1, Math.max(1 - (1 - nanite_timer) * 2, 0) );
			data.load(2, entity.getInterpolatedData('fiskheroes:energy_projection_timer') );
			data.load(3, entity.loop(20) );
			data.load(4, entity.loop(5)*entity.getInterpolatedData('fiskheroes:energy_projection_timer') );
		})
		.priority = -1;
		gun_reaper_heat.texture.set("reaper_heat", "reaper_heat");
		arm_gun_reaper_heat = renderer.createEffect("fiskheroes:model").setModel(gun_reaper_heat);
		arm_gun_reaper_heat.anchor.set("leftArm");
	
	///MANTIS
	mantis_blade = renderer.createResource("MODEL", "pwt:arm_mantis_blade");
	mantis_blade.bindAnimation("pwt:arm_mantis_blade").setData((entity, data) => {
		var sword_timer = entity.getInterpolatedData('pwt:dyn/sword_timer');
		var held_item_empty = entity.getHeldItem().isEmpty();
		data.load(0, Math.min(sword_timer * 5, 1) );
		data.load(1, Math.min(sword_timer * 4, 1) );
		data.load(2, Math.min(sword_timer * 3, 1) );
		data.load(3, Math.min(sword_timer * 2, 1) );
		data.load(4, Math.max(1 - (1 - sword_timer) * 2.0, 0) );
		data.load(5, held_item_empty ? entity.getPunchTimerInterpolated() : 0 );
		data.load(6, entity.loop(90) );
	})
	.priority = -1;
	mantis_blade.texture.set("mantis_blade");
	arm_mantis_blade = renderer.createEffect("fiskheroes:model").setModel(mantis_blade);
	arm_mantis_blade.anchor.set("rightArm");
	
	///NightVison
	night_vision = renderer.bindProperty("fiskheroes:night_vision");
	night_vision.firstPersonOnly = true;
    night_vision.setCondition(entity => {
		///night_vision.factor = entity.loop(500) >0.9 && !(entity.loop(500) >0.94 && entity.loop(500) <0.96) ? ((entity.loop(500)*100) % 1)/10 : 0.2;
		night_vision.factor = 0.05;
		
        return true;
    });
	
	///ScreenShake
	recoil = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        recoil.factor = entity.loop(500) >0.9 && !(entity.loop(500) >0.94 && entity.loop(500) <0.96) ? 1.5 - 1.45*entity.getInterpolatedData('pwt:dyn/charge') : 0.2 * (entity.getData("fiskheroes:energy_projection_timer"));
		///recoil.factor = 0.2 * (entity.getData("fiskheroes:energy_projection_timer"));
        recoil.intensity = 0;
        return entity.getData("fiskheroes:energy_projection") || entity.loop(500) >0.9 && !(entity.loop(500) >0.94 && entity.loop(500) <0.96);
    });
	
	//MuzzleFlash
	var icon = renderer.createResource("ICON", "pwt:muzzle/yellow_flash_white_layer_%s");
	flash = muzzle_flash.create(renderer, "pwt:muzzle/yellow_flash_white_layer_%s", "leftArm", -1.0, 19.5, 0.0, 0.8 );
	
	var bullet_color = 0xFFFF6D;
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:smg_shot", "leftArm", bullet_color, [
			{ "firstPerson": [3.45, 3.4, -12.0], "offset": [-0.4, 12.0, -0.4], "size": [0.7, 0.7] }
	])
	.setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_bullets")).setCondition(entity => entity.ticksExisted() % 3 == 0 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:smg_shot", "leftArm", bullet_color, [
			{ "firstPerson": [3.95, 3.0, -12.0], "offset": [-1.4, 12.0, 0.0], "size": [0.7, 0.7] }
	])
	.setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_bullets")).setCondition(entity => entity.ticksExisted() % 3 == 1 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:smg_shot", "leftArm", bullet_color, [
			{ "firstPerson": [3.45, 2.6, -12.0], "offset": [-0.4, 12.0, 0.4], "size": [0.7, 0.7] }
	])
	.setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_bullets")).setCondition(entity => entity.ticksExisted() % 3 == 2 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:smg_shot", "leftArm", 0x000000, [
			{ "firstPerson": [3.45, 2.6, -12.0], "offset": [-0.4, 12.0, 0.4], "size": [0.0, 0.0] }
	])
	.setCondition(entity => !(entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1) );
	
	utils.setOpacity(renderer, 0.999999, 1, 1);
	
	utils.addLivery(renderer, "DESERT_EAGLE", "gun");
	
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
	addAnimation(renderer, "joker.REAPER", "pwt:aiming_reaper_left") 
		.setData((entity, data) => {
		data.load(0, entity.getInterpolatedData('pwt:dyn/crab_cannon_timer'));
		data.load(1, entity.loop(3)*entity.getInterpolatedData('fiskheroes:energy_projection_timer'));
    })
	.priority = -9;
	
	addAnimationWithData(renderer, "joker.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
	
	addAnimation(renderer, "joker.SPRINT", "fiskheroes:speedster_sprint") 
		.setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"));
    })
	.priority = -6;
	
	
	addAnimation(renderer, "joker.ARMPOS", "pwt:riot_body") 
		.setData((entity, data) => {
		data.load(1);
    })
	.priority = 1;
	
	addAnimation(renderer, "joker.MANTIS_PUNCH1", "pwt:punch_mantis_1")
        .setData((entity, data) => {
			var held_item = entity.getHeldItem().isEmpty();
            data.load(0,  entity.getData('pwt:dyn/counter') == 0 && held_item ? entity.getPunchTimerInterpolated()*entity.getInterpolatedData('fiskheroes:blade_timer') : 0);
			data.load(1, entity.getInterpolatedData('pwt:dyn/crab_cannon_timer'));
		})
	.priority = 1;
	
	addAnimation(renderer, "joker.MANTIS_PUNCH2", "pwt:punch_mantis_2")
        .setData((entity, data) => {
			var held_item = entity.getHeldItem().isEmpty();
            data.load(0, entity.getData('pwt:dyn/counter') == 1 && held_item ? entity.getPunchTimerInterpolated()*entity.getInterpolatedData('fiskheroes:blade_timer') : 0);
			data.load(1, entity.getInterpolatedData('pwt:dyn/crab_cannon_timer'));
		})
	.priority = 1;
	
	
}

function render(entity, renderLayer, isFirstPersonArm) {
	var reaper_timer = entity.getInterpolatedData('pwt:dyn/crab_cannon_timer');
    if (!isFirstPersonArm && renderLayer == "HELMET") {
        hair.render();
		if (entity.loop(500) >0.9 && !(entity.loop(500) >0.94 && entity.loop(500) <0.96)) {
			eyes.render();
		}
    }
	if (renderLayer == "CHESTPLATE") {
		arm_mantis_blade.render();
		
		if (isFirstPersonArm) {
			arm_gun_reaper.setOffset(-9.0, 8.6, 7-8*reaper_timer + Math.sin(Math.PI*(entity.loop(3)*entity.getInterpolatedData('fiskheroes:energy_projection_timer')))).setRotation(-100*reaper_timer, 0, 8*reaper_timer);
			arm_gun_reaper_heat.setOffset(-9.0, 8.6, 7-8*reaper_timer + Math.sin(Math.PI*(entity.loop(3)*entity.getInterpolatedData('fiskheroes:energy_projection_timer')))).setRotation(-100*reaper_timer, 0, 8*reaper_timer);
		}
		else {
			bullets.setOffset(4.5, -3, 0);
			bullets.render();
			arm_gun_reaper.setOffset(-2, 0, 0).setRotation(0, 0, 0);
			arm_gun_reaper_heat.setOffset(-2, 0, 0).setRotation(0, 0, 0);
			
			chest.setOffset(0.0, -0.3, -0.5).setRotation(7.5, 0.0, 0.0);
			chest.render();
			
		}
		arm_gun_reaper.anchor.ignoreAnchor(isFirstPersonArm);
		arm_gun_reaper_heat.anchor.ignoreAnchor(isFirstPersonArm);
		arm_gun_reaper.render();
		arm_gun_reaper_heat.opacity = entity.getInterpolatedData('pwt:dyn/cooldown_5') - ( 0.99 * entity.getInterpolatedData('pwt:dyn/ability_timer')*entity.getInterpolatedData('pwt:dyn/stealth_timer'));
		arm_gun_reaper_heat.render();
		flash.render(entity, renderLayer, isFirstPersonArm, true);
	}
}
