extend("fiskheroes:hero_basic");
loadTextures({
    "base": "shadows:nothing",
    "layer1": "shadows:golem/layer1",
    "layer2": "shadows:golem/layer2",
    "cape": "shadows:golem/cape",
    "golem": "shadows:golem/base",
    "golem_lights": "shadows:golem/base_lights"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var golem;
var golem_hand;
var cape;
var scale = 129.25 / 32;

function isGolem(entity, player) {
    var player = player == undefined ? false : player;
    if (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM" || entity.getData("shadows:dyn/4float_interp_reset") > 0.8 && !entity.getData("shadows:dyn/2boolean_reset")) {
        return true;
    }
    if (player && entity.getData("shadows:dyn/4float_interp_reset") < 0.35) {
        return false;
    }
    if (entity.getData("fiskheroes:scale") >= scale) {
        return true;
    }
    return entity.getData("shadows:dyn/2boolean_reset");
   
}
function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => isGolem(entity, true) ? "base" : renderLayer == "LEGGINGS" ? "layer2" : "layer1");
    renderer.setItemIcons("golem/%s_0", "golem/%s_1", "golem/%s_2", "golem/%s_3");
    renderer.fixHatLayer("CHESTPLATE");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}
function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => isGolem(entity, true) ? 0.999999 : 1);

    var model = utils.createModel(renderer, "shadows:golem/golem", "golem", "golem_lights");
    model.bindAnimation("shadows:golem/base.anim.json").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge"));
        data.load(1, entity.getData("fiskheroes:beam_charging"));
        data.load(2, entity.getInterpolatedData("shadows:dyn/1float_interp_reset"));
        data.load(3, entity.getInterpolatedData("shadows:dyn/2float_interp_reset") * entity.getData("shadows:dyn/1boolean_reset"));
        data.load(4, entity.getInterpolatedData("shadows:dyn/3float_interp_reset"));
        data.load(5, Math.max(entity.getInterpolatedData("shadows:dyn/4float_interp_reset") * entity.getData("shadows:dyn/2boolean_reset"), entity.as("DISPLAY").getDisplayType() == "HOLOGRAM", entity.getData("shadows:dyn/4float_interp_reset") > 0.8 && !entity.getData("shadows:dyn/2boolean_reset")));
        data.load(6, !entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") < 0.5);
    })
    golem = renderer.createEffect("fiskheroes:model");
    golem.setModel(model);
    golem.anchor.set("body");

    golem_hand = renderer.createEffect("fiskheroes:model");
    golem_hand.setModel(utils.createModel(renderer, "shadows:golem/golem_hand", "golem", "golem_lights"));
    golem_hand.anchor.set("rightArm");
    //Ground Shatter
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = (0.1 * entity.getData("fiskheroes:beam_charging")) + (0.2 * entity.getData("fiskheroes:beam_shooting") > 0) + (0.1 * entity.getData("shadows:dyn/2boolean_reset") && entity.getData("shadows:dyn/4float_interp_reset") < 0.5);
        return true;
    });
    utils.bindParticles(renderer, "shadows:golem/detransformation").setCondition(entity => entity.getData("shadows:dyn/4float_interp_reset") > 0.8 && !entity.getData("shadows:dyn/2boolean_reset"));
    utils.bindParticles(renderer, "shadows:golem/ground_shatter").setCondition(entity => entity.getData("fiskheroes:beam_shooting_timer") == 1);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "shadows:invisible", "head", 0x8B0000, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0, 0]
            }

        ]);
    //punch
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "shadows:invisible", "head", 0x000000, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0, 0]
            }

        ]);

    //cape
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.HEAT_VISION");

    addAnimation(renderer, "golem.PLAYER", "shadows:golem/player").setData((entity, data) => {
        data.load(0, isGolem(entity, true));
        data.load(1, entity.getInterpolatedData("shadows:dyn/2float_interp_reset") * entity.getData("shadows:dyn/1boolean_reset"));
    });
    addAnimation(renderer, "golem.TRANSFORM", "shadows:golem/transform_player").setData((entity, data) => data.load(5, entity.getInterpolatedData("shadows:dyn/4float_interp_reset") * entity.getData("shadows:dyn/2boolean_reset")));
}

function render(entity, renderLayer, isFirstPersonArm) {
    var transformed = entity.getData("fiskheroes:scale") == scale;
    if (renderLayer == "CHESTPLATE") {
        if (isGolem(entity)) {
            golem.setScale(1 / scale);
            golem.setOffset(0, 18, 0);
            if (!transformed) {
                golem.setScale(1);
                golem.setOffset(0, 0, 0);
            }
            golem.render();
            if (isFirstPersonArm && transformed) {
                golem_hand.setOffset(-4, -2, 0);
                golem_hand.setRotation(-25, 0, 0)
                golem_hand.setScale(0.3);
                golem_hand.render();
            }
    
        }

        if (!isGolem(entity, true)) {
            cape.render(entity);
        }
    }

}
