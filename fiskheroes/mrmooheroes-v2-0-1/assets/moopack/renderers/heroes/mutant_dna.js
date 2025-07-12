extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:dna/dna_base"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {    
    utils.bindCloud(renderer, "fiskheroes:teleportation", "fiskheroes:breach");

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "moopack:creetle_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
