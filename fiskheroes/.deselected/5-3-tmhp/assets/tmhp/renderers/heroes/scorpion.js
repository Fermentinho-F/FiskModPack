extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:games/mortal_kombat/scorpion_layer1",
    "layer2": "tmhp:games/mortal_kombat/scorpion_layer2",
    "katana": "tmhp:games/mortal_kombat/scorpion_katana",
    "katana_glow": "tmhp:games/mortal_kombat/scorpion_katana_glow",
    "sheath": "tmhp:games/mortal_kombat/scorpion_sheath"
});

var utils = implement("fiskheroes:external/utils");
var glowing_katana = implement("tmhp:external/glowing_katana");
var flames = implement("fiskheroes:external/flames");
var vibration;
var hand_flames;
var sheath;

function init(renderer) {
    parent.init(renderer);

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorWhip.set(0xFF8000);
}

function initEffects(renderer) {
    utils.addLivery(renderer, "KATANA", "katana").setCondition(entity => !entity.getData("tmhp:dyn/electrical"));
    glowing_katana.addLivery(renderer, "KATANA", "katana", "katana_glow").setCondition(entity => entity.getData("tmhp:dyn/electrical"));
    vibration = renderer.createEffect("fiskheroes:vibration");
    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xFF8000);

    var fire = renderer.createResource("ICON", "fiskheroes:fire_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);

    sheath = renderer.createEffect("fiskheroes:model");
    sheath.setModel(utils.createModel(renderer, "tmhp:scorpion_sheath", "sheath", null));
    sheath.anchor.set("body");
    sheath.mirror = false;

    utils.bindParticles(renderer, "tmhp:hellport").setCondition(entity => entity.getInterpolatedData('fiskheroes:teleport_timer') > 0 && entity.getInterpolatedData('fiskheroes:teleport_timer') < 1);
    utils.bindParticles(renderer, "tmhp:hellfire_katana").setCondition(entity => entity.getData("tmhp:dyn/electrical"));

    utils.bindParticles(renderer, "tmhp:fire_breath").setCondition(entity => entity.getInterpolatedData("fiskheroes:beam_charging"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:null_beam", "head", 0xFF8000, [
        { "offset": [0.0, 5.0, -18.0], "size": [15.0, 15.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmhp:hellfire"));

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.4, "offset": [4.7, 13.5, -3.2], "rotation": [-102.0, 0.0, 0.0] }
    ]);
}
function render(entity, renderLayer, isFirstPersonArm) {
    glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();

    var anchor = sheath.anchor.set("body");
    var offSet = sheath.setOffset(-9.5, 0, 0.0);
    var rot = sheath.setRotation(0.0, 0.0, 0.0);
    sheath.anchor = anchor, offSet, rot;
    sheath.render();

    if (entity.getData("fiskheroes:teleport_timer")) {
       vibration.render();
    }
    if (renderLayer == "CHESTPLATE" && entity.getInterpolatedData("fiskheroes:punchmode_timer")) {
       hand_flames.render(1);
    }
}