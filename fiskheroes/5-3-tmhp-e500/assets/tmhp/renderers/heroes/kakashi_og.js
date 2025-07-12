extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:naruto_verse/kakashi/layer1",
    "layer2": "tmhp:naruto_verse/kakashi/layer2",
    "null": "tmhp:null",
    "headband": "tmhp:naruto_verse/kakashi/headband",
    "headbandfix": "tmhp:naruto_verse/kakashi/hb",

    "sharingan": "tmhp:naruto_verse/kakashi/sharingan"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var sharingan;
var headband;
var headbandfix;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
       if (renderLayer == "HELMET") {
           return "null";
       }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.setItemIcons("black_headband", "%s_1", "%s_2", "%s_3");
}
function initAnimations(renderer) {
    addAnimation(renderer, "basic.NARUTORUN", "tmhp:naruto_run")
       .setData((entity, data) => data.load(entity.isSprinting()))
       .setCondition(entity => !entity.isPunching());
}


function initEffects(renderer) {
    headband = renderer.createEffect("fiskheroes:opening_mask");
    headband.texture.set("headband");
    headband.anchor.set("head");
    headband.setOffset(-2.0, 0.5, 0.0).setRotation(0.0, 0.0, 25.0);

    headbandfix = renderer.createEffect("fiskheroes:overlay");
    headbandfix.texture.set("headbandfix");

    sharingan = renderer.createEffect("fiskheroes:overlay");
    sharingan.texture.set("sharingan");

    utils.bindParticles(renderer, "tmhp:fire_breath").setCondition(entity => entity.getInterpolatedData("fiskheroes:beam_charging"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:null_beam", "head", 0xFF8000, [
        { "offset": [0.0, 5.0, -18.0], "size": [15.0, 15.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmhp:hellfire"));

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x666666);

    chidori = body_lines.create(renderer, "tmhp:chidori", 0x1166FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 9.5, 0.0], "end": [2.0, -15.5, 0.0], "size": [5.0, 5.0] }
        ]}
    ]);
}
function render(entity, renderLayer, isFirstPersonArm) {
   sharingan.opacity = entity.getInterpolatedData("tmhp:dyn/sharingan_timer");
   sharingan.render();

    if (entity.getData('fiskheroes:cryo_charge')) {
       chidori.opacity = chidori.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       chidori.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       chidori.render(renderLayer);
    }
    if (renderLayer == "HELMET") {
       headband.render();
       headband.progress = entity.getData('tmhp:dyn/sharingan_timer') < 1;
       headbandfix.opacity = entity.getData('tmhp:dyn/sharingan_timer') < 1;
       headbandfix.render();
    }
}