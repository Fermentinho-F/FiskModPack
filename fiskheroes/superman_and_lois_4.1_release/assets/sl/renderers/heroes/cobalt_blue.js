extend("fiskheroes:hero_basic");

loadTextures({
  "layer1": "sl:cobalt_blue_layer1",
  "layer2": "sl:cobalt_blue_layer2",
  "lights": "fiskheroes:reverse_flash_eyes",
  "vib": "sl:vibration",
  "crystal": "sl:cobalt_blue_lights",
  "eyes": "sl:lb_eyes"
});

var speedster = implement("fiskheroes:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");
var vibration;
var sword;
var sword2;
var vibrationoverlay;
var eye;
var eye2;
var mandalas = implement("sl:external/speedster_construct");

function init(renderer, trailType) {
  parent.init(renderer);
  renderer.setTexture((entity, renderLayer) =>
    renderLayer === "HELMET" || renderLayer === "LEGGINGS" ? "layer2" : "layer1"
  );

  renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" ? "crystal" : null);

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

// Function to update the intensity gradually
function updateIntensity() {
    var landingTimer = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
    var intensity = 0.1 - (0.1 * landingTimer); // Gradually decrease the intensity as the landing timer progresses
    shake2.intensity = intensity > 0 ? intensity : 0;
}

// Call the updateIntensity function periodically or whenever necessary
  var vel9 = (entity => entity.hasStatusEffect("fiskheroes:velocity_nine"));
  parent.initEffects(renderer);
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var speed = entity.getData("fiskheroes:speed");
        shake.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

var anim = renderer.createResource("ANIMATION", "sl:gradual_speedster_sprint");
anim.setData((entity, data) => {
    var lean_factor = entity.getData("fiskheroes:speed") / 40;
    var speed_sprint_timer = entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer");

    // Adjust leaning sensitivity
    var leaningSensitivity = 40.0;

    // Calculate leaning angle based on player's speed
    var leaningAngle = lean_factor / (1 + entity.getData("fiskheroes:speed") / leaningSensitivity);

    // Apply leaning angle to the animation
    data.load(1, (leaningAngle + 0.15) * speed_sprint_timer);
    data.load(0, entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"));
});
renderer.addCustomAnimation("speedster.SPRINT", anim);


  utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:null", "body", 0xFF0000, [
      { "offset": [0.0, 0.0, 0.0], "size": [0.0, 0.0] }
  ]);

  utils.bindCloud(renderer, "fiskheroes:teleportation", "fiskheroes:breach");

   utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:speed_lightning", "rightArm", 0xFF0000, [
      { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] },
      { "firstPerson": [4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "leftArm" }
  ]).setCondition(entity => !entity.hasStatusEffect("fiskheroes:velocity_nine") && !entity.hasStatusEffect("fiskheroes:speed_sickness"));

   utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:speed_lightning", "rightArm", 0x0068FF, [
      { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] },
      { "firstPerson": [4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0], "anchor": "leftArm" }
  ]).setCondition(entity => entity.hasStatusEffect("fiskheroes:velocity_nine") || entity.hasStatusEffect("fiskheroes:speed_sickness"));

  utils.setOpacityWithData(renderer, 0, 1.0, "sl:dyn/invis_timer");

  utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF0000, [
    { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
  ]).setCondition(entity => !entity.hasStatusEffect("fiskheroes:velocity_nine") && !entity.hasStatusEffect("fiskheroes:speed_sickness"));

  utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xADD8E6, [
    { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
  ]).setCondition(entity => entity.hasStatusEffect("fiskheroes:velocity_nine") || entity.hasStatusEffect("fiskheroes:speed_sickness"));

  utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0x8B0000, [
    { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
  ]).setCondition(entity => !entity.hasStatusEffect("fiskheroes:velocity_nine") && !entity.hasStatusEffect("fiskheroes:speed_sickness"));

  utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xADD8E6, [
    { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
  ]).setCondition(entity => entity.hasStatusEffect("fiskheroes:velocity_nine") || entity.hasStatusEffect("fiskheroes:speed_sickness"));

  vibration = renderer.createEffect("fiskheroes:vibration");

  vibrationoverlay = renderer.createEffect("fiskheroes:overlay");
  vibrationoverlay.texture.set("vib", null);

  eye = renderer.createEffect("fiskheroes:overlay");
  eye.texture.set(null, "lights");

  eye2 = renderer.createEffect("fiskheroes:overlay");
  eye2.texture.set(null, "eyes");

  utils.bindTrail(renderer, "sl:uncharged_lightning_red").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.hasStatusEffect("fiskheroes:speed_sickness") && !entity.hasStatusEffect("fiskheroes:velocity_nine") && !(entity.getData("fiskheroes:energy_charge") === 1.0));

  utils.bindTrail(renderer, "sl:charged_lightning_red").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.hasStatusEffect("fiskheroes:speed_sickness") && !entity.hasStatusEffect("fiskheroes:velocity_nine") && (entity.getData("fiskheroes:energy_charge") === 1.0));

utils.bindTrail(renderer, "sl:blue_speedster_lightning")
  .setCondition(entity =>
    (entity.getData("fiskheroes:speeding") && entity.hasStatusEffect("fiskheroes:speed_sickness") && entity.getData("fiskheroes:energy_charge") < 1.0) ||
    (entity.getData("fiskheroes:speeding") && entity.hasStatusEffect("fiskheroes:velocity_nine") && entity.getData("fiskheroes:energy_charge") < 1.0)
  );

