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

function bindParticles(renderer, particleType) {
  return renderer.bindProperty("fiskheroes:particles").setParticles(renderer.createResource("PARTICLE_EMITTER", particleType));
}

function bindCloud(renderer, propertyName, cloudType) {
  return renderer.bindProperty(propertyName).setCloud(renderer.createResource("PARTICLE_CLOUD", cloudType));
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

function addCameraShake(renderer, factor, intensity, data) {
  var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
      shake.factor = factor * entity.getInterpolatedData(data);
      return true;
  });
  shake.intensity = intensity;
}

//Vader Special
function initVaderSpecial(renderer, type, value) {
  var data = "swhp:dyn/" + type + "_ability_cycle";
  var specialmove1 = renderer.createResource("MODEL", "swhp:special_darthvader");
  specialmove1.texture.set("special");
  specialmove1.bindAnimation("swhp:vaderspecial1").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:beam_charge"));
  });

  var specialmove2 = renderer.createResource("MODEL", "swhp:special_darthvader");
  specialmove2.texture.set("special");
  specialmove2.bindAnimation("swhp:vaderspecial2").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:beam_shooting"));
  });

  special1 = renderer.createEffect("fiskheroes:model").setModel(specialmove1);
  special1.anchor.set("head");

  special2 = renderer.createEffect("fiskheroes:model").setModel(specialmove2);
  special2.anchor.set("head");

  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == 3));

  var obj = {
    special1: special1,
    special2: special2,
    data: data,
    value: value,
    render: (entity) => {
      if (entity.getData(data) == value) {
        if (entity.getData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge") < 1) {
            special1.render();
        }
        if (entity.getInterpolatedData("fiskheroes:beam_charge") == 1 && entity.getInterpolatedData("fiskheroes:beam_shooting_timer") > 0) {
            special2.render();
        }
      }
    }
  }

  return obj;
}

//Heroic Might
function initHeroicMight(renderer, type, value) {
  var data = "swhp:dyn/" + type + "_ability_cycle";
  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x2719C7, [
    { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == value));

  bindParticles(renderer, "swhp:heroicmight_charge").setCondition(entity => entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting"));

  bindParticles(renderer, "swhp:heroicmight").setCondition(entity => entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0);

  var heroicmightchargeshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
  heroicmightchargeshake.factor = 0.1;

  var heroicmightshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0));
  heroicmightshake.factor = 0.2;
}

//Fury
function initFury(renderer, type, value) {
  var data = "swhp:dyn/" + type + "_ability_cycle";
  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == value));

  bindParticles(renderer, "swhp:shatterpoint_charge").setCondition(entity => entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting"));

  var furychargeshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
  furychargeshake.factor = 0.1;

  var furyshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0));
  furyshake.factor = 0.2;

  var specialmove1 = renderer.createResource("MODEL", "swhp:special_darthvader");
  specialmove1.texture.set("special");
  specialmove1.bindAnimation("swhp:vaderspecial1").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:beam_charge"));
  });

  var specialmove2 = renderer.createResource("MODEL", "swhp:special_darthvader");
  specialmove2.texture.set("special");
  specialmove2.bindAnimation("swhp:vaderspecial2").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:beam_shooting"));
  });

  special1 = renderer.createEffect("fiskheroes:model").setModel(specialmove1);
  special1.anchor.set("head");

  special2 = renderer.createEffect("fiskheroes:model").setModel(specialmove2);
  special2.anchor.set("head");

  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == 3));

  var obj = {
    special1: special1,
    special2: special2,
    data: data,
    value: value,
    render: (entity) => {
      if (entity.getData(data) == value) {
        if (entity.getData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge") < 1) {
            special1.render();
        }
        if (entity.getInterpolatedData("fiskheroes:beam_charge") == 1 && entity.getInterpolatedData("fiskheroes:beam_shooting_timer") > 0) {
            special2.render();
        }
      }
    }
  }

  return obj;
}

//Shatter Point
function initShatterPoint(renderer, type, value) {
  var data = "swhp:dyn/" + type + "_ability_cycle";
  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
    { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == value));

  bindParticles(renderer, "swhp:shatterpoint_charge").setCondition(entity => entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting"));

  var shatterpointchargeshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
  shatterpointchargeshake.factor = 0.1;

  var shatterpointshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0));
  shatterpointshake.factor = 0.2;
}

