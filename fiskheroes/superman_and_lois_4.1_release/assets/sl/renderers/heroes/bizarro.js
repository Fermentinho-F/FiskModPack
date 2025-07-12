extend("fiskheroes:hero_basic");
loadTextures({
  "layer1": "sl:bizarro_layer1",
  "layer2": "sl:bizarro_layer2",
  "eyes": "sl:bizarro_lights_layer1",
  "cape": "sl:superman_cape",
  "pendant": "sl:pendant",
  "pendantlights": "sl:pendant_lights",
  "lights": "sl:supercharged_inverse",
  "supercharging": "sl:superchargedlights1_inverse.tx.json",
  "ksickness": "sl:xkryptonite_sickness"
});

var kutils = implement("sl:external/kryptonian_utils");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var beam;
var beam2;
var beam3;
var speedster = implement("fiskheroes:external/speedster_utils");
var cape;
var supercharged;
var overlay;
var supercharging;
var supercharging2;
var glow;
var overlay2;
var ksickness;
var boobas;
var breathebeam;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" ? "eyes" : null);

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg", "body");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
//regular

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath_1", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") > 0.25 && entity.getData("sl:dyn/heat_breath_level") <= 0.5);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath_2", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_3")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") > 0.5 && entity.getData("sl:dyn/heat_breath_level") <= 0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_3")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") > 0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:heat_breath_1", "head", 0xFF4600, [
    { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:flame_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") <= -0.25 && entity.getData("sl:dyn/heat_breath_level") > -0.50 && entity.getData("sl:dyn/heat_breath_charge") > 0);;

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:heat_breath_1", "head", 0xFF4600, [
    { "firstPerson": [0.0, 1.2, 0.0], "offset": [0.0, -1.2, -7.5], "size": [1.8, 1.2] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:flame_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") <= -0.5 && entity.getData("sl:dyn/heat_breath_level") >= -0.75 && entity.getData("sl:dyn/heat_breath_charge") > 0);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:heat_breath_3", "head", 0xFF4600, [
    { "firstPerson": [0.0, 2.5, 0.0], "offset": [0.0, -1.2, -7.5], "size": [1.5, 1.0] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:flame_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") < -0.75 && entity.getData("sl:dyn/heat_breath_charge") > 0);

// fix

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:heat_breath_1", "head", 0xFF4600, [
    { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:flame_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") < 0.25 && entity.getData("sl:dyn/heat_breath_level") > -0.25 && entity.getData("sl:dyn/prev_heat_breath_level") == 0 && entity.getData("sl:dyn/oxygen") > 0.8 && entity.getData("sl:dyn/heat_breath_charge") > 0.5);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:heat_breath_1", "head", 0xFF4600, [
    { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:flame_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") < 0.25 && entity.getData("sl:dyn/heat_breath_level") > -0.25 && entity.getData("sl:dyn/prev_heat_breath_level") < 0 && entity.getData("sl:dyn/heat_breath_charge") > 0.5);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") < 0.25 && entity.getData("sl:dyn/heat_breath_level") > -0.25 && entity.getData("sl:dyn/prev_heat_breath_level") >= 0);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_1")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && !entity.getData("sl:dyn/heat_breath_level") == 0 && entity.getData("sl:dyn/prev_heat_breath_level") == 0 || (!entity.getData("sl:dyn/heat_breath_charge") && entity.getData("sl:dyn/heat_breath_level") < 0));

//supercharged

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xFFFFFF, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:snow_impact_1")).setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") > 0 && entity.getData("sl:dyn/heat_breath_level") <= 0.25);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_3")).setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") > 0.25 && entity.getData("sl:dyn/heat_breath_level") <= 0.5);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_3")).setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") > 0.5 && entity.getData("sl:dyn/heat_breath_level") <= 0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_3")).setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") > 0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:snow_impact_2")).setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") <= 0 && entity.getData("sl:dyn/heat_breath_level") >= -0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath_3", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:chargedfrost")).setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/heat_breath_level") < -0.75);

