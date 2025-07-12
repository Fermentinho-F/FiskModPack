extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:kahhori",
    "layer2": "zaro:kahhori"
});

var speedster = implement("fiskheroes:external/speedster_utils");

var utils = implement("fiskheroes:external/utils");


function init(renderer) {
   parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => renderLayer == "HELMET" || renderLayer == "LEGGINGS" ? "layer2" : "layer1");
    
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    speedster.init(renderer, "zaro:lightning_kahhori");

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x55FFFF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "zaro:telekinesis_kahhori");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "zaro:teleportation_kahhori");

utils.bindBeam(renderer, "fiskheroes:charged_beam", "zaro:energy_projection","body", 0x55FFFF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0],"anchor": "rightArm" },
        { "firstPerson": [4.5, 3.75, -8.0], "offset": [0.5, 9.0, 0.0], "size": [3.0, 3.0], "anchor": "leftArm" }
    ]);  

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:dual_aiming", "fiskheroes:beam_charge");
}


