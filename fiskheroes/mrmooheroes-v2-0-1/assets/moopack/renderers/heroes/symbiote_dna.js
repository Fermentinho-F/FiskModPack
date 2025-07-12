extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:dna/dna_base",
    "segment": "moopack:dna/symbiote_segment",
    "claw": "moopack:dna/symbiote_claw"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {    
    var arm = utils.createModel(renderer, "moopack:sym_segment_thin", "segment");
    var claw = utils.createModel(renderer, "moopack:sym_claw_thin", "claw");
    claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
      { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 10.0, -10.0] },
      { "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
      { "offset": [2.0, -7.5, -2.0], "direction": [13.0, -10.0, -10.0] },
      { "offset": [-2.0, -7.5, -2.0], "direction": [-13.0, -10.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 1.7;
    tentacles.segments = 13;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
