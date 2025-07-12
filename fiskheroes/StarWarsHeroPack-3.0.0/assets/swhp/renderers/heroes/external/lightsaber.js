function createModel(renderer, modelType, texture, textureLights) {
  var model = renderer.createResource("MODEL", modelType);

  if (typeof textureLights !== "undefined") {
    model.texture.set(texture, textureLights);
  }
  else {
    model.texture.set(texture);
  }

  return model;
}

function createLines(renderer, beam, color, entries) {
  var lines = renderer.createEffect("fiskheroes:lines");
  var shape = renderer.createResource("SHAPE", null);

  for (var i = 0; i < entries.length; ++i) {
    shape.bindLine(entries[i]);
  }

  if (typeof beam === "string") {
    beam = renderer.createResource("BEAM_RENDERER", beam);
  }

  lines.setShape(shape);
  lines.setRenderer(beam);
  lines.color.set(color);
  return lines;
}

function bindBeam(renderer, propertyName, beam, anchor, color, entries) {
  var prop = renderer.bindProperty(propertyName).setAnchor(anchor);
  var constln = renderer.createResource("BEAM_CONSTELLATION", null);

  for (var i = 0; i < entries.length; ++i) {
      constln.bindBeam(entries[i]);
  }

  if (typeof beam === "string") {
      beam = renderer.createResource("BEAM_RENDERER", beam);
  }

  prop.setConstellation(constln);
  prop.setRenderer(beam);
  prop.color.set(color);
  return prop;
}

function addAnimationEvent(renderer, key, value) {
  var event = renderer.createResource("ANIMATION_EVENT", null);

  if (Array.isArray(value)) {
      for (var i = 0; i < value.length; ++i) {
          var e = parseAnimationEntry(renderer, value[i]);
          event.bindAnimation(e.anim, e.weight);
      }
  }
  else {
      var e = parseAnimationEntry(renderer, value);
      event.bindAnimation(e.anim, e.weight);
  }

  renderer.addAnimationEvent(key, event);
  return event;
}

function parseAnimationEntry(renderer, value) {
  if (typeof value === "string") {
      return {
          "anim": renderer.createResource("ANIMATION", value),
          "weight": 1
      };
  }
  return {
      "anim": renderer.createResource("ANIMATION", value.key),
      "weight": value.hasOwnProperty("weight") ? value.weight : 1
  };
}

function bindParticles(renderer, particleType) {
  return renderer.bindProperty("fiskheroes:particles").setParticles(renderer.createResource("PARTICLE_EMITTER", particleType));
}

function addAnimation(renderer, key, anim) {
  if (typeof anim === "string") {
      anim = renderer.createResource("ANIMATION", anim);
  }

  renderer.addCustomAnimation(key, anim);
  return anim;
}

function addAnimationWithData(renderer, key, anim, dataVar) {
  return addAnimation(renderer, key, anim).setData((entity, data) => data.load(entity.getInterpolatedData(dataVar)));
}