kutils.initEffects(renderer);
    pendant = renderer.createEffect("fiskheroes:model");
    pendant.setModel(utils.createModel(renderer, "sl:ege", "pendant", "pendantlights"));
    pendant.anchor.set("body");
    pendant.setOffset(-0.3, 0.0, -2.0).setScale(0.3);

var physics = renderer.createResource("CAPE_PHYSICS", null);
physics.weight = 1.2;
physics.maxFlare = 0.8;
physics.flareDegree = 1.5;
physics.flareFactor = 1.2;
physics.flareElasticity = 6;
physics.setTickHandler(entity => {
  var f = 1 - entity.getData("fiskheroes:flight_timer");
  var b = entity.getData("sl:dyn/heat_breath_timer");
  f = 1 - f * f * f;
  var restAngle = entity.getData("fiskheroes:flying") ? f* 1.5 : b * 12;
  physics.headingAngle = 90 - f * 1;
  physics.restAngle = restAngle;
  physics.restFlare = (f * 0.45) + 0.2;
  physics.idleFlutter = 0.15 + 0.20 * f;
  physics.flutterSpeed = f * 0.4;
});

    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;

    renderer.bindProperty("fiskheroes:night_vision").firstPersonOnly = true;

  glow = renderer.createEffect("fiskheroes:glowerlay");
  glow.color.set(0xFF0000);

  utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF0000, [
    { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
  ]);

  utils.bindTrail(renderer, "sl:kryptoniantrail").setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("fiskheroes:speeding") && entity.isSprinting());
  utils.bindTrail(renderer, "sl:kryptoniantrail").setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("fiskheroes:speeding"));

  utils.bindTrail(renderer, "sl:supercharged_inverse").setCondition(entity => entity.getData("fiskheroes:flying") && entity.getData("sl:dyn/inverseabsorb"));
  utils.bindTrail(renderer, "sl:supercharged_static_inverse").setCondition(entity => entity.getData("sl:dyn/inverseabsorb"));
  utils.bindTrail(renderer, "sl:supercharging_inverse").setCondition(entity => entity.posY() > 1028 && !entity.isSprinting() && !entity.getData("sl:dyn/inverseabsorb") && entity.world().getDimension() === -1);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sl:normalheatvision", "head", 0xADD8E6, [
        { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:icev_impact")).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0xADD8E6, [
        { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.5, -4.0], "size": [0.8, 0.5] },
        { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.5, -4.0], "size": [0.8, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:icev_impact")).setCondition(entity => entity.getData("sl:dyn/inverseabsorb"));

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");

    breathebeam = utils.createLines(renderer, ("BEAM_RENDERER", "fiskheroes:mysterio_beam"), 0x4A8D4B, [
        {"start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [12.0, 4.0]},
    ]);
    breathebeam.setOffset(0.0, -4.0, -3.5)
    breathebeam.setScale(3.0, 3.0, 3.0)
    breathebeam.anchor.set("head");

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:heat_breath_1", "head", 0xFF4600, [
        { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:flame_impact_1")).setCondition(entity => entity.getData("sl:dyn/bizarroprofile"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:sonic_beam", "body", 0xD3D3D3, [
        { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -3.0, -4.0], "size": [15.0, 15.0] }
    ]).setCondition(entity => !entity.getData("sl:dyn/inverseabsorb"));

    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var speed = entity.getData("fiskheroes:speed");
        shake.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")) : 0;
        return false;
    });
    shake.intensity = 0.15;

var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    var landingTimer = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
    var factor = landingTimer > 0 ? 2 * landingTimer : 0;
    shake2.factor = factor > 0 ? factor : 0;
    return true;
});

shake2.intensity = 0.1;

function updateIntensity() {
    var landingTimer = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
    var intensity = 0.1 - (0.1 * landingTimer); // Gradually decrease the intensity as the landing timer progresses
    shake2.intensity = intensity > 0 ? intensity : 0;
}

