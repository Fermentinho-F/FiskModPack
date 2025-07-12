extend("fiskheroes:hero_basic");

loadTextures({
    "layer1_chest": "sl:parasite/parasite_layer1_chest",
    "layer2_chest": "sl:parasite/parasite_layer2_chest",
    "mask": "sl:parasite/parasite_hair",
    "coat": "sl:parasite/parasite_chest",
    "layer1": "sl:parasite/parasite_layer1",
    "layer2": "sl:parasite/parasite_layer2",
    "boots": "sl:parasite/parasite_boots",
    "pants": "sl:parasite/parasite_pants",
    "layer1alt": "sl:parasite/parasite_layer1alt",
    "lights": "sl:parasite/parasite_lights_layer1",
    "eyes": "sl:eyes"
});

var utils = implement("fiskheroes:external/utils");

var glow;
var glitchglow;
var vibration;
var chest;
var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer === "HELMET" && !entity.getData("fiskheroes:mask_open")) {
            return "lights";
        } else {
            return null;
        }
    });

    renderer.setTexture((entity, renderLayer) => {
        if (entity.getWornChestplate().suitType() === $SUIT_NAME) {
            if (renderLayer === "CHESTPLATE") {
                return "coat";
            } else if (renderLayer === "LEGGINGS") {
                return "layer2_chest";
            } else {
                return "layer1_chest";
            }
        } else if (renderLayer === "LEGGINGS") {
            return "pants";
        } else if (renderLayer === "HELMET") {
            return "mask";
        } else if (renderLayer === "BOOTS") {
            return "boots";
        } else {
            return "layer1alt";
        }
    });

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:night_vision").firstPersonOnly = true;

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sl:parasite_energy_drain", "rightArm", 0x4769FF, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [6.0, 6.0, -6.0] },
        { "firstPerson": [5.5, 4.75, -10.0], "offset": [0.5, 9.0, 0.0], "size": [6.0, 6.0, -6.0], "anchor": "leftArm" }
    ]);

    energy = utils.createLines(renderer, ("BEAM_RENDERER", "sl:parasite_energy_drain"), 0x4769FF, [
        { "start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [8.0, 3.0] },
    ]);
    energy.setOffset(1.0, 3.5, 0.0);
    energy.setScale(12.0, 8.0, 12.0);
    energy.anchor.set("rightArm");

    energy2 = utils.createLines(renderer, ("BEAM_RENDERER", "sl:parasite_energy_drain"), 0x4769FF, [
        { "start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [8.0, 3.0] },
    ]);
    energy2.setOffset(-1.0, 3.5, 0.0);
    energy2.setScale(12.0, 8.0, 12.0);
    energy2.anchor.set("leftArm");

    energy3 = utils.createLines(renderer, ("BEAM_RENDERER", "sl:parasite_energy_drain"), 0xB4E8FF, [
        { "start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [8.0, 3.0] },
    ]);
    energy3.setOffset(-1.0, 3.5, 0.0);
    energy3.setScale(12.0, 8.0, 12.0);
    energy3.anchor.set("leftArm");

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");

    utils.bindTrail(renderer, "sl:talrhotrail").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.getData("fiskheroes:invisible"));

    utils.bindTrail(renderer, "sl:parasite").setCondition(entity => !entity.getData("fiskheroes:invisible") && !entity.getData("fiskheroes:speeding") && !entity.getData("fiskheroes:mask_open"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam", "leftArm", 0xB4E8FF, [
        { "firstPerson": [-5.0, 5.0, -8.0], "offset": [0.75, 12.0, 0.0], "size": [5.5, 5.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:parasite"));

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "hand_energy");
    overlay.opacity = 0.6;

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.85).setYOffset(0.90);

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(chest);
    glow.color.set(0xC7C6FF);

    glitchglow = renderer.createEffect("fiskheroes:glowerlay");
    glitchglow.includeEffects(chest);
    glitchglow.color.set(0xABABAB);

    vibration = renderer.createEffect("fiskheroes:vibration");
    vibration.includeEffects(chest);

    var shakef = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakef.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? (Math.log(6) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shakef.intensity = 0.1;

 function updateIntensity() {
     var landingTimer2 = entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer");
     var maxIntensity = 0.05;
     var minIntensity = 0.01;
     var intensity2 = maxIntensity - (maxIntensity - minIntensity) * landingTimer2;
     shake3.intensity = intensity2 > minIntensity ? intensity2 : minIntensity;
 }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "parasite.LAND", "sl:soft_landing", "sl:dyn/soft_landing_timer").priority = -8;

    addAnimation(renderer, "parasite.GLITCH", "sl:parasite/parasite_glitch")
        .setData((e, d) => e.getData("sl:dyn/parasite_glitch_timer") > 0 && Math.random() < 0.06 && d.load(true))
        .priority = -10;

    addAnimation(renderer, "parasite.GLITCH1", "sl:parasite/parasite_glitch1")
        .setData((e, d) => e.getData("sl:dyn/parasite_glitch_timer") > 0 && Math.random() < 0.06 && d.load(true))
        .priority = -10;

    addAnimation(renderer, "parasite.GLITCH2", "sl:parasite/parasite_glitch2")
        .setData((e, d) => e.getData("sl:dyn/parasite_glitch_timer") > 0 && Math.random() < 0.06 && d.load(true))
        .priority = -10;

    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming_left").setData((e, d) => {
        var charge = e.getInterpolatedData("fiskheroes:beam_charge");
        d.load(Math.max(e.getInterpolatedData("fiskheroes:aiming_timer"), e.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    utils.addFlightAnimation(renderer, "parasite.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");

    addAnimationWithData(renderer, "basic.ENERGY_PROJ", "fiskheroes:dual_aiming", "fiskheroes:energy_projection_timer");

    utils.addHoverAnimation(renderer, "parasite.HOVER", "fiskheroes:flight/idle/default_back");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (!isFirstPersonArm) {
            chest.render();
        }
    }

    if (!entity.getData("fiskheroes:mask_open")) {
        vibration.render();
        energy.opacity = entity.getInterpolatedData("fiskheroes:energy_projection") / 1.5;
        energy.render();
        energy2.opacity = entity.getInterpolatedData("fiskheroes:energy_projection") / 1.5;
        energy2.render();
    }

    glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();

    glitchglow.opacity = entity.getInterpolatedData("sl:dyn/speedup_timer");
    glitchglow.render();

    energy3.opacity = entity.getInterpolatedData("fiskheroes:beam_charging");
    energy3.render();
}
