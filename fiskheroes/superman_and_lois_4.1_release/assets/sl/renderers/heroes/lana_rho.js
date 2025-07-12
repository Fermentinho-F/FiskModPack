extend("fiskheroes:hero_basic");
loadTextures({
  "layer1": "sl:lana_rho_layer1",
  "layer2": "sl:lana_rho_layer2",
  "lights": "sl:bizarro_lights_layer1",
  "cape": "sl:lana_haircape",
  "pendant": "sl:pendant",
  "pendantlights": "sl:pendant_lights",
  "supercharged": "sl:supercharged_inverse",
  "supercharging": "sl:supercharged_inverse",
  "inhaler": "sl:inhaler_texture_empty",
  "hair": "sl:lana_rho_hair",
  "null": "sl:null",
  "inhalerlights": "sl:inhaler_texture_lights",
  "ksickness": "sl:xkryptonite_sickness"
});

var kutils = implement("sl:external/kryptonian_utils");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var boobas;

var beam;
var beam1;
var beam3;
var beam2;
var speedster = implement("fiskheroes:external/speedster_utils");
var cape;
var supercharged;
var overlay;
var supercharging;
var glow;
var overlay2;
var inhalerglow;
var ksickness;
var boobas;
var breathebeam;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornHelmet().suitType() == $SUIT_NAME ? "layer1" : "layer1";
        }
        return renderLayer == "HELMET" ? "hair" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.showModel("HELMET", "head", "headwear", "body");
}

