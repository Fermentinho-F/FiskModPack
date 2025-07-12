extend("fiskheroes:hero_basic");

loadTextures({
  "chest": "sl:talrho_layer1",
  "pants": "sl:talrho_layer2",
  "boots": "sl:talrho_boots",
  "eyes": "sl:eyes",
  "lights": "sl:eradicator_logo_glow",
  "supercharging": "sl:eradicator_logo_glow",
  "coat": "sl:sagecoat",
  "null": "sl:null",
  "suittexture": "sl:superman_suit_texture"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var speedster = implement("sl:external/speedster_utils");
var cape;
var supercharged;
var overlay;
var overlay2;
var supercharging;
var supercharging2;
var glow;
var coat;
var suit;

function init(renderer, trailType) {
    parent.init(renderer);

    renderer.setItemIcon("LEGGINGS", "talrho_2");
    renderer.setItemIcon("BOOTS", "talrho_3");

    renderer.setTexture((entity, renderLayer) => {
        if (!entity.getData("sl:dyn/suitup")) {
            if (renderLayer == "CHESTPLATE") {
                return "chest";
            } else if (renderLayer == "LEGGINGS") {
                return "pants";
            } else {
                return "boots";
            }
        }
        return "null";
    });

    renderer.showModel("CHESTPLATE", "head", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
}

function initEffects(renderer) {

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x99FFFF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.5);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.20;
        return true;
    });

    var dome = renderer.bindProperty("fiskheroes:shadowdome");
    
    dome.texture.set("null")

    var solarflareshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData("sl:dyn/eradicator") && entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0));
    solarflareshake.factor = 0.15;

    suit = renderer.createEffect("fiskheroes:model");
    suit.setModel(utils.createModel(renderer, "sl:suit", "suit", "null"));
    suit.anchor.set("rightArm");
    suit.setOffset(0.0, 0.0, 0.0).setScale(1.0);

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

  renderer.bindProperty("fiskheroes:night_vision").firstPersonOnly = true;

  cape = capes.createDefault(
    renderer,
    24,
    "fiskheroes:cape_default.mesh.json",
    physics
  );
  cape.effect.texture.set("cape");
  cape.effect.width = 14;

  utils.bindParticles(renderer, "fiskheroes:black_manta_dceu_eyes").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") < 1 && entity.getData("sl:dyn/eradicator"));

  utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFFC000, [
    { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
  ]);

  utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:breath", "head", 0xADD8E6, [
    { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.2, -4.0], "size": [1.2, 0.7] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:snow_impact")).setCondition(entity => !entity.getData("sl:dyn/eradicator"));

utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:eradicator_beam", "rightArm", 0x99FFFF, [
    { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5] },
    { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5], "anchor": "leftArm" }
]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:eradicator_impact")).setCondition(entity => entity.getData("sl:dyn/eradicator"));

  utils.bindTrail(renderer, "sl:talrhotrail").setCondition(entity => !entity.getData("sl:dyn/eradicator") && entity.getData("fiskheroes:speeding") && entity.isSprinting() && !entity.getData("sl:dyn/suitup"));

  utils.bindTrail(renderer, "sl:suitlesstrail").setCondition(entity => !entity.getData("sl:dyn/eradicator") && entity.getData("fiskheroes:speeding") && entity.getData("sl:dyn/suitup"));

  utils.bindTrail(renderer, "sl:superchargedtalrhotrail").setCondition(entity => entity.getData("sl:dyn/eradicator") && entity.getData("fiskheroes:speeding"));

  utils.bindTrail(renderer, "sl:supercharged").setCondition(entity => entity.getData("fiskheroes:flying") && entity.getData("sl:dyn/eradicator") && entity.isSprinting());
  utils.bindTrail(renderer, "sl:supercharged_static").setCondition(entity => entity.getData("sl:dyn/eradicator"));
  utils.bindTrail(renderer, "sl:supercharging").setCondition(entity => entity.posY() > 1028 && !entity.isSprinting() && !entity.getData("sl:dyn/eradicator") && (entity.world().getDimension() === 0 || entity.world().getDimension() === 2595));

  utils.bindBeam(renderer, "fiskheroes:heat_vision", "sl:superman_heat_vision", "head", 0xFF1F00, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.5, -4.0], "size": [0.9, 0.5] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.5, -4.0], "size": [0.9, 0.5] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => !entity.getData("sl:dyn/eradicator"));

  utils.bindBeam(renderer, "fiskheroes:heat_vision", "sl:superman_heat_vision", "head", 0xFF1F00, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.5, -4.0], "size": [1.0, 0.55] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.5, -4.0], "size": [1.0, 0.55] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("sl:dyn/eradicator"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:sonic_beam", "body", 0xD3D3D3, [
        { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -3.0, -4.0], "size": [15.0, 15.0] }
    ]).setCondition(entity => !entity.getData("sl:dyn/eradicator"));

  utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "head", 0xFF1200, [
    { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.0, -3.5, -4.0], "size": [1.9, 1.5] },
    { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.0, -3.5, -4.0], "size": [1.9, 1.5] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("sl:dyn/eradicator"));

  utils.addCameraShake(renderer, 0.5, 1.75, "fiskheroes:dyn/superhero_landing_timer");
  utils.addCameraShake(renderer, 0.020, 1.2, "sl:dyn/sboost");
  utils.addCameraShake(renderer, 0.025, 1.3, "sl:dyn/sboost2");

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

  coat = renderer.createEffect("fiskheroes:model");
  coat.setModel(utils.createModel(renderer, "sl:sagecoat", "coat", null));
  coat.anchor.set("body");
  coat.mirror = false;

  supercharging2 = renderer.createEffect("fiskheroes:overlay");
  supercharging2.texture.set(null, "supercharging");

  utils.bindParticles(renderer, "sl:solar_energy").setCondition(entity => entity.getInterpolatedData('sl:dyn/eradicator_timer') > 0 && entity.getInterpolatedData('sl:dyn/eradicator_timer') < 1);
  utils.bindParticles(renderer, "sl:wave").setCondition(entity => entity.getInterpolatedData('sl:dyn/sboost_timer') > 0 && entity.getInterpolatedData('sl:dyn/sboost_timer') < 1 && entity.getData("sl:dyn/sboost"));
  utils.bindParticles(renderer, "sl:landing_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') > 10 && entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') < 14);
   utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("sl:dyn/sboost_timer") > 0);
   utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0);
   utils.bindParticles(renderer, "sl:chargedboost").setCondition(entity => entity.getData("sl:dyn/sboost2_timer") > 0);

  glow = renderer.createEffect("fiskheroes:glowerlay");
  glow.includeEffects(coat);
  glow.color.set(0xFFD700);

}

