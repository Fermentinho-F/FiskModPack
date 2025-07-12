extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:sukuna/sukuna_layer1",
    "layer2": "jjkp:sukuna/sukuna_layer2",
    "domain_floor": "jjkp:sukuna/domain_floor",
    "arms": "jjkp:sukuna/sukuna_layer1",
    "slash": "jjkp:sukuna/slash",
    "domain_shrine": "jjkp:sukuna/sukuna_shrine"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");
var flames = implement("fiskheroes:external/flames");

var hand_flames;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {

    var fire = renderer.createResource("ICON", "jjkp:cursed_energy_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);

    var model = renderer.createResource("MODEL", "jjkp:domain_circle_big");
    model.texture.set("domain_floor");
    domainbase = renderer.createEffect("fiskheroes:model").setModel(model);
    domainbase.setOffset(0, 0, 0)
    domainbase.setScale(1.0);
    domainbase.anchor.set("body");

    var model = renderer.createResource("MODEL", "jjkp:sukuna_domain_arms");
    model.texture.set("arms");
    arms = renderer.createEffect("fiskheroes:model").setModel(model);
    arms.setOffset(0, 0, 0)
    arms.setScale(1.0);
    arms.anchor.set("body");

    var model = renderer.createResource("MODEL", "jjkp:sukuna_shrine");
    model.texture.set("domain_shrine");
    domainshrine = renderer.createEffect("fiskheroes:model").setModel(model);
    domainshrine.setOffset(0, -35, 100)
    domainshrine.setScale(3.0);
    domainshrine.anchor.set("body");

    var model = renderer.createResource("MODEL", "jjkp:slash");
    model.texture.set("slash");
    slash = renderer.createEffect("fiskheroes:model").setModel(model);
    slash.setOffset(0, 0, 0)
    slash.setScale(1.0);
    slash.anchor.set("head");

    speedster.init(renderer);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jjkp:cleave", "rightArm", 0xFFFFFF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [0.0, 0.0, 0.0], "size": [1.5, 1.5] }
    ]);//.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x5EA4FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "SUKUNA.noarm", "jjkp:sukuna_domain_arm").setData((entity, data) => data.load(entity.getData("jjkp:dyn/shrine")));

    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "sukuna.UNSLASH", "jjkp:slash", "fiskheroes:beam_charge").setCondition(entity => {
        return entity.getData('fiskheroes:beam_charging') && !entity.getData('fiskheroes:beam_shooting');
      });
    addAnimationWithData(renderer, "sukuna.SLASH", "jjkp:slashing", "fiskheroes:beam_charge").setCondition(entity => {
        return entity.getData('fiskheroes:beam_shooting') || !entity.getData('fiskheroes:beam_charging');
      });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("jjkp:dyn/shrine")) {
        domainbase.render();
        arms.render();
        domainshrine.render();
    }
    if (entity.getData('fiskheroes:beam_shooting')) {
        slash.setOffset(0, 0, (-128 * (entity.getInterpolatedData("fiskheroes:beam_shooting"))));
        slash.setRotation(0, 0, 45 * Math.random());
        slash.render();
    }
    if (renderLayer == "CHESTPLATE") {
        hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
}
