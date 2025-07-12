extend("tmhp:hero_mask3");
loadTextures({
    "layer1": "tmhp:black_clover/asta/spade_layer1",
    "layer2": "tmhp:black_clover/asta/spade_layer2",
    "mask": "tmhp:black_clover/asta/spade_headband",
    "antimagicdemon": "tmhp:black_clover/asta/antimagicdemon",
    "blackform": "tmhp:black_clover/asta/spade_blackform",
    "black_samurai": "tmhp:black_clover/asta/black_samurai",
    "black_samurai_glow": "tmhp:black_clover/asta/black_samurai_glow",
    "black_guardian": "tmhp:black_clover/asta/black_guardian",
    "black_guardian_glow": "tmhp:black_clover/asta/black_guardian_glow",
    "horn": "tmhp:black_clover/asta/horn",
    "wing": "tmhp:black_clover/asta/wing",
    "wings": "tmhp:black_clover/asta/wings",
    "scarf": "tmhp:black_clover/asta/scarf",
    "orbs": "tmhp:black_clover/asta/orbs",

    "grimoire": "tmhp:black_clover/asta/grimoire",
    "grimoire_pocket": "tmhp:black_clover/grimoire_pocket",

    "katana": "tmhp:black_clover/asta/demon_slasher",
    "katana_black": "tmhp:black_clover/asta/demon_slasher_black",
    "demon_destroyer": "tmhp:black_clover/asta/demon_destroyer",
    "demon_destroyer_black": "tmhp:black_clover/asta/demon_destroyer_black",
    "demon_destroyer_glow": "tmhp:black_clover/asta/demon_destroyer_glow",
    "black_divider": "tmhp:black_clover/asta/black_divider",
    "demon_slayer": "tmhp:black_clover/asta/demon_slayer",
    "demon_slayer_black": "tmhp:black_clover/asta/demon_slayer_black",
    "demon_dweller": "tmhp:black_clover/asta/demon_dweller",
    "demon_dweller_black": "tmhp:black_clover/asta/demon_dweller_black",
    "demon_dweller_du": "tmhp:black_clover/asta/demon_dweller_du",
    "demon_dweller_du_glow": "tmhp:black_clover/asta/demon_dweller_du_glow"
});

