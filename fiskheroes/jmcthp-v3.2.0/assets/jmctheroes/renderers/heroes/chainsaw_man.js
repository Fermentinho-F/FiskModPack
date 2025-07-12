extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:chain/chainsaw_man_layer1",
    "layer2": "jmctheroes:chain/chainsaw_man_layer2",
    "layer3": "jmctheroes:chain/chainsaw_man_layer3",
    "head": "jmctheroes:chain/chainsaw_head.tx.json",
    "saw": "jmctheroes:chain/saw.tx.json"
});

var head_overlay;
var overlay;
var head;
var headsaw;

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "jmctheroes:invisible", "body", 0x000000, [{"offset": [0.0, 3.0],"size": [2.0, 2.0]}]);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.75, "offset": [-6.5, 0.0, 3.0], "rotation": [0.0, 0.0, 0.0] }
    ]).slotIndex = 0;

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("layer3", null);
    overlay.opacity = 1.0;

    head_overlay = renderer.createEffect("fiskheroes:overlay");
    head_overlay.texture.set("layer3", null);
    head_overlay.opacity = 1.0;
    
    utils.setOpacity(renderer, 0.5, 0.1);
    
    neck = renderer.createEffect("fiskheroes:model");
    neck.setModel(utils.createModel(renderer, "jmctheroes:neck", "head", null));
    neck.anchor.set("body");
    neck.setOffset(0.0, 0.5, 0.0);

    var chainsawhead = renderer.createResource("MODEL", "jmctheroes:chainsawmanheadV2");
    chainsawhead.bindAnimation("jmctheroes:chainsawhead").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/suit_timer"));
        data.load(1, Math.sin((2*entity.loop(50))*Math.PI)/2);
    }).priority = -1;
    
    chainsawhead.texture.set("head");
    head = renderer.createEffect("fiskheroes:model").setModel(chainsawhead);
    head.anchor.set("head");
    head.setScale(0.92);
    head.setOffset(0.0, -0.2, 0.0);

    var chainsawheadsaw = renderer.createResource("MODEL", "jmctheroes:chainsawmanheadV2");
    chainsawheadsaw.bindAnimation("jmctheroes:chainsawhead").setData((entity, data) => data.load(0, entity.getInterpolatedData("jmctheroes:dyn/suit_timer")));
    chainsawheadsaw.texture.set("saw");
    headsaw = renderer.createEffect("fiskheroes:model").setModel(chainsawheadsaw);
    headsaw.anchor.set("head");
    headsaw.setScale(0.92);
    headsaw.setOffset(0.0, -0.2, 0.0);

    var armchainsaw1 = renderer.createResource("MODEL", "jmctheroes:armsaw");
    armchainsaw1.bindAnimation("jmctheroes:armsaw").setData((entity, data) => data.load(entity.getInterpolatedData("jmctheroes:dyn/suit_timer")));
    armchainsaw1.texture.set("head");
    armsaw1 = renderer.createEffect("fiskheroes:model").setModel(armchainsaw1);
    armsaw1.anchor.set("rightArm");

    var armchainsaw2 = renderer.createResource("MODEL", "jmctheroes:armsaw");
    armchainsaw2.bindAnimation("jmctheroes:armsaw").setData((entity, data) => data.load(entity.getInterpolatedData("jmctheroes:dyn/suit_timer")));
    armchainsaw2.texture.set("head");
    armsaw2 = renderer.createEffect("fiskheroes:model").setModel(armchainsaw2);
    armsaw2.anchor.set("leftArm");
    armsaw2.setOffset(-2.0, 0.0, 0.0);

    var armchainsaw3 = renderer.createResource("MODEL", "jmctheroes:armsaw");
    armchainsaw3.bindAnimation("jmctheroes:armsaw").setData((entity, data) => data.load(entity.getInterpolatedData("jmctheroes:dyn/suit_timer")));
    armchainsaw3.texture.set("saw");
    armsaw3 = renderer.createEffect("fiskheroes:model").setModel(armchainsaw3);
    armsaw3.anchor.set("rightArm");

    var armchainsaw4 = renderer.createResource("MODEL", "jmctheroes:armsaw");
    armchainsaw4.bindAnimation("jmctheroes:armsaw").setData((entity, data) => data.load(entity.getInterpolatedData("jmctheroes:dyn/suit_timer")));
    armchainsaw4.texture.set("saw");
    armsaw4 = renderer.createEffect("fiskheroes:model").setModel(armchainsaw4);
    armsaw4.anchor.set("leftArm");
    armsaw4.setOffset(-2.0, 0.0, 0.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimation(renderer, "devil.TRANSFORMATION", "jmctheroes:saw").setData((entity, data) => {
        data.load(Math.max(entity.getHeldItem().isEmpty() && entity.getData('jmctheroes:dyn/suit') == true && entity.getInterpolatedData('jmctheroes:dyn/suit_timer')));
    });
    addAnimation(renderer, "devil.OFFTRANSFORMATION", "jmctheroes:saw_off").setData((entity, data) => {
        data.load(Math.max(entity.getHeldItem().isEmpty() && !entity.getData('jmctheroes:dyn/suit') == true && entity.getInterpolatedData('jmctheroes:dyn/suit_timer')));
    });
    addAnimation(renderer, "devil.SPRINT", "jmctheroes:speedsters/devil_sprint").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/1_timer"));
        data.load(1, entity.getInterpolatedData("jmctheroes:dyn/1_timer") ? entity.loop(10) : 0);
        data.load(2, entity.getInterpolatedData("jmctheroes:dyn/1_timer") ? entity.loop(20) : 0);
    });
    //addAnimation(renderer, "devil.SPRINT", "jmctheroes:speedsters/devil_sprint0").setData((entity, data) => {
        //data.load(0, (entity.getData("fiskheroes:beam_shooting_timer")) ? entity.loop(10) : 0);
        //data.load(1, entity.getData("fiskheroes:beam_shooting_timer"));
    //});
}

function render(entity, renderLayer, isFirstPersonArm) {
    var saw = entity.getInterpolatedData("jmctheroes:dyn/suit_timer") > 0.8;
    var hold = entity.getHeldItem().isEmpty();
    var display = !entity.isDisplayStand();
    var suit = entity.isWearingFullSuit();
    if (renderLayer == "HELMET" && display && suit) {
        head.render();
    }
    if (renderLayer == "HELMET" && display && suit && saw) {
        headsaw.render();
    }
    if (renderLayer == "CHESTPLATE" && display && hold) {
        armsaw1.render();
        armsaw2.render();
    }
    if (renderLayer == "CHESTPLATE" && display && hold && saw) {
        armsaw3.render();
        armsaw4.render();
    }
    if (renderLayer == "CHESTPLATE" && display) {
        overlay.opacity = !entity.isDisplayStand();
        overlay.render();
        neck.render();
    }
}
