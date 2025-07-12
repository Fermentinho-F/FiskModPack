extend("fiskheroes:hero_basic");
loadTextures({
    "mask": "jmctheroes:daredevil/daredevil_white_mask",
    "coat": "jmctheroes:daredevil/daredevil_white_coat",
    "coat_mask": "jmctheroes:daredevil/daredevil_white_coat_mask",
    "pants": "jmctheroes:daredevil/daredevil_white_pants",
    "pants_coat": "jmctheroes:daredevil/daredevil_white_pants_coat",
    "boots": "jmctheroes:daredevil/daredevil_white_boots",
    "billy": "jmctheroes:daredevil/billy_club_hell",
    "dd_rope": "jmctheroes:daredevil/dd_rope",
    "dd_end": "jmctheroes:daredevil/dd_end"
});

var legbilly;
var rbilly;
var lbilly;

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornHelmet().suitType() == $SUIT_NAME ? "coat_mask" : "coat";
        }
        else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_coat" : "pants";
        }
        return renderLayer == "HELMET" ? "mask" : "boots";
    });

    renderer.showModel("HELMET", "head", "headwear", "body");
    renderer.showModel("CHESTPLATE", "head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

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
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;

    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", "fiskheroes:swing_roll");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", "jmctheroes:swing_dive_dd");
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
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