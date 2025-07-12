extend("fiskheroes:hero_basic");
loadTextures({
    "base": "jmctheroes:blue_beetle/blue_beetle",
    "suit": "jmctheroes:blue_beetle/blue_beetle_suit.tx.json",
    "mask": "jmctheroes:blue_beetle/blue_beetle_mask.tx.json",
    "reactor": "jmctheroes:blue_beetle/blue_beetle_scarab",
    "mask_lights": "jmctheroes:blue_beetle/blue_beetle_mask_lights",
    "lights": "jmctheroes:blue_beetle/blue_beetle_lights",
    "shield": "jmctheroes:blue_beetle/blue_beetle_shield",
    "blade": "jmctheroes:blue_beetle/blue_beetle_blade",
    "blade_lights": "jmctheroes:blue_beetle/blue_beetle_blade_lights",
    "cannon": "jmctheroes:blue_beetle/blue_beetle_cannon.tx.json",
    "cannon_lights": "jmctheroes:blue_beetle/blue_beetle_cannon_lights",
    "beetle_wings_base": "jmctheroes:blue_beetle/beetle_wings_base.tx.json",
    "beetle_wings_lights": "jmctheroes:blue_beetle/beetle_wings_lights.tx.json",
    "beetle_extension1": "jmctheroes:blue_beetle/blue_beetle_extension1.tx.json",
    "beetle_extension2": "jmctheroes:blue_beetle/blue_beetle_extension2.tx.json",
    "sonic_cannon": "jmctheroes:blue_beetle/blue_beetle_sonic_cannon",
    "sonic_cannon_lights": "jmctheroes:blue_beetle/blue_beetle_sonic_cannon_lights"
});

var utils = implement("fiskheroes:external/utils");

var beetle1;
var beetle2;

var armcannon;
var cannonlights;
var soniccannon;
var soniccannonlights;

var blade;
var shield;
var metal_heat;

var beetlewings

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/beetle_timer");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") && entity.getInterpolatedData("jmctheroes:dyn/beetle_timer") < 1 ? "reactor_lights" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var wings = renderer.createResource("MODEL", "jmctheroes:beetlewings");

    wings.bindAnimation("jmctheroes:wing").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:flight_boost_timer")));
    wings.texture.set("beetle_wings_base", "beetle_wings_lights");
    beetlewings = renderer.createEffect("fiskheroes:model").setModel(wings);
    beetlewings.anchor.set("body");

    armcannon = renderer.createEffect("fiskheroes:model");
    armcannon.setModel(utils.createModel(renderer, "jmctheroes:armcannon", "cannon", null));
    armcannon.anchor.set("rightArm");
    cannonlights = renderer.createEffect("fiskheroes:model");
    cannonlights.setModel(utils.createModel(renderer, "jmctheroes:armcannon", null, "cannon_lights"));
    cannonlights.anchor.set("rightArm");

    soniccannon = renderer.createEffect("fiskheroes:model");
    soniccannon.setModel(utils.createModel(renderer, "jmctheroes:soniccannon", "sonic_cannon", null));
    soniccannon.anchor.set("rightArm");
    soniccannon.setScale(1.25);
    soniccannonlights = renderer.createEffect("fiskheroes:model");
    soniccannonlights.setModel(utils.createModel(renderer, "jmctheroes:soniccannon", null, "sonic_cannon_lights"));
    soniccannonlights.anchor.set("rightArm");
    soniccannonlights.setScale(1.25);

    beetle1 = renderer.createEffect("fiskheroes:shield");
    beetle1.texture.set("beetle_extension1");
    beetle1.anchor.set("body");
    beetle1.setOffset(1.25, -6.0, 7.0).setRotation(2.5, 70.0, 0.0).setCurve(65.0, 0.0);
    beetle2 = renderer.createEffect("fiskheroes:shield");
    beetle2.texture.set("beetle_extension2");
    beetle2.anchor.set("body");
    beetle2.setOffset(-1.25, -6.0, 7.0).setRotation(2.5, 110.0, 0.0).setCurve(65.0, 0.0);

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", "blade_lights");
    blade.anchor.set("rightArm");
    blade.setRotation(-15, 0.0, 0)
    blade.large = true;

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield");
    shield.anchor.set("rightArm");
    shield.setRotation(0.0, 0.0, -10.0).setCurve(15.0, 50.0);
    shield.large = true;

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(blade, shield, beetle1, beetle2, armcannon);
    
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "rightArm", getBeamColor(), [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3, 3] }
    ]);
    var beam = renderer.createResource("BEAM_RENDERER", "jmctheroes:heat_vision");
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", beam, "rightArm", getBeamColor(), [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function getBeamColor() {
    return 0x00ACE6;
}

function render(entity, renderLayer, isFirstPersonArm) {

    shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
    shield.setOffset(2.9 + 1.8 * Math.min(shield.unfold * 5, 1), 6.0, 0.0);
    shield.render();

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();

    var display = !entity.isDisplayStand();
    var charge = entity.getData('fiskheroes:beam_charge') > 0.9 ;
    if (renderLayer == "CHESTPLATE" && charge) {
        cannonlights.render();
    }
    var aim = entity.getData('fiskheroes:aiming_timer') > 0.9;
    if (renderLayer == "CHESTPLATE" && aim) {
        soniccannonlights.render();
        soniccannon.render();
    }
    if (renderLayer == "CHESTPLATE") {
        armcannon.render();
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(3.0 - 2.0 * f, 6.0 + 5.0 * f, 0.0);
        blade.render();
        beetle1.unfold = entity.isAlive() || entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
        beetle1.render();
        beetle2.unfold = entity.isAlive() || entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
        beetle2.render();
    }
    if (renderLayer == "CHESTPLATE" && display) {
        beetlewings.render();
    }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "beetle.ARM_BEAM", "fiskheroes:aiming", "fiskheroes:beam_charge");
    utils.addFlightAnimation(renderer, "beetle.FLIGHT", "jmctheroes:flight/beetle.anim.json");
    utils.addHoverAnimation(renderer, "beetle.HOVER", "fiskheroes:flight/idle/neutral");
}