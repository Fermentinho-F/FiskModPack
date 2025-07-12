extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "moopack:dna/dna_base",
    "milkcarton": "moopack:mrmoo_carton/milkcarton",
    "segment": "moopack:mrmoo_carton/milk_segment",
    "claw": "moopack:mrmoo_carton/milk_hand"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {

    var model = renderer.createResource("MODEL", "moopack:milkcarton");
    model.texture.set("milkcarton");
    milkcarton = renderer.createEffect("fiskheroes:model").setModel(model);
    milkcarton.setOffset(0, 4.0, 0.0)
    milkcarton.setScale(2.25);
    milkcarton.anchor.set("torso");

    var arm = utils.createModel(renderer, "moopack:tentacle_helmet_wide", "segment");
    var claw = utils.createModel(renderer, "moopack:claw_helmet_hand", "claw");
    claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        //{ "offset": [3.0, -3.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        //{ "offset": [-3.0, -3.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
        { "offset": [3.0, -7.5, -2.0], "direction": [13.0, -7.0, -10.0] },
        { "offset": [-3.0, -7.5, -2.0], "direction": [-13.0, -7.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 2;
    tentacles.segments = 4;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && !isFirstPersonArm) {
        milkcarton.render();
        }
}
