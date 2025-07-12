extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:war/mk3/war_machine_mk3_layer1",
    "layer2": "jmctheroes:war/mk3/war_machine_mk3_layer2",
    "lights": "jmctheroes:war/mk3/war_machine_mk3_lights_layer1",
    "suit": "jmctheroes:war/mk3/war_machine_mk3_suit.tx.json",
    "mask": "jmctheroes:war/mk3/war_machine_mk3_mask.tx.json",
    "chin": "jmctheroes:war/mk3/war_machine_mk3_chin.tx.json",
    "backpack": "jmctheroes:war/mk3/war_machine_mk3_backpack",
    //"backpack": "jmctheroes:war/mk3/war_machine_backpack.tx.json",
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

var barrelRight;
var barrelLeft;
var lowbarrelRight;
var lowbarrelLeft;

var backhammer;

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

    var model = renderer.createResource("MODEL", "jmctheroes:warbackpackmk3");
    model.bindAnimation("jmctheroes:warmachine_mk3").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:beam_charge") ||entity.getInterpolatedData("jmctheroes:dyn/suit_open")));
    model.texture.set("backpack", null );
    backpack = renderer.createEffect("fiskheroes:model").setModel(model);
    backpack.anchor.set("body");

    barrelLeft = renderer.createEffect("fiskheroes:booster")
    barrelLeft.setIcon(fire).setOffset(0, 0, -5).setRotation(-90, 0, 0).setSize(1.0, 3.0);
    barrelLeft.anchor.set("body", model.getCubeOffset("barrelLeft"));

    barrelRight = renderer.createEffect("fiskheroes:booster")
    barrelRight.setIcon(fire).setOffset(0, 0, -5).setRotation(-90, 0, 0).setSize(1.0, 3.0);
    barrelRight.anchor.set("body", model.getCubeOffset("barrelRight"));

    lowbarrelLeft = renderer.createEffect("fiskheroes:booster")
    lowbarrelLeft.setIcon(fire).setOffset(0, 0, -6).setRotation(-90, 0, 0).setSize(1.0, 3.0);
    lowbarrelLeft.anchor.set("body", model.getCubeOffset("lowbarrelLeft"));

    lowbarrelRight = renderer.createEffect("fiskheroes:booster")
    lowbarrelRight.setIcon(fire).setOffset(0, 0, -6).setRotation(-90, 0, 0).setSize(1.0, 3.0);
    lowbarrelRight.anchor.set("body", model.getCubeOffset("lowbarrelRight"));

    mask = iron_man_helmet.createFaceplate(renderer, "mask", null);
    chin = iron_man_helmet.createFaceplate(renderer, "chin", null);

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
    metal_heat.includeEffects(mask.effect, chin.effect, backpack);
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
        chin.effect.setOffset(0.0, 0.25, -0.025).setRotation(7.5, 0.0, 0.0);
        chin.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
    }

    if (!isFirstPersonArm) {
        if (renderLayer == "CHESTPLATE") {
            backpack.render();
            var gun = entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
            barrelLeft.progress = gun * Math.sin(Math.PI * entity.loop(4));
            barrelLeft.render();
            barrelRight.progress = gun * Math.sin(Math.PI * entity.loop(2));
            barrelRight.render();
            lowbarrelLeft.progress = gun * Math.sin(Math.PI * entity.loop(3));
            lowbarrelLeft.render();
            lowbarrelRight.progress = gun * Math.sin(Math.PI * entity.loop(1));
            lowbarrelRight.render();
            
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