var shake3 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    var landingTimer2 = entity.getInterpolatedData("sl:dyn/soft_landing_timer");
    var factor2 = landingTimer2 > 0 ? 1 * landingTimer2 : 0;
    shake3.factor = factor2 > 0 ? factor2 : 0;
    return true;
});

shake3.intensity = 0.05; // Initial intensity set to 0.05

function updateIntensity() {
    var landingTimer2 = entity.getInterpolatedData("sl:dyn/soft_landing_timer");
    var maxIntensity = 0.05; // Set the maximum intensity
    var minIntensity = 0.01; // Set the minimum intensity
    var intensity2 = maxIntensity - (maxIntensity - minIntensity) * landingTimer2; // Gradually decrease the intensity as the landing timer progresses
    shake3.intensity = intensity2 > minIntensity ? intensity2 : minIntensity;
}

  ksickness = renderer.createEffect("fiskheroes:overlay");
  ksickness.texture.set(null, "ksickness");

    beam = utils.createLines(renderer, ("BEAM_RENDERER", "fiskheroes:mysterio_beam"), 0xFF1200, [
        {"start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [12.0, 4.0]},
    ]);
    beam.setOffset(0.0, -4.0, -3.5)
    beam.setScale(3.0, 4.0, 3.0)
    beam.anchor.set("head");

    beam2 = utils.createLines(renderer, ("BEAM_RENDERER", "sl:shock_beam"), 0x023FB8, [
        {"start": [0, 0.5, 0], "end": [0.0, 1.0, -2.0], "size": [8.5, 2.5]},
    ]);
    beam2.setOffset(0.0, -3.0, -4.5)
    beam2.setScale(3.0, 3.0, 3.0)
    beam2.anchor.set("head");

    beam3 = utils.createLines(renderer, ("BEAM_RENDERER", "sl:shock_beam"), 0x026FB8, [
        {"start": [0, 0.5, 0], "end": [0.0, 1.0, -2.0], "size": [6.5, 2.5]},
    ]);
    beam3.setOffset(0.0, -3.0, -4.5)
    beam3.setScale(3.0, 2.5, 2.5)
    beam3.anchor.set("head");

    inhalerglow = utils.createLines(renderer, ("BEAM_RENDERER", "sl:shock_beam"), 0x4A8D4B, [
        {"start": [0, 0, 0], "end": [0.0, -0.5, 3.0], "size": [6.5, 2.5]},
    ]);
    inhalerglow.setOffset(1.12, 8.5, -4.5)
    inhalerglow.setScale(1.5, 1.5, 1.5)
    inhalerglow.anchor.set("rightArm");

    pendantglow = utils.createLines(renderer, ("BEAM_RENDERER", "sl:shock_beam"), 0x00008B, [
        {"start": [0, 0, 0], "end": [0.0, -0.5, 0.0], "size": [6.5, 2.5]},
    ]);
    pendantglow.setOffset(0.0, 4.0, -2.0)
    pendantglow.setScale(3.0, 3.0, 3.0)
    pendantglow.anchor.set("body");

    pendantglow2 = utils.createLines(renderer, ("BEAM_RENDERER", "sl:shock_beam"), 0xA020F0, [
        {"start": [0, 0, 0], "end": [0.0, -0.5, 0.0], "size": [6.5, 2.5]},
    ]);
    pendantglow2.setOffset(0.0, 4.0, -2.0)
    pendantglow2.setScale(3.0, 3.0, 3.0)
    pendantglow2.anchor.set("body");

  overlay2 = renderer.createEffect("fiskheroes:overlay");
  overlay2.texture.set(null, "eyes");

  supercharged = renderer.createEffect("fiskheroes:overlay");
  supercharged.texture.set(null, "lights");

  supercharging = renderer.createEffect("fiskheroes:overlay");
  supercharging.texture.set(null, "supercharging");

  supercharging2 = renderer.createEffect("fiskheroes:overlay");
  supercharging2.texture.set(null, "supercharging");

  var anim = renderer.createResource("ANIMATION", "fiskheroes:speedster_sprint");
  anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
  renderer.addCustomAnimation("speedster.SPRINT", anim);

  utils.bindParticles(renderer, "sl:super_breath_head").setCondition(entity => entity.getData("fiskheroes:energy_projection") && entity.getData("fiskheroes:gravity_amount") > 0);
  utils.bindParticles(renderer, "sl:redsolar_energy").setCondition(entity => entity.getInterpolatedData('sl:dyn/inverseabsorb_timer') > 0 && entity.getInterpolatedData('sl:dyn/inverseabsorb_timer') < 1);
  utils.bindParticles(renderer, "sl:wave").setCondition(entity => entity.getInterpolatedData('sl:dyn/sboost_timer') > 0 && entity.getInterpolatedData('sl:dyn/sboost_timer') < 1 && entity.getData("sl:dyn/sboost"));
  utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("sl:dyn/sboost_timer") > 0);
  utils.bindParticles(renderer, "sl:chargedboost_red").setCondition(entity => entity.getData("sl:dyn/sboost2_timer") > 0)
  utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0);
  utils.bindParticles(renderer, "sl:landing_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') > 10 && entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') < 14);
    
  utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
  utils.addCameraShake(renderer, 0.020, 1.2, "sl:dyn/sboost");
  utils.addCameraShake(renderer, 0.025, 1.3, "sl:dyn/sboost2");
  utils.addCameraShake(renderer, 0.05, 2.0, "fiskheroes:beam_shooting_timer");

}

