extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:mahoraga/mahoraga_layer1",
    "layer2": "jjkp:mahoraga/mahoraga_layer2",
    "blade": "jjkp:mahoraga/mahoraga_blade",
    "wheel": "jjkp:mahoraga/mahoraga_wheel",
    "wings": "jjkp:mahoraga/mahoraga_wings",
    "headtail": "jjkp:mahoraga/mahoraga_head_tail"
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("fiskheroes:external/flames");

var hand_flames;
var red_flames;

var blade;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var fire = renderer.createResource("ICON", "jjkp:mahoraga_energy_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x000000, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");

    var model = renderer.createResource("MODEL", "jjkp:mahoraga_wheel");
    model.texture.set("wheel", "wheel");
    wheel = renderer.createEffect("fiskheroes:model").setModel(model);
    wheel.setOffset(0, 0, 0)
    wheel.setScale(1.0);
    wheel.anchor.set("head");
    //wheel.setRotation(0, 45 * entity.getData("jjkp:dyn/wheel"), 0);

    var model = renderer.createResource("MODEL", "jjkp:mahoraga_wings_1");
    model.texture.set("wings");
    wings = renderer.createEffect("fiskheroes:model").setModel(model);
    wings.setOffset(0, 0, 0)
    wings.setScale(1.0);
    wings.anchor.set("head");

    var model = renderer.createResource("MODEL", "jjkp:mahoraga_wings_2");
    model.texture.set("wings");
    wings2 = renderer.createEffect("fiskheroes:model").setModel(model);
    wings2.setOffset(0, -2, 0)
    wings2.setScale(1.0);
    wings2.anchor.set("head");

    var model = renderer.createResource("MODEL", "jjkp:mahoraga_head_tail");
    model.texture.set("headtail");
    headtail = renderer.createEffect("fiskheroes:model").setModel(model);
    headtail.setOffset(0, 0, 0)
    headtail.setScale(1.0);
    headtail.anchor.set("head");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
    if (renderLayer == "HELMET") {
        wings.render();
        wings2.render();
        headtail.render();
    }
    wheel.setRotation(0, 45*entity.getData("jjkp:dyn/wheel") -45*entity.getData("jjkp:dyn/wheel_minus"),0);
    wheel.render();
    if (renderLayer == "CHESTPLATE") {
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.35 * f, 6.0 + 2.5 * f, 0.0);
        blade.render();
    }
}
//entity.getData("fiskheroes:time_since_damaged") < 1