var capes = implement("fiskheroes:external/capes");
var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var blackform;
var black_samurai;
var black_guardian;
var spirit_wings = implement("tmhp:external/spirit_wings");
var wing;
var wings;
var horn;
var du_horn;
var du_orbs;
var grimoire;
var grimoire_pocket;
var demon_slayer;
var black_divider;
var demon_dweller;
var demon_destroyer;
var antimagicdemon;
var physics;
var cape;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 1;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.5;
    physics.flareElasticity = 8;
    physics.setTickHandler(entity => {
        var f = 1 - entity.getData("fiskheroes:flight_timer");
        f = 1 - f * f * f;
        physics.headingAngle = 90 - f * 20;
        physics.restAngle = f * 40;
        physics.restFlare = f * 0.7;
        physics.idleFlutter = 0.25 + 0.45 * f;
        physics.flutterSpeed = f * 0.25;
    });

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("scarf");

    grimoire = renderer.createEffect("fiskheroes:model");
    grimoire.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire", "grimoire"));
    grimoire.anchor.set("body");
    grimoire.mirror = false;
    grimoire_pocket = renderer.createEffect("fiskheroes:model");
    grimoire_pocket.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire_pocket", "grimoire_pocket"));
    grimoire_pocket.anchor.set("body");
    grimoire_pocket.mirror = false;

    antimagicdemon = renderer.createEffect("fiskheroes:model");
    antimagicdemon.setModel(utils.createModel(renderer, "tmhp:black_clover/anti_magic_demon", "antimagicdemon"));
    antimagicdemon.anchor.set("body");
    antimagicdemon.mirror = false;
    black_samurai = renderer.createEffect("fiskheroes:overlay");
    black_samurai.texture.set("black_samurai", "black_samurai_glow");
    black_guardian = renderer.createEffect("fiskheroes:overlay");
    black_guardian.texture.set("black_guardian", "black_guardian_glow");
    blackform = renderer.createEffect("fiskheroes:overlay");
    blackform.texture.set("blackform", null);
    wing = spirit_wings.create(renderer, "wing", null, spirit_wings.BLACKFORM_TWO);
    wings = spirit_wings.create(renderer, "wings", null, spirit_wings.DEVIL_UNION);
    horn = renderer.createEffect("fiskheroes:model");
    horn.setModel(utils.createModel(renderer, "tmhp:black_clover/devil_horn", "horn", null));
    horn.anchor.set("head");
    horn.mirror = false;
    du_horn = renderer.createEffect("fiskheroes:model");
    du_horn.setModel(utils.createModel(renderer, "tmhp:black_clover/devil_union_horn", "horn", null));
    du_horn.anchor.set("head");
    du_horn.mirror = false;
    du_orbs = renderer.createEffect("fiskheroes:model");
    du_orbs.setModel(utils.createModel(renderer, "tmhp:black_clover/orbs", "orbs", null));
    du_orbs.anchor.set("body");
    du_orbs.mirror = false;

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(du_horn);
    glow.color.set(0xFF0000);
    shrink_lights = body_lines.create(renderer, "tmhp:df_steady_beam", 0xFF0000, [
        { anchor: "body", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [18.0, 5.0, 7.0], "end": [8.0, 5.0, 7.0], "size": [2.5, 2.5] }
        ]},
        { anchor: "body", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-18.0, 5.0, 7.0], "end": [-8.0, 5.0, 7.0], "size": [2.5, 2.5] }
        ]},
        { anchor: "body", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [12.0, 18.0, 7.0], "end": [2.0, 18.0, 7.0], "size": [2.5, 2.5] }
        ]},
        { anchor: "body", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-12.0, 18.0, 7.0], "end": [-2.0, 18.0, 7.0], "size": [2.5, 2.5] }
        ]},
        { anchor: "body", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [12.0, -10.0, 7.0], "end": [2.0, -10.0, 7.0], "size": [2.5, 2.5] }
        ]},
        { anchor: "body", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-12.0, -10.0, 7.0], "end": [-2.0, -10.0, 7.0], "size": [2.5, 2.5] }
        ]}
    ]);


    utils.bindParticles(renderer, "tmhp:blackform").setCondition(entity => entity.getData('tmhp:dyn/blackform2_timer') > 0 && entity.getData('tmhp:dyn/blackform2_timer') < 1);
    utils.bindParticles(renderer, "tmhp:devil_union").setCondition(entity => entity.getData('tmhp:dyn/devil_union_timer') > 0 && entity.getData('tmhp:dyn/devil_union_timer') < 1);
    utils.bindTrail(renderer, "tmhp:devil_union").setCondition(entity => entity.getData('tmhp:dyn/devil_union_timer') > 0 && entity.getData('tmhp:dyn/devil_union_timer') < 1);
    utils.bindTrail(renderer, "tmhp:anti_mahou").setCondition(entity => entity.getData('tmhp:dyn/blackform2_timer') > 0 && entity.getData('tmhp:dyn/blackform2_timer') < 1);
    utils.bindTrail(renderer, "tmhp:devil_union").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "tmhp:black_slash", "rightArm", 0xFF0000, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.0, 11.0] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:black_slash", "rightArm", 0xFF0000, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 10.0, -12.0], "size": [1.0, 50.0] }
    ]);
    utils.bindParticles(renderer, "tmhp:black_slash").setCondition(entity => entity.getData('fiskheroes:energy_charging') > 0);

    utils.addLivery(renderer, "KATANA", "katana_black").setCondition(entity => entity.getData('tmhp:dyn/devil_union') || entity.getData('tmhp:dyn/blackform2'));
    utils.addLivery(renderer, "KATANA", "katana").setCondition(entity => !entity.getData('tmhp:dyn/devil_union') || !entity.getData('tmhp:dyn/blackform2'));
    demon_slayer = renderer.createEffect("fiskheroes:model");
    demon_slayer.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_slayer", "demon_slayer", null));
    demon_slayer.anchor.set("rightArm");
    demon_slayer.mirror = false;
    demon_slayer_black = renderer.createEffect("fiskheroes:model");
    demon_slayer_black.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_slayer", "demon_slayer_black", null));
    demon_slayer_black.anchor.set("rightArm");
    demon_slayer_black.mirror = false;
    demon_slayer_du = renderer.createEffect("fiskheroes:model");
    demon_slayer_du.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_slayer", "demon_slayer_black", null));
    demon_slayer_du.anchor.set("rightArm");
    demon_slayer_du.mirror = false;
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
    demon_dweller_du = renderer.createEffect("fiskheroes:model");
    demon_dweller_du.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_dweller_du", "demon_dweller_du", "demon_dweller_du_glow"));
    demon_dweller_du.anchor.set("rightArm");
    demon_dweller_du.mirror = false;

    demon_destroyer = renderer.createEffect("fiskheroes:model");
    demon_destroyer.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_destroyer", "demon_destroyer", null));
    demon_destroyer.anchor.set("leftArm");
    demon_destroyer.mirror = false;
    demon_destroyer_black = renderer.createEffect("fiskheroes:model");
    demon_destroyer_black.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_destroyer", "demon_destroyer_black", null));
    demon_destroyer_black.anchor.set("leftArm");
    demon_destroyer_black.mirror = false;
    demon_destroyer_du = renderer.createEffect("fiskheroes:model");
    demon_destroyer_du.setModel(utils.createModel(renderer, "tmhp:black_clover/demon_destroyer_du", "demon_destroyer_black", "demon_destroyer_glow"));
    demon_destroyer_du.anchor.set("leftArm");
    demon_destroyer_du.mirror = false;
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
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        grimoire_pocket.opacity = !entity.getInterpolatedData("tmhp:dyn/devil_union_timer");
        grimoire_pocket.render();
        grimoire.opacity = entity.getInterpolatedData("tmhp:dyn/grimoire_timer");
        grimoire.render();

        horn.opacity = entity.getInterpolatedData("tmhp:dyn/blackform2_timer");
        horn.render();

        demon_slayer.opacity = entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/blackform2_timer") && !entity.getData("tmhp:dyn/devil_union_timer");
        demon_slayer.render();
        demon_slayer_black.opacity = entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:cryo_charge") && entity.getData("tmhp:dyn/blackform2_timer");
        demon_slayer_black.render();
        demon_slayer_du.opacity = entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:cryo_charge") && entity.getData("tmhp:dyn/devil_union_timer");
        demon_slayer_du.render();

        demon_dweller.opacity = entity.getData("fiskheroes:blade") && !entity.getData("tmhp:dyn/devil_union_timer");
        demon_dweller.render();
        demon_dweller_black.opacity = entity.getData("fiskheroes:blade") && entity.getData("tmhp:dyn/blackform2_timer");
        demon_dweller_black.render();
        demon_dweller_du.opacity = entity.getData("fiskheroes:blade") && entity.getData("tmhp:dyn/devil_union_timer");
        demon_dweller_du.render();

        demon_destroyer.opacity = entity.getData("fiskheroes:dyn/steeled") && !entity.getData("tmhp:dyn/devil_union_timer");
        demon_destroyer.render();
        demon_destroyer_black.opacity = entity.getData("fiskheroes:dyn/steeled") && entity.getData("tmhp:dyn/blackform2_timer");
        demon_destroyer_black.render();
        demon_destroyer_du.opacity = entity.getData("fiskheroes:dyn/steeled") && entity.getData("tmhp:dyn/devil_union_timer");
        demon_destroyer_du.render();
    }
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:cryo_charge")) {
        demon_slayer_black_divider.render();
    }
    if (renderLayer == "CHESTPLATE" || renderLayer == "LEGGINGS" || renderLayer == "BOOTS") {
        blackform.opacity = entity.getInterpolatedData("tmhp:dyn/blackform2_timer");
        blackform.render();
        black_samurai.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union_timer") && !entity.getHeldItem().isEmpty();
        black_samurai.render();
        black_guardian.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union_timer") && entity.getHeldItem().isEmpty();
        black_guardian.render();
        du_horn.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union_timer");
        du_horn.render();
        du_orbs.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union_timer");
        du_orbs.render();
        antimagicdemon.opacity = !entity.getInterpolatedData("tmhp:dyn/devil_union_timer");
        antimagicdemon.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" && entity.getData("tmhp:dyn/devil_union_timer") > 0.6 && !entity.getHeldItem().isEmpty()) {
            var f = entity.getInterpolatedData("fiskheroes:flight_timer");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
    }
    if (entity.getInterpolatedData("tmhp:dyn/blackform2_timer")) {
        wing.render(entity, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"));
    }
    if (entity.getInterpolatedData("tmhp:dyn/devil_union_timer") > 0.9) {
        wings.render(entity, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"));
    }
    glow.opacity = entity.getData('tmhp:dyn/devil_union_timer') > 0 && entity.getData('tmhp:dyn/devil_union_timer') < 1;
    glow.render();
    shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("tmhp:dyn/devil_union_timer");
    shrink_lights.progress /= Math.sqrt(entity.getData('tmhp:dyn/devil_union_timer') > 0) * 2;
    shrink_lights.render(renderLayer);
}