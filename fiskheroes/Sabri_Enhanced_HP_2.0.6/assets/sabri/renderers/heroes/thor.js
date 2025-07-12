extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:thor_layer1",
    "layer2": "sabri:thor_layer2",
    "cape": "sabri:thor_cape",
    "null": "sabri:empty"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY") && entity.getData("fiskheroes:mask_open_timer2") >= 0.5) {
            return "null";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
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

    var color = 0x00AAF6;

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(cape.effect);
    glow.color.set(0xFFFFFF);

    lightning = utils.createLines(renderer, ("BEAM_RENDERER", "sabri:thor_lightning"), color, [
        {"start": [0, -96, 0], "end": [0, 8, 0], "size": [8.0, 8.0]}
    ]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sabri:thor_lightning", "rightArm", color, [
        { "firstPerson": [-6.5, 3.5, -10.0], "offset": [-0.5, 16.25, -2.4], "size": [2.5, 2.5, 2.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    
    lightning.anchor.ignoreAnchor(true);
    lightning.setOffset(0.0, -96.0, 0.2);
    lightning.setScale(16.0);

    trail = renderer.bindProperty("fiskheroes:trail");
    trail.setTrail(renderer.createResource("TRAIL", "sabri:thor"));
    trail.setCondition(entity => entity.getData("fiskheroes:mask_open_timer2") > 0 && entity.getData("fiskheroes:mask_open_timer2") < 1);

    utils.addCameraShake(renderer, 0.015, 1.25, "fiskheroes:mask_open_timer2");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:mask_open_timer2")) * 1.25;
        return true;
    });
    shake.intensity = 0.0;

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.0;

    utils.bindParticles(renderer, "sabri:thor_slam").setCondition(entity => entity.getData("sabri:dyn/superhero_landing_timer") >= 0.9);;

    utils.addCameraShake(renderer, 0.015, 1.25, "sabri:dyn/superhero_landing_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = Math.sin(Math.PI * 0.5 * entity.getInterpolatedData("sabri:dyn/superhero_landing_timer")) * 1.25;
        return true;
    });
    shake.intensity = 0.0;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "thor.LEAP", "sabri:thor_leap") 
		.setData((entity, data) => {
		data.load(0, entity.getInterpolatedData("sabri:dyn/mjolnir_leap_timer") - entity.getInterpolatedData("sabri:dyn/superhero_landing_timer"));
    }).priority = 0;

    addAnimationWithData(renderer, "thor.SMASH", "sabri:thor_slam", "sabri:dyn/superhero_landing_timer")
        .priority = 1;

    addAnimationWithData(renderer, "thor.LAND", "sabri:thor_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "thor.CHARGE", "sabri:mjolnir_charge", "fiskheroes:reload_timer")
        .priority = -8;

    addAnimation(renderer, "thor.SPIN", "sabri:mjolnir_spin").setData((entity, data) => {
        var m = Math.min(entity.getInterpolatedData("fiskheroes:flight_boost_timer") * 10, 1)
        data.load(0, Math.min(Math.max(entity.getInterpolatedData("sabri:dyn/aiming_timer") - m, 0) * 5, 1));
        data.load(1, Math.max(entity.loop(8) * (1 - m), 0));
    });

    addAnimation(renderer, "thor.CHARGED_BEAM", "fiskheroes:aiming").setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(entity.getData("fiskheroes:beam_charging") ? Math.max(f * 4 - 3, 0) : Math.max(f * 5 - 4, 0));
    });

    utils.addHoverAnimation(renderer, "thor.HOVER", "sabri:flight/idle/thor");
    utils.addFlightAnimation(renderer, "thor.FLIGHT", "sabri:flight/thor.anim.json", (entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:flight_timer");
        var b = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        data.load(0, entity.getInterpolatedData("sabri:dyn/aiming_timer") > 0 ? f : 0);
        data.load(1, b);
        data.load(3, f - b);
    });
}

function hasCape() {
    return true;
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (!entity.is("DISPLAY")) {
        if (renderLayer == "CHESTPLATE" && hasCape() && entity.getData("fiskheroes:mask_open_timer2") < 0.5) {
            cape.render(entity);
        }
        if (entity.getData("fiskheroes:mask_open_timer2") > 0 && entity.getData("fiskheroes:mask_open_timer2") < 1) {
            lightning.progress = Math.min(entity.getData("fiskheroes:mask_open_timer2") * 5, 1);
            lightning.render();
    
            glow.opacity = Math.sin(Math.PI * entity.getData("fiskheroes:mask_open_timer2"));
            glow.render();
        }
    }
    else if (renderLayer == "CHESTPLATE" && hasCape()) {
        cape.render(entity);
    }
}