var hidden_blade;

function init(renderer) {
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE" && !entity.getData('fiskheroes:mask_open_timer')) {
            return "chest";
        }
        if (renderLayer == "CHESTPLATE" && entity.getData('fiskheroes:mask_open_timer')) {
            return "mask";
        }
        return renderLayer == "LEGGINGS" ? "legs" : "boots";
    });
    
    renderer.setItemIcons("%s_0", "%s_1", "%s_2", "%s_3");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
    
    initEffects(renderer);
    initAnimations(renderer);
}

function initEffects(renderer) {
    hidden_blade = renderer.createEffect("fiskheroes:shield");
    hidden_blade.texture.set("hidden_blade");
    hidden_blade.anchor.set("rightArm");
    hidden_blade.setCurve(0.0, 0.0);
}

function initAnimations(renderer) {
    addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });
    addAnimation(renderer, "basic.PROP_FLIGHT", "fiskheroes:flight_lean")
        .setData((entity, data) => data.load(entity.getData("fiskheroes:flight_animation")))
        .priority = -10;

    addAnimationWithData(renderer, "basic.BLOCKING", "fiskheroes:blocking", "fiskheroes:shield_blocking_timer")
        .priority = -5;

    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
        .setCondition(entity => !entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
        .priority = 10;

    addAnimationWithData(renderer, "basic.DUAL_AIMING", "fiskheroes:dual_aiming", "fiskheroes:aiming_timer")
        .setCondition(entity => entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
        .priority = 10;
    
    addAnimationWithData(renderer, "basic.ENERGY_PROJ", "fiskheroes:dual_hand_beam", "fiskheroes:energy_projection_timer");
    addAnimationWithData(renderer, "basic.HEAT_VISION", "fiskheroes:ocular_beam", "fiskheroes:heat_vision_timer");
    addAnimationWithData(renderer, "basic.CHARGED_BEAM", "fiskheroes:ocular_beam", "fiskheroes:beam_shooting_timer");
}

function addAnimation(renderer, key, anim) {
    if (typeof anim === "string") {
        anim = renderer.createResource("ANIMATION", anim);
    }

    renderer.addCustomAnimation(key, anim);
    return anim;
}

function addAnimationWithData(renderer, key, anim, dataVar) {
    return addAnimation(renderer, key, anim).setData((entity, data) => data.load(entity.getInterpolatedData(dataVar)));
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        hidden_blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
        hidden_blade.setOffset(-1.0, 4.0, -0.5);
        hidden_blade.render();
    }
}
