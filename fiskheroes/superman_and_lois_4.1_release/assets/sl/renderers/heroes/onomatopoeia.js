extend("fiskheroes:hero_basic");

loadTextures({
    "mask": "sl:peia_mask_empty",
    "coat": "sl:peia_coat",
    "pants": "sl:peia_pants",
    "boots": "sl:peia_boots",
    "mask_texture": "sl:peia_mask_text",
    "null": "sl:null" 
});

var utils = implement("fiskheroes:external/utils");

var chest;
var vibration;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            if (entity.isDisplayStand() || entity.isBookPlayer()) {
                if (entity.getData("fiskheroes:mask_open")) {
                    return "null";
                }
            } else {
                if (entity.getData("fiskheroes:mask_open_timer2") > 0.35) {
                    return "null";
                }
            }
            return "mask";
        } else if (renderLayer == "CHESTPLATE") {
            return "coat";
        } else if (renderLayer == "LEGGINGS") {
            return "pants";
        } else {
            return "boots";
        }
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {

var shaketc = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shaketc.factor = (Math.log(6) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    return true;
});

var shakes = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shakes.factor = (Math.log(1) + 0.5) * 0.5 * entity.getData("fiskheroes:sonic_waves");
    return true;
});

var shakehv = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shakehv.factor = (Math.log(2) + 0.5) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:aimed_timer"));
    return true;
});

    var model = renderer.createResource("MODEL","sl:peia_mask_model");
    model.texture.set("mask_texture");
    model.bindAnimation("sl:peia_mask_anim").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("sl:dyn/peia_anim_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:aimed_timer"));
        data.load(2, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    });

    maskmodel = renderer.createEffect("fiskheroes:model").setModel(model);
    maskmodel.anchor.set("head");
    maskmodel.setOffset(0, -3.0, -0.2);

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.75).setYOffset(1);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xA020F0);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.10;
        return true;
    });

  vibration = renderer.createEffect("fiskheroes:vibration");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        {
            "anchor": "rightLeg",
            "scale": 0.7,
            "offset": [-1.8, 0.75, -0.5],
            "rotation": [110.0, 0.0, 0.0]
        }
    ]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:sonic_beam", "head", 0xD3D3D3, [
        {
            "firstPerson": [0.0, 1.0, 0.5],
            "offset": [0.0, -1.0, -4.0],
            "size": [20.0, 20.0]
        }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "superman.BREATH", "sl:breath_anim", "fiskheroes:aimed_timer").priority = 10;
    addAnimation(renderer, "ono.MASK", "sl:remove_mask")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });
    renderer.removeCustomAnimation("basic.AIMING");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer === "CHESTPLATE" && !isFirstPersonArm) {
        chest.render();
    } else if (renderLayer === "HELMET" && entity.getData("fiskheroes:aiming")) {
        vibration.render();
    }
    if (renderLayer === "HELMET" && !isFirstPersonArm && entity.getData("fiskheroes:mask_open_timer2") <= 0.35) {
        maskmodel.render();
    }
}
