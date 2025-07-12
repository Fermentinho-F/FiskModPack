extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/superman/superman_layer1",
    "layer2": "loriatpack:justice_legaue/superman/superman_layer2",
    "cape": "loriatpack:justice_legaue/superman/superman_cape",
    "eyes": "loriatpack:justice_legaue/superman/eyes"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var physics;
var overlay;

function init(renderer) {
    parent.init(renderer);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");

    night_v = renderer.bindProperty("fiskheroes:night_vision");
	night_v.firstPersonOnly = false;

    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 1;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.5;
    physics.flareElasticity = 8;
    physics.setTickHandler(entity => {
        var f = 1 - entity.getData("fiskheroes:beam_charge");
        f = 1 - f * f * f;
        physics.headingAngle = 90 - f * 20;
        physics.restAngle = f * 40;
        physics.restFlare = f * 0.7;
        physics.idleFlutter = 0.15 + 0.25 * f;
        physics.flutterSpeed = f * 0.3;
    });

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("cape");
	cape.effect.width = 14;

    var beam2 = renderer.createResource("BEAM_RENDERER", "loriatpack:breath");
    var beam = renderer.createResource("BEAM_RENDERER", "loriatpack:thund");
    var beam3 = renderer.createResource("BEAM_RENDERER", "loriatpack:heat_vision");
    var color = 0xFF1500;

    utils.bindTrail(renderer, "loriatpack:superman");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "body", 0x87cefa, [
        { "firstPerson": [0.0, 3.0, 0.0], "offset": [0.0, -1.0, 0.0], "size": [1.0, 1.0], "anchor": "Head" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "loriatpack:ice"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:charged_beam", "head", 0xFF1500, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.5, -3.5, -4.0] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.5, -3.5, -4.0] }
	]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", beam, "head", 0xFFFFFF, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, -3.0, -4.0], "size": [6.0, 6.0] }
    ]);  
    utils.bindParticles(renderer, "loriatpack:jump_smoke").setCondition(entity => entity.getInterpolatedData("loriatpack:dyn/jump_cooldown") > 0.4);      
} 


function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimationWithData(renderer, "superman.JUMP_POSE", "loriatpack:superhero_jump", "loriatpack:dyn/jump_cooldown")
        .priority = 1;
    addAnimationWithData(renderer, "basic.ENERGY_PROJ", "loriatpack:thunderclap", "fiskheroes:beam_charge")
    .setCondition(entity => !entity.getData("fiskheroes:beam_charging") || entity.getInterpolatedData("fiskheroes:beam_charge") > 0 && entity.getInterpolatedData("fiskheroes:beam_shooting_timer") > 0);
    
    addAnimation(renderer, "superman.ENERGY_PROJ_CHARGE", "loriatpack:thunderclap_charge")
    .setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:beam_charge")))
    .setCondition(entity => entity.getInterpolatedData("fiskheroes:beam_charge") > 0 
    && entity.getInterpolatedData("fiskheroes:beam_shooting_timer") == 0 && entity.getInterpolatedData("fiskheroes:beam_charging"));
    utils.addFlightAnimation(renderer, "shazam.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "shazam.HOVER", "fiskheroes:flight/idle/default");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" || renderLayer == "HELMET") { 

        overlay.opacity = entity.getInterpolatedData("fiskheroes:heat_vision");
        overlay.render();
		
		
    }
	 if (!isFirstPersonArm) {

            var f = entity.getInterpolatedData("fiskheroes:beam_charge");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
        }
}

