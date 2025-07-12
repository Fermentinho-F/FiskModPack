extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:dna/dna_base"
});

var speedster = implement("fiskheroes:external/speedster_utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {    
    speedster.init(renderer, "moopack:lightning_jade");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
