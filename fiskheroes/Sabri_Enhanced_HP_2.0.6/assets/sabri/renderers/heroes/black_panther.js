extend("fiskheroes:hero_basic");
loadTextures({
    "necklace": "sabri:black_panther_necklace",
    "claws": "sabri:black_panther_claws",
    "base": "sabri:black_panther_suit",
    "suit": "sabri:black_panther_suit.tx.json",
    "kinetic": "sabri:black_panther_kinetic.tx.json",
    "kinetic_lights": "sabri:black_panther_kinetic_lights.tx.json",
    "mask": "sabri:black_panther_mask.tx.json",
    "kinetic_mask": "sabri:black_panther_kinetic_mask_lights.tx.json",
    "kinetic_mask_lights": "sabri:black_panther_kinetic_mask.tx.json",
    "kinetic_charge": "sabri:black_panther_kinetic_charge",
    "kinetic_charge_lights": "sabri:black_panther_kinetic_charge_lights",
    "kinetic_charge_mask": "sabri:black_panther_kinetic_charge_mask",
    "kinetic_charge_mask_lights": "sabri:black_panther_kinetic_charge_mask_lights"
});

var utils = implement("fiskheroes:external/utils");

var claws;
var kinetic_charge;
var kinetic_charge_mask;

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("sabri:dyn/vibranium_nanite_timer");
            return timer > 1 / 45 * 10 ? timer < 1 ? "suit" : "base" : "necklace";
        }
        return "base";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer, entity) {
    claws = renderer.createEffect("fiskheroes:overlay");
    claws.texture.set("claws");

    kinetic_charge = renderer.createEffect("fiskheroes:overlay");
    kinetic_charge.texture.set("kinetic_charge", "kinetic_charge_lights");

    kinetic_charge_mask = renderer.createEffect("fiskheroes:overlay");
    kinetic_charge_mask.texture.set("kinetic_charge_mask", "kinetic_charge_mask_lights");

    transformation = renderer.createEffect("fiskheroes:overlay");
    transformation.texture.set("kinetic", "kinetic_lights");

    mask = renderer.createEffect("fiskheroes:overlay");
    mask.texture.set("kinetic_mask", "kinetic_mask_lights");

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x6B06BB);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0)
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getData("sabri:dyn/kinetic_energy_pulse") ? 1.5 * entity.getInterpolatedData("sabri:dyn/kinetic_energy_timer") : 0;
        forcefield.setScale(entity.getData("sabri:dyn/kinetic_energy_pulse") ? 5 * entity.getInterpolatedData("sabri:dyn/kinetic_energy_effect") : null);
        return true;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");

    addAnimationWithData(renderer, "black_widow.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimation(renderer, "black_panther.PUNCH", "sabri:dual_punch")
        .setData((entity, data) => {
            data.load(entity.isPunching() ? entity.getInterpolatedData("fiskheroes:blade_timer") : 0);
	})
	.priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
    var timer = entity.getData("sabri:dyn/vibranium_nanite_timer");
    var type = entity.as("DISPLAY").getDisplayType();
    if (!entity.is("DISPLAY") ? true : (type == "DISPLAY_STAND" || type == "ITERATOR_PREVIEW")) {
        if (renderLayer == "CHESTPLATE") {
            if (timer > 0 && timer < 1) {
                transformation.render();
            }
            if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
                mask.render();
            }
            if (timer == 1) {
                kinetic_charge.opacity = entity.getInterpolatedData("sabri:dyn/kinetic_energy_timer");
                kinetic_charge.render();
    
                kinetic_charge_mask.opacity = entity.getInterpolatedData("sabri:dyn/kinetic_energy_timer") - entity.getInterpolatedData("fiskheroes:mask_open_timer2");
                kinetic_charge_mask.render();
            }
            if (entity.getData("fiskheroes:blade")) {
                claws.render();
            }
        }
    }
    else {
        kinetic_charge.opacity = kinetic_charge_mask.opacity = Math.sin(Math.PI * Math.max(8 * entity.loop(200) - 7, 0));
        kinetic_charge.render();
        kinetic_charge_mask.render();
    }
}