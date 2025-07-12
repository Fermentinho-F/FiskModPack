extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:custom/hue_man/hue_man_layer1.tx.json",
    "layer2": "shadows:custom/hue_man/hue_man_layer2.tx.json",
    "recharing": "shadows:custom/hue_man/recharging",
    "lights_layer1": "shadows:custom/hue_man/hue_man_lights_layer1.tx.json"
});

var utils = implement("fiskheroes:external/utils");
var glyphs = implement("shadows:external/hue_man_glypth");
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("custom/hue_man/%s_0", "custom/hue_man/%s_1", "custom/hue_man/%s_2", "custom/hue_man/%s_3");
    renderer.setLights((entity, renderLayer) => renderLayer != "LEGGINGS" ? "lights_layer1" : null);
}

function getColor(entity) {
    var hueDegrees = entity.ticksExisted() * 6 % 360;
    var colorRanges = [
        { color: "Red", range: { start: 0, end: 15 } },
        { color: "Orange", range: { start: 16, end: 35 } },
        { color: "Yellow", range: { start: 36, end: 44 } },
        { color: "Green", range: { start: 45, end: 169 } },
        { color: "Aqua", range: { start: 170, end: 211 } },
        { color: "Blue", range: { start: 212, end: 260 } },
        { color: "Purple", range: { start: 261, end: 290 } },
        { color: "Pink", range: { start: 291, end: 345 } }
    ];
    for (var index = 0; index < colorRanges.length; index++) {
        var item = colorRanges[index]
        if (hueDegrees >= item.range.start && hueDegrees <= item.range.end || item.color == "Red" && hueDegrees >= 346) {
            return item.color;
        }
    }
    return null;
}

var translateColor = {
    "Red": 0xFF0000,
    "Orange": 0xFF9D00,
    "Yellow": 0xFFFB00,
    "Green": 0x00FF33,
    "Aqua": 0x00FFEA,
    "Blue": 0x000AFF,
    "Purple": 0x8000FF,
    "Pink": 0xDA00FF
}
var glyph;
var leftArm;
var recharge;

function initEffects(renderer) {
    var energyProjection = color => {
        utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "head", translateColor[color], [{
                    "firstPerson": [0.0, 2.0, -20],
                    "offset": [0.0, 3.0, -20],
                    "size": [1.5, 1.5]
                }
            ]).setCondition(entity => getColor(entity) == color);
    };
    var repulsorBlastRight = color => {
        utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:cold_beam", "rightArm", translateColor[color], [{
                "firstPerson": [-4.5, 3.75, -7.0],
                "offset": [-0.5, 9.0, 0.0],
                "size": [1.5, 1.5]
                }
            ]).setCondition(entity => getColor(entity) == color && entity.ticksExisted() % 10 < 5);
    };
    var repulsorBlastLeft = color => {
        utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:cold_beam", "leftArm", translateColor[color], [{
                "firstPerson": [4.5, 3.75, -7.0],
                "offset": [0.5, 8.0, 0.0],
                "size": [1.5, 1.5]
                }
            ]).setCondition(entity => getColor(entity) == color && entity.ticksExisted() % 10 >= 5);
    };
    var saveLoad = color => {
        utils.bindParticles(renderer, "shadows:hue_man/" + color.toLowerCase()).setCondition(entity => {
            var nbt = entity.getWornChestplate().nbt();
            return (nbt.getBoolean("recall") && nbt.getFloat("recall_float") < 0.2 || !nbt.getBoolean("recall") && nbt.getFloat("recall_float") > 0 || entity.getData("fiskheroes:teleport_timer") > 0) && !entity.getData("shadows:dyn/1boolean_reset") && entity.getData("shadows:dyn/1float_reset") == 0 && getColor(entity) == color;
        });
    };
    
    Object.keys(translateColor).forEach(color => {
        energyProjection(color);
        repulsorBlastRight(color);
        repulsorBlastLeft(color);
        saveLoad(color);
    });
    glyph = glyphs.create(renderer, translateColor["Red"], "shadows:spell", false);
    glyph.setScale(16);

    leftArm = renderer.createEffect("fiskheroes:model");
    leftArm.setModel(utils.createModel(renderer, "shadows:leftArm", "layer1"));
    leftArm.anchor.ignoreAnchor(true);
    leftArm.anchor.set("rightArm");

    recharge = renderer.createEffect("fiskheroes:overlay");
    recharge.texture.set("recharing");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimationWithData(renderer, "random_repulsor.DUAL_AIMING", "fiskheroes:dual_aiming", "fiskheroes:aiming_timer")
    .priority = 10;

    addAnimationWithData(renderer, "shadows.AIMING", "fiskheroes:aiming", "shadows:dyn/1float_interp_reset");
}

function render(entity, renderLayer, isFirstPersonArm) {
    glyph.render(Math.min(entity.getData("fiskheroes:energy_projection_timer") * 2, 1), isFirstPersonArm, eye => {
        var color = getColor(entity);
        eye.color.set(translateColor[color])
        if (color != "Blue") {
            eye.opacity *= 0.2
        }
    });
    var timer = entity.getInterpolatedData("fiskheroes:aiming_timer");
    if (isFirstPersonArm && timer > 0) {
        leftArm.setOffset(-7.9, 2.1, 15 - timer * 14.8);
        leftArm.setRotation(-90, -90, 0);
        leftArm.render();
    }
    if (entity.getData("shadows:dyn/recall_cooldown") > 0) {
        recharge.texture.set("recharing");
        recharge.opacity = entity.getInterpolatedData("shadows:dyn/recall_cooldown");
        recharge.render();
    }
}