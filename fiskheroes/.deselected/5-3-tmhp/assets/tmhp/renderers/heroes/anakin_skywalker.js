extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:star_wars/anakin_layer1",
    "layer2": "tmhp:star_wars/anakin_layer2",

    "lightsaber": "tmhp:star_wars/blue_lightsaber"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var lightsaber;
var lightsaber_back;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "basic.AIM", "fiskheroes:aiming_left").setData((entity, data) => data.load(Math.max(entity.getData("fiskheroes:grab_id") > -1)));

    addAnimation(renderer, "basic.BLOCKING", "tmhp:jedi_block").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"), entity.getData("fiskheroes:shield_blocking") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimationWithData(renderer, "demon_slayer.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:shield_timer").setCondition(entity => !entity.getInterpolatedData('fiskheroes:shield_blocking_timer'));
    addAnimation(renderer, "scout.ROLL", "fiskheroes:falcon_dive_roll")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
            data.load(f > 0 ? Math.min((1 - f) * 2.5, 1) : 0);
        });
}

function initEffects(renderer) {
    shrink_lights = body_lines.create(renderer, "tmhp:lightsaber_beam", 0x0000FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [0.0, 8.5, -3.1], "end": [0.0, 8.5, -50.0], "size": [0.8, 0.8] }
        ]}
    ]);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "tmhp:null_beam", "head", 0xFF8000, [
        { "offset": [0.0, 5.0, -18.0], "size": [15.0, 15.0] }
    ]);

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(0x0088FF);
    magic.colorEarthCrack.set(0x000000);
    magic.colorAtmosphere.set(0x111111);

    lightsaber = renderer.createEffect("fiskheroes:model");
    lightsaber.setModel(utils.createModel(renderer, "tmhp:lightsaber_blue", "lightsaber", null));
    lightsaber.anchor.set("rightArm");
    lightsaber.mirror = false;

    utils.bindParticles(renderer, "fisktag:scout_leap").setCondition(entity => entity.getData("fisktag:dyn/leap_cooldown") > 0.75);
}

function render(entity, renderLayer, isFirstPersonArm) {
   if (renderLayer == "CHESTPLATE") {
        shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("fiskheroes:shield_timer");
        shrink_lights.progress /= Math.sqrt(entity.getData('fiskheroes:shield_timer') > 0) * 2;
        shrink_lights.render(renderLayer);
   }
    if (entity.getData("fiskheroes:shield_timer") > 0) {
        var lightsaber_anchor = lightsaber.anchor.set("rightArm");
        var lightsaber_offSet = lightsaber.setOffset(0.0, 0.0, 0.0);
        var lightsaber_rot = lightsaber.setRotation(0.0, 0.0, 0.0);

        lightsaber.anchor = lightsaber_anchor, lightsaber_offSet, lightsaber_rot;
        lightsaber.render();
    }
    if (renderLayer == "CHESTPLATE" && !entity.getData("fiskheroes:shield_timer")) {
        var back_anchor = lightsaber.anchor.set("body");
        var back_offSet = lightsaber.setOffset(-4.7, 4.5, 5.5);
        var back_rot = lightsaber.setRotation(-50.0, -175.0, -5.0);

        lightsaber.anchor = back_anchor, back_offSet, back_rot;
        lightsaber.render();
    }
}