//Double Blade Spin
function initDoubleBladeSpin(renderer, type, value) {
  var data = "swhp:dyn/" + type + "_ability_cycle";
  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xff232d, [
    { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == value));

  bindParticles(renderer, "swhp:shatterpoint_charge").setCondition(entity => entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting"));

  var doublebladespinchargeshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
  doublebladespinchargeshake.factor = 0.1;

  var doublebladespinshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0));
  doublebladespinshake.factor = 0.2;
}

//Darth Revan Lightning Storm
function initLightningStorm(renderer, color, type, value) {
  var data = "swhp:dyn/" + type + "_ability_cycle";
  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", color, [
    { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == value));

  var lightningstormchargeshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
  lightningstormchargeshake .factor = 0.1;

  var lightningstormshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_shooting_timer") > 0));
  lightningstormshake .factor = 0.2;

  var lightningstorm_beam = renderer.createResource("BEAM_RENDERER", "swhp:lightningstorm");

  var lightningstorm = createLines(renderer, lightningstorm_beam, color, [
    {"start": [-10.0, -100.0, 4.0], "end": [-10.0, 0.0, 4.0], "size": [10.0, 10.0]},
  ]);
  lightningstorm.anchor.set("body");
  lightningstorm.setScale(1.5);
  lightningstorm.mirror = false;

  var obj = {
    lightningstorm: lightningstorm,
    data: data,
    value: value,
    render: (entity) => {
      if (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging")){
        lightningstorm.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        lightningstorm.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        lightningstorm.render();
      }
    }
  }

  return obj;
}

//Force Lightning
function initForceLightning(renderer, color, type, value) {
  var data = "swhp:dyn/" + type + "_ability_cycle";
  bindBeam(renderer, "fiskheroes:charged_beam", "swhp:forcelightning", "leftArm", color, [
    { "firstPerson": [3.75, 3.0, 0.0], "offset": [-0.5, 4.0, 0.0], "size": [2.0, 2.0] }
  ]).setCondition(entity => (entity.getData(data) == value));

  var forcelightningchargeshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
  forcelightningchargeshake.factor = 0.05;

  var forcelightningshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData(data) == value && entity.getData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_shooting_timer") > 0));
  forcelightningshake.factor = 0.1;

  var forcelightningsurge_beam = renderer.createResource("BEAM_RENDERER", "swhp:forcelightningsurge");

  var forcelightningsurgearm = createLines(renderer, forcelightningsurge_beam, color, [
    {"start": [0.3, -1.0, -1.1], "end": [1.7, 6.5, -1.1], "size": [10.0, 10.0]},
    {"start": [1.7, -1.0, -1.1], "end": [0.3, 6.5, -1.1], "size": [10.0, 10.0]},

    {"start": [0.3, -1.0, 1.1], "end": [1.7, 6.5, 1.1], "size": [10.0, 10.0]},
    {"start": [1.7, -1.0, 1.1], "end": [0.3, 6.5, 1.1], "size": [10.0, 10.0]},

    {"start": [1.8, -1.0, 1.0], "end": [1.8, 6.5, -1.0], "size": [10.0, 10.0]},
    {"start": [1.8, -1.0, -1.0], "end": [1.8, 6.5, 1.0], "size": [10.0, 10.0]},

    {"start": [-0.4, -1.0, 1.0], "end": [-0.4, 6.5, -1.0], "size": [10.0, 10.0]},
    {"start": [-0.4, -1.0, -1.0], "end": [-0.4, 6.5, 1.0], "size": [10.0, 10.0]},
  ]);
  forcelightningsurgearm.anchor.set("leftArm");
  forcelightningsurgearm.setScale(1.5);
  forcelightningsurgearm.mirror = false;

  var obj = {
    forcelightningsurgearm: forcelightningsurgearm,
    data: data,
    value: value,
    render: (entity) => {
      if (entity.getData(data) == value && entity.getData("fiskheroes:beam_charge")){
        forcelightningsurgearm.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        forcelightningsurgearm.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        forcelightningsurgearm.render();
      }
    }
  }

  return obj;
}