extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:war/mk1/war_machine_mk1_layer1",
    "layer2": "jmctheroes:war/mk1/war_machine_mk1_layer2",
    "lights": "jmctheroes:war/mk1/war_machine_mk1_lights",
    "mask": "jmctheroes:war/mk1/war_machine_mk1_mask.tx.json",
    "backpack": "jmctheroes:war/mk1/war_machine_mk1_backpack",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "blank": "jmctheroes:blank"
});

var utils = implement("fiskheroes:external/utils");
var war_machine_boosters = implement("jmctheroes:external/war_machine_boosters");
var war_gun2 = implement("jmctheroes:external/war_machine_gun_hand");
var iron_man_helmet = implement("fiskheroes:external/iron_man_helmet");

var backpack;
var hand_guns;

var GunBarrel;

var helmet;
var boosters;
var repulsor;
var metal_heat;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && hasFoldingHelmet() && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "layer2";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "blank" : entity.getData('fiskheroes:mask_open_timer2') > 0
        && renderLayer == "HELMET" ? "blank" : "lights");
}

function hasFoldingHelmet() {
    return false;
}

function initEffects(renderer) {
    var fire = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");
    repulsor = renderer.createEffect("fiskheroes:overlay");

    var model = renderer.createResource("MODEL", "jmctheroes:warbackpackmk1");
    model.bindAnimation("jmctheroes:warmachine_mk1").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge"));
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_charge") ? entity.loop(12) : 0);
    }).priority = -1;
    model.texture.set("backpack", null );
    backpack = renderer.createEffect("fiskheroes:model").setModel(model);
    backpack.anchor.set("body");

    mask = iron_man_helmet.createFaceplate(renderer, "mask", null);

    GunBarrel = renderer.createEffect("fiskheroes:booster")
    GunBarrel.setIcon(fire).setOffset(0.0, 0.0, 0.0).setRotation(0, 0, 0).setSize(1.6, 6.0);
    GunBarrel.anchor.set("body", model.getCubeOffset("Gun1RotZ"));

    utils.addCameraShake(renderer, 0.025, 1.75, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:invisible", "body", 0xFF1F00, [{"offset": [0.0, 3.0],"size": [2.0, 2.0]}
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "jmctheroes:invisible", "rightArm", 0xFF1F00, [
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);

    boosters = war_machine_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    hand_guns = war_gun2.createHV(renderer, fire);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(mask.effect, backpack);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.HEAT_VISION");
    renderer.removeCustomAnimation("basic.AIMING");

    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    
    addAnimation(renderer, "basic.CHARGED_BEAM", "jmctheroes:aim/war_machine").setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer")));
        data.load(1, Math.max(entity.getInterpolatedData("fiskheroes:heat_vision_timer")));
    });

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;
    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        mask.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
    }

    if (!isFirstPersonArm) {
        if (renderLayer == "CHESTPLATE") {
            backpack.render();
            var gun = entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
            GunBarrel.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
            GunBarrel.progress = gun * Math.sin(Math.PI * entity.loop(3));
            GunBarrel.render();
            
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
        }
    }
    hand_guns.render(entity, renderLayer, false);
    
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}