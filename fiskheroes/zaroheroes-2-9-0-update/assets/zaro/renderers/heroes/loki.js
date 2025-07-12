extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:loki",
    "layer2": "zaro:loki"
});

var utils = implement("fiskheroes:external/utils");


function init(renderer) {
   parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => renderLayer == "HELMET" || renderLayer == "LEGGINGS" ? "layer2" : "layer1");
    
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x50C878);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });


    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorEarthCrack.set(0x50C878);
    magic.colorAtmosphere.set(0x50C878);
    magic.colorGeneric.set(0x50C878);
    magic.colorWhip.set(0x50C878);
   
   
    utils.bindCloud(renderer, "fiskheroes:telekinesis", "zaro:telekinesis_loki");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "zaro:teleportation_loki");

utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam","body", 0x50C878, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0],"anchor": "rightArm" },
        { "firstPerson": [4.5, 3.75, -8.0], "offset": [0.5, 9.0, 0.0], "size": [3.0, 3.0], "anchor": "leftArm" }
    ]);  

  renderer.bindProperty("fiskheroes:gravity_manipulation").color.set(0x50C878);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:dual_aiming", "fiskheroes:beam_charge");
}


