extend("jmctheroes:modok");
loadTextures({
    "layer1": "jmctheroes:blank",
    "layer2": "jmctheroes:blank",
    "modok": "jmctheroes:modok2",
    "lights": "jmctheroes:modok2_lights"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.setOpacity(renderer, 0.5, 0.1);
    
    var model = renderer.createResource("MODEL", "jmctheroes:MODOK/MODOK2");
    model.texture.set("modok", "lights");
    model.bindAnimation("jmctheroes:pose/modok_boost").setData((entity, data) => {
        data.load(0, Math.sin((2*entity.loop(100))*Math.PI)/2);
        data.load(1, entity.getInterpolatedData("jmctheroes:dyn/moving_timer"));
        data.load(2, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    }).priority = -1;
    
    modok = renderer.createEffect("fiskheroes:model").setModel(model);
    modok.anchor.set("body");

    var modelfull = renderer.createResource("MODEL", "jmctheroes:MODOK/MODOK2Full");
    modelfull.texture.set("modok", "lights");
    //modelfull.bindAnimation("jmctheroes:pose/modok_boost").setData((entity, data) => {
    //    data.load(0, Math.sin((2*entity.loop(100))*Math.PI)/2);
    //    data.load(1, entity.getInterpolatedData("jmctheroes:dyn/moving_timer"));
    //    data.load(2, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    //}).priority = -1;
    modokfull = renderer.createEffect("fiskheroes:model").setModel(modelfull);
    modokfull.anchor.set("body");

    var fire = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");

    thruster = renderer.createEffect("fiskheroes:booster")
    thruster.setIcon(fire).setOffset(0.0, 0.0, 0.0).setRotation(0, 0, 0).setSize(12.0, 1.5);
    thruster.anchor.set("body", model.getCubeOffset("Head"));

    var arm = utils.createModel(renderer, "jmctheroes:MODOK/MODOK2Arm", "modok", null);
    arm.generateMirror();

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "body", 0xFF1000, [
        { "firstPerson": [0.0, -6.15, 0.0], "offset": [0.0, -10.5, -11.0], "size": [2.5, 2.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    armEffect = renderer.createEffect("fiskheroes:model");
    armEffect.setModel(arm);
    armEffect.anchor.set("rightArm");
    armEffect.setOffset(0.0, -1.0, 0.0);
    armEffect.mirror = true;
}

function render(entity, renderLayer, isFirstPersonArm) {
    // Is player, on holostand, or in book
    if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "HOLOGRAM" || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
        modok.render();
        armEffect.render();
        var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        thruster.setRotation(0 - -15 * boost, 0.0, 0 - 0 * boost);
        thruster.speedScale = 0.1 * boost;
        thruster.render();
    }
    else {
        if (entity.as("DISPLAY").getDisplayType() === "FABRICATOR_RESULT") {
            modokfull.setScale(0.4);
            modokfull.setOffset(0.0, 4.0, 1.75);
        }
        else {
            modokfull.setScale(1.0);
            modokfull.setOffset(0.0, 0.0, 0.0);
        }
        modokfull.render();
    }
}