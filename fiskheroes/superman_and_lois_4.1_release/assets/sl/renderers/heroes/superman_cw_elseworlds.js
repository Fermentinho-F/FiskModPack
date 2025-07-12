extend("fiskheroes:hero_basic");

loadTextures({
  "layer1": "sl:superman_cw_elseworlds_layer1",
  "layer2": "sl:superman_cw_elseworlds_layer2",
  "eyes": "sl:superman_eyes",
  "cape": "sl:superman_elseworlds_cape",
  "lights": "sl:supercharged",
  "supercharging": "sl:sun",
  "null": "sl:null",
  "suittexture": "sl:superman_suit_texture",
  "ksickness": "sl:kryptonite_sickness"
});

var kutils = implement("sl:external/kryptonian_utils");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var speedster = implement("fiskheroes:external/speedster_utils");
var cape;
var supercharged;
var overlay;
var overlay2;
var supercharging;
var glow;
var ksickness;

function init(renderer, trailType) {
  parent.init(renderer);
renderer.setTexture((entity, renderLayer) =>
  (renderLayer === "HELMET" && !entity.getData("sl:dyn/suitup_timer") > 0.5) || (renderLayer === "LEGGINGS" && !entity.getData("sl:dyn/suitup")) ? "layer2" : (entity.getData("sl:dyn/suitup") ? "null" : "layer1")
);


  renderer.showModel(
    "CHESTPLATE",
    "head",
    "headwear",
    "body",
    "rightArm",
    "leftArm"
  );
}

function initEffects(renderer) {
kutils.initEffects(renderer);
var physics = renderer.createResource("CAPE_PHYSICS", null);
physics.weight = 1.2;
physics.maxFlare = 0.8;
physics.flareDegree = 1.5;
physics.flareFactor = 1.2;
physics.flareElasticity = 6;
physics.setTickHandler(entity => {
  var f = 1 - entity.getData("fiskheroes:flight_timer");
  var b = entity.getData("fiskheroes:energy_projection_timer");
  f = 1 - f * f * f;
  var restAngle = entity.getData("fiskheroes:flying") ? f* 1.5 : b * 12; // Conditionally set restAngle
  physics.headingAngle = 90 - f * 1;
  physics.restAngle = restAngle; // Set restAngle based on condition
  physics.restFlare = (f * 0.45) + 0.2;
  physics.idleFlutter = 0.15 + 0.20 * f;
  physics.flutterSpeed = f * 0.4;
});

  renderer.bindProperty("fiskheroes:night_vision");

  cape = capes.createDefault(
    renderer,
    24,
    "fiskheroes:cape_default.mesh.json",
    physics
  );
  cape.effect.texture.set("cape");
  cape.effect.width = 14;

  glow = renderer.createEffect("fiskheroes:glowerlay");
  glow.color.set(0xFFD700);

  utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFFC000, [
    { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
  ]);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xFFFFFF, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:snow_impact_1")).setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:gravity_amount") > -0.25 && entity.getData("fiskheroes:gravity_amount") <= 0.25);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath_1", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_1")).setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:gravity_amount") > 0.25 && entity.getData("fiskheroes:gravity_amount") <= 0.5);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath_2", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_3")).setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:gravity_amount") > 0.5 && entity.getData("fiskheroes:gravity_amount") <= 0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0x8F9194, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:super_breath_impact_3")).setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:gravity_amount") > 0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:snow_impact_1")).setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:gravity_amount") <= -0.25 && entity.getData("fiskheroes:gravity_amount") > -0.50);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:snow_impact_2")).setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:gravity_amount") <= -0.5 && entity.getData("fiskheroes:gravity_amount") >= -0.75);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath_3", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:chargedfrost")).setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:gravity_amount") < -0.75);

  utils.bindTrail(renderer, "sl:talrhotrail").setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:speeding") && entity.isSprinting() && !entity.getData("sl:dyn/suitup"));

  utils.bindTrail(renderer, "sl:suitlesstrail").setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:speeding") && entity.getData("sl:dyn/suitup"));

  utils.bindTrail(renderer, "sl:supercharged").setCondition(entity => entity.getData("fiskheroes:flying") && entity.getData("sl:dyn/absorb") && entity.isSprinting());
  utils.bindTrail(renderer, "sl:supercharged_static").setCondition(entity => entity.getData("sl:dyn/absorb"));
  utils.bindTrail(renderer, "sl:supercharging").setCondition(entity => entity.posY() > 1028 && !entity.isSprinting() && !entity.getData("sl:dyn/absorb") && (entity.world().getDimension() === 0 || entity.world().getDimension() === 2595));

  utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0x22BFFF, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.25, -4.0], "size": [0.8, 0.5] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.25, -4.0], "size": [0.8, 0.5] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => !entity.getData("sl:dyn/absorb"));

  utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0x22BFFF, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.25, -4.0], "size": [1.0, 0.55] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.25, -4.0], "size": [1.0, 0.55] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sl:dyn/absorb"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:sonic_beam", "body", 0xD3D3D3, [
        { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -3.0, -4.0], "size": [15.0, 15.0] }
    ]).setCondition(entity => !entity.getData("sl:dyn/absorb"));

  utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "head", 0xFF1200, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.5, -4.0], "size": [1.9, 1.5] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.5, -4.0], "size": [1.9, 1.5] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("sl:dyn/absorb"));

  utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
  utils.addCameraShake(renderer, 0.020, 1.2, "sl:dyn/sboost");
  utils.addCameraShake(renderer, 0.025, 1.3, "sl:dyn/sboost2");
  utils.addCameraShake(renderer, 0.05, 2.0, "fiskheroes:beam_shooting_timer");

    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var speed = entity.getData("fiskheroes:speed");
        shake.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

