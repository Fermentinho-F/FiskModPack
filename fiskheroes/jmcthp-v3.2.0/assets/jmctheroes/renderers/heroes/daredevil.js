extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:daredevil/daredevil_layer1",
    "layer2": "jmctheroes:daredevil/daredevil_layer2",
    "billy": "jmctheroes:daredevil/billy_club",
    "dd_rope": "jmctheroes:daredevil/dd_rope",
    "dd_end": "jmctheroes:daredevil/dd_end"

});

var legbilly;
var rbilly;
var lbilly;

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    var webs = renderer.bindProperty("fiskheroes:webs");
    var rightbilly = renderer.createResource("MODEL", "jmctheroes:billyboy");
    var leftbilly = renderer.createResource("MODEL", "jmctheroes:leftbillyboy");

    webs.textureRope.set("dd_rope", null);
    webs.textureRopeBase.set("dd_end", null);

    leftbilly.bindAnimation("jmctheroes:billy_swing").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:web_swinging_timer")));
    leftbilly.texture.set("billy");
    lbilly = renderer.createEffect("fiskheroes:model").setModel(leftbilly);
    lbilly.anchor.set("leftArm");

    rightbilly.bindAnimation("jmctheroes:billy_swing").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:web_swinging_timer")));
    rightbilly.texture.set("billy");
    rbilly = renderer.createEffect("fiskheroes:model").setModel(rightbilly);
    rbilly.anchor.set("rightArm");

    legbilly = renderer.createEffect("fiskheroes:model");
    legbilly.setModel(utils.createModel(renderer, "jmctheroes:legbillyboy", "billy", null));
    legbilly.anchor.set("leftLeg");
    legbilly.setOffset(0.0, -1.5, 0.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", ["fiskheroes:swing_roll", "jmctheroes:swing_roll6", "jmctheroes:swing_roll7"]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", "jmctheroes:swing_dive_dd");
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", ["fiskheroes:swing_springboard", "jmctheroes:swing_roll6"]);
    addAnimation(renderer, "daredevil.GEAR", "jmctheroes:hand").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:blade_timer")));
    });
}

function render(entity, renderLayer, isFirstPersonArm) { 
    var blade = entity.getData('fiskheroes:blade_timer') > 0.5 || !entity.getInterpolatedData('fiskheroes:web_swinging_timer') == 0 || entity.isDisplayStand();
    var noblade = !entity.getData('fiskheroes:blade_timer') > 0.5 && entity.getInterpolatedData('fiskheroes:web_swinging_timer') == 0 && !entity.isDisplayStand();
    if (renderLayer == "LEGGINGS" && noblade) {
        legbilly.render();
    }
    if (renderLayer == "CHESTPLATE" && blade) {
        rbilly.render();
    }
    if (renderLayer == "CHESTPLATE" && blade) {
        lbilly.render();
    }
}