extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:naruto_verse/naruto/shippuden_layer1",
    "layer2": "tmhp:naruto_verse/naruto/shippuden_layer2",
    "headband": "tmhp:naruto_verse/black_headband",
    "rage": "tmhp:naruto_verse/naruto/rage_eyes",

    "tail": "tmhp:naruto_verse/naruto/four_tail/tails",
    "body": "tmhp:naruto_verse/naruto/four_tail/body",
    "head": "tmhp:naruto_verse/naruto/four_tail/head"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var red_eyes;
var head;
var body;
var tail;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
       if (renderLayer == "HELMET" && !entity.getData('tmhp:dyn/one_tailed')) {
           return "headband";
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
    red_eyes = renderer.createEffect("fiskheroes:overlay");
    red_eyes.texture.set("rage");

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "tmhp:one_tail/head", "head", null));
    head.anchor.set("head");
    head.mirror = false;

    body = renderer.createEffect("fiskheroes:overlay");
    body.texture.set("body");

    tail = renderer.createEffect("fiskheroes:model");
    tail.setModel(utils.createModel(renderer, "tmhp:one_tail/four_tails", "tail", null));
    tail.anchor.set("body");
    tail.mirror = false;

    utils.setOpacityWithData(renderer, 0.999, 1.0, "tmhp:dyn/one_tailed");
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xFF8855);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "body", 0x220022, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, -1.0, 0.0], "size": [3, 3] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));

    rasengan = body_lines.create(renderer, "tmhp:rasengan", 0x1155FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [4.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [-9.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]}
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
   red_eyes.opacity = entity.getInterpolatedData("tmhp:dyn/rage_timer");
   red_eyes.render();

    if (entity.getData('fiskheroes:cryo_charge') && !entity.getData('tmhp:dyn/one_tailed')) {
       rasengan.opacity = rasengan.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       rasengan.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       rasengan.render(renderLayer);
    }

    if (entity.getData('tmhp:dyn/one_tailed')) {
        head.opacity = 1.0;
        head.render();
        body.opacity = 1.0;
        body.render();
        tail.opacity = 1.0;
        tail.render();
   }
}