function initAnimations(renderer) {
  parent.initAnimations(renderer);

  renderer.removeCustomAnimation("basic.AIMING");

  renderer.removeCustomAnimation("basic.ENERGY_PROJ");

  utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive").priority = 1;

  utils.addFlightAnimation(renderer, "superman.FLIGHT", "sl:superman_arms_forward.anim.json");

  addAnimation(renderer, "bizarro.POSE", "sl:bizarro_pose").setData((entity, data) => data.load(0.5 - entity.getData("fiskheroes:flight_timer") / 2))
  .priority = -10;
  
  addAnimationWithData(renderer, "superman.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").priority = 10;

  addAnimationWithData(renderer, "superman.SOFTLAND", "sl:soft_landing", "sl:dyn/soft_landing_timer").priority = 10;

  addAnimationWithData(renderer, "bizarro.USE", "sl:inhale", "sl:dyn/kryptonite_timer").setCondition(entity => { 
    return entity.getData("sl:dyn/kryptonite_cooldown") < 0.5 && entity.getData("sl:dyn/kryptonite");
  }).priority = 10;

  utils.addHoverAnimation(renderer, "superman.HOVER", "fiskheroes:flight/idle/neutral");

  addAnimationWithData(renderer, "superman.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer").priority = 10;

  addAnimationWithData(renderer, "superman.ENERGY_CHARGING", "sl:tpose", "sl:dyn/sun_timer");

  addAnimationWithData(renderer, "bizarro.GLITCH", "sl:bizarro_glitch", "sl:dyn/speedup_timer")
        .setData((entity, data) => {
            data.load(1, entity.getInterpolatedData("sl:dyn/speedup_timer"));
        });

  addAnimationWithData(renderer, "superman.THUNDER", "sl:thunderclap_charge", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/inverseabsorb");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.THUNDER2", "sl:tpose", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/inverseabsorb") && !entity.getData("sl:dyn/clap_animation_cooldown") && entity.getData("fiskheroes:beam_shooting");
  }).priority = 10;

