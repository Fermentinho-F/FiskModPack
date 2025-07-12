extend("dmh:hero_basic");
loadTextures({
    "layer1": "dmh:king_thanos/layer1",
    "layer2": "dmh:king_thanos/layer2",
    "lights": "dmh:king_thanos/layer1_lights",
    "sword": "dmh:weapons/twilight_sword"
});

var utils = implement("fiskheroes:external/utils");

var flame;
var disabled_sword;
var sword;
function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? null : "lights");
}

function initEffects(renderer) {
    disabled_sword = renderer.createEffect("fiskheroes:model");
    disabled_sword.setModel(utils.createModel(renderer, "dmh:weapons/equiped/twilight_sword", "sword"));
    disabled_sword.anchor.set("body");
    disabled_sword.setOffset(1, 5, 3).setScale(0.65);

    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "dmh:weapons/twilight_sword", "sword"));
    sword.setOffset(1, 8, -10).setScale(0.8);
    sword.anchor.set("rightArm");

    flame = renderer.createEffect("fiskheroes:booster").setIcon(renderer.createResource("ICON", "fiskheroes:fire_layer_%s"));
    flame.setOffset(1.0, 8.0, -3.5).setSize(1, 34).setRotation(-90, 0, 0).setScale(1.8, 1, 4.5);
    flame.anchor.set("rightArm");

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:telekinesis_monitor");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "fiskheroes:breach");
    utils.bindParticles(renderer, "dmh:king_thanos/flight").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindParticles(renderer, "dmh:king_thanos/landing").setCondition(entity => entity.getData("fiskheroes:dyn/superhero_landing_timer") > 0);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_discharge", "body", 0x0062ff, [{
                "firstPerson": [0.0, 6.0, 0.0],
                "offset": [0.0, 5.0, -4.0],
                "size": [4.0, 4.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "dmh:king_thanos/impact_blue_energy_projection")).setCondition(entity => !entity.getData("dmh:dyn/ignite"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "body", 0xff3700, [{
                "firstPerson": [0.0, 6.0, 0.0],
                "offset": [0.0, 5.0, -4.0],
                "size": [4.0, 4.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "dmh:king_thanos/impact_flame_energy_projection")).setCondition(entity => entity.getData("dmh:dyn/ignite")); ;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x0062ff);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.8);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimationWithData(renderer, "king_thanos.EQUIP", "dmh:king_thanos/equip", "dmh:dyn/equip_timer");

    utils.addFlightAnimation(renderer, "king_thanos.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "king_thanos.HOVER", "fiskheroes:flight/idle/neutral");

    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        flame.progress = Math.min(Math.max(entity.getInterpolatedData("dmh:dyn/equip_timer") - 0.8, 0) * 5, entity.getInterpolatedData("dmh:dyn/ignite_timer"));
        flame.render();

        if (entity.as("DISPLAY").getDisplayType() == "BOOK_PREVIEW") {
            if (entity.getData("fiskheroes:blade")) {
                sword.render();
            } else {
                disabled_sword.render();
            }
        } else if (entity.as("DISPLAY").getDisplayType() == "DISPLAY_STAND") {
            if (entity.getData("fiskheroes:mask_open")) {
                sword.render();
            } else {
                disabled_sword.render();
            }
        } else {
            var equiped = entity.getData("fiskheroes:blade") ? entity.getData("dmh:dyn/equip_timer") < 0.8 : entity.getData("dmh:dyn/equip_timer") < 0.3;
            if (!isFirstPersonArm && equiped) {
                disabled_sword.render();
            }
            if (!equiped) {
                sword.render();
            }
        }

    }
}