function initEffects(renderer) {
kutils.initEffects(renderer);

  ksickness = renderer.createEffect("fiskheroes:overlay");
  ksickness.texture.set(null, "ksickness")

    beam1 = utils.createLines(renderer, ("BEAM_RENDERER", "fiskheroes:mysterio_beam"), 0xFF1200, [
        {"start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [12.0, 4.0]},
    ]);
    beam1.setOffset(0.0, -4.0, -3.5)
    beam1.setScale(3.0, 4.0, 3.0)
    beam1.anchor.set("head");

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

    renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getData("sl:dyn/kryptonite_timer") == 1).firstPersonOnly = true;

    boobas = renderer.createEffect("fiskheroes:chest");
    boobas.setExtrude(0.70).setYOffset(1);

    pendant = renderer.createEffect("fiskheroes:model");
    pendant.setModel(utils.createModel(renderer, "sl:ege", "pendant", "pendantlights"));
    pendant.anchor.set("body");
    pendant.setOffset(-0.3, 0.0, -2.0).setScale(0.3);

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.4;
    physics.maxFlare = 0.6;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 4;
    physics.setTickHandler(entity => {
        var f = 1 - entity.getData("fiskheroes:flight_timer");
        f = 1 - f * f * f;
        physics.headingAngle = 90 - f * 1;
        physics.restAngle = f * 12;
        physics.restFlare = f * 0.65;
        physics.idleFlutter = 0.15 + 0.25 * f;
        physics.flutterSpeed = f * 0.4;
    });

    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;

  glow = renderer.createEffect("fiskheroes:glowerlay");
  glow.color.set(0xFF0000);

  utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF0000, [
    { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
  ]);

  utils.bindTrail(renderer, "sl:soa_trail").setCondition(entity => !entity.getData("sl:dyn/inverseabsorb") && entity.getData("fiskheroes:speeding") && entity.isSprinting());
  utils.bindTrail(renderer, "sl:soa_trail").setCondition(entity => entity.getData("sl:dyn/inverseabsorb") && entity.getData("fiskheroes:speeding"));

  utils.bindTrail(renderer, "sl:supercharged_inverse").setCondition(entity => entity.getData("fiskheroes:flying") && entity.getData("sl:dyn/inverseabsorb"));
  utils.bindTrail(renderer, "sl:supercharged_static_inverse").setCondition(entity => entity.getData("sl:dyn/inverseabsorb"));
  utils.bindTrail(renderer, "sl:supercharging_inverse").setCondition(entity => entity.posY() > 1028 && !entity.isSprinting() && !entity.getData("sl:dyn/inverseabsorb") && entity.world().getDimension() === -1);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sl:normalheatvision", "head", 0x51E0FC, [
        { "firstPerson": [3.0, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:icev_impact"));

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "lights");

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


    beam = utils.createLines(renderer, ("BEAM_RENDERER", "fiskheroes:mysterio_beam"), 0x4A8D4B, [
        {"start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [12.0, 4.0]},
    ]);
    beam.setOffset(0.0, -4.0, -3.5)
    beam.setScale(3.0, 3.0, 3.0)
    beam.anchor.set("head");

    inhalerglow = utils.createLines(renderer, ("BEAM_RENDERER", "sl:shock_beam"), 0x4A8D4B, [
        {"start": [0, 0, 0], "end": [0.0, -0.5, 3.0], "size": [6.5, 2.5]},
    ]);
    inhalerglow.setOffset(1.12, 8.5, -4.5)
    inhalerglow.setScale(1.5, 1.5, 1.5)
    inhalerglow.anchor.set("rightArm");

  overlay2 = renderer.createEffect("fiskheroes:overlay");
  overlay2.texture.set(null, "lights");

  supercharged = renderer.createEffect("fiskheroes:overlay");
  supercharged.texture.set(null, "supercharged");

  supercharging = renderer.createEffect("fiskheroes:overlay");
  supercharging.texture.set(null, "supercharging");

  utils.bindParticles(renderer, "sl:super_breath_head").setCondition(entity => entity.getData("fiskheroes:energy_projection") && entity.getData("fiskheroes:gravity_amount") > 0);
  utils.bindParticles(renderer, "sl:wave").setCondition(entity => entity.getInterpolatedData('sl:dyn/sboost_timer') > 0 && entity.getInterpolatedData('sl:dyn/sboost_timer') < 1 && entity.getData("sl:dyn/sboost") && entity.getData("sl:dyn/kryptonite_timer") == 1);
  utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("sl:dyn/sboost_timer") > 0 && entity.getData("sl:dyn/kryptonite_timer") == 1);
  utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0 && entity.getData("sl:dyn/kryptonite_timer") == 1);
  utils.bindParticles(renderer, "sl:landing_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') > 10 && entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') < 14 && entity.getData("sl:dyn/kryptonite_timer") == 1);
utils.bindParticles(renderer, "sl:kryptonite_inhaler_break")
  .setCondition(entity => 
    entity.getData("sl:dyn/playparticle_timer") > 0
  );
    
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

shake2.intensity = 0.1;

function updateIntensity() {
    var landingTimer = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
    var intensity = 0.1 - (0.1 * landingTimer);
    shake2.intensity = intensity > 0 ? intensity : 0;
}
    }

function initAnimations(renderer) {
  parent.initAnimations(renderer);

  renderer.removeCustomAnimation("basic.AIMING");

  renderer.removeCustomAnimation("basic.ENERGY_PROJ");

  utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

  utils.addFlightAnimation(renderer, "superman.FLIGHT", "sl:superman_arms_forward.anim.json");
  
  addAnimationWithData(renderer, "superman.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").priority = 10;

  addAnimationWithData(renderer, "superman.SOFTLAND", "sl:soft_landing", "sl:dyn/soft_landing_timer").priority = 10;

  addAnimationWithData(renderer, "superman.USE", "sl:inhale", "sl:dyn/kryptonite_timer").setCondition(entity => { 
    return entity.getData("sl:dyn/kryptonite_cooldown") < 0.5 && entity.getData("sl:dyn/kryptonite");
  }).priority = -10;

  addAnimationWithData(renderer, "superman.USEFP", "sl:inhaler_consume_fp", "sl:dyn/kryptonite_timer").setCondition(entity => { 
    return entity.getData("sl:dyn/kryptonite");
  }).priority = -10;

  utils.addHoverAnimation(renderer, "superman.HOVER", "fiskheroes:flight/idle/neutral");

  addAnimationWithData(renderer, "superman.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer").priority = 10;

  addAnimationWithData(renderer, "superman.THUNDER", "sl:tpose", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/bizarroprofile");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.THUNDERCLAP", "sl:clap", "sl:dyn/clap_timer").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/bizarroprofile");
  }).priority = 10;

  addAnimationWithData(renderer, "superman.UNCLAP", "sl:clap", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/bizarroprofile");
  }).priority = -10;

  addAnimationWithData(renderer, "superman.CLAP", "sl:clap", "fiskheroes:beam_charge").setCondition(entity => {
    return !entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_shooting") && entity.getData("sl:dyn/bizarroprofile");
  });

