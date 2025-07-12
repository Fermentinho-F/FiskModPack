extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:nothing",
    "layer2": "shadows:nothing",
    "bite": "shadows:vampire/bite",
    "half_mask": "shadows:vampire/half_oni_mask.tx.json",
    "half_mask_rgb": "shadows:vampire/half_oni_mask_rgb.tx.json",
    "half_mask_rgb_dyed": "shadows:vampire/half_oni_mask_rgb_dyed.tx.json",
    "teeth": "shadows:vampire/half_oni_mask_teeth",
    "bat": "shadows:vampire/bat",
    "wolf": "shadows:vampire/wolf"
});
var utils = implement("fiskheroes:external/utils");
var bat;
var wolf;
var mask;
var maskModel;
var bite;

var bat_slam = [];

function prev_transform(entity, type) {
    return entity.getData("fiskheroes:scale") != 1 && entity.getData("shadows:dyn/1string_reset") == type;
}
function createBat(renderer, player, anchor) {
    player = player == undefined ? false : player;
    anchor = player == undefined ? "head" : anchor;
    var model = utils.createModel(renderer, "shadows:vampire/bat", "bat");
    model.bindAnimation("shadows:vampire/bat/" + (player ? "form_" : "") + "flying").setData((entity, data) => {
        data.load(entity.loop(4) * 2);
        data.load(1, entity.loop(8) * 2);
    });
    var output = renderer.createEffect("fiskheroes:model");
    output.setModel(model);
    output.anchor.set(player ? "body" : anchor);
    output.setScale(player ? 1.2 - 0.35 : 0.35);
    return output;
}
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("HELMET", "%s");
    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "shadows:invisible", "head", 0x8B0000, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0, 0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shadows:vampire/bite"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "shadows:invisible", "head", 0x000000, [{
                "firstPerson": [0, 0, 0],
                "offset": [0, 0, 0],
                "size": [0, 0, 0]
            }
        ]);
    bat = createBat(renderer, true);
    for (var amount = 3; amount > 0; amount--) {
        bat_slam.push(createBat(renderer, false, "head"));
    }

    var wolfModel = utils.createModel(renderer, "shadows:vampire/wolf", "wolf");
    wolfModel.bindAnimation("shadows:vampire/wolf/form_walking").setData((entity, data) => data.load(1));
    wolf = renderer.createEffect("fiskheroes:model");
    wolf.setModel(wolfModel);
    wolf.anchor.set("body");
    wolf.setScale(1.73);

    maskModel = utils.createModel(renderer, "shadows:vampire/halfOniMask", "half_mask");
    maskModel.bindAnimation("shadows:vampire/mask_open").setData((entity, data) => {
        var timer = entity.getInterpolatedData("shadows:dyn/1float_interp_reset")
            data.load(Math.max(Math.max(0, entity.getInterpolatedData("fiskheroes:mask_open_timer2") / 2), entity.getData("shadows:dyn/3boolean_reset") ? Math.min(timer * 2, 1) : Math.max(timer * 3 - 2, 0)));
    });
    mask = renderer.createEffect("fiskheroes:model");
    mask.setModel(maskModel);
    mask.anchor.set("head");

    var biteModel = utils.createModel(renderer, "shadows:vampire/bite", "bite");
    biteModel.bindAnimation("shadows:vampire/bite").setData((entity, data) => {
        data.load(entity.getData("shadows:dyn/3boolean_reset") ? Math.min(Math.max(entity.getInterpolatedData("shadows:dyn/1float_interp_reset") - 0.9, 0) * 10.1, 1) : 1);
    });
    bite = renderer.createEffect("fiskheroes:model");
    bite.setModel(biteModel);
    bite.anchor.set("head");


    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return entity.getData("shadows:dyn/1boolean_reset") || entity.getData("shadows:dyn/2boolean_reset") || prev_transform(entity, "bat") || prev_transform(entity, "wolf") ? 0.99999 : 1;
    });

    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = 0.4 * (entity.getInterpolatedData("fiskheroes:beam_charging") ? entity.getInterpolatedData("fiskheroes:beam_charge") : entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
        return true;
    });

    utils.bindParticles(renderer, "shadows:vampire/shadows").setCondition(entity => entity.getData("shadows:dyn/4boolean_reset"));

    utils.bindParticles(renderer, "shadows:vampire/levitate").setCondition(entity => entity.getData("fiskheroes:hovering"));

    var night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 1;

    var shadows = renderer.bindProperty("fiskheroes:trail");
    shadows.setTrail(renderer.createResource("TRAIL", "shadows:shadows"));
    shadows.setCondition(entity => entity.getData("shadows:dyn/4boolean_reset") && Math.floor(Math.random() * 4) == 0);

    var shadows_red = renderer.bindProperty("fiskheroes:trail");
    shadows_red.setTrail(renderer.createResource("TRAIL", "shadows:shadows_red"));
    shadows_red.setCondition(entity => entity.getData("shadows:dyn/4boolean_reset") && Math.floor(Math.random() * 2) == 0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "BAT.FLYING.PLAYER", "shadows:vampire/bat/flying_player").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:flight_boost_timer")));

    addAnimation(renderer, "NOTHING", "shadows:vampire/transformed").setData((entity, data) => data.load(1))
    .setCondition(entity => entity.getData("shadows:dyn/1boolean_reset") || entity.getData("shadows:dyn/2boolean_reset") || prev_transform(entity, "bat") || prev_transform(entity, "wolf")).priority = 1;


    addAnimation(renderer, "VAMPIRE.BITE", "shadows:vampire/bite")
    .setData((entity, data) => data.load(entity.getData("shadows:dyn/3boolean_reset") && Math.min(Math.max(1.8 * entity.getInterpolatedData("shadows:dyn/1float_interp_reset") - 0.8, 0), 1) * 2));

    addAnimation(renderer, "BAT.SLAM", "shadows:vampire/bat_slam")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charging") ? entity.getInterpolatedData("fiskheroes:beam_charge") : 0);
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting"));
    });

    addAnimationWithData(renderer, "VAMPIRE.HOLD", "shadows:dual_aiming", "fiskheroes:aiming_timer")
    .setCondition(entity => entity.getHeldItem().isEmpty()).priority = 10;

    addAnimation(renderer, "LEVITATE.main", "fiskheroes:flight/idle/default")
    .setData((entity, data) => data.load(0, entity.getInterpolatedData("shadows:dyn/2float_interp_reset"))).priority = -10;
    addAnimation(renderer, "LEVITATE.header", "fiskheroes:flight/header")
    .setData((entity, data) => data.load(0, entity.getInterpolatedData("shadows:dyn/2float_interp_reset"))).priority = -10;

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("shadows:dyn/1boolean_reset") || prev_transform(entity, "bat"))
        bat.render();
    else if (entity.getData("shadows:dyn/2boolean_reset") || prev_transform(entity, "wolf"))
        wolf.render();
    else {
        maskModel.texture.set("half_mask");
        if (entity.getWornHelmet().nbt().getBoolean("rgb") || entity.getData("fiskheroes:mask_open") && entity.as("DISPLAY").getDisplayType() == "BOOK_PREVIEW") {
            maskModel.texture.set(entity.getWornHelmet().nbt().getByte("color") > 0 ? "half_mask_rgb_dyed" : "half_mask_rgb");
        }
            
        mask.render();
    }

    if (entity.getData("fiskheroes:beam_charge") > 0.5 && entity.getData("fiskheroes:beam_charging")) {
        var shooting = Math.min(Math.max(entity.getInterpolatedData("fiskheroes:beam_shooting") - 0.35, 0) * 1.55, 1);
        var charge = Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") - 0.5, 0) * 2;
        var length = entity.getInterpolatedData("fiskheroes:heat_vision_length");
        var up = 30 * (Math.max(shooting - 0.4, 0) * 1.65);
        var charge = [64, 150, 494].map(i => Math.min(charge * 2, 1) * i);
        var shoot = [24, 30 - up, Math.max((length * 16) - 16, 0)].map(i => shooting * i);
        bat_slam.forEach((bat, index) => {
            var middle = index % 2 == 1 ? 10 : 0;
            bat.setOffset(96 - charge[0] - shoot[0] - (8 * index), -160 + charge[1] + middle + shoot[1], 480 - charge[2] - shoot[2]);
            bat.anchor.ignoreAnchor(isFirstPersonArm);
            bat.render();
        });
    }

    if (entity.getData("shadows:dyn/1float_interp_reset") > 0) {
        bite.opacity = Math.min(Math.max(entity.getInterpolatedData("shadows:dyn/1float_interp_reset") - 0.9, 0) * 10, 1);
        bite.anchor.ignoreAnchor(isFirstPersonArm);
        bite.setRotation(isFirstPersonArm ? 0 : 60, 0, 0);
        var offset = entity.getData("shadows:dyn/3boolean_reset") ? Math.max(bite.opacity - 0.5, 0) * 2  : 1;
        bite.setOffset(0, -14, -20 - (10 * offset));
        bite.render();
    }
}