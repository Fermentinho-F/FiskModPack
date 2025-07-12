extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:thebigmooster/thebigmooster_layer1",
    "layer2": "moopack:thebigmooster/thebigmooster_layer2",
    "web_small": "moopack:thebigmooster/thebigmooster_web",
    "web_large": "moopack:thebigmooster/thebigmooster_web_24",
    "web_rope": "moopack:thebigmooster/thebigmooster_web_rope"
});

var utils = implement("fiskheroes:external/utils");

var glyphs = implement("fiskheroes:external/mysterio_glyph");

var glyph;
var glyph_big;

function init(renderer) {
    parent.init(renderer);
    //renderer.setTexture((entity, renderLayer) => renderLayer == "HELMET" || renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    //renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0xFFFF00, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));

	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set("web_small");
	webs.textureLarge.set("web_large");
	webs.textureRope.set("web_rope");
	webs.textureRopeBase.set("web_small");

    var color = 0xFFFF00;
    glyph = glyphs.create(renderer, color, "rightArm", "fiskheroes:mysterio_glyph", true);
    glyph.setOffset(1.0, 13.0, 0.0).setRotation(0.0, 0.0, 10.0).setScale(5.2);
    glyph_big = glyphs.create(renderer, color, "head", "fiskheroes:mysterio_glyph_big", false);
    glyph_big.setScale(16);

    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:mysterio_beam");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", beam, "head", color, [
        { "offset": [0.0, 5.0, -22.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;

    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;

    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
        "fiskheroes:swing_roll",
        "fiskheroes:swing_roll2",
        "fiskheroes:swing_roll5"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "fiskheroes:swing_dive",
        "fiskheroes:swing_dive2"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
    utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
}

function render(entity, renderLayer, isFirstPersonArm) {

    if (!isFirstPersonArm && renderLayer == "HELMET") {
        renderGlyph(entity, isFirstPersonArm);
    }
    else if (renderLayer == "CHESTPLATE") {
        glyph.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));

        if (isFirstPersonArm) {
            renderGlyph(entity, isFirstPersonArm);
        }
        else {
        }
    }

}

function renderGlyph(entity, isFirstPersonArm) {
    var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
    charge = entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 2, 1) : Math.max(charge * 3 - 2, 0);

    if (isFirstPersonArm) {
        glyph_big.setOffset(0, 3, -20).setRotation(80, 0, 0);
        glyph_big.ignoreAnchor(true);
    }
    else {
        glyph_big.setOffset(0, 5, -24).setRotation(90, 0, 0);
        glyph_big.ignoreAnchor(false);
    }

    glyph_big.render(charge);
}