var shake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    var landingTimer = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
    var factor = landingTimer > 0 ? 2 * landingTimer : 0;
    shake2.factor = factor > 0 ? factor : 0;
    return true;
});

shake2.intensity = 0.1; // Initial intensity set to 0.1

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


    var anim = renderer.createResource("ANIMATION", "fiskheroes:speedster_sprint");
    anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    renderer.addCustomAnimation("speedster.SPRINT", anim);

  ksickness = renderer.createEffect("fiskheroes:overlay");
  ksickness.texture.set(null, "ksickness");

  overlay = renderer.createEffect("fiskheroes:overlay");
  overlay.texture.set(null, "eyes");

  overlay2 = renderer.createEffect("fiskheroes:overlay");
  overlay2.texture.set(null, "eyes");

  supercharged = renderer.createEffect("fiskheroes:overlay");
  supercharged.texture.set(null, "lights");

  supercharging = renderer.createEffect("fiskheroes:overlay");
  supercharging.texture.set(null, "supercharging");

  utils.bindParticles(renderer, "sl:cold_breath_head").setCondition(entity => entity.getData("fiskheroes:energy_projection") && entity.getData("fiskheroes:gravity_amount") < 0);
  utils.bindParticles(renderer, "sl:super_breath_head").setCondition(entity => entity.getData("fiskheroes:energy_projection") && entity.getData("fiskheroes:gravity_amount") > 0);
  utils.bindParticles(renderer, "sl:landing_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') > 10 && entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') < 14);
   utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("sl:dyn/sboost_timer") > 0);
   utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0);
  utils.bindParticles(renderer, "sl:wave").setCondition(entity => entity.getInterpolatedData('sl:dyn/sboost_timer') > 0 && entity.getInterpolatedData('sl:dyn/sboost_timer') < 1 && entity.getData("sl:dyn/sboost"));
}

function initAnimations(renderer) {
  parent.initAnimations(renderer);

  renderer.removeCustomAnimation("basic.AIMING");

  renderer.removeCustomAnimation("basic.ENERGY_PROJ");

  utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive").priority = 1;

  utils.addFlightAnimation(renderer, "superman.FLIGHT", "sl:superman_arms_forward.anim.json");
  
  addAnimationWithData(renderer, "superman.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").priority = 10;

  addAnimationWithData(renderer, "superman.SOFTLAND", "sl:soft_landing", "sl:dyn/soft_landing_timer").priority = 10;

  utils.addHoverAnimation(renderer, "superman.HOVER", "fiskheroes:flight/idle/neutral");

  addAnimationWithData(renderer, "superman.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer").priority = 10;

  addAnimationWithData(renderer, "superman.ENERGY_CHARGING", "sl:tpose", "sl:dyn/sun_timer");

  addAnimationWithData(renderer, "superman.THUNDER", "sl:thunderclap_charge", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.THUNDER2", "sl:tpose", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && !entity.getData("sl:dyn/clap_animation_cooldown") && entity.getData("fiskheroes:beam_shooting");
  }).priority = 10;

addAnimation(renderer, "superman.THUNDERCLAP", "sl:clap")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sl:dyn/clap_timer"));
        data.load(1, entity.getInterpolatedData("sl:dyn/clap_timer"));
    })
    .setCondition(entity => {
        return !entity.getData("sl:dyn/absorb");
    })
    .priority = 10;

  addAnimationWithData(renderer, "superman.UNCLAP", "sl:clap", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/clap_animation_cooldown");
  }).priority = -10;

addAnimationWithData(renderer, "superman.BREATH", "sl:breath_anim", "fiskheroes:energy_projection_timer").priority = 10;

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

  addAnimationWithData(renderer, "superman.TEST", "sl:spintest", "sl:dyn/suitup_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
  if (renderLayer === "CHESTPLATE" || renderLayer === "LEGGINGS" || renderLayer === "HELMET" || renderLayer === "BOOTS") {
    if ((entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_charging")) || 
        (entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_shooting"))) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
    } else if (!entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/absorb")) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    }

    if ((entity.getData("sl:dyn/heat_vision") && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/absorb")) ||
        (entity.getData("sl:dyn/heat_vision_charge") > 0.0 && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/absorb"))) {
      overlay.opacity = entity.getInterpolatedData("sl:dyn/heat_vision_charge");
    } else if (!entity.getData("sl:dyn/heat_vision") && !entity.getData("sl:dyn/absorb")) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    }

    overlay.render();

    ksickness.opacity = entity.getInterpolatedData("sl:dyn/kryptonite_sickness_timer");
    ksickness.render();

    supercharged.opacity = entity.getInterpolatedData("sl:dyn/absorb");
    supercharged.render();

    supercharging.opacity = entity.getInterpolatedData("fiskheroes:energy_charge");
    supercharging.render();
  }

  if (renderLayer === "CHESTPLATE") {
    cape.render(entity);
  }
}
