extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:adam/black_adam_layer1",
    "layer2": "jmctheroes:adam/black_adam_layer2",
    "lights": "jmctheroes:adam/black_adam_lights",
    "blank": "jmctheroes:blank"
});
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/shazam_timer");
            var stand = entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
            return stand ? "layer1" : timer == 0 ? "blank" : timer < 1 ? "layer1" : "layer1";
        }
        if (renderLayer == "LEGGINGS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/shazam_timer");
            var stand = entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
            return stand ? "layer2" : timer == 0 ? "blank" : timer < 1 ? "layer2" : "layer2";
        }
        return "blank";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE" || renderLayer == "HELMET" || renderLayer == "BOOTS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/shazam_timer");
            var stand = entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
            return stand ? "lights" : timer == 0 ? "blank" : timer < 1 ? "blank" : "lights";
        }
        return "blank";
    });
}

function initEffects(renderer) {
    utils.bindTrail(renderer, "jmctheroes:shazam_power").setCondition(entity => entity.getData("jmctheroes:dyn/shazam_timer") > 0 && entity.getData('jmctheroes:dyn/shazam_timer') < 1);
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:energy_discharge", "rightArm", 0xFFFA5B, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);
    
    beam = renderer.createResource("BEAM_RENDERER", "jmctheroes:lightning_beam");
    utils.bindBeam(renderer, "fiskheroes:energy_projection", beam, "body", 0xFFFA5B, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    var lightning_color = 0xFFFA5B;

    utils.bindParticles(renderer, "jmctheroes:shazam").setCondition(entity => entity.getData("jmctheroes:dyn/shazam_timer") > 0 && entity.getData('jmctheroes:dyn/shazam_timer') < 1);

    var beam_1 = renderer.createResource("BEAM_RENDERER", "jmctheroes:shazam");
    var beam_2 = renderer.createResource("BEAM_RENDERER", "jmctheroes:lightning");

    shazam_beam = utils.createLines(renderer, beam_1, lightning_color, [
        {
            "start": [0, -64, 0],
            "end": [0, -1, 0],
            "size": [15.0, 15.0]
        },
    ])
    
    shazam_beam.anchor.set("body");
    shazam_beam.setOffset(1.0, 38.0, -3.2).setRotation(0, 90.0, 0).setScale(15.0);
    shazam_beam.mirror = false;

    shazam_beam2 = utils.createLines(renderer, beam_2, lightning_color, [
        {
            "start": [0, -8, 0],
            "end": [0, -1, 0],
            "size": [4.0, 4.0]
        },
    ])
    
    shazam_beam2.anchor.set("rightArm");
    shazam_beam2.setOffset(1.0, -2.0, -1.0).setRotation(90.0, 90.0, 90.0).setScale(1.5);
    shazam_beam2.mirror = false;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "shazam.FLIGHT", "jmctheroes:flight/rarm.anim.json");
    utils.addHoverAnimation(renderer, "shazam.HOVER", "fiskheroes:flight/idle/neutral");
}

function render(entity, renderLayer, isFirstPersonArm){
    var shazam_timer = entity.getInterpolatedData("jmctheroes:dyn/shazam_timer");
    if (!isFirstPersonArm){
        if (shazam_timer > 0 && shazam_timer < 1){
            shazam_beam.render();
        }
    }
    if (isFirstPersonArm){
        if (shazam_timer > 0 && shazam_timer < 1){
            shazam_beam2.render();
        }
    }
}