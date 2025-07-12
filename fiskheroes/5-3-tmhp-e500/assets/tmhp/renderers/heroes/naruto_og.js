extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:naruto_verse/naruto/og_layer1",
    "layer2": "tmhp:naruto_verse/naruto/og_layer2",
    "headband": "tmhp:naruto_verse/blue_headband",
    "rage": "tmhp:naruto_verse/naruto/rage_eyes",

    "tail": "tmhp:naruto_verse/naruto/one_tail/tail",
    "body": "tmhp:naruto_verse/naruto/one_tail/body",
    "head": "tmhp:naruto_verse/naruto/one_tail/head"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var red_eyes;
var head;
var body;
var tail;
var arm;
var leg;

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
    red_eyes = renderer.createEffect("fiskheroes:overlay");
    red_eyes.texture.set("rage");

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "tmhp:one_tail/head", "head", null));
    head.anchor.set("head");
    head.mirror = false;

    body = renderer.createEffect("fiskheroes:model");
    body.setModel(utils.createModel(renderer, "tmhp:one_tail/tail", "tail", null));
    body.anchor.set("body");
    body.mirror = false;

    tail = renderer.createEffect("fiskheroes:model");
    tail.setModel(utils.createModel(renderer, "tmhp:one_tail/body", "body", null));
    tail.anchor.set("body");
    tail.mirror = false;

    arm = renderer.createEffect("fiskheroes:model");
    arm.setModel(utils.createModel(renderer, "tmhp:one_tail/arm", "body", null));
    arm.anchor.set("rightArm");
    arm.mirror = true;

    leg = renderer.createEffect("fiskheroes:model");
    leg.setModel(utils.createModel(renderer, "tmhp:one_tail/leg", "body", null));
    leg.anchor.set("rightLeg");
    leg.mirror = true;

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xFF8855);

    rasengan = body_lines.create(renderer, "tmhp:rasengan", 0x1155FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [2.0, 7.5, -6.0], "size": [4.0, 4.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [-5.0, 7.5, -6.0], "size": [4.0, 4.0] }
        ]}
    ]);
    tailed_rasengan = body_lines.create(renderer, "tmhp:rasengan", 0xFF00FF, [
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
    if (entity.getData('fiskheroes:cryo_charge') && entity.getData('tmhp:dyn/one_tailed')) {
       tailed_rasengan.opacity = tailed_rasengan.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       tailed_rasengan.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       tailed_rasengan.render(renderLayer);
    }

    if (entity.getData('tmhp:dyn/one_tailed')) {
        head.opacity = 0.5;
        head.render();
        body.opacity = 0.5;
        body.render();
        tail.opacity = 0.5;
        tail.render();
        arm.opacity = 0.5;
        arm.render();
        leg.opacity = 0.5;
        leg.render();
   }
}