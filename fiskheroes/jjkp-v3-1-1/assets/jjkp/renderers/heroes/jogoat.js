extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:jogoat/jogoat_layer1",
    "layer2": "jjkp:jogoat/jogoat_layer2",
    "volcano": "jjkp:jogo/jogo_volcano",
    "jogodomain": "jjkp:jogoat/infinite_volcano",
    "eye": "jjkp:jogoat/jogoat_eye",
    "gloweye": "jjkp:jogoat/jogoat_eye",
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");
var flames = implement("fiskheroes:external/flames");

var hand_flames;
var red_flames;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var fire = renderer.createResource("ICON", "jjkp:curse_energy_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);
    head_flames = flames.createHead(renderer, fire);

    var fire = renderer.createResource("ICON", "jjkp:black_flash_layer_%s");
    red_flames = flames.createHands(renderer, fire, true);

    var shadow_dome = renderer.bindProperty("fiskheroes:shadowdome");
	shadow_dome.texture.set("jogodomain", "jogodomain");
	//shadow_dome.setShape(36, 36)

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xA53BFF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:energy_projection");
    utils.bindBeam(renderer, "fiskheroes:energy_projection", beam, "body", 0xBBA1D5, [
        { "firstPerson": [0.2, 4, -4.0], "offset": [0.2, 2, -4.0], "size": [3, 3] },
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    var night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.firstPersonOnly = false;
    night_vision.setCondition(entity => {
        night_vision.factor = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        return true;
    });

    utils.bindParticles(renderer, "jjkp:limitless_particles").setCondition(entity => entity.getData("jjkp:dyn/limitless"));

    var model = renderer.createResource("MODEL", "jjkp:jogo_volcano");
    model.texture.set("volcano");
    volcano = renderer.createEffect("fiskheroes:model").setModel(model);
    volcano.setOffset(0, 0, 0)
    volcano.setScale(1.0);
    volcano.anchor.set("head");

    var model = renderer.createResource("MODEL", "jjkp:jogoat_eye_low");
    model.texture.set("eye");
    eye = renderer.createEffect("fiskheroes:model").setModel(model);
    eye.setOffset(0, 0, 0)
    eye.setScale(1.0);
    eye.anchor.set("head");

    var model = renderer.createResource("MODEL", "jjkp:jogoat_eye_low");
    model.texture.set(null, "gloweye");
    gloweye = renderer.createEffect("fiskheroes:model").setModel(model);
    gloweye.setOffset(0, 0, 0)
    gloweye.setScale(1.0);
    gloweye.anchor.set("head");

    speedster.init(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "mmcw.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
    if (renderLayer == "CHESTPLATE") {
        red_flames.render(entity.getInterpolatedData('jjkp:dyn/flash'));
    }
    if (renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open")) {
        volcano.render();
        gloweye.render();
    }
    if (renderLayer == "HELMET" && !entity.getData("fiskheroes:mask_open")) {
        volcano.render();
        eye.render();
    }
}
