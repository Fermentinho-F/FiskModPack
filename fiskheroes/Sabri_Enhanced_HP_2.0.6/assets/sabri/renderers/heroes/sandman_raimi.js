extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:sandman_raimi_layer1",
    "layer2": "sabri:sandman_raimi_layer2",
    "sand": "sabri:sandman_raimi_sand",
    "mud": "sabri:sandman_raimi_mud",
    "fist": "sabri:sandman_raimi_fist",
    "hammer": "sabri:sandman_raimi_hammer",
    "mace": "sabri:sandman_raimi_mace",
    "castle": "sabri:sandman_raimi_castle",
    "null": "sabri:empty"
});

var utils = implement("fiskheroes:external/utils");

var sand;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return entity.getData("fiskheroes:shield_blocking") ? "null" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    utils.bindParticles(renderer, "sabri:sandman_raimi");
    //utils.bindParticles(renderer, "sabri:sandman_raimi_castle");
    
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 1 - Math.max(entity.getInterpolatedData("fiskheroes:shadowform_timer"), entity.getData("fiskheroes:shield_blocking") * 0.00001);
    });

    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "sabri:mud_puddle").setCondition(entity => entity.getInterpolatedData("sabri:dyn/drought_timer") == 1);

    sand = renderer.createEffect("fiskheroes:overlay");
    sand.texture.set("sand");

    mud = renderer.createEffect("fiskheroes:overlay");
    mud.texture.set("mud");

    var model = renderer.createResource("MODEL", "sabri:sandman_castle");
    model.bindAnimation("sabri:sandman_raimi_castle")
        .setData((entity, data) => {
            data.load(entity.getInterpolatedData("sabri:dyn/sand_castle_timer"));
        });
    model.texture.set("castle");
    castle = renderer.createEffect("fiskheroes:model").setModel(model);
    castle.anchor.set("body");

    utils.addCameraShake(renderer, 0.015, 0.75, "sabri:dyn/sand_castle_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var sand_castle = entity.getInterpolatedData("sabri:dyn/sand_castle_timer");
        shake.factor = sand_castle > 0 ? 1 - sand_castle : 0;
        return true;
    });
    shake.intensity = 0.0;

    fist = renderer.createEffect("fiskheroes:overlay");
    fist.texture.set("fist");

    hammer = renderer.createEffect("fiskheroes:model");
    hammer.setModel(utils.createModel(renderer, "sabri:sandman_raimi_hammer", "hammer"));
    hammer.anchor.set("rightArm");

    mace = renderer.createEffect("fiskheroes:model");
    mace.setModel(utils.createModel(renderer, "sabri:sandman_raimi_mace", "mace"));
    mace.anchor.set("rightArm");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimationWithData(renderer, "sandman.MACE_POSE", "fiskheroes:sword_pose", "sabri:dyn/mace_timer");

    addAnimationWithData(renderer, "sandman.CASTLE", "sabri:sandman_raimi_castle_player", "sabri:dyn/sand_castle_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    var shield = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
    var sand_castle = entity.getInterpolatedData("sabri:dyn/sand_castle_timer");

    if (renderLayer == "CHESTPLATE" || renderLayer == "LEGGINGS" || renderLayer == "BOOTS") {
        sand.opacity = Math.max(entity.getInterpolatedData("fiskheroes:dyn/giant_mode_timer"), entity.getInterpolatedData("sabri:dyn/sand_timer") - 0.25 * entity.getInterpolatedData("sabri:dyn/sand_cooldown"), Math.min(entity.getInterpolatedData("sabri:dyn/sand_castle_timer") * 6, 1)) - entity.getData("fiskheroes:shield_blocking");
        sand.render();

        mud.opacity = entity.getInterpolatedData("sabri:dyn/drought_timer");
        mud.render();
    }

    if (sand_castle > 0) {
        castle.render();
    }

    if (entity.getData("fiskheroes:blade_timer") > 0) {
        fist.opacity = entity.getInterpolatedData("fiskheroes:blade_timer");
        fist.render();

        if (entity.getData("sabri:dyn/hammer_timer") > 0) {
            hammer.setScale(entity.getInterpolatedData("sabri:dyn/hammer_timer"));
            hammer.setOffset(1, 7 - 18 * entity.getInterpolatedData("sabri:dyn/hammer_timer"), 0)
            hammer.render();
        }
        if (entity.getData("sabri:dyn/mace_timer") > 0) {
            mace.setScale(entity.getInterpolatedData("sabri:dyn/mace_timer"));
            mace.setOffset(1, 7 - 18 * entity.getInterpolatedData("sabri:dyn/mace_timer"), 0)
            mace.render();
        }
    }
}