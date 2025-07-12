extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/batmans/batman/batman_layer1",
    "layer2": "loriatpack:justice_legaue/batmans/batman/batman_layer2",
    "lights": "loriatpack:justice_legaue/batmans/batman/night_vision",
    "cape": "loriatpack:justice_legaue/batmans/batman/batman_cape",
	"cape2": "loriatpack:justice_legaue/batmans/batman/batman_cape_2",
    "electro": "loriatpack:justice_legaue/batmans/batman/electro",
    "krypt": "loriatpack:justice_legaue/batmans/batman/krypt",
    "lights_electro": "loriatpack:justice_legaue/batmans/batman/lights_electro",
    "lights_krypto": "loriatpack:justice_legaue/batmans/batman/lights_krypt",
    "rebreather": "loriatpack:justice_legaue/batmans/batman/rebreather",
    "grappling": "loriatpack:justice_legaue/batmans/batman/grapling",
    "web_base": "loriatpack:justice_legaue/batmans/batman/rope",
	"web_rope": "loriatpack:justice_legaue/batmans/batman/rope_claw",
	"ears": "loriatpack:justice_legaue/batmans/batman/batman_ears",
	"spikes": "loriatpack:justice_legaue/batmans/batman/batman_spike"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var ears;
var cape;
var cape2;
var spikes;
var electro_effect;

function init(renderer) {
	parent.init(renderer);
	 renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("loriatpack:dyn/mask_open_timer") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
	renderer.setLights((entity, renderLayer) => {
		if (entity.getData("loriatpack:dyn/night_timer") > 0.4 && !entity.getData("fiskheroes:mask_open")) {
			return renderLayer == "LEGGINGS" ? "lights" : "lights";
		}
		return renderLayer == "CHESTPLATE" ? null : null;
	});

}

function initEffects(renderer) {
	ears = renderer.createEffect("fiskheroes:model");
    ears.setModel(utils.createModel(renderer, "loriatpack:batman_ears", "ears"));
    ears.anchor.set("head");
	ears.setOffset(0.0, -1.0, 0.03);
	
	spikes = renderer.createEffect("fiskheroes:model");
    spikes.setModel(utils.createModel(renderer, "loriatpack:batman_spike", "spikes"));
    spikes.anchor.set("leftArm");
	spikes.setOffset(5.0, -2.0, 0.0);
	
	spikes2 = renderer.createEffect("fiskheroes:model");
    spikes2.setModel(utils.createModel(renderer, "loriatpack:batman_spike", "spikes"));
    spikes2.anchor.set("rightArm");
	spikes2.setOffset(10.5, 15.5, 5.5);
	spikes2.setRotation(180, 0, 0);
	
    night_v = renderer.bindProperty("fiskheroes:night_vision");
    night_v.setCondition(entity => entity.getData("loriatpack:dyn/night_timer") > 0.4 && !entity.getData("fiskheroes:mask_open"));
    night_v.firstPersonOnly = false;

    var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureRope.set("web_rope");
	webs.textureRopeBase.set("web_base");
    
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;

    cape = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape.effect.texture.set("cape");
	
	cape2 = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape2.effect.texture.set("cape2");
	

//grappling
    var model_grappling = renderer.createResource("MODEL", "loriatpack:grapling");
    model_grappling.texture.set("grappling");

    grappling = renderer.createEffect("fiskheroes:model").setModel(model_grappling);
    grappling.anchor.set("rightArm");
    grappling.setScale(1.35);
//electro knuckle
    var model_electro = renderer.createResource("MODEL", "loriatpack:electro");
    model_electro.texture.set("electro");
    model_electro.generateMirror();

    electro = renderer.createEffect("fiskheroes:model").setModel(model_electro);
    electro.anchor.set("rightArm");
    electro.setScale(1);
    electro.mirror = true;
//kryptonite knuckle
        var model_kryptonite = renderer.createResource("MODEL", "loriatpack:crypto");
    model_kryptonite.texture.set("krypt");
    model_kryptonite.generateMirror();

    kryptonite = renderer.createEffect("fiskheroes:model").setModel(model_kryptonite);
    kryptonite.anchor.set("rightArm");
    kryptonite.setScale(1);
    kryptonite.mirror = true;
//rebreather
    var model_rebreather = renderer.createResource("MODEL", "loriatpack:rebreather");
    model_rebreather.texture.set("rebreather");

    rebreather = renderer.createEffect("fiskheroes:model").setModel(model_rebreather);
    rebreather.anchor.set("head");
    rebreather.setScale(1);

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x000000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]);
// electro beam
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x7CC0FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    electro_effect = utils.createLines(renderer, "loriatpack:electro_knuckles", 0x7CC0FF, [
        {"start": [0, 0.5, 0], "end": [0.0, 1.0, 0.0], "size": [7.0, 3.0]},
    ]);
    electro_effect.anchor.set("rightArm");
    electro_effect.setOffset(1, 6.0, 0).setRotation(0.0, 0.0, 0.0).setScale(5.0, 6.0, 7.0);
    electro_effect.mirror = true;
}


