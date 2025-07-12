extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:star_lord/star_lord_layer1",
    "layer2": "jmctheroes:star_lord/star_lord_layer2",
    "boots": "jmctheroes:star_lord/star_lord_boots",
    "pants": "jmctheroes:star_lord/star_lord_pants",
    "jetboots": "jmctheroes:star_lord/star_lord_jetboots",
    "mask": "jmctheroes:star_lord/star_lord_mask.tx.json",
    "lights": "jmctheroes:star_lord/star_lord_lights",
    "quadblaster": "jmctheroes:star_lord/quadblaster",
    "blank": "jmctheroes:blank"
});

var utils = implement("fiskheroes:external/utils");

var blasters1;
var blasters2;
var blastersLeg1;
var blastersLeg2;

var jetboots;

var boosters1;
var boosters2;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants" : "layer2";
        }
        return renderLayer == "BOOTS" ? "boots" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "blank";
        }
        return renderLayer == "LEGGINGS" ? "blank" : "lights";
    });
    
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    blasters1 = renderer.createEffect("fiskheroes:model");
    blasters1.setModel(utils.createModel(renderer, "jmctheroes:quadblaster", "quadblaster", null));
    blasters1.anchor.set("rightArm");
    blasters1.setOffset(0.0, 1.5, 0.0);
    blasters1.setScale(0.85);

    blasters2 = renderer.createEffect("fiskheroes:model");
    blasters2.setModel(utils.createModel(renderer, "jmctheroes:quadblaster", "quadblaster", null));
    blasters2.anchor.set("leftArm");
    blasters2.setOffset(-2.0, 1.5, 0.0);
    blasters2.setScale(0.85);

    blastersLeg1 = renderer.createEffect("fiskheroes:model");
    blastersLeg1.setModel(utils.createModel(renderer, "jmctheroes:quadblaster", "quadblaster", null));
    blastersLeg1.anchor.set("rightLeg");
    blastersLeg1.setOffset(2.0, -3.5, 0.0);
    blastersLeg1.setScale(0.5);

    blastersLeg2 = renderer.createEffect("fiskheroes:model");
    blastersLeg2.setModel(utils.createModel(renderer, "jmctheroes:quadblaster", "quadblaster", null));
    blastersLeg2.anchor.set("leftLeg");
    blastersLeg2.setOffset(-3.0, -3.5, 0.0);
    blastersLeg2.setScale(0.5);

    jetboots = renderer.createEffect("fiskheroes:model");
    jetboots.setModel(utils.createModel(renderer, "jmctheroes:jetboots", "jetboots", null));
    jetboots.anchor.set("leftLeg");
    jetboots.mirror = true;

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "jmctheroes:lantern_blast", "rightArm", 0x00E9FF, [{
        "firstPerson": [-4.5, 4.75, -7.0],"offset": [-0.5, 10.0, 1.25],"size": [0.5, 0.5]
    }]).setCondition(entity => entity.getData("jmctheroes:dyn/random_repulsor") == 1);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "jmctheroes:lantern_blast", "rightArm", 0xFF5C00, [{
        "firstPerson": [-4.5, 2.75, -7.0],"offset": [-0.5, 10.0, -2.5],"size": [0.5, 0.5]
    }]).setCondition(entity => entity.getData("jmctheroes:dyn/random_repulsor") == 2);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "jmctheroes:lantern_blast", "leftArm", 0x00E9FF, [{
        "firstPerson": [4.5, 4.75, -7.0],"offset": [0.5, 10.0, 1.25],"size": [0.5, 0.5]
    }]).setCondition(entity => entity.getData("jmctheroes:dyn/random_repulsor") == 3);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "jmctheroes:lantern_blast", "leftArm", 0xFF5C00, [{
        "firstPerson": [4.5, 2.75, -7.0],"offset": [0.5, 10.0, -2.5],"size": [0.5, 0.5]
    }]).setCondition(entity => entity.getData("jmctheroes:dyn/random_repulsor") == 4);

    var booster = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");
    boosters1 = renderer.createEffect("fiskheroes:booster");
    boosters1.setIcon(booster).setOffset(2.5, 10.5, 1.0).setRotation(20.0, 0.0, 0.0).setSize(1.25, 2.75);
    boosters1.anchor.set("rightLeg");
    boosters1.mirror = true;

    boosters2 = renderer.createEffect("fiskheroes:booster");
    boosters2.setIcon(booster).setOffset(2.5, 10.5, -1.0).setRotation(20.0, 0.0, 0.0).setSize(1.25, 2.75);
    boosters2.anchor.set("rightLeg");
    boosters2.mirror = true;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimation(renderer, "basic.AIMING", "jmctheroes:dual_aiming").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer")));
    });
    addAnimation(renderer, "nolan.FLIGHT", "jmctheroes:flight/superman2.anim.json")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
            data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        })
        .priority = -10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    var hold = entity.getHeldItem().isEmpty();
    if (renderLayer == "BOOTS") {
        jetboots.render();
    }
    if (renderLayer == "CHESTPLATE" && hold) {
        blasters1.render();
        blasters2.render();
    }
    if (renderLayer == "LEGGINGS" && !hold) {
        blastersLeg1.render();
        blastersLeg2.render();
    }
    if (!isFirstPersonArm) {
        if (renderLayer == "BOOTS") {
            var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
            boosters1.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            boosters1.speedScale = 0.5 * boost;
            boosters1.flutter = 1 + boost;
            boosters1.render();

            boosters2.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            boosters2.speedScale = 0.5 * boost;
            boosters2.flutter = 1 + boost;
            boosters2.render();
        }
    }
}