utils.bindTrail(renderer, "sl:charged_blue_speedster_lightning")
  .setCondition(entity =>
    (entity.getData("fiskheroes:speeding") && entity.hasStatusEffect("fiskheroes:speed_sickness") && entity.getData("fiskheroes:energy_charge") === 1.0) ||
    (entity.getData("fiskheroes:speeding") && entity.hasStatusEffect("fiskheroes:velocity_nine") && entity.getData("fiskheroes:energy_charge") === 1.0)
  );


    sword = utils.createLines(renderer, ("BEAM_RENDERER", "sl:lightning_construct"), 0xFF1111, [
        {"start": [-0.1, 0.5, 1.0], "end": [0.1, 0.8, -10.0], "size": [1.0, 1.0]},
    ]);

    sword2 = utils.createLines(renderer, ("BEAM_RENDERER", "sl:lightning_construct"), 0x147CFF, [
        {"start": [-0.1, 0.5, 1.0], "end": [0.1, 0.8, -10.0], "size": [1.0, 1.0]},
    ]);

    sword.setOffset(1.0, 6.0, 0.0)
    sword.setScale(2.0, 4.0, 2.0)
    sword.anchor.set("rightArm");

    sword2.setOffset(1.0, 6.0, 0.0)
    sword2.setScale(2.0, 4.0, 2.0)
    sword2.anchor.set("rightArm");

    var color = 0xFF0000;
    var tao_mandala = renderer.createResource("SHAPE", "fiskheroes:tao_mandala");
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:line");
    shield = mandalas.create(renderer, color, tao_mandala, beam);
    shield2 = mandalas.create(renderer, 0x2F3BF8, tao_mandala, beam);

    utils.bindParticles(renderer, "sl:flight_smoke").setCondition(entity => entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0);
  utils.bindParticles(renderer, "sl:landing_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') > 10 && entity.getInterpolatedData('fiskheroes:dyn/superhero_landing_ticks') < 14);

}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.PROPELLED_FLIGHT");

    addAnimationWithData(renderer, "cobalt.JETPACK", "sl:wall_run", "fiskheroes:jetpacking_timer");

    addAnimationWithData(renderer, "cobalt.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer").priority = -8;

    addAnimation(renderer, "cobalt.MIRAGE", "sl:speedmirage/mirage").setData((entity, data) => data.load(Math.max(entity.getData("sl:dyn/mirage") && Math.random() < 0.5)))
    .priority = -10;
    addAnimation(renderer, "cobalt.MIRAGE1", "sl:speedmirage/mirage3").setData((entity, data) => data.load(Math.max(entity.getData("sl:dyn/mirage") && Math.random() < 0.5)))
    .priority = -10;

    addAnimationWithData(renderer, "cobalt.TORNADO", "sl:aim", "fiskheroes:beam_charge");

    addAnimationWithData(renderer, "cobalt.ARMS", "sl:vortex", "fiskheroes:beam_shooting");
    addAnimationWithData(renderer, "parasite.ENERGY_PROJ", "fiskheroes:dual_aiming", "fiskheroes:energy_projection_timer")

 addAnimation(renderer, "flash.WALL_RUNNING", "sl:wall_running")
    .setData((entity, data) => {
data.load(0, entity.getData("fiskheroes:jetpacking_timer") == 1 
    ? Math.sin(entity.loop(2.5 * Math.PI) * Math.PI * 2) 
    : 0
);

data.load(1, entity.getData("fiskheroes:jetpacking_timer") == 1 
    ? Math.sin(entity.loop(2.5 * Math.PI) * Math.PI * 2) 
    : 0
);

    });

}

function render(entity, renderLayer, isFirstPersonArm) {
  parent.render(entity, renderLayer, isFirstPersonArm);
  sword.opacity = entity.getInterpolatedData("sl:dyn/construct_timer");
  sword2.opacity = entity.getInterpolatedData("sl:dyn/construct_timer");

  if (!entity.hasStatusEffect("fiskheroes:velocity_nine")  && !entity.hasStatusEffect("fiskheroes:speed_sickness")) {
    sword.render();
    shield.render(entity, isFirstPersonArm);
  }

  if (entity.hasStatusEffect("fiskheroes:velocity_nine") || entity.hasStatusEffect("fiskheroes:speed_sickness")) {
    sword2.render();
    shield2.render(entity, isFirstPersonArm);
  }

  vibrationoverlay.opacity = 0.2;

  if (
    renderLayer === "CHESTPLATE" ||
    renderLayer === "LEGGINGS" ||
    renderLayer === "HELMET" ||
    renderLayer === "BOOTS"
  ) {
    if (
      !entity.isDisplayStand() &&
      (entity.getData("fiskheroes:mask_open") ||
        entity.getData("fiskheroes:intangible") ||
        entity.getData("sl:dyn/mirage"))
    ) {
      if (!entity.hasStatusEffect("fiskheroes:velocity_nine")  && !entity.hasStatusEffect("fiskheroes:speed_sickness")) {
        eye.render();
      } else {
        eye2.render();
      }
      vibration.render();
      vibrationoverlay.render();
    }
  }
}
