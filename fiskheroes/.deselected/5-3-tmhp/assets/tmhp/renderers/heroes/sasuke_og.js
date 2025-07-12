extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:naruto_verse/sasuke/chunin_layer1",
    "layer2": "tmhp:naruto_verse/sasuke/chunin_layer2",
    "headband": "tmhp:naruto_verse/blue_headband",

    "sharingan": "tmhp:naruto_verse/sasuke/sharingan",
    "curse_mark_hand": "tmhp:naruto_verse/sasuke/big_hand",
    "curse_mark": "tmhp:naruto_verse/sasuke/curse_mark"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var sharingan;
var curse_mark;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
       if (renderLayer == "HELMET") {
           return "headband";
       }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.setItemIcons("blue_headband", "%s_1", "%s_2", "%s_3");
}
function initAnimations(renderer) {
    addAnimation(renderer, "basic.NARUTORUN", "tmhp:naruto_run")
       .setData((entity, data) => data.load(entity.isSprinting()))
       .setCondition(entity => !entity.isPunching());
}


function initEffects(renderer) {
    sharingan = renderer.createEffect("fiskheroes:overlay");
    sharingan.texture.set("sharingan");
    curse_mark = renderer.createEffect("fiskheroes:overlay");
    curse_mark.texture.set("curse_mark");

    curse_mark_hand = renderer.createEffect("fiskheroes:model");
    curse_mark_hand.setModel(utils.createModel(renderer, "tmhp:curse_mark", "curse_mark_hand", null));
    curse_mark_hand.anchor.set("body");
    curse_mark_hand.mirror = false;

    utils.bindParticles(renderer, "tmhp:fire_breath").setCondition(entity => entity.getInterpolatedData("fiskheroes:beam_charging"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:null_beam", "head", 0xFF8000, [
        { "offset": [0.0, 5.0, -18.0], "size": [15.0, 15.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmhp:hellfire"));

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x000066);

    chidori = body_lines.create(renderer, "tmhp:chidori", 0x1166FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 9.5, 0.0], "end": [2.0, -15.5, 0.0], "size": [5.0, 5.0] }
        ]}
    ]);
    onyx_chidori = body_lines.create(renderer, "tmhp:onyx_chidori", 0x111111, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 9.5, 0.0], "end": [2.0, -25.5, 0.0], "size": [5.0, 5.0] }
        ]}
    ]);
}
function render(entity, renderLayer, isFirstPersonArm) {
   sharingan.opacity = entity.getInterpolatedData("tmhp:dyn/sharingan_timer");
   sharingan.render();
   curse_mark.opacity = entity.getInterpolatedData("tmhp:dyn/curse_mark_timer");
   curse_mark.render();
   curse_mark_hand.opacity = entity.getInterpolatedData("tmhp:dyn/curse_mark_timer");
   curse_mark_hand.render();

    if (entity.getData('fiskheroes:cryo_charge') && !entity.getData('tmhp:dyn/curse_mark')) {
       chidori.opacity = chidori.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       chidori.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       chidori.render(renderLayer);
    }
    if (entity.getData('fiskheroes:cryo_charge') && entity.getData('tmhp:dyn/curse_mark')) {
       onyx_chidori.opacity = onyx_chidori.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       onyx_chidori.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       onyx_chidori.render(renderLayer);
    }
}