extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:chain/katana_man_layer1",
    "layer2": "jmctheroes:chain/katana_man_layer2",
    "layer3": "jmctheroes:chain/katana_man_layer3",
    "head": "jmctheroes:chain/katana_head.tx.json",
    "neck": "jmctheroes:chain/neck",
});

var head_overlay;
var overlay;
var head;
var headsaw;

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "jmctheroes:invisible", "body", 0xFF1F00, [{"offset": [0.0, 3.0],"size": [2.0, 2.0]}]);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("layer3", null);
    overlay.opacity = 1.0;

    head_overlay = renderer.createEffect("fiskheroes:overlay");
    head_overlay.texture.set("layer3", null);
    head_overlay.opacity = 1.0;
    
    neck = renderer.createEffect("fiskheroes:model");
    neck.setModel(utils.createModel(renderer, "jmctheroes:neck", "neck", null));
    neck.anchor.set("body");
    neck.setOffset(0.0, 0.5, 0.0);

    var armblade = renderer.createResource("MODEL", "jmctheroes:armblade");
    armblade.bindAnimation("jmctheroes:armblade").setData((entity, data) => data.load(entity.getInterpolatedData("jmctheroes:dyn/suit_timer")));
    armblade.texture.set("head");
    arm1 = renderer.createEffect("fiskheroes:model").setModel(armblade);
    arm1.anchor.set("rightArm");

    arm2 = renderer.createEffect("fiskheroes:model").setModel(armblade);
    arm2.anchor.set("leftArm");
    arm2.setOffset(-2.0, 0.0, 0.0);

    utils.setOpacity(renderer, 0.5, 0.1);

    var katanahead = renderer.createResource("MODEL", "jmctheroes:katanamanheadV2");
    katanahead.bindAnimation("jmctheroes:katanahead").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/suit_timer"));
        data.load(1, Math.sin((2*entity.loop(50))*Math.PI)/2);
    }).priority = -1;
    
    katanahead.texture.set("head");
    head = renderer.createEffect("fiskheroes:model").setModel(katanahead);
    head.anchor.set("head");
    head.setScale(0.0);
    head.setOffset(0.0, 0.0, 0.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "devil.TRANSFORMATION", "jmctheroes:bladesout").setData((entity, data) => {
        data.load(Math.max(entity.getHeldItem().isEmpty() && entity.getData('jmctheroes:dyn/suit') == true && entity.getInterpolatedData('jmctheroes:dyn/suit_timer')));
    });
    addAnimation(renderer, "devil.OFFTRANSFORMATION", "jmctheroes:saw_off").setData((entity, data) => {
        data.load(Math.max(entity.getHeldItem().isEmpty() && !entity.getData('jmctheroes:dyn/suit') == true && entity.getInterpolatedData('jmctheroes:dyn/suit_timer')));
    });
    addAnimation(renderer, "devil.DASH", "jmctheroes:katanadash").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData('jmctheroes:dyn/dash_timer')));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    var blade = entity.getInterpolatedData("jmctheroes:dyn/suit_timer") > 0.8;
    var hold = entity.getHeldItem().isEmpty();
    var display = !entity.isDisplayStand();
    var suit = entity.isWearingFullSuit();
    if (renderLayer == "HELMET" && display && suit) {
        head.render();
    }
    if (renderLayer == "CHESTPLATE" && display && hold) {
        arm1.render();
        arm2.render();
    }
    if (renderLayer == "CHESTPLATE" && display) {
        overlay.opacity = !entity.isDisplayStand();
        overlay.render();
        neck.opacity = blade;
        neck.render();
    }
}