function initDual(renderer, saberTypeRight, saberTypeLeft, colorRight, colorLeft) {

  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));

  var leftType = "swhp:lightsaber_" + saberTypeLeft;
  var rightType = "swhp:lightsaber_" + saberTypeRight;

  var saberright = renderer.createResource("MODEL", rightType);
  saberright.texture.set("lightsaberright");
  var saberleft = renderer.createResource("MODEL", leftType);
  saberleft.texture.set("lightsaberleft");

  var lightsaberright = renderer.createEffect("fiskheroes:model");
  lightsaberright.setModel(saberright);
  lightsaberright.setScale(0.425);

  var lightsaberleft = renderer.createEffect("fiskheroes:model");
  lightsaberleft.setModel(saberleft);
  lightsaberleft.setScale(0.425);

  var lightsaberignite_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite");
  var lightsaberignite2_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite2");

  //Right
  if (saberTypeRight == "revan") {
    var lightsaberigniteright = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [-1.0, 9.0, -4.7], "end": [-1.0, 9.0, -24.7], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright.anchor.set("rightArm");
    lightsaberigniteright.setScale(1.0);
    lightsaberigniteright.mirror = false;
  
    var lightsaberigniteright2 = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [-1.0, 9.0, -4.7], "end": [-1.0, 9.0, -25.2], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2.anchor.set("rightArm");
    lightsaberigniteright2.setScale(1.0);
    lightsaberigniteright2.mirror = false;
  
    var lightsaberigniteright_throw = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [0.0, 0.0, 1.3], "end": [0.0, 0.0, -18.7], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright_throw.anchor.set("rightArm");
    lightsaberigniteright_throw.setScale(1.0);
    lightsaberigniteright_throw.mirror = false;
  
    var lightsaberigniteright2_throw = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [0.0, 0.0, 1.3], "end": [0.0, 0.0, -19.2], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2_throw.anchor.set("rightArm");
    lightsaberigniteright2_throw.setScale(1.0);
    lightsaberigniteright2_throw.mirror = false;
  } else if (saberTypeRight == "kenobi") {
    var lightsaberigniteright = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [-1.0, 9.0, -4.05], "end": [-1.0, 9.0, -24.05], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright.anchor.set("rightArm");
    lightsaberigniteright.setScale(1.0);
    lightsaberigniteright.mirror = false;
  
    var lightsaberigniteright2 = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [-1.0, 9.0, -4.05], "end": [-1.0, 9.0, -24.55], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2.anchor.set("rightArm");
    lightsaberigniteright2.setScale(1.0);
    lightsaberigniteright2.mirror = false;
  
    var lightsaberigniteright_throw = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [0.0, 0.0, 1.95], "end": [0.0, 0.0, -18.05], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright_throw.anchor.set("rightArm");
    lightsaberigniteright_throw.setScale(1.0);
    lightsaberigniteright_throw.mirror = false;
  
    var lightsaberigniteright2_throw = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [0.0, 0.0, 1.95], "end": [0.0, 0.0, -18.55], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2_throw.anchor.set("rightArm");
    lightsaberigniteright2_throw.setScale(1.0);
    lightsaberigniteright2_throw.mirror = false;
  } else if (saberTypeRight == "windu") {
    var lightsaberigniteright = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [-1.0, 9.0, -3.4], "end": [-1.0, 9.0, -23.4], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright.anchor.set("rightArm");
    lightsaberigniteright.setScale(1.0);
    lightsaberigniteright.mirror = false;
  
    var lightsaberigniteright2 = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [-1.0, 9.0, -3.4], "end": [-1.0, 9.0, -23.9], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2.anchor.set("rightArm");
    lightsaberigniteright2.setScale(1.0);
    lightsaberigniteright2.mirror = false;
  
    var lightsaberigniteright_throw = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [0.0, 0.0, 2.6], "end": [0.0, 0.0, -17.4], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright_throw.anchor.set("rightArm");
    lightsaberigniteright_throw.setScale(1.0);
    lightsaberigniteright_throw.mirror = false;
  
    var lightsaberigniteright2_throw = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [0.0, 0.0, 2.6], "end": [0.0, 0.0, -17.9], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2_throw.anchor.set("rightArm");
    lightsaberigniteright2_throw.setScale(1.0);
    lightsaberigniteright2_throw.mirror = false;
  } else if (saberTypeRight == "anakin") {
    var lightsaberigniteright = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [-1.0, 9.0, -3.6], "end": [-1.0, 9.0, -23.6], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright.anchor.set("rightArm");
    lightsaberigniteright.setScale(1.0);
    lightsaberigniteright.mirror = false;
  
    var lightsaberigniteright2 = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [-1.0, 9.0, -3.6], "end": [-1.0, 9.0, -24.1], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2.anchor.set("rightArm");
    lightsaberigniteright2.setScale(1.0);
    lightsaberigniteright2.mirror = false;
  
    var lightsaberigniteright_throw = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [0.0, 0.0, 2.4], "end": [0.0, 0.0, -17.6], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright_throw.anchor.set("rightArm");
    lightsaberigniteright_throw.setScale(1.0);
    lightsaberigniteright_throw.mirror = false;
  
    var lightsaberigniteright2_throw = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [0.0, 0.0, 2.4], "end": [0.0, 0.0, -18.1], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2_throw.anchor.set("rightArm");
    lightsaberigniteright2_throw.setScale(1.0);
    lightsaberigniteright2_throw.mirror = false;
  } else {
    var lightsaberigniteright = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [-1.0, 9.0, -3.5], "end": [-1.0, 9.0, -23.5], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright.anchor.set("rightArm");
    lightsaberigniteright.setScale(1.0);
    lightsaberigniteright.mirror = false;
  
    var lightsaberigniteright2 = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [-1.0, 9.0, -3.5], "end": [-1.0, 9.0, -24.0], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2.anchor.set("rightArm");
    lightsaberigniteright2.setScale(1.0);
    lightsaberigniteright2.mirror = false;
  
    var lightsaberigniteright_throw = createLines(renderer, lightsaberignite_effect, colorRight, [
      {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, -17.5], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright_throw.anchor.set("rightArm");
    lightsaberigniteright_throw.setScale(1.0);
    lightsaberigniteright_throw.mirror = false;
  
    var lightsaberigniteright2_throw = createLines(renderer, lightsaberignite2_effect, colorRight, [
      {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, -18.0], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteright2_throw.anchor.set("rightArm");
    lightsaberigniteright2_throw.setScale(1.0);
    lightsaberigniteright2_throw.mirror = false;
  }

  //Left
  if (saberTypeLeft == "revan") {
    var lightsaberigniteleft = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [1.0, 9.0, -4.7], "end": [1.0, 9.0, -24.7], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft.anchor.set("leftArm");
    lightsaberigniteleft.setScale(1.0);
    lightsaberigniteleft.mirror = false;
  
    var lightsaberigniteleft2 = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [1.0, 9.0, -4.7], "end": [1.0, 9.0, -25.2], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2.anchor.set("leftArm");
    lightsaberigniteleft2.setScale(1.0);
    lightsaberigniteleft2.mirror = false;
  
    var lightsaberigniteleft_throw = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [0.0, 0.0, 1.3], "end": [0.0, 0.0, -18.7], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft_throw.anchor.set("leftArm");
    lightsaberigniteleft_throw.setScale(1.0);
    lightsaberigniteleft_throw.mirror = false;
  
    var lightsaberigniteleft2_throw = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [0.0, 0.0, 1.3], "end": [0.0, 0.0, -19.2], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2_throw.anchor.set("leftArm");
    lightsaberigniteleft2_throw.setScale(1.0);
    lightsaberigniteleft2_throw.mirror = false;
  } else if (saberTypeLeft == "kenobi") {
    var lightsaberigniteleft = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [1.0, 9.0, -4.05], "end": [1.0, 9.0, -24.05], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft.anchor.set("leftArm");
    lightsaberigniteleft.setScale(1.0);
    lightsaberigniteleft.mirror = false;
  
    var lightsaberigniteleft2 = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [1.0, 9.0, -4.05], "end": [1.0, 9.0, -24.55], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2.anchor.set("leftArm");
    lightsaberigniteleft2.setScale(1.0);
    lightsaberigniteleft2.mirror = false;
  
    var lightsaberigniteleft_throw = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [0.0, 0.0, 1.95], "end": [0.0, 0.0, -18.05], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft_throw.anchor.set("leftArm");
    lightsaberigniteleft_throw.setScale(1.0);
    lightsaberigniteleft_throw.mirror = false;
  
    var lightsaberigniteleft2_throw = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [0.0, 0.0, 1.95], "end": [0.0, 0.0, -18.55], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2_throw.anchor.set("leftArm");
    lightsaberigniteleft2_throw.setScale(1.0);
    lightsaberigniteleft2_throw.mirror = false;
  } else if (saberTypeLeft == "windu") {
    var lightsaberigniteleft = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [1.0, 9.0, -3.4], "end": [1.0, 9.0, -23.4], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft.anchor.set("leftArm");
    lightsaberigniteleft.setScale(1.0);
    lightsaberigniteleft.mirror = false;
  
    var lightsaberigniteleft2 = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [1.0, 9.0, -3.4], "end": [1.0, 9.0, -23.9], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2.anchor.set("leftArm");
    lightsaberigniteleft2.setScale(1.0);
    lightsaberigniteleft2.mirror = false;
  
    var lightsaberigniteleft_throw = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [0.0, 0.0, 2.6], "end": [0.0, 0.0, -17.4], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft_throw.anchor.set("leftArm");
    lightsaberigniteleft_throw.setScale(1.0);
    lightsaberigniteleft_throw.mirror = false;
  
    var lightsaberigniteleft2_throw = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [0.0, 0.0, 2.6], "end": [0.0, 0.0, -17.9], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2_throw.anchor.set("leftArm");
    lightsaberigniteleft2_throw.setScale(1.0);
    lightsaberigniteleft2_throw.mirror = false;
  } else if (saberTypeLeft == "anakin") {
    var lightsaberigniteleft = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [1.0, 9.0, -3.6], "end": [1.0, 9.0, -23.6], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft.anchor.set("leftArm");
    lightsaberigniteleft.setScale(1.0);
    lightsaberigniteleft.mirror = false;
  
    var lightsaberigniteleft2 = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [1.0, 9.0, -3.6], "end": [1.0, 9.0, -24.1], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2.anchor.set("leftArm");
    lightsaberigniteleft2.setScale(1.0);
    lightsaberigniteleft2.mirror = false;
  
    var lightsaberigniteleft_throw = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [0.0, 0.0, 2.4], "end": [0.0, 0.0, -17.6], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft_throw.anchor.set("leftArm");
    lightsaberigniteleft_throw.setScale(1.0);
    lightsaberigniteleft_throw.mirror = false;
  
    var lightsaberigniteleft2_throw = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [0.0, 0.0, 2.4], "end": [0.0, 0.0, -18.1], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2_throw.anchor.set("leftArm");
    lightsaberigniteleft2_throw.setScale(1.0);
    lightsaberigniteleft2_throw.mirror = false;
  } else {
    var lightsaberigniteleft = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [1.0, 9.0, -3.5], "end": [1.0, 9.0, -23.5], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft.anchor.set("leftArm");
    lightsaberigniteleft.setScale(1.0);
    lightsaberigniteleft.mirror = false;
  
    var lightsaberigniteleft2 = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [1.0, 9.0, -3.5], "end": [1.0, 9.0, -24.0], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2.anchor.set("leftArm");
    lightsaberigniteleft2.setScale(1.0);
    lightsaberigniteleft2.mirror = false;
  
    var lightsaberigniteleft_throw = createLines(renderer, lightsaberignite_effect, colorLeft, [
      {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, -17.5], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft_throw.anchor.set("leftArm");
    lightsaberigniteleft_throw.setScale(1.0);
    lightsaberigniteleft_throw.mirror = false;
  
    var lightsaberigniteleft2_throw = createLines(renderer, lightsaberignite2_effect, colorLeft, [
      {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, -18.0], "size": [10.0, 10.0]},
    ]);
    lightsaberigniteleft2_throw.anchor.set("leftArm");
    lightsaberigniteleft2_throw.setScale(1.0);
    lightsaberigniteleft2_throw.mirror = false;
  }

  var obj = {
    render: (entity, renderLayer) => {
      if (renderLayer == "CHESTPLATE") {
        if ((entity.getInterpolatedData("swhp:dyn/lightsaber_timer") > 0.5) && (entity.getHeldItem().isEmpty()) && (entity.getData("swhp:dyn/lightsaberthrowanimation_timer") == 0) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
          lightsaberright.anchor.set("rightArm");
          lightsaberright.setOffset(1.0, 9.0, -6.0);
          lightsaberright.setRotation(90, 0, 0);
          lightsaberleft.anchor.set("leftArm");
          lightsaberleft.setOffset(-1.0, 9.0, -6.0);
          lightsaberleft.setRotation(90, 0, 0);
          lightsaberright.render();
          lightsaberleft.render();
        }
        if ((entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer") > 0) && (entity.getHeldItem().isEmpty())) {
          lightsaberigniteright_throw.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberigniteleft_throw.setOffset(-1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberigniteright2_throw.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberigniteleft2_throw.setOffset(-1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberigniteright_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
          lightsaberigniteleft_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
          lightsaberigniteright2_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
          lightsaberigniteleft2_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
          lightsaberigniteright_throw.progress = true;
          lightsaberigniteleft_throw.progress = true;
          lightsaberigniteright2_throw.progress = true;
          lightsaberigniteleft2_throw.progress = true;
          lightsaberigniteright_throw.render();
          lightsaberigniteleft_throw.render();
          lightsaberigniteright2_throw.render();
          lightsaberigniteleft2_throw.render();
          lightsaberright.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberleft.setOffset(-1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberright.setRotation((720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 90, 0, 0);
          lightsaberleft.setRotation((720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 90, 0, 0);
          lightsaberright.render();
          lightsaberleft.render();
        }
        if ((renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && !entity.isSneaking()) && !(entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
          lightsaberright.anchor.set("body");
          lightsaberright.setOffset(2.5, 7.2, -3.0);
          lightsaberright.setRotation(0, 180, 0);
          lightsaberleft.anchor.set("body");
          lightsaberleft.setOffset(-2.5, 7.2, -3.0);
          lightsaberleft.setRotation(0, 180, 0);
          lightsaberright.render();
          lightsaberleft.render();
        }
        if (renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && entity.isSneaking()) {
          lightsaberright.anchor.set("body");
          lightsaberright.setOffset(2.5, 6.2, -3.5);
          lightsaberright.setRotation(-20, 180, 0);
          lightsaberright.render();
          lightsaberleft.anchor.set("body");
          lightsaberleft.setOffset(-2.5, 6.2, -3.5);
          lightsaberleft.setRotation(-20, 180, 0);
          lightsaberleft.render();
        }
        if ((entity.getData("swhp:dyn/lightsaber") && entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer') > 0 && entity.getData("swhp:dyn/lightsaberthrowanimation_timer") == 0 && entity.getHeldItem().isEmpty()) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")){
          lightsaberigniteright.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
          lightsaberigniteleft.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
          lightsaberigniteright2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
          lightsaberigniteleft2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
          lightsaberigniteright.setOffset(0.0, 0.0, 0.0);
          lightsaberigniteleft.setOffset(0.0, 0.0, 0.0);
          lightsaberigniteright2.setOffset(0.0, 0.0, 0.0);
          lightsaberigniteleft2.setOffset(0.0, 0.0, 0.0);
          lightsaberigniteright2.render();
          lightsaberigniteleft2.render();
          lightsaberigniteright.render();
          lightsaberigniteleft.render();
        }
      }
    }
  }
  return obj;
}

function initDualParticles(renderer, right, left) {
  var rightType = "swhp:lightsaberignitesmoke_" + right;
  var leftType = "swhp:lightsaberignitesmoke_left_" + left;

  bindParticles(renderer, rightType).setCondition(entity => entity.getData("swhp:dyn/lightsaber") && (entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") > 0 && entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") < 1));
  bindParticles(renderer, leftType).setCondition(entity => entity.getData("swhp:dyn/lightsaber") && (entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") > 0 && entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") < 1));
}

function initDualAnimations(renderer, igniteType, blockType) {
  addAnimationWithData(renderer, "dual.LIGHTSABERUNHOLSTER", "swhp:lightsaberunholster_dual", "swhp:dyn/lightsaber_timer");
  addAnimationWithData(renderer, "dual.LIGHTSABERTHROW", "swhp:lightsaberthrowaiming_dual", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));
  addAnimationWithData(renderer, "dual.LIGHTSABERDUALWIELD", "swhp:dualwield", "swhp:dyn/lightsaberignite").setCondition(entity => entity.isPunching() &&  !entity.getData("fiskheroes:shield_blocking_timer"));
  
  var block_event = blockType + ".BLOCKING";
  var block_anim = "swhp:lightsaberblock_" + blockType;
  var block_anim_display = blockType + ".DISPLAY";
  addAnimationWithData(renderer, block_event, block_anim, "fiskheroes:shield_blocking_timer")
    .priority = -5;
  addAnimation(renderer, block_anim_display, block_anim)
    .setData((entity, data) => data.load(1.0))
    .setCondition(entity => (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = 13;
  var ignite_event = igniteType + ".LIGHTSABERIGNITE";
  var ignite_anim = "swhp:lightsaberignite_" + igniteType;
  addAnimationWithData(renderer, ignite_event, ignite_anim, "swhp:dyn/lightsaberignite_timer");
}

function initSingle(renderer, saberType, color) {

  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", color, [
    { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));

  var type = "swhp:lightsaber_" + saberType;

  var saber = renderer.createResource("MODEL", type);
  saber.texture.set("lightsaber");

  var lightsaber = renderer.createEffect("fiskheroes:model");
  lightsaber.setModel(saber);
  lightsaber.setScale(0.425);

  var lightsaberignite_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite");
  var lightsaberignite2_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite2");

  if (saberType == "revan") {
    var lightsaberignite = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [-1.0, 9.0, -4.7], "end": [-1.0, 9.0, -24.7], "size": [10.0, 10.0]},
    ]);
    lightsaberignite
    lightsaberignite.anchor.set("rightArm");
    lightsaberignite.setScale(1.0);
    lightsaberignite.mirror = false;
  
    var lightsaberignite2 = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [-1.0, 9.0, -4.7], "end": [-1.0, 9.0, -25.2], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2.anchor.set("rightArm");
    lightsaberignite2.setScale(1.0);
    lightsaberignite2.mirror = false;
  
    var lightsaberignite_throw = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [0.0, 0.0, 1.3], "end": [0.0, 0.0, -18.7], "size": [10.0, 10.0]},
    ]);
    lightsaberignite_throw.anchor.set("rightArm");
    lightsaberignite_throw.setScale(1.0);
    lightsaberignite_throw.mirror = false;
  
    var lightsaberignite2_throw = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [0.0, 0.0, 1.3], "end": [0.0, 0.0, -19.2], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2_throw.anchor.set("rightArm");
    lightsaberignite2_throw.setScale(1.0);
    lightsaberignite2_throw.mirror = false;
  } else if (saberType == "kenobi") {
    var lightsaberignite = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [-1.0, 9.0, -4.05], "end": [-1.0, 9.0, -24.05], "size": [10.0, 10.0]},
    ]);
    lightsaberignite.anchor.set("rightArm");
    lightsaberignite.setScale(1.0);
    lightsaberignite.mirror = false;
  
    var lightsaberignite2 = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [-1.0, 9.0, -4.05], "end": [-1.0, 9.0, -24.55], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2.anchor.set("rightArm");
    lightsaberignite2.setScale(1.0);
    lightsaberignite2.mirror = false;
  
    var lightsaberignite_throw = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [0.0, 0.0, 1.95], "end": [0.0, 0.0, -18.05], "size": [10.0, 10.0]},
    ]);
    lightsaberignite_throw.anchor.set("rightArm");
    lightsaberignite_throw.setScale(1.0);
    lightsaberignite_throw.mirror = false;
  
    var lightsaberignite2_throw = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [0.0, 0.0, 1.95], "end": [0.0, 0.0, -18.55], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2_throw.anchor.set("rightArm");
    lightsaberignite2_throw.setScale(1.0);
    lightsaberignite2_throw.mirror = false;
  } else if (saberType == "windu") {
    var lightsaberignite = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [-1.0, 9.0, -3.4], "end": [-1.0, 9.0, -23.4], "size": [10.0, 10.0]},
    ]);
    lightsaberignite.anchor.set("rightArm");
    lightsaberignite.setScale(1.0);
    lightsaberignite.mirror = false;
  
    var lightsaberignite2 = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [-1.0, 9.0, -3.4], "end": [-1.0, 9.0, -23.9], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2.anchor.set("rightArm");
    lightsaberignite2.setScale(1.0);
    lightsaberignite2.mirror = false;
  
    var lightsaberignite_throw = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [0.0, 0.0, 2.6], "end": [0.0, 0.0, -17.4], "size": [10.0, 10.0]},
    ]);
    lightsaberignite_throw.anchor.set("rightArm");
    lightsaberignite_throw.setScale(1.0);
    lightsaberignite_throw.mirror = false;
  
    var lightsaberignite2_throw = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [0.0, 0.0, 2.6], "end": [0.0, 0.0, -17.9], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2_throw.anchor.set("rightArm");
    lightsaberignite2_throw.setScale(1.0);
    lightsaberignite2_throw.mirror = false;
  } else if (saberType == "anakin") {
    var lightsaberignite = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [-1.0, 9.0, -3.6], "end": [-1.0, 9.0, -23.6], "size": [10.0, 10.0]},
    ]);
    lightsaberignite.anchor.set("rightArm");
    lightsaberignite.setScale(1.0);
    lightsaberignite.mirror = false;
  
    var lightsaberignite2 = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [-1.0, 9.0, -3.6], "end": [-1.0, 9.0, -24.1], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2.anchor.set("rightArm");
    lightsaberignite2.setScale(1.0);
    lightsaberignite2.mirror = false;
  
    var lightsaberignite_throw = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [0.0, 0.0, 2.4], "end": [0.0, 0.0, -17.6], "size": [10.0, 10.0]},
    ]);
    lightsaberignite_throw.anchor.set("rightArm");
    lightsaberignite_throw.setScale(1.0);
    lightsaberignite_throw.mirror = false;
  
    var lightsaberignite2_throw = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [0.0, 0.0, 2.4], "end": [0.0, 0.0, -18.1], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2_throw.anchor.set("rightArm");
    lightsaberignite2_throw.setScale(1.0);
    lightsaberignite2_throw.mirror = false;
  } else {
    var lightsaberignite = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [-1.0, 9.0, -3.5], "end": [-1.0, 9.0, -23.5], "size": [10.0, 10.0]},
    ]);
    lightsaberignite.anchor.set("rightArm");
    lightsaberignite.setScale(1.0);
    lightsaberignite.mirror = false;
  
    var lightsaberignite2 = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [-1.0, 9.0, -3.5], "end": [-1.0, 9.0, -24.0], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2.anchor.set("rightArm");
    lightsaberignite2.setScale(1.0);
    lightsaberignite2.mirror = false;
  
    var lightsaberignite_throw = createLines(renderer, lightsaberignite_effect, color, [
      {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, -17.5], "size": [10.0, 10.0]},
    ]);
    lightsaberignite_throw.anchor.set("rightArm");
    lightsaberignite_throw.setScale(1.0);
    lightsaberignite_throw.mirror = false;
  
    var lightsaberignite2_throw = createLines(renderer, lightsaberignite2_effect, color, [
      {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, -18.0], "size": [10.0, 10.0]},
    ]);
    lightsaberignite2_throw.anchor.set("rightArm");
    lightsaberignite2_throw.setScale(1.0);
    lightsaberignite2_throw.mirror = false;
  }

  var obj = {
    render: (entity, renderLayer) => {
      if (renderLayer == "CHESTPLATE") {
        if ((entity.getInterpolatedData("swhp:dyn/lightsaber_timer") > 0.5) && (entity.getHeldItem().isEmpty()) && (entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer") == 0) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
          lightsaber.anchor.set("rightArm");
          lightsaber.setOffset(1.0, 9.0, -6.0);
          lightsaber.setRotation(90, 0, 0);
          lightsaber.render();
        }
        if ((entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer") > 0) && (entity.getHeldItem().isEmpty())) {
          lightsaberignite_throw.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberignite2_throw.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaberignite_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
          lightsaberignite2_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
          lightsaberignite_throw.progress = true;
          lightsaberignite2_throw.progress = true;
          lightsaberignite_throw.render();
          lightsaberignite2_throw.render();
          lightsaber.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), -6.0);
          lightsaber.setRotation((720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 90, 0, 0);
          lightsaber.render();
        }
        if ((renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && !entity.isSneaking()) && !(entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
          lightsaber.anchor.set("body");
          lightsaber.setOffset(-2.5, 7.2, -3.0);
          lightsaber.setRotation(0, 180, 0);
          lightsaber.render();
        }
        if (renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && entity.isSneaking()) {
          lightsaber.anchor.set("body");
          lightsaber.setOffset(-2.5, 6.2, -3.5);
          lightsaber.setRotation(-20, 180, 0);
          lightsaber.render();
        }
        if ((entity.getData("swhp:dyn/lightsaber") && entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer') > 0 && (entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer") == 0) && entity.getHeldItem().isEmpty()) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")){
          lightsaberignite.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
          lightsaberignite2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
          lightsaberignite.setOffset(0.0, 0.0, 0.0);
          lightsaberignite2.setOffset(0.0, 0.0, 0.0);
          lightsaberignite2.render();
          lightsaberignite.render();
        }
      }
    }
  }
  return obj;
}

function initSingleParticles(renderer, particleType) {
  var type = "swhp:lightsaberignitesmoke_" + particleType;

  bindParticles(renderer, type).setCondition(entity => entity.getData("swhp:dyn/lightsaber") && (entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") > 0 && entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") < 1));
}

function initSingleAnimations(renderer, igniteType, blockType) {
  addAnimationWithData(renderer, "single.LIGHTSABERUNHOLSTER", "swhp:lightsaberunholster", "swhp:dyn/lightsaber_timer");
  addAnimationWithData(renderer, "single.LIGHTSABERTHROW", "swhp:lightsaberthrowaiming", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));
  
  var block_event = blockType + ".BLOCKING";
  var block_anim = "swhp:lightsaberblock_" + blockType;
  var block_anim_display = blockType + ".DISPLAY";
  addAnimationWithData(renderer, block_event, block_anim, "fiskheroes:shield_blocking_timer")
    .priority = -5;
  addAnimation(renderer, block_anim_display, block_anim)
    .setData((entity, data) => data.load(1.0))
    .setCondition(entity => (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = 13;
  var ignite_event = igniteType + ".LIGHTSABERIGNITE";
  var ignite_anim = "swhp:lightsaberignite_" + igniteType;
  addAnimationWithData(renderer, ignite_event, ignite_anim, "swhp:dyn/lightsaberignite_timer");
}

function initDouble(renderer, saberType, colorTop, colorBottom) {

  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));

  var type = "swhp:lightsaber_" + saberType;

  var saber = renderer.createResource("MODEL", type);
  saber.texture.set("lightsaber");

  var lightsaber = renderer.createEffect("fiskheroes:model");
  lightsaber.setModel(saber);
  lightsaber.setScale(0.425);

  var lightsaberignite_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite");
  var lightsaberignite2_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite2");

  var lightsaberignitetop = createLines(renderer, lightsaberignite_effect, colorTop, [
    {"start": [-0.9, 9.1, -8.85], "end": [-0.9, 9.1, -28.85], "size": [10.0, 10.0]},
  ]);
  lightsaberignitetop.anchor.set("rightArm");
  lightsaberignitetop.setScale(1.0);
  lightsaberignitetop.mirror = false;

  var lightsaberignitebottom = createLines(renderer, lightsaberignite_effect, colorBottom, [
    {"start": [-0.9, 9.1, 9.03], "end": [-0.9, 9.1, 29.03], "size": [10.0, 10.0]},
  ]);
  lightsaberignitebottom.anchor.set("rightArm");
  lightsaberignitebottom.setScale(1.0);
  lightsaberignitebottom.mirror = false;

  var lightsaberignitetop2 = createLines(renderer, lightsaberignite2_effect, colorTop, [
    {"start": [-0.9, 9.1, -8.85], "end": [-0.9, 9.1, -29.35], "size": [10.0, 10.0]},
  ]);
  lightsaberignitetop2.anchor.set("rightArm");
  lightsaberignitetop2.setScale(1.0);
  lightsaberignitetop2.mirror = false;

  var lightsaberignitebottom2 = createLines(renderer, lightsaberignite2_effect, colorBottom, [
    {"start": [-0.9, 9.1, 9.03], "end": [-0.9, 9.1, 29.53], "size": [10.0, 10.0]},
  ]);
  lightsaberignitebottom2.anchor.set("rightArm");
  lightsaberignitebottom2.setScale(1.0);
  lightsaberignitebottom2.mirror = false;
  
  var lightsaberignitetop_throw = createLines(renderer, lightsaberignite_effect, colorTop, [
    {"start": [0.0, 0.0, -9.4], "end": [0.0, 0.0, -29.4], "size": [10.0, 10.0]},
  ]);
  lightsaberignitetop_throw.anchor.set("rightArm");
  lightsaberignitetop_throw.setScale(1.0);
  lightsaberignitetop_throw.mirror = false;

  var lightsaberignitebottom_throw = createLines(renderer, lightsaberignite_effect, colorBottom, [
    {"start": [0.0, 0.0, 8.48], "end": [0.0, 0.0, 28.48], "size": [10.0, 10.0]},
  ]);
  lightsaberignitebottom_throw.anchor.set("rightArm");
  lightsaberignitebottom_throw.setScale(1.0);
  lightsaberignitebottom_throw.mirror = false;

  var lightsaberignitetop2_throw = createLines(renderer, lightsaberignite2_effect, colorTop, [
    {"start": [0.0, 0.0, -9.4], "end": [0.0, 0.0, -29.9], "size": [10.0, 10.0]},
  ]);
  lightsaberignitetop2_throw.anchor.set("rightArm");
  lightsaberignitetop2_throw.setScale(1.0);
  lightsaberignitetop2_throw.mirror = false;

  var lightsaberignitebottom2_throw = createLines(renderer, lightsaberignite2_effect, colorBottom, [
    {"start": [0.0, 0.0, 8.48], "end": [0.0, 0.0, 28.98], "size": [10.0, 10.0]},
  ]);
  lightsaberignitebottom2_throw.anchor.set("rightArm");
  lightsaberignitebottom2_throw.setScale(1.0);
  lightsaberignitebottom2_throw.mirror = false;

  var obj = {
    render: (entity, renderLayer) => {
      if ((entity.getInterpolatedData("swhp:dyn/lightsaber_timer") > 0.5) && (entity.getHeldItem().isEmpty()) && (!entity.getData("swhp:dyn/lightsaberthrowanimation_timer")) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
        lightsaber.anchor.set("rightArm");
        lightsaber.setOffset(0.9, 9.125, 0.55);
        lightsaber.setRotation(90, 0, 0);
        lightsaber.render();
      }
      if ((entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer") > 0) && (entity.getHeldItem().isEmpty())) {
        lightsaberignitetop_throw.setOffset(0.9, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.125), 0.55);
        lightsaberignitebottom_throw.setOffset(0.9, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.125), 0.55);
        lightsaberignitetop2_throw.setOffset(0.9, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.125), 0.55);
        lightsaberignitebottom2_throw.setOffset(0.9, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.125), 0.55);
        lightsaberignitetop_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberignitebottom_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberignitetop2_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberignitebottom2_throw.setRotation(720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberignitetop_throw.progress = true;
        lightsaberignitebottom_throw.progress = true;
        lightsaberignitetop2_throw.progress = true;
        lightsaberignitebottom2_throw.progress = true;
        lightsaberignitetop_throw.render();
        lightsaberignitebottom_throw.render();
        lightsaberignitetop2_throw.render();
        lightsaberignitebottom2_throw.render();
        lightsaber.setOffset(0.9, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.125), 0.55);
        lightsaber.setRotation((720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 90, 0, 0);
        lightsaber.render();
      }
      if ((renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && !entity.isSneaking()) && !(entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
        lightsaber.anchor.set("body");
        lightsaber.setOffset(-2.5, 15.0, -3.0);
        lightsaber.setRotation(0, 180, 0);
        lightsaber.render();
      }
      if (renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && entity.isSneaking()) {
        lightsaber.anchor.set("body");
        lightsaber.setOffset(-2.5, 11.0, -5.5);
        lightsaber.setRotation(-20, 180, 0);
        lightsaber.render();
      }
      if ((entity.getData("swhp:dyn/lightsaber") && entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer') > 0 && !entity.getData("swhp:dyn/lightsaberthrowanimation_timer") && entity.getHeldItem().isEmpty()) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")){
        lightsaberignitetop.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberignitebottom.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberignitetop2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberignitebottom2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberignitetop.setOffset(0.0, 0.0, 0.0);
        lightsaberignitebottom.setOffset(0.0, 0.0, 0.0);
        lightsaberignitetop2.setOffset(0.0, 0.0, 0.0);
        lightsaberignitebottom2.setOffset(0.0, 0.0, 0.0);
        lightsaberignitetop.render();
        lightsaberignitebottom.render();
        lightsaberignitetop2.render();
        lightsaberignitebottom2.render();
      }
    }
  }
  return obj;
  
}

