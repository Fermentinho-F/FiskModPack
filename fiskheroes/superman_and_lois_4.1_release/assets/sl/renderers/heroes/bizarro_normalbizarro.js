extend("sl:bizarro");
loadTextures({
  "layer1": "sl:normalbizarro_layer1",
  "layer2": "sl:s1_layer2",
  "eyes": "sl:bizarro_lights_layer1",
  "cape": "sl:normalbizarro_cape",
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
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" ? null : null);

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg", "body");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

