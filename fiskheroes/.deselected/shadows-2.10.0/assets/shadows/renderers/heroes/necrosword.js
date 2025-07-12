extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:nothing",
    "layer2": "shadows:nothing",
    "sword": "shadows:necro_sword/sword",
    "tentacle": "shadows:necro_sword/tentacle",
    "suit": "shadows:necro_sword/suit_xor.tx.json"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("CHESTPLATE", "%s");
}

function initEffects(renderer) {
    var tentacle = utils.createModel(renderer, "shadows:tentacleArm", "tentacle");

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([{
                    "offset": [2.0, -4.5, -2.0],
                    "direction": [13.0, 10.0, -10.0]
                }, {
                    "offset": [-2.0, -4.5, -2.0],
                    "direction": [-13.0, 10.0, -10.0]
                }, {
                    "offset": [2.0, -7.5, -2.0],
                    "direction": [13.0, -10.0, -10.0]
                }, {
                    "offset": [-2.0, -7.5, -2.0],
                    "direction": [-13.0, -10.0, -10.0]
                }, {
                    "offset": [2.0, -2, -2.0],
                    "direction": [13.0, 10.0, -10.0]
                }, {
                    "offset": [-2.0, -2, -2.0],
                    "direction": [-13.0, 10.0, -10.0]
                }
            ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(tentacle);
    tentacles.segmentLength = 2;
    tentacles.segments = 8;

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("suit");
    overlay.opacity = 1;

    sword = renderer.createEffect("fiskheroes:shield");
    sword.texture.set("sword");
    sword.anchor.set("rightArm");
    sword.setCurve(0.0, 0.0);
    sword.large = true;

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 1 + (0 - 1) * Number(entity.getInterpolatedData("fiskheroes:shadowform_timer") > 0);
    });
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "shadows:black_red").setCondition(entity => entity.getInterpolatedData("fiskheroes:shadowform_timer") > 0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "symbiotes.nothing", "shadows:nothing").setData((entity, data) => data.load(1))
    .setCondition(entity => entity.getData('fiskheroes:tentacle_lift')).priority = 1;

    renderer.reprioritizeDefaultAnimation("PUNCH", 3);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", 2);
}

function render(entity, renderLayer) {
    if (renderLayer == "CHESTPLATE") {
        overlay.render();

        sword.unfold = entity.is("DISPLAY") && entity.as("DISPLAY").getDisplayType() != "BOOK_PREVIEW" ? entity.getInterpolatedData('fiskheroes:mask_open_timer2') : entity.getData("fiskheroes:tentacle_extend_timer") > 0 && entity.getData('fiskheroes:blade_timer') == 1 ? 1 + (0 - 1) * entity.getInterpolatedData('fiskheroes:tentacle_extend_timer') : Math.min(Math.max(entity.getInterpolatedData('fiskheroes:blade_timer') * 2, 0), 1);
        sword.setOffset(1.5, 8.0, 0.0);
        sword.render();
    }
}
