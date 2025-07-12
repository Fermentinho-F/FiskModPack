extend("fiskheroes:hero_basic");
loadTextures({
    "base": "shadows:custom/tornado/base",
    "layer1": "shadows:custom/tornado/layer1",
    "layer2": "shadows:custom/tornado/layer2",
    "tornado": "shadows:custom/tornado/tornado",
    "tornado_shield": "shadows:custom/tornado/tornado_shield"
});

var utils = implement("fiskheroes:external/utils");

var flight;
var shield;
var attack;
var tornado;

function init(renderer) {
    parent.init(renderer);
    // Had to do this texture set because of issue with opacity and leggings.
    renderer.setTexture((entity, renderLayer) => entity.isWearingFullSuit() ? "base" : renderLayer == "LEGGINGS" ? "layer2" : "layer1");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.setItemIcons("custom/tornado/%s_0", "custom/tornado/%s_1", "custom/tornado/%s_2", "custom/tornado/%s_3");
}

function initEffects(renderer) {
    var bind = (model) => {
        model.bindAnimation("shadows:tornado/model").setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("shadows:dyn/1float_interp_reset"));
            data.load(1, entity.getInterpolatedData("shadows:dyn/2float_interp_reset"));
            data.load(2, entity.getInterpolatedData("shadows:dyn/3float_interp_reset"));
        })
    };

    utils.bindParticles(renderer, "shadows:tornado/flight").setCondition(entity => entity.getData("fiskheroes:flying"));
    var model = utils.createModel(renderer, "shadows:tornado/tornado", "tornado");
    bind(model);
    flight = renderer.createEffect("fiskheroes:model");
    flight.setModel(model);
    flight.setScale(1.2);
    flight.setOffset(0, 10, 0);
    flight.anchor.set("body");

    utils.bindParticles(renderer, "shadows:tornado/shield").setCondition(entity => entity.getData("fiskheroes:shield_blocking"));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "shadows:invisible", "head", 0xFFFFFF, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0]
            }
        ]);
    var model_shield = utils.createModel(renderer, "shadows:tornado/tornado", "tornado_shield");
    bind(model_shield);
    shield = renderer.createEffect("fiskheroes:model");
    shield.setModel(model_shield);
    shield.setOffset(0, -20, 0);
    shield.setScale(2.5);
    shield.anchor.set("body");

    utils.bindParticles(renderer, "shadows:tornado/attack").setCondition(entity => entity.getData("fiskheroes:beam_shooting_timer") > 0);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "shadows:invisible", "head", 0xFFFFFF, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shadows:tornado/impact"));
    attack = renderer.createEffect("fiskheroes:model");
    attack.setOffset(0, 10, 0);
    attack.setRotation(-5,0,0)
    attack.setModel(model);
    attack.anchor.set("rightArm");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "shadows:invisible", "head", 0xFFFFFF, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shadows:tornado/tornado"));
    tornado = renderer.createEffect("fiskheroes:model");
    tornado.setModel(model);
    tornado.setScale(3);
    tornado.anchor.set("head");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    renderer.reprioritizeDefaultAnimation("AIM_BOW", 1);

   addAnimation(renderer, "tornado.FLIGHT", "shadows:tornado/flight.anim.json").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
    data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
   }).priority = -10;
   
   

    addAnimation(renderer, "tornado.DISABLE", "shadows:tornado/disable").setData((entity, data) => {
        data.load(Math.max(Math.min(entity.getInterpolatedData("fiskheroes:flight_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:shield_blocking_timer")));
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_charge"));
    });

    addAnimation(renderer, "tornado.ATTACK", "fiskheroes:aiming").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:beam_charge")));
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (entity.getData("fiskheroes:flight_timer") > 0) {
            flight.opacity = entity.getInterpolatedData("fiskheroes:flight_timer") ;
            flight.render();
        }
        if (entity.getData("fiskheroes:shield_blocking_timer") > 0) {
            shield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
            shield.render();
        }
        if (entity.getData("fiskheroes:beam_shooting_timer") > 0) {
            attack.opacity = Math.min(entity.getInterpolatedData("fiskheroes:beam_shooting_timer"), 0.99);
            var scale = attack.opacity;
            attack.setScale(2 * scale, 10 * (entity.getInterpolatedData("fiskheroes:heat_vision_length") * scale / 15), 2 * scale);
            attack.render();
        }
        if (entity.getData("shadows:dyn/4float_interp_reset") > 0 && entity.getData("shadows:dyn/1boolean_reset")) {
            tornado.opacity = entity.getInterpolatedData("shadows:dyn/4float_interp_reset");
            tornado.anchor.ignoreAnchor(isFirstPersonArm);
            var energy = entity.getInterpolatedData("fiskheroes:energy_projection_timer");

            // Positioning stuff
            var pitch = entity.rotPitch();
            var value = pitchToValue(pitch);
            var oppsiteValue = Math.max(1 - value);
            var posY = -40 * oppsiteValue;
            var offset = (30 * value) - 24 * oppsiteValue;
            var length = Math.max(entity.getInterpolatedData("fiskheroes:heat_vision_length") * 16 - offset, 0) * energy;
            var posZ = ((-80 * (1 - energy) - length) * oppsiteValue) - (-40 + length * value);

            tornado.setOffset(0, posY, posZ);
            tornado.setRotation(-pitch,0,0);
            tornado.render();
        }
    }
}

function pitchToValue(pitch) {
    return pitch <= -90 ? 1.0 : pitch < -9 ? (pitch + 9) / -81.0 : pitch >= -9 && pitch <= 9 ? 0.0 : pitch <= 90 ? (pitch - 9) / 81.0 : 1.0;
}