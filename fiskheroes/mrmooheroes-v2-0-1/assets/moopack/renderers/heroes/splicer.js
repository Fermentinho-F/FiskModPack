extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:dna/dna_watch",
    "segment": "moopack:dna/symbiote_segment",
    "claw": "moopack:dna/symbiote_claw",
    "spider_dna": "moopack:dna/spider_dna",
    "symbiote_dna": "moopack:dna/symbiote_dna",
    "mutant_dna": "moopack:dna/mutant_dna",
    "speed_dna": "moopack:dna/speed_dna",
    "cosmic_dna": "moopack:dna/cosmic_dna",
    "nature_dna": "moopack:dna/nature_dna",
    "nolights": "moopack:dna/dna_base"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");

    /*renderer.setLights((entity, renderLayer) => {
      if (entity.getData("moopack:dyn/spider_dna_active") && !entity.getData("moopack:dyn/symbiote_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active")) {
          return "spider_dna";
      }
      else if (entity.getData("moopack:dyn/symbiote_dna_active") && !entity.getData("moopack:dyn/spider_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active")) {
          return "symbiote_dna";
      }
      else if (entity.getData("moopack:dyn/mutant_dna_active") && !entity.getData("moopack:dyn/spider_dna_active") && !entity.getData("moopack:dyn/symbiote_dna_active")) {
        return "mutant_dna";
      }
    //renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" && entity.getData("moopack:dyn/spider_dna_active") ? "spider_dna" : null);
    //renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" && entity.getData("moopack:dyn/symbiote_dna_active") ? "symbiote_dna" : null);
    //renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" && entity.getData("moopack:dyn/mutant_dna_active") ? "mutant_dna" : null);
  }); */
  renderer.setLights((entity, renderLayer) => {
    if (entity.getData("moopack:dyn/spider_dna_active")) {
        return "spider_dna";
    }
    else if (entity.getData("moopack:dyn/symbiote_dna_active")) {
        return "symbiote_dna";
    }
    else if (entity.getData("moopack:dyn/mutant_dna_active")) {
      return "mutant_dna";
    }
    else if (entity.getData("moopack:dyn/speed_dna_active")) {
      return "speed_dna";
    }
    else if (entity.getData("moopack:dyn/cosmic_dna_active")) {
      return "cosmic_dna";
    }
    else if (entity.getData("moopack:dyn/nature_dna_active")) {
      return "nature_dna";
    }
    else {
      return "nolights";
    }
  });
}

function initEffects(renderer) {  

  var forcefield = renderer.bindProperty("fiskheroes:forcefield");
  forcefield.color.set(0x1193D4);
  forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
  forcefield.setCondition(entity => {
      forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
      return true;
  });

  utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:telekinesis_monitor");

  utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "rightArm", 0x1193D4, [
      { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
  ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

  speedster.init(renderer, "moopack:lightning_jade");

  renderer.bindProperty("fiskheroes:gravity_manipulation").color.set(0x65fe08);

    utils.bindCloud(renderer, "fiskheroes:teleportation", "fiskheroes:breach");

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "moopack:creetle_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));
  
    var arm = utils.createModel(renderer, "moopack:sym_segment_thin", "segment");
    var claw = utils.createModel(renderer, "moopack:sym_claw_thin", "claw");
    claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        { "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
        { "offset": [2.0, -7.5, -2.0], "direction": [13.0, -10.0, -10.0] },
        { "offset": [-2.0, -7.5, -2.0], "direction": [-13.0, -10.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 1.7;
    tentacles.segments = 13;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimationWithData(renderer, "power.CHHARGED_BEAM", "fiskheroes:aiming_fpcorr", "fiskheroes:beam_charge");
    
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;

    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
        "fiskheroes:swing_roll",
        "fiskheroes:swing_roll2",
        "fiskheroes:swing_roll5"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "fiskheroes:swing_dive",
        "fiskheroes:swing_dive2"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
    utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
}