function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("loriatpack:dyn/mask_open_timer");
            data.load(f < 1 ? f : 0);
        });
		
    addAnimation(renderer, "batman.REBREATHER", "loriatpack:bat_breath").setData((entity, data) => {
        var charge = entity.getInterpolatedData("loriatpack:dyn/rebreather_timer");
        data.load(0, entity.getData("loriatpack:dyn/rebreather_timer") ? Math.min(charge, 1) * 2 : 0);
        data.load(1, Math.max(charge - 0.5, 0) * 2);
    });

    addAnimationWithData(renderer, "batman.GRAPPLING", "loriatpack:equip_brass", "loriatpack:dyn/grappling_timer");
    addAnimationWithData(renderer, "batman.ELECTRO", "loriatpack:equip_brass_due", "loriatpack:dyn/electro_timer");
    addAnimationWithData(renderer, "batman.KRYPTONITE", "loriatpack:equip_brass_due", "loriatpack:dyn/kryptonite_timer");
    addAnimationWithData(renderer, "batman.NIGHT", "loriatpack:equip_night_vision", "loriatpack:dyn/night_timer");
	
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_rappel", "fiskheroes:web_aim_left_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;

    addAnimation(renderer, "punch.KRYPTONITE", "loriatpack:due_punch")
        .setData((entity, data) => {
            data.load(entity.getInterpolatedData("loriatpack:dyn/punch_int")*entity.getInterpolatedData("loriatpack:dyn/kryptonite_timer"));
	})
	.priority = 1;

    addAnimation(renderer, "punch.ELECTRO", "loriatpack:due_punch")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("loriatpack:dyn/punch_int")*entity.getInterpolatedData("loriatpack:dyn/electro_timer"));
})
.priority = 1;

        utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
        utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
        utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_default");
    
}

function render(entity, renderLayer, isFirstPersonArm) {
	if (renderLayer == "HELMET") {
         if (!entity.getData("loriatpack:dyn/mask_open_timer") > 0){
		 ears.render();
		}
    }
	
    if (renderLayer == "CHESTPLATE") {
		if (!isFirstPersonArm && !entity.getData("fiskheroes:gliding") && renderLayer == "CHESTPLATE") {
			cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
		}
		if (!isFirstPersonArm && entity.getData("fiskheroes:gliding") && renderLayer == "CHESTPLATE") {
			cape2.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
		}	
		spikes.render();
		spikes2.render();
        var charging_electro = entity.getData("fiskheroes:energy_charge");
        electro_effect.opacity = charging_electro;
        electro_effect.render();

        //electro
        if (entity.getData("loriatpack:dyn/electro_timer") > 0.4) {
            var blade_anchor = electro.anchor.set("rightArm");
            var blade_offSet = electro.setOffset(7.2, -1.35, 0.0);
            var blade_rot = electro.setRotation(0, 0, 0);
            
            electro.anchor = blade_anchor, blade_offSet, blade_rot;
            electro.render();
    }
    //grappling
    if (entity.getData("loriatpack:dyn/grappling_timer") > 0.4  && entity.getHeldItem().isEmpty()) {
        var blade3_anchor = grappling.anchor.set("rightArm");
        var blade3_offSet = grappling.setOffset(9.64, -9, 0);
        var blade3_rot = grappling.setRotation(0, 0, 0);
        
        grappling.anchor = blade3_anchor, blade3_offSet, blade3_rot;
        grappling.render();
}
//kryptonite
    if (entity.getData("loriatpack:dyn/kryptonite_timer") > 0.4) {
        var blade1_anchor = kryptonite.anchor.set("rightArm");
        var blade1_offSet = kryptonite.setOffset(7.2, -1.35, 0.0);
        var blade1_rot = kryptonite.setRotation(0, 0, 0);
        
        kryptonite.anchor = blade1_anchor, blade1_offSet, blade1_rot;
        kryptonite.render();
}


//rebreather
        }
            if (entity.getData("loriatpack:dyn/rebreather_timer") < 0.8 && entity.getData("loriatpack:dyn/rebreather_timer") > 0.4) {

                var blade2_anchor = rebreather.anchor.set("rightArm");
                var blade2_offSet = rebreather.setOffset(-0.2, 10, 0.0);
                var blade2_rot = rebreather.setRotation(0, 0, 0);
                
                rebreather.anchor = blade2_anchor, blade2_offSet, blade2_rot;
                rebreather.render();
                
        } else if (entity.getData("loriatpack:dyn/rebreather_timer") > 0.8) {
            var blade22_anchor = rebreather.anchor.set("head");
            var blade22_offSet = rebreather.setOffset(0, -0.2, 0.0);
            var blade22_rot = rebreather.setRotation(0, 0, 0);
            
            rebreather.anchor = blade22_anchor, blade22_offSet, blade22_rot;
            rebreather.render();
        } 
                   
        }
        