function initAnimations(renderer) {
  parent.initAnimations(renderer);

  renderer.removeCustomAnimation("basic.AIMING");

  renderer.removeCustomAnimation("basic.ENERGY_PROJ");

  utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive").priority = 1;

  utils.addFlightAnimation(renderer, "superman.FLIGHT", "sl:superman_arms_forward.anim.json");
  
  addAnimationWithData(renderer, "superman.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").priority = -8;

  addAnimationWithData(renderer, "superman.SOFTLAND", "sl:soft_landing", "sl:dyn/soft_landing_timer").priority = -8;

  utils.addHoverAnimation(renderer, "superman.HOVER", "fiskheroes:flight/idle/neutral");

  addAnimationWithData(renderer, "superman.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer").priority = 10;

  addAnimationWithData(renderer, "superman.ENERGY_CHARGING", "sl:tpose", "sl:dyn/sun_timer");

  addAnimationWithData(renderer, "superman.THUNDER", "sl:tpose", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/eradicator");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.THUNDER2", "sl:tpose", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/eradicator") && !entity.getData("sl:dyn/clap_animation_cooldown") && entity.getData("fiskheroes:beam_shooting");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.THUNDERCLAP", "sl:clap", "sl:dyn/clap_timer").setCondition(entity => {
    return !entity.getData("sl:dyn/eradicator");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.UNCLAP", "sl:clap", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/eradicator") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/clap_animation_cooldown");
  }).priority = -10;

  addAnimationWithData(renderer, "supermanboosted.FLIGHT", "sl:heil", "sl:dyn/sboost")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost_timer"));
        }).priority = -1;

  addAnimationWithData(renderer, "supermanchargedboosted.FLIGHT", "sl:heil", "sl:dyn/sboost2")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost2_timer"));
        });

  addAnimationWithData(renderer, "talrho.SUITUP", "sl:test", "sl:dyn/suitup_timer");

  addAnimationWithData(renderer, "superman.SUIT", "fiskheroes:sword_pose", "sl:dyn/suitup").setCondition(entity => {
    return entity.getData("sl:dyn/suitup_timer") > 0 && entity.getData("sl:dyn/suitup_timer") < 1;
  }).priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
  if (renderLayer === "CHESTPLATE" || renderLayer === "LEGGINGS" || renderLayer === "HELMET" || renderLayer === "BOOTS") {
    if ((entity.getData("sl:dyn/eradicator") && entity.getData("fiskheroes:beam_charging")) || (entity.getData("sl:dyn/eradicator") && entity.getData("fiskheroes:beam_shooting"))) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
    } else if (!entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/eradicator")) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    }
    
    if ((entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/eradicator")) ||
        (entity.getData("fiskheroes:aiming_timer") > 0.0 && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/eradicator"))) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer");
    } else if (!entity.getData("fiskheroes:aiming") && !entity.getData("sl:dyn/eradicator")) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    }
    
    overlay.render();
   
    if (entity.getData("sl:dyn/eradicator")) {
    supercharged.opacity = entity.getInterpolatedData("sl:dyn/eradicator") / 2;
    supercharged.render();
    } else {
    supercharged.opacity = entity.getInterpolatedData("fiskheroes:energy_charge") / 2;
    supercharged.render();
    }
    
    supercharging.opacity = entity.getInterpolatedData("fiskheroes:energy_charge");
    supercharging.render();

    if (entity.getData("sl:dyn/eradicator")) {
      supercharging2.opacity = (entity.getData("sl:dyn/light"));
      supercharging2.render();
    } else {
      supercharging2.opacity = 0;
    }
    
    glow.opacity = entity.getData('sl:dyn/eradicator_timer') > 0 && entity.getData('sl:dyn/eradicator_timer') < 1;
    glow.render();
  }
  
  if (renderLayer === "CHESTPLATE" && !entity.getData("sl:dyn/suitup_timer") > 0.5) {
    coat.render();
  }
  if (entity.getData("sl:dyn/suitup")) {
    suit.render();
  }
}
