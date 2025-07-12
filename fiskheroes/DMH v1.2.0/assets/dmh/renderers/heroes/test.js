extend("fiskheroes:hero_basic");
loadTextures({
    "base": "dmh:atro_full/base",
    "suit": "dmh:atro_full/transformed",
    "suit_transforming": "dmh:atro_full/suit.tx.json",
    "suit_lights": "dmh:atro_full/transformed_lights",
    "eyes": "dmh:atro_full/eye_lights",
    "under": "dmh:atro_full/base_no",
    "mask": "dmh:atro_full/mask.tx.json",
    "segment": "fiskheroes:doctor_octopus_arm",
    "claw": "fiskheroes:doctor_octopus_claw",
    "claw_lights": "fiskheroes:doctor_octopus_claw_lights",
    "shield": "dmh:acce/astro_shield",
    "shield_lights": "dmh:acce/astro_shield_lights",
    "blade": "dmh:acce/astro_blade",
    "backpack": "dmh:acce/astro_backpack",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",
});
var utils = implement("fiskheroes:external/utils");
var mk85_backpack = implement("fiskheroes:external/mk85_backpack");
var astro_boosters = implement("dmh:external/astro_boosters");

var backpack;
var boosters;

var repulsor;
var blade;
var shield;
var metal_heat;

var suit;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return entity.getData("fiskheroes:mask_open_timer2") == 1 ? "base" : "under";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("dmh:dyn/transform_timer");
            return timer == 0 ? "base" : "under";
        }
        return "base";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    suit = renderer.createEffect("fiskheroes:overlay");
    
    var ock_arm = utils.createModel(renderer, "fiskheroes:ock_arm", "segment");
    var ock_claw = utils.createModel(renderer, "fiskheroes:ock_claw", "claw", "claw_lights");
    ock_claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        {
            "offset": [3.0, -3.5, -2.0],
            "direction": [13.0, 10.0, -10.0]
        },
        {
            "offset": [-3.0, -3.5, -2.0],
            "direction": [-13.0, 10.0, -10.0]
        },
        {
            "offset": [3.0, -7.5, -2.0],
            "direction": [13.0, -7.0, -10.0]
        },
        {
            "offset": [-3.0, -7.5, -2.0],
            "direction": [-13.0, -7.0, -10.0]



        },
        {
            "offset": [2.5, -5.0, -2.0],
            "direction": [8.0, 17.0, -17.0]
        },
        {
            "offset": [-2.5, -5.0, -2.0],
            "direction": [-5.0, 16.0, -17.0]
        }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(ock_arm);
    tentacles.setHeadModel(ock_claw);
    tentacles.segmentLength = 1.8;
    tentacles.segments = 16;

    repulsor = renderer.createEffect("fiskheroes:overlay");

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield", "shield_lights");
    shield.anchor.set("rightArm");
    shield.setRotation(0.0, 0.0, -10.0).setCurve(15.0, 50.0);
    shield.large = true;

    backpack = mk85_backpack.create(renderer, "backpack");
    boosters = astro_boosters.create(renderer, "dmh:blue_fire_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(blade, shield, backpack.b1, backpack.b2, backpack.b3);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0x55FFFF, [
        { "offset": [6.75, 10.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [10.0, 0.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [6.5, -4.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-6.75, 10.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [-10.0, 0.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-6.5, -4.5, 3.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0x55FFFF, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 8.0, 0.0], "size": [1.5, 1.5] }
    ]);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "dmh:energy_projection", "rightArm", 0x55FFFF, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 8.0, 0.0], "size": [1.5, 1.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "basic.CHARGED_BEAM", "fiskheroes:dual_aiming").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 5 - 4, 0)));

    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;

    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
  }

function render(entity, renderLayer, isFirstPersonArm) {
    var timer = entity.getData("dmh:dyn/transform_timer");
    if (timer > 0) {
        suit.texture.set(timer == 1 ? entity.getData("fiskheroes:mask_open_timer2") > 0 ? "mask" : "suit" : "suit_transforming");
        suit.render();
    }
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
    repulsor.texture.set(null, "repulsor");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
    repulsor.texture.set(null, "repulsor_left");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
    repulsor.texture.set(null, "repulsor_boots");
    repulsor.render();

    blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

    var f = Math.min(blade.unfold * 5, 1);
    blade.setOffset(2.9 + 0.1 * f, 6.0 + 3.0 * f, 0.0);
    blade.render();

    shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
    shield.setOffset(2.9 + 2 * Math.min(shield.unfold * 5, 1), 6.0, 0.0);
    shield.render();

    backpack.render(entity.getInterpolatedData("fiskheroes:beam_charge"));
    boosters.render(entity, renderLayer, isFirstPersonArm, true);

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}