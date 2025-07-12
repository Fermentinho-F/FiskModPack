extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sl:griffin_layer1",
    "layer2": "sl:griffin_layer2",
    "layer1_damaged": "sl:griffin_layer1_damaged",
    "petercopter_texture": "sl:petercopter_texture",
    "griffintbl": "sl:griffin",
    "griffinbb": "sl:griffinbb",
    "null": "sl:null"
});

var utils = implement("fiskheroes:external/utils");
var chestModelAboveHP;
var chestModelBelowHP;

var oldchest;
var glow;
var copter;
var chest;

function init(renderer) {
renderer.setTexture((entity, renderLayer) => {
  if (entity.isWearingFullSuit()) {
    return "null";
    } else {
    if (entity.getHealth() > 10) {
        if (renderLayer === "LEGGINGS") {
            return "layer2";
        } else {
            return "layer1";
        }
    } else if (entity.getHealth() <= 10) {
        if (renderLayer === "LEGGINGS") {
            return "layer2";
        } else {
            return "layer1_damaged";
        }
    }
  }
});

    renderer.setItemIcons("griffin_0", "griffin_1", "griffin_2", "griffin_3");
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");

    initEffects(renderer);
    initAnimations(renderer);
}

function initEffects(renderer) {
utils.setOpacityWithData(renderer, 0.999, 0.999, "fiskheroes:intangibility_timer");

// Left Arm
leftArm = renderer.createEffect("fiskheroes:model");
leftArm.setModel(utils.createModel(renderer, "sl:griffin_leftarm", "griffintbl"));
leftArm.anchor.set("leftArm");
leftArm.mirror = false;

// Right Arm
rightArm = renderer.createEffect("fiskheroes:model");
rightArm.setModel(utils.createModel(renderer, "sl:griffin_rightarm", "griffintbl"));
rightArm.anchor.set("rightArm");
rightArm.mirror = false;

// Left Leg
leftLeg = renderer.createEffect("fiskheroes:model");
leftLeg.setModel(utils.createModel(renderer, "sl:griffin_leftleg", "griffintbl"));
leftLeg.anchor.set("leftLeg");
leftLeg.mirror = false;

// Chest
chestModelAboveHP = utils.createModel(renderer, "sl:griffin_chest", "griffintbl");
chestModelBelowHP = utils.createModel(renderer, "sl:griffin_chest", "griffin_layer1_damaged");
chest = renderer.createEffect("fiskheroes:model");
chest.setModel(chestModelAboveHP);
chest.anchor.set("body");

// Head
head = renderer.createEffect("fiskheroes:model");
head.setModel(utils.createModel(renderer, "sl:griffin_head", "griffintbl"));
head.anchor.set("head");
head.mirror = false;

// Right Leg
rightLeg = renderer.createEffect("fiskheroes:model");
rightLeg.setModel(utils.createModel(renderer, "sl:griffin_rightleg", "griffintbl"));
rightLeg.anchor.set("rightLeg");
rightLeg.mirror = false;

    jetpack = renderer.createEffect("fiskheroes:model");
    jetpack.setModel(utils.createModel(renderer, "fiskheroes:falcon_jetpack", "jetpack"));
    jetpack.anchor.set("body");
    jetpack.mirror = false;

    var petercopter = renderer.createResource("MODEL", "sl:petercopter");
    petercopter.bindAnimation("sl:helicopter_blades").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("sl:dyn/peia_anim_timer"));
    data.load(1, entity.getInterpolatedData("sl:dyn/petercopter_timer"));
    data.load(2, entity.getInterpolatedData("sl:dyn/petercopter_timer") >= 0.75 ? (entity.getInterpolatedData("sl:dyn/petercopter_timer") - 0.75) * 4 : 0);
    });
    petercopter.texture.set("petercopter_texture");
    copter = renderer.createEffect("fiskheroes:model").setModel(petercopter); 
    copter.anchor.set("body");

    oldchest = renderer.createEffect("fiskheroes:chest");
    oldchest.setExtrude(1.1).setYOffset(5);

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(chest, leftArm, rightArm, leftLeg, rightLeg, head);
    glow.color.set(0xFFFFFF);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", renderer.createResource("BEAM_RENDERER", "sl:null"), "head", 0x000000, [
        { "firstPerson": [0.0,0.0,0.0], "offset": [0.0,0.0,0.0], "size": [0.0, 0.0] }
    ]);

    renderer.bindProperty("fiskheroes:gravity_manipulation").color.set(0xFFFFFF);

    var anim = renderer.createResource("ANIMATION", "fiskheroes:speedster_sprint");
    anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    renderer.addCustomAnimation("speedster.SPRINT", anim);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

addAnimation(renderer, "griffin.SIT", "sl:sit")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sl:dyn/petercopter_timer") >= 0.75 ? (entity.getInterpolatedData("sl:dyn/petercopter_timer") - 0.75) * 4 : 0);
    });

 addAnimation(renderer, "griffin.CHARGED_BEAM", "sl:roadhouse")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge"));
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));

        if (entity.getData("fiskheroes:beam_charge") < 1 && entity.getData("fiskheroes:beam_shooting_timer") < 1 && entity.getData("fiskheroes:beam_shooting_timer") > 0) {
            data.load(2, 0); // Set data 2 to 0
        } else {
            data.load(2, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
        }
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "LEGGINGS" && renderLayer == "CHESTPLATE" && renderLayer == "HELMET") {
    if (entity.getHealth() > 10) {
        chest.setModel(chestModelAboveHP);
    } else {
        chest.setModel(chestModelBelowHP);
    }
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
        rightArm.setOffset(-2, -4, -2);
        rightArm.render();
        leftArm.setOffset(5, -2, 0);
        leftArm.render();
    }
    if (isFirstPersonArm && renderLayer == "CHESTPLATE") {
        rightArm.setOffset(-2, -4, -2);
        rightArm.render();
    }
    if (!isFirstPersonArm && renderLayer == "LEGGINGS") {
        rightLeg.setOffset(0, -12, -2);
        rightLeg.render();
        leftLeg.setOffset(4, -12, -2);
        leftLeg.render();
    }
    if (!isFirstPersonArm && renderLayer == "HELMET") {
        head.setOffset(4, -8, -4);
        head.render();
    }

    glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();
   
    leftArm.render();

    copter.setOffset(0, -38.5, 10);
    copter.setScale(2.8);
    copter.render();
    copter.opacity = entity.getInterpolatedData("sl:dyn/petercopter_timer");
}
