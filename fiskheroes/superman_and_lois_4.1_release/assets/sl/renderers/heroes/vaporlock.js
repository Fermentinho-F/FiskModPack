extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sl:steel/steel_layer1",
    "layer2": "sl:steel/steel_layer2",
    "lights_suit": "sl:steel_lights_suit.tx.json",
    "suit": "sl:steel_suit.tx.json",
    "mask": "sl:steel_helmet.tx.json",
    "mask_lights": "sl:temp_lights.tx.json",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",
    "blade": "sl:vaporlock_blade",
    "blade_lights": "sl:kryptonite_blade_lights",
    "hammer": "sl:hammer",
    "jetpack": "sl:steel_jetpack"
});

var utils = implement("sl:external/utils");
var iron_man_boosters = implement("sl:external/steel_boosters");
var iron_man_helmet = implement("fiskheroes:external/iron_man_helmet");

var helmet;
var booster_boots;
var booster_back;
var blade;

var repulsor;
var metal_heat;

var hammer;
var chest;
var jetpack;

var chest;

function init(renderer) {
    parent.init(renderer);

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1.25).setYOffset(1.10);

    renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" ? "blade_lights" : null);

    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && hasFoldingHelmet() && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "layer2";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return null;
        }
        else if (renderLayer == "BOOTS" && !hasBootLights()) {
            return null;
        }
        return entity.getData('fiskheroes:suit_open_timer') > 0 ? "lights_suit" : renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1";
    });
    renderer.setItemIcons("steel_0", "starlight_1", "steel_2", "steel_3");
}

function initEffects(renderer) {

    newleftArm = renderer.createEffect("fiskheroes:model");
    newleftArm.setModel(utils.createModel(renderer, "sl:leftAlexArm", "layer1", null));
    newleftArm.anchor.set("leftArm");
    newleftArm.setOffset(0, -2.5, 0);

    renderer.createResource("MODEL", "sl:newhammer").bindAnimation("sl:hammercall").setData((entity, data) => data.load(entity.getInterpolatedData("sl:dyn/hammer_timer")));
    var newhammer = renderer.createResource("MODEL", "sl:newhammer");
    newhammer.texture.set("hammer", null);
    newhammer.bindAnimation("sl:hammercall").setData((entity, data) => {
		data.load(entity.getInterpolatedData("sl:dyn/hammer_timer"));
	});
    newhammer.bindAnimation("sl:hammer_throw_spin").setData((entity, data) => {
		data.load(entity.loop(4));
	});
    newhammer.bindAnimation("sl:hammer_throw").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:heat_vision_length"));
	});
    hammerrender = renderer.createEffect("fiskheroes:model").setModel(newhammer);
    hammerrender.anchor.set("rightArm");
    hammerrender.setOffset(501.0, -2.5, 512.0);


    renderer.createResource("MODEL", "sl:newhammer").bindAnimation("sl:hammercall").setData((entity, data) => data.load(entity.getInterpolatedData("sl:dyn/hammer_timer")));
    var newhammer1 = renderer.createResource("MODEL", "sl:newhammer");
    newhammer1.texture.set("hammer", null);
    newhammer1.bindAnimation("sl:hammercall").setData((entity, data) => {
		data.load(entity.getInterpolatedData("sl:dyn/hammer_timer"));
	});

    hammerrender1 = renderer.createEffect("fiskheroes:model").setModel(newhammer1);
    hammerrender1.anchor.set("rightArm");
    hammerrender1.setOffset(501.0, -2.5, 512.0);


    renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => !entity.getData("fiskheroes:mask_open")).firstPersonOnly = true;


    // energy manipulation
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "sl:kinetic_energy", "rightArm", 0xD3D3D3, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    jetpack = renderer.createEffect("fiskheroes:model");
    jetpack.setModel(utils.createModel(renderer, "fiskheroes:falcon_jetpack", "jetpack"));
    jetpack.anchor.set("body");
    jetpack.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:sonic_beam", "rightArm", 0xD3D3D3, [
        { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -1.0, -4.0], "size": [30.0, 25.0] }
    ]).setCondition(entity => entity.getData("sl:dyn/hammer_timer") === 0);

utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:null", "rightArm", 0xD3D3D3, [
    { "firstPerson": [0.0, 1.0, 0.5], "offset": [0.0, -1.0, -4.0], "size": [30.0, 25.0] }
]).setCondition(entity => entity.getData("sl:dyn/hammer") || (!entity.getData("sl:dyn/hammer") && entity.getData("sl:dyn/hammer_timer") > 0));

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", null);
    blade.anchor.set("rightArm");

    repulsor = renderer.createEffect("fiskheroes:overlay");

    if (hasFoldingHelmet()) {
        helmet = iron_man_helmet.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");
    }
    else {
        helmet = iron_man_helmet.createFaceplate(renderer, "mask", null);
    }

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect);

    utils.addCameraShake(renderer, 0.018, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "sl:solar_blast", "rightArm", 0xFF0000, [
        { "firstPerson": [-4.5, 2.75, -7.0], "offset": [-0.5, 2.0, -3.0], "size": [3.5, 3.5] }
    ]);

    energy = utils.createLines(renderer, ("BEAM_RENDERER", "sl:shock_beam"), 0xFF0000, [
        {"start": [0.0, 0.5, 0.0], "end": [0.0, 1.0, 0.0], "size": [2.0, 0.75]},
    ]);
    energy.setOffset(1.0, 1.5, -2.0)
    energy.setScale(5.0, 5.0, 5.0)
    energy.anchor.set("rightArm");

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.25).setYOffset(1.10);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "steel_aiming", "sl:better_aiming", "fiskheroes:aiming_timer");
    addAnimation(renderer, "arm_destroyer", "sl:sendarmsintoblivion").setData((entity, data) => data.load(0));
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    utils.addFlightAnimationWithLanding(renderer, "steel.FLIGHT", "sl:steel.anim.json");
    utils.addHoverAnimation(renderer, "steel.HOVER", "fiskheroes:flight/idle/iron_man");
    addAnimationWithData(renderer, "steel.LAND", "sl:soft_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "steel.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
    addAnimationWithData(renderer, "steel.PROPULSION", "fiskheroes:aiming", "fiskheroes:beam_charge")
        .setCondition(entity => entity.getData("sl:dyn/hammer_profile"))
        .priority = 10;

    addAnimationWithData(renderer, "antimonitor.ANTIBLAST2", "fiskheroes:aiming", "fiskheroes:beam_charge")
        .setCondition(entity => !entity.getData("sl:dyn/hammer_profile"));

    addAnimationWithData(renderer, "steel.ARMPROPULSION", "sl:arm_propulsion", "fiskheroes:beam_shooting_timer")
        .setCondition(entity => !entity.getData("sl:dyn/hammer_profile"));

    addAnimationWithData(renderer, "steel.mixed_ENERGY_CHARGING", "sl:hand_charge", "sl:dyn/steelchargedata")
        .setCondition(entity => entity.getData("fiskheroes:energy_charge") > 0);
}

function hasFoldingHelmet() {
    return true;
}

function hasBootLights() {
    return false;
}

function render(entity, renderLayer, isFirstPersonArm) {
  if (renderLayer == "CHESTPLATE") {
    if (entity.getData("sl:dyn/hammer") && !entity.getData("fiskheroes:beam_shooting")) {
      hammerrender1.opacity = entity.getInterpolatedData("sl:dyn/hammer") * 2.5;
      hammerrender1.render();
    }
    if (entity.getData("fiskheroes:beam_shooting") && entity.getData("sl:dyn/hammer")) {
      hammerrender.opacity = entity.getInterpolatedData("sl:dyn/hammer");
      hammerrender.render();
    }
    blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
    var f = Math.min(blade.unfold * 5, 1);
    blade.setOffset(2.9 + 0.35 * f, 6.0 + 2.5 * f, 0.0);
    blade.render();
    if (renderLayer == "CHESTPLATE" && !entity.getData("fiskheroes:suit_open")) {
      jetpack.render();
    }
  }

  boosters.render(entity, renderLayer, isFirstPersonArm, false);

  if (!isFirstPersonArm) {
      chest.render();
    if (renderLayer == "HELMET") {
      if (hasFoldingHelmet()) {
        helmet.render(entity);
      } else {
        helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
      }
    } else if (renderLayer == "BOOTS") {
      repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
      repulsor.texture.set(null, "repulsor_boots");
      repulsor.render();
    }
  }

  metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
  metal_heat.render();
}