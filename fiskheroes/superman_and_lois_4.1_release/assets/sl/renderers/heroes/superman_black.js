extend("fiskheroes:hero_basic");

loadTextures({
  "layer1": "sl:superman_black_layer1",
  "layer2": "sl:superman_black_layer2",
  "eyes": "sl:eyes",
  "cape": "sl:superman_black_cape",
  "lights": "sl:supercharged_alt2",
  "supercharging": "sl:supercharged_alt2",
  "null": "sl:null"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var speedster = implement("fiskheroes:external/speedster_utils");
var cape;
var supercharged;
var overlay;
var overlay2;
var supercharging;
var glow;

function init(renderer, trailType) {
  parent.init(renderer);
renderer.setTexture((entity, renderLayer) =>
  (renderLayer === "HELMET" && !entity.getData("sl:dyn/suitup>_timer") > 0.5) || (renderLayer === "LEGGINGS" && !entity.getData("sl:dyn/suitup_timer") > 0.5) ? "layer2" : (entity.getData("sl:dyn/suitup_timer") > 0.5 ? "null" : "layer1")
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
  var physics = renderer.createResource("CAPE_PHYSICS", null);
  physics.weight = 1.2;
  physics.maxFlare = 0.8;
  physics.flareDegree = 1.5;
  physics.flareFactor = 1.2;
  physics.flareElasticity = 6;
  physics.setTickHandler(entity => {
    var f = 1 - entity.getData("fiskheroes:flight_timer");
    f = 1 - f * f * f;
    physics.headingAngle = 90 - f * 1;
    physics.restAngle = f * 12;
    physics.restFlare = f * 0.65;
    physics.idleFlutter = 0.15 + 0.25 * f;
    physics.flutterSpeed = f * 0.4;
  });

  cape = capes.createDefault(
    renderer,
    24,
    "fiskheroes:cape_default.mesh.json",
    physics
  );
  cape.effect.texture.set("cape");
  cape.effect.width = 14;

  renderer.bindProperty("fiskheroes:night_vision");

  glow = renderer.createEffect("fiskheroes:glowerlay");
  glow.color.set(0xFFD700);

  utils.bindParticles(renderer, "fiskheroes:black_manta_dceu_eyes").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") < 1 && entity.getData("sl:dyn/absorb"));

  utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFFC000, [
    { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
  ]);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:snow_impact")).setCondition(entity => !entity.getData("sl:dyn/absorb"));

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:chargedfrost")).setCondition(entity => entity.getData("sl:dyn/absorb"));

  utils.bindTrail(renderer, "sl:talrhotrail").setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:speeding") && entity.isSprinting() && !entity.getData("sl:dyn/suitup"));
  utils.bindTrail(renderer, "sl:suitlesstrail").setCondition(entity => !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:speeding") && entity.getData("sl:dyn/suitup"));

  utils.bindTrail(renderer, "sl:superchargedtalrhotrail").setCondition(entity => entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:speeding"));

  utils.bindTrail(renderer, "sl:supercharged").setCondition(entity => entity.getData("fiskheroes:flying") && entity.getData("sl:dyn/absorb") && entity.isSprinting());
  utils.bindTrail(renderer, "sl:supercharged_static").setCondition(entity => entity.getData("sl:dyn/absorb"));
  utils.bindTrail(renderer, "sl:supercharging").setCondition(entity => entity.posY() > 1028 && !entity.isSprinting() && !entity.getData("sl:dyn/absorb") && (entity.world().getDimension() === 0 || entity.world().getDimension() === 2595));

  utils.bindBeam(renderer, "fiskheroes:heat_vision", "sl:superman_heat_vision", "head", 0xFF1F00, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.5, -4.0], "size": [0.9, 0.5] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.5, -4.0], "size": [0.9, 0.5] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => !entity.getData("sl:dyn/absorb"));

  utils.bindBeam(renderer, "fiskheroes:heat_vision", "sl:superman_heat_vision", "head", 0xFF1F00, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.5, -4.0], "size": [1.0, 0.55] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.5, -4.0], "size": [1.0, 0.55] }
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

    var anim = renderer.createResource("ANIMATION", "fiskheroes:speedster_sprint");
    anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    renderer.addCustomAnimation("speedster.SPRINT", anim);

  overlay = renderer.createEffect("fiskheroes:overlay");
  overlay.texture.set(null, "eyes");

  overlay2 = renderer.createEffect("fiskheroes:overlay");
  overlay2.texture.set(null, "eyes");

  supercharged = renderer.createEffect("fiskheroes:overlay");
  supercharged.texture.set(null, "lights");

  supercharging = renderer.createEffect("fiskheroes:overlay");
  supercharging.texture.set(null, "supercharging");

  utils.bindParticles(renderer, "sl:solar_energy").setCondition(entity => entity.getInterpolatedData('sl:dyn/absorb_timer') > 0 && entity.getInterpolatedData('sl:dyn/absorb_timer') < 1);
  utils.bindParticles(renderer, "sl:wave").setCondition(entity => entity.getInterpolatedData('sl:dyn/sboost_timer') > 0 && entity.getInterpolatedData('sl:dyn/sboost_timer') < 1 && entity.getData("sl:dyn/sboost"));
  utils.bindParticles(renderer, "sl:landing_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') > 10 && entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') < 14);
   utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("sl:dyn/sboost_timer") > 0);
   utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0);
   utils.bindParticles(renderer, "sl:chargedboost").setCondition(entity => entity.getData("sl:dyn/sboost2_timer") > 0);
}

