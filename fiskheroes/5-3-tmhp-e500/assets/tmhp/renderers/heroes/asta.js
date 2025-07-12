extend("tmhp:hero_mask2");
loadTextures({
    "layer1": "tmhp:black_clover/asta/prets_hooded",
    "layer2": "tmhp:black_clover/asta/prets_layer2",
    "mask": "tmhp:black_clover/asta/prets_headband",
    "hood_open": "tmhp:black_clover/asta/prets_layer1",

    "blackform": "tmhp:black_clover/asta/blackform",
    "horn": "tmhp:black_clover/asta/horn",
    "wing": "tmhp:black_clover/asta/wing",

    "nero": "tmhp:black_clover/nero",
    "nero_block": "tmhp:black_clover/nero_block",

    "grimoire": "tmhp:black_clover/asta/grimoire",
    "grimoire_pocket": "tmhp:black_clover/grimoire_pocket",

    "demon_destroyer": "tmhp:black_clover/asta/demon_destroyer",
    "demon_destroyer_black": "tmhp:black_clover/asta/demon_destroyer_black",
    "demon_slayer": "tmhp:black_clover/asta/demon_slayer",
    "demon_slayer_black": "tmhp:black_clover/asta/demon_slayer_black",
    "black_divider": "tmhp:black_clover/asta/black_divider",
    "demon_dweller": "tmhp:black_clover/asta/demon_dweller",
    "demon_dweller_black": "tmhp:black_clover/asta/demon_dweller_black"
});

var utils = implement("fiskheroes:external/utils");
var spirit_wings = implement("tmhp:external/spirit_wings");
var blackform;
var wing;
var horn;
var grimoire;
var grimoire_pocket;
var nero;
var nero_block;
var demon_slayer;
var demon_dweller;
var demon_destroyer;

function init(renderer) {
    parent.init(renderer);
}
function initEffects(renderer) {
    nero = renderer.createEffect("fiskheroes:model");
    nero.setModel(utils.createModel(renderer, "tmhp:black_clover/nero", "nero", null));
    nero.anchor.set("head");
    nero.mirror = false;
    nero_block = renderer.createEffect("fiskheroes:model");
    nero_block.setModel(utils.createModel(renderer, "tmhp:black_clover/nero_block", "nero_block", null));
    nero_block.anchor.set("head");
    nero_block.mirror = false;
    grimoire = renderer.createEffect("fiskheroes:model");
    grimoire.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire", "grimoire"));
    grimoire.anchor.set("body");
    grimoire.mirror = false;
    grimoire_pocket = renderer.createEffect("fiskheroes:model");
    grimoire_pocket.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire_pocket", "grimoire_pocket"));
    grimoire_pocket.anchor.set("body");
    grimoire_pocket.mirror = false;

    blackform = renderer.createEffect("fiskheroes:overlay");
    blackform.texture.set("blackform", null);
    wing = spirit_wings.create(renderer, "wing", null, spirit_wings.BLACKFORM);
    horn = renderer.createEffect("fiskheroes:model");
    horn.setModel(utils.createModel(renderer, "tmhp:black_clover/devil_horn", "horn", null));
    horn.anchor.set("head");
    horn.mirror = false;

    utils.bindParticles(renderer, "tmhp:blackform").setCondition(entity => entity.getData('tmhp:dyn/blackform_timer') > 0 && entity.getData('tmhp:dyn/blackform_timer') < 1);
    utils.bindTrail(renderer, "tmhp:anti_mahou").setCondition(entity => entity.getData('tmhp:dyn/blackform_timer') > 0 && entity.getData('tmhp:dyn/blackform_timer') < 1);
    utils.bindTrail(renderer, "tmhp:devil_union").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));

    demon_slayer = renderer.createEffect("fiskheroes:model");
    demon_slayer.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_slayer", "demon_slayer", null));
    demon_slayer.anchor.set("rightArm");
    demon_slayer.mirror = false;
    demon_slayer_black = renderer.createEffect("fiskheroes:model");
    demon_slayer_black.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_slayer", "demon_slayer_black", null));
    demon_slayer_black.anchor.set("rightArm");
    demon_slayer_black.mirror = false;
    demon_slayer_black_divider = renderer.createEffect("fiskheroes:model");
    demon_slayer_black_divider.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_slayer", "black_divider", null));
    demon_slayer_black_divider.anchor.set("rightArm");
    demon_slayer_black_divider.mirror = false;

    demon_dweller = renderer.createEffect("fiskheroes:model");
    demon_dweller.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_dweller", "demon_dweller", null));
    demon_dweller.anchor.set("rightArm");
    demon_dweller.mirror = false;
    demon_dweller_black = renderer.createEffect("fiskheroes:model");
    demon_dweller_black.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_dweller", "demon_dweller_black", null));
    demon_dweller_black.anchor.set("rightArm");
    demon_dweller_black.mirror = false;

    demon_destroyer = renderer.createEffect("fiskheroes:model");
    demon_destroyer.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_destroyer", "demon_destroyer", null));
    demon_destroyer.anchor.set("leftArm");
    demon_destroyer.mirror = false;
    demon_destroyer_black = renderer.createEffect("fiskheroes:model");
    demon_destroyer_black.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_destroyer", "demon_destroyer_black", null));
    demon_destroyer_black.anchor.set("leftArm");
    demon_destroyer_black.mirror = false;
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);

    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;

    addAnimationWithData(renderer, "demon_slayer.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:shield_timer");
    addAnimationWithData(renderer, "demon_dweller.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:blade_timer");

    addAnimation(renderer, "blackform.TRANSFORM", "tmhp:blackform").setData((entity, data) => {
        var charge = entity.getInterpolatedData("tmhp:dyn/blackform_timer");
        data.load(entity.getData('tmhp:dyn/blackform_timer') > 0 && entity.getData('tmhp:dyn/blackform_timer') < 1);
    }).setCondition(entity => entity.getInterpolatedData('tmhp:dyn/blackform'));
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        grimoire_pocket.render();
        grimoire.opacity = entity.getInterpolatedData("tmhp:dyn/grimoire_timer");
        grimoire.render();

        blackform.opacity = entity.getInterpolatedData("tmhp:dyn/blackform_timer");
        blackform.render();
        horn.opacity = entity.getInterpolatedData("tmhp:dyn/blackform_timer");
        horn.render();

        demon_slayer.opacity = entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/blackform_timer");
        demon_slayer.render();
        demon_slayer_black.opacity = entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/blackform_timer") && !entity.getData("fiskheroes:cryo_charge");
        demon_slayer_black.render();

        demon_dweller.opacity = entity.getData("fiskheroes:blade");
        demon_dweller.render();
        demon_dweller_black.opacity = entity.getData("fiskheroes:blade") && entity.getData("tmhp:dyn/blackform_timer");
        demon_dweller_black.render();

        demon_destroyer.opacity = entity.getData("fiskheroes:dyn/steeled");
        demon_destroyer.render();
        demon_destroyer_black.opacity = entity.getData("fiskheroes:dyn/steeled") && entity.getData("tmhp:dyn/blackform_timer");
        demon_destroyer_black.render();
    }
    if (entity.getInterpolatedData("tmhp:dyn/blackform_timer")) {
        blackform.render();
        wing.render(entity, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"));
    }
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:cryo_charge")) {
        demon_slayer_black_divider.render();
    }
    if (renderLayer == "HELMET" && entity.getData('fiskheroes:shield_blocking_timer')) {
        nero_block.render();
    }
    if (renderLayer == "HELMET" && !entity.getData('fiskheroes:shield_blocking_timer')) {
        nero.render();
    }
}