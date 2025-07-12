extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:naruto_verse/naruto/sage_layer1",
    "layer2": "tmhp:naruto_verse/naruto/shippuden_layer2",
    "headband": "tmhp:naruto_verse/black_headband",

    "sage": "tmhp:naruto_verse/naruto/sage_eyes",
    "sagecoat": "tmhp:naruto_verse/naruto/sagecoat"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var sage_eyes;
var sagecoat;
var spell;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
       if (renderLayer == "HELMET") {
           return "headband";
       }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.setItemIcons("black_headband", "%s_1", "naruto_shippuden_2", "naruto_shippuden_3");
}
function initAnimations(renderer) {
    addAnimation(renderer, "basic.NARUTORUN", "tmhp:naruto_run")
       .setData((entity, data) => data.load(entity.isSprinting()))
       .setCondition(entity => !entity.isPunching());

    addAnimation(renderer, "basic.AIMING", "tmhp:rasenshuriken").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
}

function initEffects(renderer) {
    sage_eyes = renderer.createEffect("fiskheroes:overlay");
    sage_eyes.texture.set("sage");

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xFF8855);

    rasengan = body_lines.create(renderer, "tmhp:rasengan", 0x1155FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [4.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [-9.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]}
    ]);
    double_rasengan = body_lines.create(renderer, "tmhp:rasengan", 0x1155FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: true, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [4.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: true, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [-9.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]}
    ]);
    rasenshiruken = body_lines.create(renderer, "tmhp:rasengan", 0xFFFFFF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 16.0, 0.0], "end": [4.0, 16.0, 0.0], "size": [12.0, 12.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 16.0, 0.0], "end": [-9.0, 16.0, 0.0], "size": [12.0, 12.0] }
        ]}
    ]);

    sagecoat = renderer.createEffect("fiskheroes:model");
    sagecoat.setModel(utils.createModel(renderer, "tmhp:sagecoat", "sagecoat", null));
    sagecoat.anchor.set("body");
    sagecoat.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:null_beam", "head", 0xFFFFFF, [
        { "offset": [0.0, 5.0, -18.0], "size": [15.0, 15.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmhp:rasenshuriken"));

    var color = 0xFFFFFF;
    var tao_mandala = renderer.createResource("SHAPE", "tmhp:beam");
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:line");
    spell = renderer.createEffect("fiskheroes:lines").setShape(tao_mandala).setRenderer(beam);
    spell.color.set(color);
    spell.setOffset(1.0, 16.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(20.0);
    spell.anchor.set("rightArm");
    spell.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) {
   sage_eyes.opacity = entity.getInterpolatedData("tmhp:dyn/sage_mod_timer");
   sage_eyes.render();

    if (entity.getData('fiskheroes:cryo_charge') && !entity.getInterpolatedData("tmhp:dyn/sage_mod_timer")) {
       rasengan.opacity = rasengan.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       rasengan.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       rasengan.render(renderLayer);
    }
    if (entity.getData('fiskheroes:cryo_charge') && entity.getData('tmhp:dyn/sage_mod_timer')) {
       double_rasengan.opacity = double_rasengan.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       double_rasengan.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       double_rasengan.render(renderLayer);
    }
    if (entity.getInterpolatedData("fiskheroes:beam_charging")) {
       rasenshiruken.opacity = rasenshiruken.progress = entity.getInterpolatedData("fiskheroes:beam_charging");
       rasenshiruken.progress /= Math.sqrt(entity.getInterpolatedData("fiskheroes:beam_charging") > 0) * 2;
       rasenshiruken.render(renderLayer);
       spell.render();
    }

    if (renderLayer == "CHESTPLATE") {
        sagecoat.render();
    }
}