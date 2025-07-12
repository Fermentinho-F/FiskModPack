extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:black_clover/themucahid/layer1",
    "layer2": "tmhp:black_clover/themucahid/layer2",
    "scarf": "tmhp:black_clover/themucahid/scarf",
    "grimoire": "tmhp:black_clover/themucahid/grimoire",
    "grimoire_pocket": "tmhp:black_clover/grimoire_pocket",
    "coat": "tmhp:black_clover/themucahid/coat",
    "dragon": "tmhp:black_clover/themucahid/dragon",
    "hellfang": "tmhp:black_clover/themucahid/hellfang",
    
    "hell_crown": "tmhp:black_clover/themucahid/hell_crown",
    "hell_crown_glow": "tmhp:black_clover/themucahid/hell_crown_glow",
    "du": "tmhp:black_clover/themucahid/du",
    "du_glow": "tmhp:black_clover/themucahid/du_glow",
    "eyes": "tmhp:black_clover/themucahid/eyes",
    "eyes_glow": "tmhp:black_clover/themucahid/eyes_glow",
    "wings": "tmhp:black_clover/themucahid/wings",
    "orbs": "tmhp:black_clover/asta/orbs",
    "katana": "tmhp:black_clover/themucahid/katana",
    "katana_du": "tmhp:black_clover/themucahid/katana_du",
    "katana_du_glow": "tmhp:black_clover/themucahid/katana_du_glow",
    "hellfang_du": "tmhp:black_clover/themucahid/hellfang_du",
    "hellfang_du_glow": "tmhp:black_clover/themucahid/hellfang_du_glow"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var capes = implement("fiskheroes:external/capes");
