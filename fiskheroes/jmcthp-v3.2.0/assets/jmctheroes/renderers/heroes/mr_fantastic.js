extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:fantastic4/mr_fantastic_layer1",
    "layer2": "jmctheroes:fantastic4/fantastic_layer2",
    "shield": "jmctheroes:fantastic4/mr_fantastic_shield",
    "glove1": "jmctheroes:fantastic4/mr_fantastic_glove1",
    "glove2": "jmctheroes:fantastic4/mr_fantastic_glove2",
    "glove3": "jmctheroes:fantastic4/mr_fantastic_glove3",
    "overlay_shield": "jmctheroes:fantastic4/mr_fantastic_over1",
    "overlay_glove": "jmctheroes:fantastic4/mr_fantastic_over2",
    "arm": "jmctheroes:fantastic4/fantastic_arm",
    "hand": "jmctheroes:fantastic4/fantastic_hand"
});

var utils = implement("fiskheroes:external/utils");

var overlay_shield;
var overlay_glove;
var shield;
var glove = [];

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var arm = utils.createModel(renderer, "jmctheroes:arm", "arm");
    var hand = utils.createModel(renderer, "jmctheroes:hand", "hand");

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
    {"offset": [3.0, -2.0, 0],"direction": [15.0, 0.0, 0]},
    {"offset": [-3.0, -2.0, 0],"direction": [-15.0, 0.0, 0]}
    ]);

    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(hand);
    tentacles.segmentLength = 2.75,
    tentacles.segments = 10,

    glove[1] = renderer.createEffect("fiskheroes:shield");
    glove[1].texture.set("glove1");
    glove[1].anchor.set("rightArm");
    glove[1].setCurve(0, 0).setOffset(-2.0, 9.0, -1.0).setRotation(0.0, 0.0, 0.0);

    glove[2] = renderer.createEffect("fiskheroes:shield");
    glove[2].texture.set("glove1");
    glove[2].anchor.set("rightArm");
    glove[2].setCurve(0, 0).setOffset(4.0, 9.0, -1.0).setRotation(0.0, 0.0, 0.0);

    glove[3] = renderer.createEffect("fiskheroes:shield");
    glove[3].texture.set("glove2");
    glove[3].anchor.set("rightArm");
    glove[3].setCurve(0, 0).setOffset(3.0, 9.0, 4.00).setRotation(0.0, 90.0, 0.0);

    glove[4] = renderer.createEffect("fiskheroes:shield");
    glove[4].texture.set("glove2");
    glove[4].anchor.set("rightArm");
    glove[4].setCurve(0, 0).setOffset(3.0, 9.0, -4.0).setRotation(0.0, 90.0, 0.0);

    glove[5] = renderer.createEffect("fiskheroes:shield");
    glove[5].texture.set("glove3");
    glove[5].anchor.set("rightArm");
    glove[5].setCurve(0, 0).setOffset(-2.0, 9.0, -1.0).setRotation(0.0, 0.0, 90.0);

    glove[6] = renderer.createEffect("fiskheroes:shield");
    glove[6].texture.set("glove3");
    glove[6].anchor.set("rightArm");
    glove[6].setCurve(0, 0).setRotation(0.0, 0.0, 90.0);

    overlay_glove = renderer.createEffect("fiskheroes:overlay");
    overlay_glove.texture.set("overlay_glove");
    overlay_glove.opacity = 1;

    overlay_shield = renderer.createEffect("fiskheroes:overlay");
    overlay_shield.texture.set("overlay_shield");
    overlay_shield.opacity = 1;

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield");
    shield.anchor.set("rightArm");
    shield.setCurve(50, 50).setOffset(4.7, 6.0, 0.0).setRotation(0.0, 0.0, -10.0);
    shield.large = true
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "REED.noarms", "jmctheroes:arms").setData((entity, data) => data.load(entity.getData('fiskheroes:tentacles') != null ? 1:0));
}


function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {

        overlay_shield.opacity = entity.getInterpolatedData("fiskheroes:shield_timer");
        overlay_shield.render();

        overlay_glove.opacity = entity.getInterpolatedData("fiskheroes:blade_timer");
        overlay_glove.render();

        shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
        shield.render();
        
        var blade = entity.getInterpolatedData("fiskheroes:blade_timer");
        for (var i = 1; i <= 6 &&  blade > 0; i++) {
            if (i != 5) {glove[i].unfold = blade};
            if (i == 6) {
                glove[i].setOffset(-2.0, 15.0 * Math.min(glove[i].unfold * 1.5, 1), -1.0)
                if (blade >  0.5) {
                glove[i].render();
                }
            }
            if (i != 6) {glove[i].render()};
        }

    }
}