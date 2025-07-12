extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/cyborg/cyborg_layer1",
    "layer2": "loriatpack:justice_legaue/cyborg/cyborg_layer2",
	"layer3": "loriatpack:justice_legaue/cyborg/canon",
    "eyes": "loriatpack:justice_legaue/cyborg/eyes",
    "lights_layer1": "loriatpack:justice_legaue/cyborg/cyborg_light_layer1",
	"lights_layer2": "loriatpack:justice_legaue/cyborg/cyborg_light_layer2",
	"cannon_inner": "fiskheroes:iron_man_mk50_cannon_inner",
	"cannon1": "loriatpack:justice_legaue/cyborg/cyborg_crab1",
    "cannon2": "loriatpack:justice_legaue/cyborg/cyborg_crab2",
    "cannon1_lights": "fiskheroes:iron_man_mk50_cannon1_lights",
    "cannon2_lights": "fiskheroes:iron_man_mk50_cannon2_lights",
	"jetpack": "loriatpack:justice_legaue/cyborg/back_jet_cyborg",
    "jetpack_lights": "loriatpack:justice_legaue/cyborg/back_jet_cyborg_light",
	"bacpack": "loriatpack:justice_legaue/cyborg/backpack_cyborg",
    "bacpack_lights": "loriatpack:justice_legaue/cyborg/backpack_cyborg_light"
});

var utils = implement("fiskheroes:external/utils");
var boosters2;
var boots_booster = implement("loriatpack:external/boots_booster");
var glow;
var metal_heat;
var beam_canon;
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");
var cannon;

var falcon_boosters = implement("fiskheroes:external/falcon_boosters");
var jetpack;
var boosters;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "lights_layer2" : renderLayer != "BOOTS" ? "lights_layer1" : null);
}

function initEffects(renderer) {
	night_v = renderer.bindProperty("fiskheroes:night_vision");
    night_v.firstPersonOnly = false;
	
	jetpack = renderer.createEffect("fiskheroes:model");
    jetpack.setModel(utils.createModel(renderer, "loriatpack:backpack_cyborg", "bacpack", "bacpack_lights"));
    jetpack.anchor.set("body");
	
	boosters = initBoosters(renderer, utils, falcon_boosters);
	 
	beam_canon = renderer.createEffect("fiskheroes:model");
    beam_canon.setModel(utils.createModel(renderer, "loriatpack:canon", "layer3", null));
    beam_canon.anchor.set("rightArm");
    beam_canon.setRotation(90, 0, 180);
	beam_canon.setScale(0.6);
	beam_canon.setOffset(1.3, 12.0, 6.0);
	
	cannon = mk50_cannon.create(renderer, "rightArm", 0x00ACFF);
	
	eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set(null, "eyes");
	
	glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xffffff);
	utils.bindParticles(renderer, "fiskheroes:harbinger_glow");
	
	boosters2 = boots_booster.create(renderer, "fiskheroes:blue_fire_layer_%s", true);
	
	metal_heat = renderer.createEffect("fiskheroes:metal_heat");
	
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x00bfff);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.5);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.35;
        return true;
    });
	
	utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "loriatpack:ray", "rightArm", 0xce1414, [
        { "firstPerson": [-8.0, 8.0, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
	
	utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0xce1414, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
	
	utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xce1414, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function initBoosters(renderer, utils, falcon_boosters) {
    utils.bindParticles(renderer, "fiskheroes:falcon").setCondition(entity => entity.getData("fiskheroes:flying"));
    return falcon_boosters.create(renderer, 0x0033FF, "fiskheroes:blue_fire_layer_%s", {
        boosters: [
            { anchor: "body", offset: [0.0, 4.25, 2.6], size: [1.75, 3.0] },
            { anchor: "body", offset: [1.0, 4.25, 2.6], size: [1.5, 2.0], mirror: true }
        ],
        bloom: [
            { anchor: "body", offset: [0.0, 4.25, 2.6], size: [3.0, 1.75, 5.5] }
        ]
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");
	addAnimationWithData(renderer, "beam.AIMING", "loriatpack:aiming_fpcorr_cyborg", "fiskheroes:beam_charge");
	renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "basic.BLOCKING", "fiskheroes:aiming", "fiskheroes:shield_blocking_timer").priority = -5;
	utils.addHoverAnimation(renderer, "atom.HOVER", "fiskheroes:flight/idle/default_back");
    utils.addFlightAnimation(renderer, "atom.FLIGHT", "fiskheroes:flight/propelled.anim.json");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    beam_canon.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
	beam_canon.render();
	cannon.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));
	
    if (renderLayer == "CHESTPLATE") {
	jetpack.render();
	}
	
	boosters.render(entity); 
	
    if (!isFirstPersonArm) {
		boosters2.render(entity, renderLayer, isFirstPersonArm, false);
    }
	glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();
	metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
	function render(entity, renderLayer, isFirstPersonArm) {
        if (!isFirstPersonArm && renderLayer == "CHESTPLATE" || renderLayer == "HELMET") { 
    
            eyes.opacity = entity.getInterpolatedData("fiskheroes:heat_vision_timer");
            eyes.render();
        }
    }
}