function initDoubleParticles(renderer, particleType) {
  var type = "swhp:lightsaberignitesmoke_" + particleType;

  bindParticles(renderer, type).setCondition(entity => entity.getData("swhp:dyn/lightsaber") && (entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") > 0 && entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") < 1));
}

function initDoubleAnimations(renderer, igniteType, blockType) {
  addAnimationWithData(renderer, "double.LIGHTSABERUNHOLSTER", "swhp:lightsaberunholster", "swhp:dyn/lightsaber_timer");
  addAnimationWithData(renderer, "double.LIGHTSABERTHROW", "swhp:lightsaberthrowaiming", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));
  
  var block_event = blockType + ".BLOCKING";
  var block_anim = "swhp:lightsaberblock_" + blockType;
  var block_anim_display = blockType + ".DISPLAY";
  addAnimationWithData(renderer, block_event, block_anim, "fiskheroes:shield_blocking_timer")
    .priority = -5;
  addAnimation(renderer, block_anim_display, block_anim)
    .setData((entity, data) => data.load(1.0))
    .setCondition(entity => (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = 13;
  var ignite_event = igniteType + ".LIGHTSABERIGNITE";
  var ignite_anim = "swhp:lightsaberignite_" + igniteType;
  addAnimationWithData(renderer, ignite_event, ignite_anim, "swhp:dyn/lightsaberignite_timer");
}

function initDarkSaber(renderer, saberType, color) {

  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));

  var type = "swhp:lightsaber_" + saberType;

  var saber = renderer.createResource("MODEL", type);
  saber.texture.set("darksaber");

  var lightsaber = renderer.createEffect("fiskheroes:model");
  lightsaber.setModel(saber);
  lightsaber.setScale(0.425);

  var lightsaberignite_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite_darksaber");
  var lightsaberignite2_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite2_darksaber");
  var lightsaberignite3_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite3_darksaber");

  var lightsaberignite = createLines(renderer, lightsaberignite_effect, color, [
    {"start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -19.0], "size": [10.0, 20.0]},
  ]);
  lightsaberignite.anchor.set("rightArm");
  lightsaberignite.setScale(1.0);
  lightsaberignite.mirror = false;

  var lightsaberignitepoint = createLines(renderer, lightsaberignite_effect, color, [
    {"start": [0.0, 0.21, -18.8], "end": [0.0, -0.2, -20.5], "size": [10.0, 10.0]},
    {"start": [0.0, -0.2, -18.8], "end": [0.0, -0.2, -20.5], "size": [10.0, 10.0]},
  ]);
  lightsaberignitepoint.anchor.set("rightArm");
  lightsaberignitepoint.setScale(1.0);
  lightsaberignitepoint.mirror = false;

  var lightsaberignite2 = createLines(renderer, lightsaberignite2_effect, color, [
    {"start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -19.0], "size": [10.0, 20.0]},
  ]);
  lightsaberignite2.anchor.set("rightArm");
  lightsaberignite2.setScale(1.0);
  lightsaberignite2.mirror = false;

  var lightsaberignitepoint2 = createLines(renderer, lightsaberignite2_effect, color, [
    {"start": [0.0, 0.21, -18.8], "end": [0.0, -0.2, -20.5], "size": [10.0, 10.0]},
    {"start": [0.0, -0.2, -18.8], "end": [0.0, -0.2, -20.5], "size": [10.0, 10.0]},
  ]);
  lightsaberignitepoint2.anchor.set("rightArm");
  lightsaberignitepoint2.setScale(1.0);
  lightsaberignitepoint2.mirror = false;

  var lightsaberignite3 = createLines(renderer, lightsaberignite3_effect, color, [
    {"start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -19.0], "size": [10.1, 1.0]},
  ]);
  lightsaberignite3.anchor.set("rightArm");
  lightsaberignite3.setScale(1.0);
  lightsaberignite3.mirror = false;
  
  var obj = {
    render: (entity, renderLayer) => {
      if ((entity.getInterpolatedData("swhp:dyn/lightsaber_timer") > 0.5) && (entity.getHeldItem().isEmpty()) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
        lightsaber.anchor.set("rightArm");
        lightsaber.setOffset(1.2, 9.0, -6.0);
        lightsaber.setRotation(90, 0, 0);
        lightsaber.render();
      }
      if ((renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && !entity.isSneaking()) && !(entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
        lightsaber.anchor.set("body");
        lightsaber.setOffset(-2.5, 7.2, -2.5);
        lightsaber.setRotation(0, 90, 0);
        lightsaber.render();
      }
      if (renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && entity.isSneaking()) {
        lightsaber.anchor.set("body");
        lightsaber.setOffset(-2.5, 6.2, -3.0);
        lightsaber.setRotation(-20, 90, 0);
        lightsaber.render();
      }
      if ((entity.getData("swhp:dyn/lightsaber") && entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer') > 0 && entity.getHeldItem().isEmpty()) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")){
        lightsaberignite.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberignite2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberignite3.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberignite.setOffset(1.0, 8.8, -3.5);
        lightsaberignite2.setOffset(1.0, 8.8, -3.5);
        lightsaberignite3.setOffset(1.0, 8.8, -3.5);
        lightsaberignite.render();
        lightsaberignite2.render();
        lightsaberignite3.render();
      }
      if ((entity.getData("swhp:dyn/lightsaber") && entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer') == 1 && entity.getHeldItem().isEmpty()) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")){
        lightsaberignitepoint.setOffset(1.0, 8.8, -3.5);
        lightsaberignitepoint2.setOffset(1.0, 8.8, -3.5);
        lightsaberignitepoint.render();
        lightsaberignitepoint2.render();
      }
    }
  }
  return obj;
  
}

function initDarkSaberParticles(renderer, particleType) {
  var type = "swhp:lightsaberignitesmoke_" + particleType;

  bindParticles(renderer, type).setCondition(entity => entity.getData("swhp:dyn/lightsaber") && (entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") > 0 && entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") < 1));
}

function initDarkSaberAnimations(renderer, igniteType, blockType) {
  addAnimationWithData(renderer, "darksaber.LIGHTSABERUNHOLSTER", "swhp:lightsaberunholster", "swhp:dyn/lightsaber_timer");
  addAnimationWithData(renderer, "darksaber.LIGHTSABERTHROW", "swhp:lightsaberthrowaiming", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));
  
  var block_event = blockType + ".BLOCKING";
  var block_anim = "swhp:lightsaberblock_" + blockType;
  var block_anim_display = blockType + ".DISPLAY";
  addAnimationWithData(renderer, block_event, block_anim, "fiskheroes:shield_blocking_timer")
    .priority = -5;
  addAnimation(renderer, block_anim_display, block_anim)
    .setData((entity, data) => data.load(1.0))
    .setCondition(entity => (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = 13;
  var block_event = blockType + ".BLOCKING";
  var block_anim = "swhp:lightsaberblock_" + blockType;
  var block_anim_display = blockType + ".DISPLAY";
  addAnimationWithData(renderer, "jedi.BLOCKING", "swhp:lightsaberblock_jedi", "fiskheroes:shield_blocking_timer")
    .priority = -5;
  addAnimation(renderer, "jedi.DISPLAY", "swhp:lightsaberblock_jedi")
    .setData((entity, data) => data.load(1.0))
    .setCondition(entity => (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = 13;
  var ignite_event = igniteType + ".LIGHTSABERIGNITE";
  var ignite_anim = "swhp:lightsaberignite_" + igniteType;
  addAnimationWithData(renderer, ignite_event, ignite_anim, "swhp:dyn/lightsaberignite_timer");
}

function initDualBackwards(renderer, saberTypeRight, saberTypeLeft, colorRight, colorLeft) {

  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));

  var leftType = "swhp:lightsaber_" + saberTypeLeft;
  var rightType = "swhp:lightsaber_" + saberTypeRight;

  var saberright = renderer.createResource("MODEL", rightType);
  saberright.texture.set("lightsaberright");
  var saberleft = renderer.createResource("MODEL", leftType);
  saberleft.texture.set("lightsaberleft");

  var lightsaberright = renderer.createEffect("fiskheroes:model");
  lightsaberright.setModel(saberright);
  lightsaberright.setScale(0.425);

  var lightsaberleft = renderer.createEffect("fiskheroes:model");
  lightsaberleft.setModel(saberleft);
  lightsaberleft.setScale(0.425);

  var lightsaberignite_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite");
  var lightsaberignite2_effect = renderer.createResource("BEAM_RENDERER", "swhp:lightsaberignite2");

  var lightsaberigniteright = createLines(renderer, lightsaberignite_effect, colorRight, [
    {"start": [-1.0, 9.0, 7.1], "end": [-1.0, 9.0, 27.1], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteright.anchor.set("rightArm");
  lightsaberigniteright.setScale(1.0);
  lightsaberigniteright.mirror = false;

  var lightsaberigniteleft = createLines(renderer, lightsaberignite_effect, colorLeft, [
    {"start": [1.0, 9.0, 7.1], "end": [1.0, 9.0, 19.1], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteleft.anchor.set("leftArm");
  lightsaberigniteleft.setScale(1.0);
  lightsaberigniteleft.mirror = false;

  var lightsaberigniteright2 = createLines(renderer, lightsaberignite2_effect, colorRight, [
    {"start": [-1.0, 9.0, 7.1], "end": [-1.0, 9.0, 27.6], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteright2.anchor.set("rightArm");
  lightsaberigniteright2.setScale(1.0);
  lightsaberigniteright2.mirror = false;

  var lightsaberigniteleft2 = createLines(renderer, lightsaberignite2_effect, colorLeft, [
    {"start": [1.0, 9.0, 7.1], "end": [1.0, 9.0, 19.6], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteleft2.anchor.set("leftArm");
  lightsaberigniteleft2.setScale(1.0);
  lightsaberigniteleft2.mirror = false;

  var lightsaberigniteright_throw = createLines(renderer, lightsaberignite_effect, colorRight, [
    {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, 22.5], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteright_throw.anchor.set("rightArm");
  lightsaberigniteright_throw.setScale(1.0);
  lightsaberigniteright_throw.mirror = false;

  var lightsaberigniteleft_throw = createLines(renderer, lightsaberignite_effect, colorLeft, [
    {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, 14.5], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteleft_throw.anchor.set("leftArm");
  lightsaberigniteleft_throw.setScale(1.0);
  lightsaberigniteleft_throw.mirror = false;

  var lightsaberigniteright2_throw = createLines(renderer, lightsaberignite2_effect, colorRight, [
    {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, 23.0], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteright2_throw.anchor.set("rightArm");
  lightsaberigniteright2_throw.setScale(1.0);
  lightsaberigniteright2_throw.mirror = false;

  var lightsaberigniteleft2_throw = createLines(renderer, lightsaberignite2_effect, colorLeft, [
    {"start": [0.0, 0.0, 2.5], "end": [0.0, 0.0, 15.0], "size": [10.0, 10.0]},
  ]);
  lightsaberigniteleft2_throw.anchor.set("leftArm");
  lightsaberigniteleft2_throw.setScale(1.0);
  lightsaberigniteleft2_throw.mirror = false;

  var obj = {
    render: (entity, renderLayer) => {
      if ((entity.getInterpolatedData("swhp:dyn/lightsaber_timer") > 0.5) && (entity.getHeldItem().isEmpty()) && (!entity.getData("swhp:dyn/lightsaberthrowanimation_timer")) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
        lightsaberright.anchor.set("rightArm");
        lightsaberright.setOffset(1.0, 9.0, 5.0);
        lightsaberright.setRotation(90, 0, 180);
        lightsaberleft.anchor.set("leftArm");
        lightsaberleft.setOffset(-1.0, 9.0, 5.0);
        lightsaberleft.setRotation(90, 180, 180);
        lightsaberright.render();
        lightsaberleft.render();
      }
      if ((entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer") > 0) && (entity.getHeldItem().isEmpty())) {
        lightsaberigniteright_throw.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), 5.0);
        lightsaberigniteleft_throw.setOffset(-1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), 5.0);
        lightsaberigniteright2_throw.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), 5.0);
        lightsaberigniteleft2_throw.setOffset(-1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), 5.0);
        lightsaberigniteright_throw.setRotation(-720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberigniteleft_throw.setRotation(-720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberigniteright2_throw.setRotation(-720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberigniteleft2_throw.setRotation(-720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer"), 0, 0);
        lightsaberigniteright_throw.progress = true;
        lightsaberigniteleft_throw.progress = true;
        lightsaberigniteright2_throw.progress = true;
        lightsaberigniteleft2_throw.progress = true;
        lightsaberigniteright2_throw.render();
        lightsaberigniteleft2_throw.render();
        lightsaberigniteright_throw.render();
        lightsaberigniteleft_throw.render();
        lightsaberright.setOffset(1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), 5.0);
        lightsaberleft.setOffset(-1.0, ((200 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) + 9.0), 5.0);
        lightsaberright.setRotation((-720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) - 90, 0, 0);
        lightsaberleft.setRotation((-720 * entity.getInterpolatedData("swhp:dyn/lightsaberthrowanimation_timer")) - 90, 0, 0);
        lightsaberright.render();
        lightsaberleft.render();
      }
      if ((renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && !entity.isSneaking()) && !(entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) {
        lightsaberright.anchor.set("body");
        lightsaberright.setOffset(-2.5, 19.2, -3.0);
        lightsaberright.setRotation(0, 180, 180);
        lightsaberleft.anchor.set("body");
        lightsaberleft.setOffset(2.5, 19.2, -3.0);
        lightsaberleft.setRotation(0, 0, 180);
        lightsaberright.render();
        lightsaberleft.render();
      }
      if (renderLayer == "CHESTPLATE" && entity.getInterpolatedData("swhp:dyn/lightsaber_timer") < 0.5 && entity.isSneaking()) {
        lightsaberright.render();
        lightsaberright.anchor.set("body");
        lightsaberright.setOffset(-2.5, 18.2, -7.5);
        lightsaberright.setRotation(-20, 180, 180);
        lightsaberleft.anchor.set("body");
        lightsaberleft.setOffset(2.5, 18.2, -7.5);
        lightsaberleft.setRotation(-20, 180, 180);
        lightsaberleft.render();
      }
      if ((entity.getData("swhp:dyn/lightsaber") && entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer') > 0 && !entity.getData("swhp:dyn/lightsaberthrowanimation_timer") && entity.getHeldItem().isEmpty()) || (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")){
        lightsaberigniteright.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberigniteleft.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberigniteright2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberigniteleft2.progress = Math.max(1 - (1 - entity.getInterpolatedData('swhp:dyn/lightsaberignite_timer')) * 1, 0) + (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM");
        lightsaberigniteright.setOffset(0.0, 0.0, 0.0);
        lightsaberigniteleft.setOffset(0.0, 0.0, 0.0);
        lightsaberigniteright2.setOffset(0.0, 0.0, 0.0);
        lightsaberigniteleft2.setOffset(0.0, 0.0, 0.0);
        lightsaberigniteright2.render();
        lightsaberigniteleft2.render();
        lightsaberigniteright.render();
        lightsaberigniteleft.render();
      }
    }
  }
  return obj;
}

function initDualBackwardsParticles(renderer, right, left) {
  var rightType = "swhp:lightsaberignitesmokebackwards_" + right;
  var leftType = "swhp:lightsaberignitesmokebackwards_left_" + left;

  bindParticles(renderer, rightType).setCondition(entity => entity.getData("swhp:dyn/lightsaber") && (entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") > 0 && entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") < 1));
  bindParticles(renderer, leftType).setCondition(entity => entity.getData("swhp:dyn/lightsaber") && (entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") > 0 && entity.getInterpolatedData("swhp:dyn/lightsaberignite_timer") < 1));
}

function initDualBackwardsAnimations(renderer, igniteType, blockType) {
  addAnimationWithData(renderer, "dual.LIGHTSABERUNHOLSTER", "swhp:lightsaberunholster_dual", "swhp:dyn/lightsaber_timer");
  addAnimationWithData(renderer, "dual.LIGHTSABERTHROW", "swhp:lightsaberthrowaiming_dual", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/sith_ability_cycle") == 4 || entity.getData("swhp:dyn/jedi_ability_cycle") == 3)));
  addAnimationWithData(renderer, "dual.LIGHTSABERDUALWIELD", "swhp:dualwield", "swhp:dyn/lightsaberignite").setCondition(entity => entity.isPunching() &&  !entity.getData("fiskheroes:shield_blocking_timer"));
  
  var block_event = blockType + ".BLOCKING";
  var block_anim = "swhp:lightsaberblock_" + blockType;
  var block_anim_display = blockType + ".DISPLAY";
  addAnimationWithData(renderer, block_event, block_anim, "fiskheroes:shield_blocking_timer")
    .priority = -5;
  addAnimation(renderer, block_anim_display, block_anim)
    .setData((entity, data) => data.load(1.0))
    .setCondition(entity => (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = 13;
  var ignite_event = igniteType + ".LIGHTSABERIGNITE";
  var ignite_anim = "swhp:lightsaberignite_" + igniteType;
  addAnimationWithData(renderer, ignite_event, ignite_anim, "swhp:dyn/lightsaberignite_timer");
}