var spirit_wings = implement("tmhp:external/spirit_wings");
var body_lines = implement("fiskheroes:external/body_lines");
var glowing_katana = implement("tmhp:external/glowing_katana");
var coat;
var grimoire;
var grimoire_pocket;
var cape;
var collar;
var wings;
var du;
var hellfang;
var hellfang_du;
var orbs;
var eyes;
var hell_crown;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    dragon = renderer.createEffect("fiskheroes:model");
    dragon.setModel(utils.createModel(renderer, "tmhp:black_clover/dragon", "dragon"));
    dragon.anchor.set("head");
    dragon.mirror = false;

    utils.addLivery(renderer, "KATANA", "katana").setCondition(entity => !entity.getData("tmhp:dyn/devil_union2"));
    glowing_katana.addLivery(renderer, "KATANA", "katana_du", "katana_du_glow").setCondition(entity => entity.getData("tmhp:dyn/devil_union2"));
    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 1;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.5;
    physics.flareElasticity = 8;
    physics.setTickHandler(entity => {
        var f = 1 - !entity.getData("fiskheroes:dyn/nanite_timer");
        f = 1 - f * f * f;
        physics.headingAngle = 90 - f * 20;
        physics.restAngle = f * 40;
        physics.restFlare = f * 0.7;
        physics.idleFlutter = 0.25 + 0.45 * f;
        physics.flutterSpeed = f * 0.25;
    });
    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("scarf");

    coat = renderer.createEffect("fiskheroes:model");
    coat.setModel(utils.createModel(renderer, "tmhp:sagecoat", "coat", null));
    coat.anchor.set("body");
    coat.mirror = false;

    grimoire = renderer.createEffect("fiskheroes:model");
    grimoire.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire", "grimoire"));
    grimoire.anchor.set("body");
    grimoire.mirror = false;
    grimoire_pocket = renderer.createEffect("fiskheroes:model");
    grimoire_pocket.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire_pocket", "grimoire_pocket"));
    grimoire_pocket.anchor.set("body");
    grimoire_pocket.mirror = false;

    collar = renderer.createEffect("fiskheroes:ears");
    collar.anchor.set("head");
    collar.angle = -4;
    collar.inset = -0.07;



    wings = spirit_wings.create(renderer, null, "wings", spirit_wings.DEVIL_UNION2);

    hell_crown = renderer.createEffect("fiskheroes:model");
    hell_crown.setModel(utils.createModel(renderer, "tmhp:black_clover/hell_crown", "hell_crown", "hell_crown_glow"));
    hell_crown.anchor.set("head");
    hell_crown.mirror = false;
    du = renderer.createEffect("fiskheroes:overlay");
    du.texture.set("du", "du_glow");
    eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set("eyes", "eyes_glow");
    orbs = renderer.createEffect("fiskheroes:model");
    orbs.setModel(utils.createModel(renderer, "tmhp:black_clover/orbs", "orbs", null));
    orbs.anchor.set("body");
    orbs.mirror = false;

    hellfang = renderer.createEffect("fiskheroes:model");
    hellfang.setModel(utils.createModel(renderer, "tmhp:black_clover/hellfang", "hellfang", null));
    hellfang.anchor.set("rightArm");
    hellfang.mirror = false;
    hellfang_du = renderer.createEffect("fiskheroes:model");
    hellfang_du.setModel(utils.createModel(renderer, "tmhp:black_clover/hellfang", "hellfang_du", "hellfang_du_glow"));
    hellfang_du.anchor.set("rightArm");
    hellfang_du.mirror = false;
    utils.bindParticles(renderer, "tmhp:hellfire_katana").setCondition(entity => entity.getData("fiskheroes:shield") && entity.isPunching());

    utils.bindParticles(renderer, "tmhp:hellport").setCondition(entity => entity.getInterpolatedData('fiskheroes:teleport_timer') > 0 && entity.getInterpolatedData('fiskheroes:teleport_timer') < 1);
    utils.bindParticles(renderer, "tmhp:devil_union").setCondition(entity => entity.getData('tmhp:dyn/devil_union2_timer') > 0 && entity.getData('tmhp:dyn/devil_union2_timer') < 1);
    utils.bindTrail(renderer, "tmhp:devil_union").setCondition(entity => entity.getData('tmhp:dyn/devil_union2_timer') > 0 && entity.getData('tmhp:dyn/devil_union2_timer') < 1);
    utils.bindParticles(renderer, "tmhp:hellport").setCondition(entity => entity.getInterpolatedData('tmhp:dyn/devil_union2_timer') > 0 && entity.getInterpolatedData('tmhp:dyn/devil_union2_timer') < 1);
    utils.bindParticles(renderer, "tmhp:hellport").setCondition(entity => entity.getInterpolatedData('fiskheroes:shield_blocking'));

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFF5500);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 1.15;
        return true;
    });
    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(coat, hellfang, hellfang_du);
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

    hellball = body_lines.create(renderer, "tmhp:rasengan", 0xFF5500, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [2.0, 7.5, -6.0], "size": [4.0, 4.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [-5.0, 7.5, -6.0], "size": [4.0, 4.0] }
        ]}
    ]);
    hellball_du = body_lines.create(renderer, "tmhp:black_rasengan", 0xFF0000, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [2.0, 7.5, -6.0], "size": [4.0, 4.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [-5.0, 7.5, -6.0], "size": [4.0, 4.0] }
        ]}
    ]);

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(0xFF0000);
    magic.colorEarthCrack.set(0xFF0000);
    magic.colorWhip.set(0xFF3300);

    utils.bindParticles(renderer, "tmhp:devil_union").setCondition(entity => entity.getData('tmhp:dyn/devil_union_timer') > 0 && entity.getData('tmhp:dyn/devil_union_timer') < 1);
    utils.bindTrail(renderer, "tmhp:devil_union").setCondition(entity => entity.getData('tmhp:dyn/devil_union_timer') > 0 && entity.getData('tmhp:dyn/devil_union_timer') < 1);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmhp:slash", "rightArm", 0xFF0000, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [5.5, 0.0, 0.0], "size": [25.0, 25.0] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:black_slash", "rightArm", 0xFF5500, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 10.0, -12.0], "size": [1.0, 50.0] }
    ]);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);

    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;

    addAnimationWithData(renderer, "demon_slayer.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:shield_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        coat.render();
        grimoire_pocket.opacity = !entity.getData("tmhp:dyn/devil_union2_timer");
        grimoire_pocket.render();
        grimoire.opacity = entity.getInterpolatedData("tmhp:dyn/grimoire_timer");
        grimoire.render();
        collar.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
            var f = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
    }
    du.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union2_timer");
    du.render();
    eyes.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union2_timer");
    eyes.render();
    hell_crown.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union2_timer");
    hell_crown.render();

    hellfang.opacity = entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/devil_union2_timer");
    hellfang.render();
    hellfang_du.opacity = entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/devil_union2_timer");
    hellfang_du.render();
    orbs.opacity = entity.getInterpolatedData("tmhp:dyn/devil_union2_timer");
    orbs.render();
    dragon.opacity = !entity.getInterpolatedData("tmhp:dyn/devil_union2_timer");
    dragon.render();

    if (entity.getInterpolatedData("tmhp:dyn/devil_union2_timer") > 0.9) {
        wings.render(entity, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"));
    }
    glow.opacity = entity.getData('tmhp:dyn/devil_union2_timer') > 0 && entity.getData('tmhp:dyn/devil_union2_timer') < 1;
    glow.render();
    shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("tmhp:dyn/devil_union2_timer");
    shrink_lights.progress /= Math.sqrt(entity.getData('tmhp:dyn/devil_union2_timer') > 0) * 2;
    shrink_lights.render(renderLayer);

    if (entity.getData('fiskheroes:cryo_charge') && !entity.getData('tmhp:dyn/devil_union2')) {
       hellball.opacity = hellball.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       hellball.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       hellball.render(renderLayer);
    }
    if (entity.getData('fiskheroes:cryo_charge') && entity.getData('tmhp:dyn/devil_union2')) {
       hellball_du.opacity = hellball_du.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       hellball_du.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       hellball_du.render(renderLayer);
    }
}