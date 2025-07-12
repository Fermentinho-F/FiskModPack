extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:shadow_knight/shadow_knight_layer1",
    "layer2": "moopack:shadow_knight/shadow_knight_layer2",
    "eyes": "fiskheroes:reverse_flash_eyes",
    "segment": "moopack:shadow_knight/tentacle_helmet_wide",
    "claw": "moopack:shadow_knight/claw_helmet_hand"
});

var speedster = implement("fiskheroes:external/speedster_utils");

var utils = implement("fiskheroes:external/utils");

var vibration;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" && entity.getData("moopack:dyn/helmet_active") ? "eyes" : null);
}

function initEffects(renderer) {
    vibration = renderer.createEffect("fiskheroes:vibration");

    speedster.init(renderer, "moopack:red_flicker");

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));

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
        { "offset": [3.0, -3.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        { "offset": [-3.0, -3.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
        { "offset": [3.0, -7.5, -2.0], "direction": [13.0, -7.0, -10.0] },
        { "offset": [-3.0, -7.5, -2.0], "direction": [-13.0, -7.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 4;
    tentacles.segments = 7;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if ((!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getData("fiskheroes:speed") && entity.getData("fiskheroes:speeding")) {
        vibration.render();
    }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}