extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:nether_demon/demon_layer1",
    "layer2": "moopack:nether_demon/demon_layer2",
    "rightleg": "moopack:nether_demon/demon_legs",
    "leftleg": "moopack:nether_demon/demon_legs",
    "horns": "moopack:nether_demon/demon_horns",
    "blank": "moopack:nether_demon/blank",
    "eyes": "moopack:nether_demon/demon_eyes"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_shooting")) {
            return "eyes";
        }
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") ? "blank" : "eyes";
    });
}

function initEffects(renderer) {

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:heat_vision", "head", 0xFD821E, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));

    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));

    var model = renderer.createResource("MODEL", "moopack:demon_left_leg");
    model.texture.set("leftleg");
    leftleg = renderer.createEffect("fiskheroes:model").setModel(model);
    leftleg.setOffset(16385.90, -12, -0.10);
    leftleg.setScale(1.0);
    leftleg.anchor.set("leftLeg");

    var model = renderer.createResource("MODEL", "moopack:demon_right_leg");
    model.texture.set("rightleg");
    rightleg = renderer.createEffect("fiskheroes:model").setModel(model);
    rightleg.setOffset(16382.10, -12, -0.10);
    rightleg.setScale(1.0);
    rightleg.anchor.set("rightLeg");

    var model = renderer.createResource("MODEL", "moopack:demon_horns");
    model.texture.set("horns");
    horns = renderer.createEffect("fiskheroes:model").setModel(model);
    horns.setOffset(0, 0, 0);
    horns.setScale(1.0);
    horns.anchor.set("head");

    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:flying"));

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("eyes");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "vision.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "vision.HOVER", "fiskheroes:flight/idle/neutral");
    addAnimation(renderer, "DEMON.nolegs", "moopack:legs").setData((entity, data) => data.load(!entity.getData('fiskheroes:shadowform') ? 1:0));
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "LEGGINGS") {
        leftleg.render();
        rightleg.render();
        }
    if (renderLayer == "HELMET") {
        horns.render();
        }
    if (!isFirstPersonArm && renderLayer == "HELMET" && (entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_shooting"))) {
        overlay.render();
    }
}