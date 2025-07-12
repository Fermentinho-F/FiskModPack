extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:rex",
    "layer2": "emo:rex",
    "cannon1": "emo:rexc1",
    "cannon2": "emo:rexc2",
    "cannon1_lights": "emo:rexc1_lights",
    "cannon2_lights": "emo:rexc2_lights",
    "cannon_inner": "emo:rexc_inner",
    "sword": "emo:rextest",
    "punch": "emo:rextest",
    "punch2": "emo:rextest",
    "flight": "emo:rextest",    
    "icel": "emo:rextest"
});

var utils = implement("fiskheroes:external/utils");
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");

var cannon;
var sword;
var punch;
var punch2;
var flight;
var icel;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:big_fat_sword", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    punch = renderer.createEffect("fiskheroes:model");
    punch.setModel(utils.createModel(renderer, "emo:rexsag", "punch"));
    punch.anchor.set("rightArm");
    punch.mirror = false;
    
    punch2 = renderer.createEffect("fiskheroes:model");
    punch2.setModel(utils.createModel(renderer, "emo:rexsol", "punch2"));
    punch2.anchor.set("leftArm");
    punch2.mirror = false;

    cannon = mk50_cannon.create(renderer, "rightArm", 0x1CA1E6);

    flight = renderer.createEffect("fiskheroes:model");
    flight.setModel(utils.createModel(renderer, "emo:booge", "flight"));
    flight.anchor.set("body");
    flight.mirror = false;

    icel = renderer.createEffect("fiskheroes:model");
    icel.setModel(utils.createModel(renderer, "emo:icel", "icel"));
    icel.anchor.set("rightArm");
    icel.mirror = false;

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x1CA1E6);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");
    addAnimationWithData(renderer,"orex.SWORD", "emo:rex", "emo:dyn/sword");
    addAnimationWithData(renderer,"orex.SWORD", "emo:rex2", "emo:dyn/sword");
    addAnimationWithData(renderer,"orex.EL", "emo:rex", "emo:dyn/el");
    addAnimationWithData(renderer,"orex.SWORDEL", "emo:rex", "emo:dyn/swordel");
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    cannon.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));
    if (entity.getData("emo:dyn/sword") > 0.6) {
        sword.render();
    } 
    if (entity.getData("emo:dyn/el") > 0.6) {
        punch.render();
    } 
    if (entity.getData("emo:dyn/el") > 0.6) {
        punch2.render();
    } 
    if (entity.getData("emo:dyn/boogie") > 0.6) {
        flight.render();
    } 
    if (entity.getData("emo:dyn/swordel") > 0.6) {
        sword.render();
    } 
    if (entity.getData("emo:dyn/swordel") > 0.6) {
        punch2.render();
    } 
    if (entity.getData("emo:dyn/sword") > 0.6) {
        icel.render();
    } 
    if (entity.getData("emo:dyn/el") > 0.6) {
        icel.render();
    } 
    if (entity.getData("emo:dyn/swordel") > 0.6) {
        icel.render();
    } 
    if (!isFirstPersonArm) {
        sword.opacity = entity.getInterpolatedData("emo:dyn/sword_timer");
        sword.render();
    }
    if (!isFirstPersonArm) {
        punch.opacity = entity.getInterpolatedData("emo:dyn/el_timer");
        punch.render();
    }
    if (!isFirstPersonArm) {
        punch2.opacity = entity.getInterpolatedData("emo:dyn/el_timer");
        punch2.render();
    }
    if (!isFirstPersonArm) {
        sword.opacity = entity.getInterpolatedData("emo:dyn/swordel_timer");
        sword.render();
    }
    if (!isFirstPersonArm) {
        punch2.opacity = entity.getInterpolatedData("emo:dyn/swordel_timer");
        punch2.render();
    }
    if (!isFirstPersonArm) {
        flight.opacity = entity.getInterpolatedData("emo:dyn/boogie_timer");
        flight.render();
    }
}