addAnimationWithData(renderer, "superman.BREATH", "sl:breath_anim", "sl:dyn/heat_breath_timer").priority = 10;

addAnimationWithData(renderer, "superman.BREATH2", "sl:leaning", "sl:dyn/steelchargedata")
    .setCondition(entity => {
        return !entity.isSneaking();
    })
    .priority = 10;

  addAnimationWithData(renderer, "supermanboosted.FLIGHT", "sl:heil", "sl:dyn/sboost")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost_timer"));
        });

  addAnimationWithData(renderer, "supermanchargedboosted.FLIGHT", "sl:heil", "sl:dyn/sboost2")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("sl:dyn/sboost2_timer"));
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
  if (renderLayer === "CHESTPLATE" || renderLayer === "LEGGINGS" || renderLayer === "HELMET" || renderLayer === "BOOTS") {
    if ((entity.getData("sl:dyn/heat_vision") && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/absorb")) ||
        (entity.getData("sl:dyn/heat_vision_charge") > 0.0 && !entity.getData("fiskheroes:mask_open") && !entity.getData("sl:dyn/absorb"))) {
      overlay.opacity = entity.getInterpolatedData("sl:dyn/heat_vision_charge");
    } else if (!entity.getData("sl:dyn/heat_vision") && !entity.getData("sl:dyn/absorb")) {
      overlay.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    }
    ksickness.opacity = entity.getInterpolatedData("sl:dyn/kryptonite_sickness_timer");
    ksickness.render();
    overlay.render();
    supercharged.opacity = entity.getInterpolatedData("sl:dyn/inverseabsorb");
    supercharged.render();
    supercharging.opacity = entity.getInterpolatedData("fiskheroes:energy_charge");
    supercharging.render();
    glow.opacity = entity.getData('sl:dyn/inverseabsorb_timer') > 0 && entity.getData('sl:dyn/inverseabsorb_timer') < 1;
    glow.render();
  }
  if (entity.getData("sl:dyn/heat_breath_level") < -0.5 && entity.getData("sl:dyn/heat_breath_charge") == 1) {
      beam1.opacity = 0;
      beam1.render();
    } else {
      beam1.opacity = entity.getInterpolatedData("sl:dyn/heat_breath_charge");
      beam1.render();
  }
if (entity.getData("sl:dyn/heat_breath_level") < -0.75) {
    beam2.opacity = entity.getData("fiskheroes:energy_projection_timer") / 3;
    beam2.render();
} else if (entity.getData("sl:dyn/heat_breath_level") <= -0.5 && entity.getData("sl:dyn/heat_breath_level") > -0.75) {
    beam3.opacity = entity.getData("fiskheroes:energy_projection_timer") / 4;
    beam3.render();
}

  if (renderLayer === "HELMET") {
      cape.render(entity);
  }
  if (renderLayer === "CHESTPLATE") {
      beam.opacity = entity.getInterpolatedData("sl:dyn/inhaler_breathe_timer") - 0.2;
      beam.render();
      boobas.render();
  }
}
