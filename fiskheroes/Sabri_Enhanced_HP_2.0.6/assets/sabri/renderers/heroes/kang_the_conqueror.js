extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:kang_the_conqueror_layer1",
    "layer2": "sabri:kang_the_conqueror_layer2",
    "layer2_chest": "sabri:kang_the_conqueror_layer2_chest",
    "chest": "sabri:kang_the_conqueror_chest",
    "lights": "sabri:kang_the_conqueror_lights",
    "mask": "sabri:kang_the_conqueror_mask.tx.json",
    "mask_lights": "sabri:kang_the_conqueror_mask_lights.tx.json",
    "cape": "sabri:kang_the_conqueror_cape",
    "platform": "sabri:kang_the_conqueror_platform",
    "eyes": "sabri:kang_the_conqueror_eyes",
    "scars": "sabri:kang_the_conqueror_scars",
    "arm": "sabri:kang_the_conqueror_arm_lights"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getData("fiskheroes:mask_open_timer2") > 0 ? "mask" : "layer1";
        }
        else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "layer2_chest" : "layer2";
        }
        else if (renderLayer == "BOOTS") {
            return "layer1";
        }
        return "chest";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return renderLayer == "HELMET" ? "lights" : null;
    });

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");
}


function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.3;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;
    
    utils.bindCloud(renderer, "fiskheroes:teleportation", "sabri:kang_the_conqueror_portal");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sabri:kang_the_conqueror_energy_projection", "rightArm", 0x00BAFF, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0] },
        { "firstPerson": [5.5, 4.75, -10.0], "offset": [0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sabri:kang_the_conqueror_energy_projection"));


    var energy_blast = renderer.createResource("BEAM_RENDERER", "sabri:kang_the_conqueror_energy_projection");
    var constln = renderer.createResource("BEAM_CONSTELLATION", null);
    var energy_blast_beam = constln.bindBeam({ "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0] });
    
    var repulsor_blast = renderer.bindProperty("fiskheroes:repulsor_blast");
    repulsor_blast.setConstellation(constln);
    repulsor_blast.setRenderer(energy_blast);
    repulsor_blast.color.set(0x00BAFF);

    repulsor_blast.setCondition(entity => {
        if (Math.random() < 0.5) {
            repulsor_blast.setAnchor("rightArm");
            energy_blast_beam.firstPerson.x = -5.5;
            energy_blast_beam.offset.x = -0.5;
        }
        else {
            repulsor_blast.setAnchor("leftArm");
            energy_blast_beam.firstPerson.x = 5.5;
            energy_blast_beam.offset.x = 0.5;
        }
        
        return true;
    });

    arms_blast = utils.createLines(renderer, "sabri:kang_the_conqueror_aura_hands", 0x039dfc, [
        {"start": [0, 0.5, 0], "end": [0.0, 1.0, 0.0], "size": [10.0, 3.0]},
    ]);
    arms_blast.anchor.set("rightArm");
    arms_blast.setOffset(1, 4.25, 0).setRotation(0.0, 0.0, 0.0).setScale(8.0, 6.0, 8.0);
    arms_blast.mirror = true;

    energy_proj = renderer.createEffect("fiskheroes:overlay");

    arms = renderer.createEffect("fiskheroes:overlay");
    arms.texture.set(null, "arm");

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x00BAFF);
    forcefield.setShape(36, 18).setOffset(0.0, 16.0, 0.0).setScale(3);
    forcefield.setCondition(entity => {
        var shield = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        var t = 5;
        forcefield.setScale(3, 3 * shield, 3);
        forcefield.opacity = 0.35 * shield + Math.max(Math.sin(Math.PI * (Math.min(entity.getInterpolatedData("fiskheroes:ticks_since_shield_damaged"), t) / t)), 0) * (shield * 0.25);
        return true;
    });

    platform = renderer.createEffect("fiskheroes:model");
    platform.setModel(utils.createModel(renderer, "sabri:kang_the_conqueror_platform", null, "platform"));
    platform.setOffset(0, 1.5, 0)
    platform.anchor.set("body");

    vision = renderer.bindProperty("fiskheroes:night_vision");
    vision.factor = 1;
    vision.fogStrength = 0;
    vision.setCondition(entity => entity.getData("fiskheroes:mask_open_timer2") == 0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.AIMING");

    renderer.reprioritizeDefaultAnimation("HOLD_CHRONOS_RIFLE", 9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", 9);
    renderer.reprioritizeDefaultAnimation("HOLD_PIZZA", 9);
    renderer.reprioritizeDefaultAnimation("PUNCH", 9);

    addAnimationWithData(renderer, "kang.TELEPORT", "fiskheroes:aiming", "fiskheroes:teleport_timer");
    addAnimationWithData(renderer, "kang.TELEKINESIS", "fiskheroes:aiming", "sabri:dyn/aiming_timer");
    
    addAnimationWithData(renderer, "kang.BLOCKING", "sabri:kang_the_conqueror_blocking", "fiskheroes:shield_blocking_timer")
        .priority = -5;

    addAnimationWithData(renderer, "kang.ENERGY_PROJ", "fiskheroes:dual_aiming", "fiskheroes:aiming_timer")
        .priority = -5;

    utils.addHoverAnimation(renderer, "kang.HOVER", "sabri:flight/idle/kang_the_conqueror");
    utils.addFlightAnimation(renderer, "kang.BOOST", "sabri:flight/kang_the_conqueror.anim.json", (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("sabri:dyn/kang_boost_timer"));
        data.load(2, entity.getInterpolatedData("sabri:dyn/single_hit"));
        data.load(3, entity.getInterpolatedData("sabri:dyn/dual_hit"));
        data.load(4, entity.getInterpolatedData("sabri:dyn/single"));
        data.load(5, entity.getInterpolatedData("sabri:dyn/dual"));
    }).priority = -5;

    addAnimationWithData(renderer, "kang.LAND", "sabri:kang_the_conqueror_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
    var aiming = entity.getInterpolatedData("fiskheroes:aiming_timer");
    var f = entity.getInterpolatedData("fiskheroes:flight_timer");

    if (renderLayer == "HELMET") {
        energy_proj.texture.set(null, entity.getData("fiskheroes:mask_open_timer2") ? "eyes" : "scars");
        energy_proj.opacity = aiming;
        energy_proj.render();
    }

    if (renderLayer == "CHESTPLATE") {
        cape.render(entity);
        
        arms_blast.opacity = aiming;
        arms_blast.render();

        arms.opacity = Math.max(entity.getInterpolatedData("sabri:dyn/aiming_timer"), entity.getInterpolatedData("fiskheroes:teleport_timer"));
        arms.render();

        if (f > 0) {
            var scale = f > 0.75 ? f : 0.75
            platform.setScale(scale, 1, scale)
            platform.opacity = 0.9 * f;
    
            if (isFirstPersonArm) {
                platform.setRotation(-entity.rotPitch(), 0, 0);
                platform.anchor.ignoreAnchor(true);
            } else {
                platform.setRotation(0, 0, 0);
                platform.anchor.ignoreAnchor(false);
            }
    
            platform.render();
        }
    }
}