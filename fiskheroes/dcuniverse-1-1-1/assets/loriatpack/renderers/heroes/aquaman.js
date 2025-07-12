extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/aquaman/aquaman_layer1",
    "layer2": "loriatpack:justice_legaue/aquaman/aquaman_layer2",
    "trident": "loriatpack:justice_legaue/aquaman/trident",
	"fish": "loriatpack:justice_legaue/aquaman/fish",
	"null": "loriatpack:blank"
});

var utils = implement("fiskheroes:external/utils");
var trident;

function init(renderer) {
    parent.init(renderer);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
	night_v = renderer.bindProperty("fiskheroes:night_vision");
    night_v.firstPersonOnly = false;
	
    var model_trident = renderer.createResource("MODEL", "loriatpack:trident");
    model_trident.texture.set("trident");
    trident = renderer.createEffect("fiskheroes:model").setModel(model_trident);
    trident.anchor.set("rightArm");
    trident.setScale(1.10);
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "loriatpack:water_beam","body", 0x00008b, [
        { "firstPerson": [-4.5, -16.0, -8.0], "offset": [-0.5, 9.0, -16.0], "size": [0.7, 0.7],"anchor": "rightArm" }
    ]);
	
	 utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:no_beam", "head", 0xffffff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [0.5, 12.0, 0.0], "size": [3.0, 3.0],}
    ]);
	
	var arm = utils.createModel(renderer, "loriatpack:fantasticarm", "null");
	var stretchfist = utils.createModel(renderer, "loriatpack:fish1", "fish");
	var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [0.0, -3.0, 1.0], "direction": [18.0, 0.0, 0.0] },
        { "offset": [0.0, -3.0, -1.0], "direction": [-18.0, 0.0, 0.0] },
		{ "offset": [0.0, -3.0, -1.0], "direction": [0.0, 18.0, 0.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
	tentacles.setHeadModel(stretchfist);
    tentacles.segmentLength = 1.0;
    tentacles.segments = 30;
	
	utils.bindParticles(renderer, "loriatpack:jump_smoke").setCondition(entity => entity.getInterpolatedData("loriatpack:dyn/jump_cooldown") > 0.4);     
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    utils.addFlightAnimation(renderer, "shazam.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "shazam.HOVER", "fiskheroes:flight/idle/default");
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "loriatpack:aiming_fpcorr_cyborg", "fiskheroes:beam_charge");
	addAnimation(renderer, "aqualad.HAMMER_EQUIP", "loriatpack:equip").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:blade_timer")))
        .priority = 100;	
	addAnimation(renderer, "aquaman.EQUIP", "loriatpack:weapon_in_hand").setData((entity, data) => data.load(entity.getData("fiskheroes:blade")  && !entity.getData("fiskheroes:beam_charge")))
        .priority = 10;	
	addAnimation(renderer, "VORTEX", "loriatpack:arm_vortex").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:sonic_waves");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:sonic_waves"), entity.getData("fiskheroes:sonic_waves") ? Math.min(charge * 1.5, 1) : Math.max(charge * 5 - 4, 0))&& entity.loop(3));
    });

	addAnimation(renderer, "sonic.VORTEX", "loriatpack:arm_vortex").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:sonic_waves"))&& entity.loop(3));

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (entity.getData("fiskheroes:blade_timer") > 0.4) {
            var blade_anchor = trident.anchor.set("rightArm");
            var blade_offSet = trident.setOffset(-10.1, 3.0, -6.3);
            var blade_rot = trident.setRotation(0, 0, 90);
            
            trident.anchor = blade_anchor, blade_offSet, blade_rot;
            trident.render(); 
         }
		 else{
		    var back_anchor = trident.anchor.set("body");
            var back_offSet = trident.setOffset(5.0, 8.0, 15.0);
            var back_rot = trident.setRotation(-90, 50, 0);
			trident.anchor = back_anchor, back_offSet, back_rot;
            trident.render();			
		}  
        }
}


