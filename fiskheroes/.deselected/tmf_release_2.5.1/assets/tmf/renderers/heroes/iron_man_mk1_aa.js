extend("fiskheroes:hero_basic");
loadTextures({
	"null": "tmf:null",
	"suit": "tmf:mk1/iron_man_mk1_aa",
	"mask": "tmf:mk1/iron_man_mk1_aa_mask",
	"layer1": "tmf:mk1/iron_man_mk1_aa_layer1",
	"layer2": "tmf:mk1/iron_man_mk1_aa_layer2",
	"suit_lights": "tmf:mk1/iron_man_mk1_aa_lights",
	"armory": "tmf:armory"
});

var utils = implement("fiskheroes:external/utils");
var maskModel = implement("tmf:external/mask");
var armoryT = implement("tmf:external/armory");
var bootsFront;
var bootsBack;
var mask;

function init(renderer) {  
    parent.init(renderer);
    renderer.fixHatLayer("HELMET");
	
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0 && !(entity.isDisplayStand() && entity.world().getBlock(entity.pos().add(0, -1, 0)) == "fiskheroes:titanium_block")) {
            return null;
        }
        if (renderLayer == "LEGGINGS") {
            return null;
        }
        return "suit_lights";
    });
	
}

function initEffects(renderer) {

    armory = renderer.createEffect("fiskheroes:model");
		armory.setModel(armoryT.createModel(renderer, "tmf:other/armory", "armory"));
		armory.anchor.set("body");
		armory.setScale(1.2);
		armory.setOffset(0,-4,-1.2);

    icon = renderer.createResource("ICON", "tmf:repulsors");

    bootsFront = renderer.createEffect("fiskheroes:booster");
    bootsFront.setIcon(icon).setOffset(0.0, 12.0, 1.0).setSize(3.5, 1.0);
    bootsFront.anchor.set("rightLeg");
    bootsFront.mirror = true;
	
    bootsBack = renderer.createEffect("fiskheroes:booster");
    bootsBack.setIcon(icon).setOffset(0.0, 12.0, -1.0).setSize(2.5, 1.0);
    bootsBack.anchor.set("rightLeg");
    bootsBack.mirror = true;
		
    mask = renderer.createEffect("fiskheroes:model");
		mask.setModel(maskModel.createModel(renderer, "tmf:other/mask", "mask"));
		mask.anchor.set("head");
		mask.setScale(1.01);
		
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x9FA4C2);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(mask);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0x66DCFF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
	
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0x66DCFF, [
        { "firstPerson": [0.0, 4.0, 0.0], "offset": [0.0, 3.0, -2.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

}

function render(entity, renderLayer, isFirstPersonArm) {
        if (!isFirstPersonArm && entity.isWearingFullSuit()) {
            var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
            var opacity = 1 - entity.getInterpolatedData("tmf:dyn/stealth_timer");
            bootsFront.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            bootsFront.speedScale = 0.5 * boost;
            bootsFront.flutter = 1 + boost;
            bootsFront.opacity = opacity;
            
            bootsBack.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            bootsBack.speedScale = 0.5 * boost;
            bootsBack.flutter = 1 + boost;
            bootsBack.opacity = opacity;
    
            var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
            f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
            bootsFront.setSize(2.5 + f * 4, 3.0 - f * 3.9);
            bootsFront.render();
            
            bootsBack.setSize(2.5 + f * 4, 3.0 - f * 3.9);
            bootsBack.render();
        }
	mask.render();
	
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();

	if (entity.isDisplayStand() && entity.world().getBlock(entity.pos().add(0, -1, 0)) == "fiskheroes:titanium_block") {		
		armory.render();
	}

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	
	renderer.removeCustomAnimation("basic.BLOCKING");
	
    addAnimation(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")));
            data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        })
        .priority = -10;
    
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
	
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
	
    addAnimationWithData(renderer, "iron_man_aa.SHIELD", "tmf:other/forcefield_blocking", "fiskheroes:shield_blocking_timer")
        .priority = -8;
		
    addAnimationWithData(renderer, "iron_man_aa.UNIBEAM", "tmf:other/unibeam_charging", "fiskheroes:beam_charge").setCondition(entity => (entity.getData('fiskheroes:beam_charging')))
        .priority = -8;
    
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}