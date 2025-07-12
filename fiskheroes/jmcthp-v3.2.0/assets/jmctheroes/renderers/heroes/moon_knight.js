extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:moon/moon_knight_layer1",
    "layer2": "jmctheroes:moon/moon_knight_layer2",
    "layer1_lights": "jmctheroes:moon/moon_knight_lights_layer1",
    "layer2_lights": "jmctheroes:moon/moon_knight_lights_layer2",
    "cape": "jmctheroes:moon/moon_knight_cape",
    "truncheons": "jmctheroes:moon/truncheons",
    "crescent": "jmctheroes:moon/crescent"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
//var capeDay;
var capeNight;
var truncheon2;
var truncheon;
var dart2;
var dart;
var overlay, overlaySecond;
//var baseLayer1, baseLayer2;

function init(renderer) {
  parent.init(renderer);

  truncheon = renderer.createEffect("fiskheroes:model");
  truncheon.setModel(utils.createModel(renderer,  "jmctheroes:truncheons", null, "truncheons"));
  truncheon.anchor.set("rightArm");

  truncheon2 = renderer.createEffect("fiskheroes:model");
  truncheon2.setModel(utils.createModel(renderer,  "jmctheroes:truncheons", null, "truncheons"));
  truncheon2.anchor.set("leftArm");
  truncheon2.setOffset(-2.0, 0.0, 0.0);

  dart = renderer.createEffect("fiskheroes:model");
  dart.setModel(utils.createModel(renderer,  "jmctheroes:crescentdarts", null, "crescent"));
  dart.anchor.set("rightArm");
  dart.setOffset(0.0, 0.5, 0.0);
  dart.setScale(0.9);

  dart2 = renderer.createEffect("fiskheroes:model");
  dart2.setModel(utils.createModel(renderer,  "jmctheroes:crescentdarts", null, "crescent"));
  dart2.anchor.set("leftArm");
  dart2.setOffset(-2.0, 0.5, 0.0);
  dart2.setScale(0.9);
}
function initEffects(renderer) {
  var physics = renderer.createResource("CAPE_PHYSICS", null);
  physics.maxFlare = 1;
  physics.flareDegree = 1.5;
  physics.flareFactor = 1.5;
  physics.flareElasticity = 5;

  //capeDay = capes.createGlider(renderer, 24, "jmctheroes:moon_cape.mesh.json", physics);
  //capeDay.effect.texture.set("cape", null);

  capeNight = capes.createGlider(renderer, 24, "jmctheroes:moon_cape.mesh.json", physics);
  capeNight.effect.texture.set(null, "cape");

  overlay = renderer.createEffect("fiskheroes:overlay");
  overlay.texture.set(null, "layer1_lights");
  overlaySecond = renderer.createEffect("fiskheroes:overlay");
  overlaySecond.texture.set(null, "layer2_lights");

  //baseLayer1 = renderer.createEffect("fiskheroes:overlay");
  //baseLayer1.texture.set("layer1_lights", null);
  //baseLayer2 = renderer.createEffect("fiskheroes:overlay");
  //baseLayer2.texture.set("layer2_lights", null);

}

function initAnimations(renderer) {
  parent.initAnimations(renderer);  
  addAnimation(renderer, "moon.GEAR", "jmctheroes:hand").setData((entity, data) => {
      data.load(Math.max(entity.getInterpolatedData("fiskheroes:blade_timer") || entity.getInterpolatedData("fiskheroes:shield_timer")));
  });
}

function render(entity, renderLayer, isFirstPersonArm) {
  var blade = entity.getData('fiskheroes:blade_timer') > 0.5; 
  var shield = entity.getData('fiskheroes:shield_timer') > 0.5;
  //var day = entity.getData('jmctheroes:dyn/day');
  //var night = entity.getData('jmctheroes:dyn/night');

  if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
    //capeDay.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
    //capeNight.effect.opacity = 1 - day;
    capeNight.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
  }
  if (renderLayer == "CHESTPLATE" && shield) {
    truncheon.render();
    truncheon2.render();
  }
  if (renderLayer == "CHESTPLATE" && blade) {
    dart.render();
    dart2.render();
  }
  if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
    //overlay.opacity = entity.getInterpolatedData("jmctheroes:dyn/night") || entity.isDisplayStand();
    overlay.render();
    //baseLayer1.opacity = entity.getInterpolatedData("jmctheroes:dyn/day");
    //baseLayer1.render();
  }
  if (renderLayer == "LEGGINGS") {
    //overlaySecond.opacity = entity.getInterpolatedData("jmctheroes:dyn/night") || entity.isDisplayStand();
    overlaySecond.render();
    //baseLayer2.opacity = entity.getInterpolatedData("jmctheroes:dyn/day");
    //baseLayer2.render();
  }
}