function initAnimations(renderer) {
  parent.initAnimations(renderer);

  addAnimationWithData(renderer, "superman.TEST", "sl:test", "sl:dyn/suitup_timer");

  renderer.removeCustomAnimation("basic.AIMING");

  renderer.removeCustomAnimation("basic.ENERGY_PROJ");

  utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

  utils.addFlightAnimation(renderer, "superman.FLIGHT", "sl:superman_arms_forward.anim.json");
  
  addAnimationWithData(renderer, "superman.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").priority = -8;

  utils.addHoverAnimation(renderer, "superman.HOVER", "fiskheroes:flight/idle/neutral");

  addAnimationWithData(renderer, "superman.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer").priority = 10;

  addAnimationWithData(renderer, "superman.ENERGY_CHARGING", "sl:tpose", "sl:dyn/sun_timer");

  addAnimationWithData(renderer, "superman.THUNDER", "sl:thunderclap_charge", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.THUNDERCLAP", "sl:clap", "sl:dyn/clap_timer").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_charging");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.UNCLAP", "sl:clap", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:beam_charging");
  }).priority = -10;

  addAnimationWithData(renderer, "superman.CLAP", "sl:clap", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_shooting");
  });

  addAnimationWithData(renderer, "supermanboosted.FLIGHT", "sl:heil", "sl:dyn/sboost")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost_timer"));
        }).priority = -1;

  addAnimationWithData(renderer, "supermanchargedboosted.FLIGHT", "sl:heil", "sl:dyn/sboost2")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost2_timer"));
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
  if (renderLayer === "CHESTPLATE" || renderLayer === "LEGGINGS" || renderLayer === "HELMET" || renderLayer === "BOOTS") {
    if ((entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_charging")) || (entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_shooting"))) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
    } else if (!entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/absorb")) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    }
    
    if ((entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/absorb")) ||
        (entity.getData("fiskheroes:aiming_timer") > 0.0 && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/absorb"))) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer") + 0.2;
    } else if (!entity.getData("fiskheroes:aiming") && !entity.getData("sl:dyn/absorb")) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    }
    
    overlay.render();
    
    supercharged.opacity = entity.getInterpolatedData("sl:dyn/absorb");
    supercharged.render();
    
    supercharging.opacity = entity.getInterpolatedData("fiskheroes:energy_charge");
    supercharging.render();
    
    glow.opacity = entity.getData('sl:dyn/absorb_timer') > 0 && entity.getData('sl:dyn/absorb_timer') < 1;
    glow.render();
  }
  
   if (renderLayer === "CHESTPLATE" && !entity.getData("sl:dyn/suitup")) {
     cape.render(entity);
   }
}
