extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "pwt:batman_cyberpunk_layer12",
	"layer1_cannon": "pwt:batman_cyberpunk_arm_up",
    "pants": "pwt:batman_cyberpunk_pants",
	"pants_jacket": "pwt:batman_cyberpunk_pants_jacket",
	"boots": "pwt:batman_cyberpunk_boots",
	"layer1_lights": "pwt:batman_cyberpunk_lights_layer1",
	"ears": "pwt:batman_cyberpunk_ears",
	"launcher": "pwt:batman_cyberpunk_arm.tx.json",
	"launcher_lights": "pwt:ninja_advanced_arm_lights.tx.json",
    "cape": "pwt:batman_cyberpunk_cape"
});

var utils = implement("pwt:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var collar;
var gun_launcher;

function init(renderer) {
    parent.init(renderer);
	// renderer.setLights((entity, renderLayer) => {
        // if (renderLayer == "HELMET") {
            // return "layer1_lights";
        // }
        // return null;
    // });
	renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') > 0.18 ? "layer1_cannon" : "layer1";
        }
		else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_jacket" : "pants";
        }
        return "boots";
    });
	renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
	renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;

    cape = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape.effect.texture.set("cape");
	
	collar = renderer.createEffect("fiskheroes:ears");
    collar.anchor.set("head");
    collar.angle = -9;
    collar.inset = -0.075;
	
	var model_ears = renderer.createResource("MODEL", "pwt:bat_ears");
    model_ears.texture.set("ears");

    ears = renderer.createEffect("fiskheroes:model").setModel(model_ears);
    ears.anchor.set("head");
	
	eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set(null, "layer1_lights");
	
	///NightVison
	night_vision = renderer.bindProperty("fiskheroes:night_vision");
	night_vision.firstPersonOnly = true;
    night_vision.setCondition(entity => {
		night_vision.factor = 0.6-0.5*entity.getInterpolatedData('fiskheroes:mask_open_timer2');
		
        return true;
    });
	
	///LAUNCHER
	gun_launcher = renderer.createResource("MODEL", "pwt:arm_canon_2_folded");
	gun_launcher.bindAnimation("pwt:arm_gun_3").setData((entity, data) => {
		var nanite_timer = entity.getInterpolatedData('fiskheroes:dyn/nanite_timer')
		var aimed_timer = entity.getInterpolatedData('fiskheroes:aimed_timer')
		var held_item_empty = entity.getHeldItem().isEmpty()
		data.load(0, held_item_empty ? Math.max(1 - (1 - aimed_timer) * 1.0, 0) : 0);
		data.load(1, Math.max(1 - (1 - aimed_timer) * 2, 0) );
		data.load(2, Math.max(1 - (1 - aimed_timer) * 3.0, 0) );
		data.load(3, Math.max(1 - (1 - aimed_timer) * 1, 0) );
		data.load(4, Math.max(1 - (1 - aimed_timer) * 2, 0) );
		data.load(5, Math.max(1 - (1 - aimed_timer) * 3, 0) );
	})
	.priority = -1;
	gun_launcher.texture.set("launcher", "launcher_lights");
	arm_gun_launcher = renderer.createEffect("fiskheroes:model").setModel(gun_launcher);
	arm_gun_launcher.anchor.set("rightArm");
	

	///darts
		
		var repulsor = "fiskheroes:repulsor_blast";
		var beam_dart = "pwt:dart_shot";
		var constln_dart = { "firstPerson": [-5.5, 3.75, -15.0], "offset": [-2.5, 9.0, 0.0], "size": [0.5, 0.5] };
		var dart_stunt = 0x44a6a1;
		var dart_sleeping = 0x9e1dde;
		var dart_kriptonite = 0x07bd5c;
		
		///stunt
			utils.bindBeamModel(renderer, repulsor, beam_dart, "rightArm", dart_stunt, [
			constln_dart
			]).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("dart_stunt") == true );
		///sleeping
			utils.bindBeamModel(renderer, repulsor, beam_dart, "rightArm", dart_sleeping, [
			constln_dart
			]).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("dart_sleeping") == true );
		///poison
			utils.bindBeamModel(renderer, repulsor, beam_dart, "rightArm", dart_kriptonite, [
			constln_dart
			]).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("dart_kriptonite") == true );


    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x000000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-1.8, 0.75, 0.6], "rotation": [110.0, 0.0, 0.0] },
    ]).slotIndex = 1;
	
	utils.setOpacity(renderer, 0.999999, 1, 1);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimation(renderer, "batman.ARM_CHANGE", "pwt:batman_cyberpunk_arm")
        .setData((entity, data) => {
            data.load(entity.getInterpolatedData('fiskheroes:dyn/nanite_timer'));
		})
	.priority = -9;
	
	addAnimation(renderer, "batman.PUNCH", "pwt:boxing_pos")
        .setData((entity, data) => {
			var held_item = (entity.getHeldItem().isEmpty() || entity.getHeldItem().name() == 'fiskheroes:tactical_tonfa' || entity.getHeldItem().name() == 'fiskheroes:captain_americas_shield');
            data.load(0, entity.getData('pwt:dyn/counter') == 0 && held_item ? entity.getPunchTimerInterpolated()*entity.getData("pwt:dyn/combat_cooldown") : 0);
			data.load(1, entity.getData('pwt:dyn/counter') == 1 && held_item ? entity.getPunchTimerInterpolated()*entity.getData("pwt:dyn/combat_cooldown") : 0);
		})
	.priority = -9;
	
	
	addAnimation(renderer, "batman.GRAVITY", "pwt:flight/superhero_1.anim.json")
	.setData((entity, data) => {
		data.load(0, entity.getInterpolatedData("pwt:dyn/levitate_timer"));
	})
	.priority = -8;
	
		addAnimation(renderer, "batman.GRAVITY_HOVER", "pwt:flight/hovering_pose_unstable")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("pwt:dyn/levitate_timer"));
            data.load(1, entity.loop(20 * Math.PI) + 0.4);
        })
	.priority = -8;
	
	
    ///renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	if (!isFirstPersonArm && renderLayer == "HELMET") {
		eyes.opacity = 1-entity.getInterpolatedData("fiskheroes:mask_open_timer2")
		eyes.render();
        ears.render();
    }
    
	else if (renderLayer == "CHESTPLATE") {
		collar.render();
		arm_gun_launcher.render();
		if (!isFirstPersonArm) {
			cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
		}
	}
	
}
