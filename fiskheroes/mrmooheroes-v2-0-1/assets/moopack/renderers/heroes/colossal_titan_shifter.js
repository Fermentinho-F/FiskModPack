extend("fiskheroes:hero_basic");
loadTextures({
    "base": "moopack:titan_shifter/bertholdt_titan",
    "suit": "moopack:titan_shifter/bertholdt_titan.tx.json",
    "reactor": "moopack:dna/dna_base"
});

var utils = implement("fiskheroes:external/utils");

var bolt;
var bolt2;
var glow;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.isDisplayStand()) {
            var timer = entity.getInterpolatedData("moopack:dyn/titan_timer");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {

    bolt = utils.createLines(renderer, "moopack:titan", 0xFFF56D,[
        {"start": [0.0, 25.0, 0.0], "end": [0.0, -512, 0.0], "size": [100, 100]},
    ]);
    bolt.anchor.set("body");

    bolt2 = utils.createLines(renderer, "moopack:titan", 0xFFF56D,[
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -128, 0.0], "size": [100, 100]},
    ]);
    bolt2.anchor.set("body");
    utils.bindParticles(renderer, "moopack:titan_smoke").setCondition(entity => entity.getInterpolatedData('moopack:dyn/titan_timer') > 0 && entity.getInterpolatedData('moopack:dyn/titan_timer') < 1);

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xFFFFFF);

    utils.bindParticles(renderer, "moopack:titan_glow");
    utils.bindTrail(renderer, "moopack:titan_lightning");

    utils.bindTrail(renderer, "moopack:titan_spawn").setCondition(entity => entity.getData("moopack:dyn/titan_timer") < 1 
    && entity.getData("moopack:dyn/titan_timer") > 0);	

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}  

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("moopack:dyn/titan_timer") < 1 && entity.getData("moopack:dyn/titan_timer") > 0) {
        glow.opacity = 1 - entity.getInterpolatedData("moopack:dyn/titan_timer");
        glow.render();
        bolt.render();
        bolt2.render();
    }
}