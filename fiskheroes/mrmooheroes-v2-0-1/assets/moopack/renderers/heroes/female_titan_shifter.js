extend("fiskheroes:hero_basic");
loadTextures({
    "base": "moopack:titan_shifter/annie_titan",
    "suit": "moopack:titan_shifter/annie_titan.tx.json",
    "reactor": "moopack:dna/dna_base",
    "hands": "moopack:titan_shifter/harden_hands"
});

var utils = implement("fiskheroes:external/utils");

var overlay;
var chest;

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

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "hands");
    overlay.opacity = 0.8;

    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));

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
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" && entity.getData("moopack:dyn/titan")) {
        chest.render();
    }
    if (renderLayer == "CHESTPLATE") {
        var charge = entity.getData("fiskheroes:cryo_charge");
        overlay.opacity = 0.8 * charge;
        overlay.render();
    }
    if (entity.getData("moopack:dyn/titan_timer") < 1 && entity.getData("moopack:dyn/titan_timer") > 0) {
        glow.opacity = 1 - entity.getInterpolatedData("moopack:dyn/titan_timer");
        glow.render();
        bolt.render();
        bolt2.render();
    }
}