addAnimation(renderer, "superman.THUNDERCLAP", "sl:clap")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sl:dyn/clap_timer"));
        data.load(1, entity.getInterpolatedData("sl:dyn/clap_timer"));
    })
    .setCondition(entity => {
        return !entity.getData("sl:dyn/inverseabsorb");
    })
    .priority = 10;

  addAnimationWithData(renderer, "superman.UNCLAP", "sl:clap", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/inverseabsorb") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/clap_animation_cooldown");
  }).priority = -10;

addAnimationWithData(renderer, "superman.BREATH", "sl:breath_anim", "sl:dyn/heat_breath_timer").priority = 10;

addAnimationWithData(renderer, "superman.BREATH2", "sl:leaning", "sl:dyn/steelchargedata")
    .setCondition(entity => {
        return !entity.isSneaking();
    })
    .priority = 10;

  addAnimationWithData(renderer, "supermanboosted.FLIGHT", "sl:heil", "sl:dyn/sboost")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost_timer"));
        }).priority = -1;

  addAnimationWithData(renderer, "supermanchargedboosted.FLIGHT", "sl:heil", "sl:dyn/sboost2")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost2_timer"));
        });

addAnimationWithData(renderer, "superman.TEST", "sl:spintest", "sl:dyn/suitup_timer").setCondition(entity => {
    return entity.getEquipmentInSlot(3).nbt().getString('HeroType') !== 'sl:superman/black2';
});

addAnimationWithData(renderer, "talrho.SUITUP", "sl:test", "sl:dyn/suitup_timer").setCondition(entity => {
    return entity.getEquipmentInSlot(3).nbt().getString('HeroType') === 'sl:superman/black2';
});

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getEquipmentInSlot(1).nbt().getBoolean("isgay") && !entity.getData("sl:dyn/inverseabsorb")) {
    boobas.render();
    }

  if (renderLayer === "CHESTPLATE" || renderLayer === "LEGGINGS" || renderLayer === "HELMET" || renderLayer === "BOOTS") {
    overlay2.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer");
    overlay2.render();
    glow.opacity = entity.getData('sl:dyn/inverseabsorb_timer') > 0 && entity.getData('sl:dyn/inverseabsorb_timer') < 1;
    glow.render();
  }

  if (renderLayer === "CHESTPLATE") {
      cape.render(entity);
      breathebeam.opacity = entity.getInterpolatedData("sl:dyn/inhaler_breathe_timer") - 0.2;
      breathebeam.render();
  }
  
  if (entity.getData("sl:dyn/heat_breath_level") < -0.5 && entity.getData("sl:dyn/heat_breath_charge") == 1) {
      beam.opacity = 0;
      beam.render();
    } else {
      beam.opacity = entity.getInterpolatedData("sl:dyn/heat_breath_charge");
      beam.render();
  }

if (entity.getData("sl:dyn/heat_breath_level") < -0.75) {
    beam2.opacity = entity.getData("fiskheroes:energy_projection_timer") / 3;
    beam2.render();
} else if (entity.getData("sl:dyn/heat_breath_level") <= -0.5 && entity.getData("sl:dyn/heat_breath_level") > -0.75) {
    beam3.opacity = entity.getData("fiskheroes:energy_projection_timer") / 4;
    beam3.render();
}

    ksickness.opacity = entity.getInterpolatedData("sl:dyn/kryptonite_sickness_timer");
    ksickness.render();

    if (entity.getData("sl:dyn/inverseabsorb")) {
    supercharged.opacity = entity.getInterpolatedData("sl:dyn/inverseabsorb") / 2;
    supercharged.render();
    } else {
    supercharged.opacity = entity.getInterpolatedData("fiskheroes:energy_charge") / 2;
    supercharged.render();
    }

    supercharging.opacity = entity.getInterpolatedData("fiskheroes:energy_charge");
    supercharging.render();

    if (entity.getData("sl:dyn/inverseabsorb")) {
      supercharging2.opacity = (entity.getData("sl:dyn/light"));
      supercharging2.render();
    } else {
      supercharging2.opacity = 0;
    }
}
