extend("dmh:hero_basic");
loadTextures({
    "layer1": "dmh:cgr/layer1",
    "layer2": "dmh:cgr/layer2",
    "layer1_lights": "dmh:cgr/layer1_lights",
    "layer2_lights": "dmh:cgr/layer2_lights",
    "eyes": "dmh:cgr/eyes",
    "cosmic_eyes": "dmh:cgr/cosmic_eyes",
    "fire": "dmh:cgr/skull_fire",
    "chains": "dmh:cgr/chains_body",
    "chains_hand": "dmh:cgr/chains_blade",
    "chains_model": "dmh:cgr/chains_model",
    "gun": "dmh:weapons/cgr_blaster",
    "bike": "dmh:cgr/cosmic_bike",
    "bike_lights": "dmh:cgr/cosmic_bike_lights"
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("dmh:external/flames");
var fisk_flames = implement("fiskheroes:external/flames");
var head_flames;
var hand_flame;
var head;
var eyes;
var chains;
var chains_model;
var cosmic_eyes;
var gun;
var gun_left;
var bike;
var bike_booster;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights");
}

function initEffects(renderer) {
    var fire = renderer.createResource("ICON", "fiskheroes:fire_layer_%s");
    head_flames = flames.createHead(renderer, fire);

    hand_flame = fisk_flames.createHands(renderer, fire, false);
    
    head = renderer.createEffect("fiskheroes:overlay");
    head.texture.set(null, "fire");

    cosmic_eyes = renderer.createEffect("fiskheroes:overlay");
    cosmic_eyes.texture.set(null, "cosmic_eyes");

    eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set(null, "eyes");
    
    chains = renderer.createEffect("fiskheroes:overlay");
    
    chains_model = renderer.createEffect("fiskheroes:model");
    chains_model.setModel(utils.createModel(renderer, "dmh:weapons/ghost_rider_chains", null, "chains_model"));
    chains_model.anchor.set("rightArm");

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "dmh:purple");

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0x7700ff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [4, 4] },
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [0.5, 10.0, 0.0], "size": [4, 4], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "dmh:gun", "rightArm", 0xff0000, [
        { "firstPerson": [-8, 5, -19.0], "offset": [-0.5, 19, -3], "size": [1.5, 1.5] },
        { "firstPerson": [8, 5, -19.0], "offset": [0.5, 19, -3], "size": [1.5, 1.5], "anchor": "leftArm"  }
    ]);

    gun = renderer.createEffect("fiskheroes:model");
    gun.setModel(utils.createModel(renderer, "dmh:weapons/cgr_blaster", "gun"));
    gun.setOffset(2, 3.5, 1.5).setRotation(10,0,0);
    gun.anchor.set("rightArm");

    gun_left = renderer.createEffect("fiskheroes:model");
    gun_left.setModel(utils.createModel(renderer, "dmh:weapons/cgr_blaster", "gun"));
    gun_left.setOffset(0, 3.5, 1.5).setRotation(10,0,0);
    gun_left.anchor.set("leftArm");

    bike = renderer.createEffect("fiskheroes:model");
    bike.setModel(utils.createModel(renderer, "dmh:cosmic_bike", "bike", "bike_lights"));
    bike.anchor.ignoreAnchor(true);
    bike.setOffset(0, 6, -9.5);
    bike.anchor.set("body");

    var bike_trail = renderer.bindProperty("fiskheroes:trail");
    bike_trail.setTrail(renderer.createResource("TRAIL", "dmh:bike"));
    bike_trail.setCondition(entity => entity.getData("fiskheroes:flying"));

    bike_booster = renderer.createEffect("fiskheroes:booster").setIcon(renderer.createResource("ICON", "fiskheroes:fire_layer_%s"));
    bike_booster.setOffset(0.0, 19.0, 22.0).setSize(4.0, 4.0).setRotation(90,45,0);
    bike_booster.anchor.set("body");

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer") - entity.getInterpolatedData("dmh:dyn/cosmic_timer"), 0)));

    addAnimation(renderer, "cgr.DUAL_AIMING", "fiskheroes:dual_aiming_fpcorr").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:aiming_timer") * entity.getInterpolatedData("dmh:dyn/cosmic_timer")));

    addAnimationWithData(renderer, "basic.CHARGED_BEAM", "fiskheroes:dual_aiming", "fiskheroes:beam_shooting_timer");
    
    addAnimationWithData(renderer, "cgr.AIMING", "fiskheroes:aiming", "dmh:dyn/transform_timer").priority = 10;

    addAnimation(renderer, "cgr.BIKE", "dmh:bike").setData((entity, data) => {
        data.load(0, Math.min(entity.getInterpolatedData("fiskheroes:flight_timer") * 2, 1));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        if (!isFirstPersonArm) {
            head.opacity = 1 - entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            head_flames.render(head.opacity);
            
            head.render();

            eyes.opacity = entity.getInterpolatedData("dmh:dyn/ignite_timer");
            eyes.render();

            cosmic_eyes.opacity = entity.getInterpolatedData("dmh:dyn/cosmic_timer");
            cosmic_eyes.render();
        }
    }
    if (renderLayer == "CHESTPLATE") {
        hand_flame.render(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer") - entity.getInterpolatedData("dmh:dyn/cosmic_timer"), 0));
        
        gun.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer") * entity.getInterpolatedData("dmh:dyn/cosmic_timer");
        gun.render();
        gun_left.opacity = gun.opacity;
        gun_left.render();
        if (entity.isPunching() && entity.getData("fiskheroes:blade")) {
            chains_model.opacity = entity.getInterpolatedData("fiskheroes:blade_timer");
            chains_model.render();
        } else {
            chains.texture.set(null, entity.getData("fiskheroes:blade") ? "chains_hand" : "chains");
            chains.render();
        }

        bike.opacity = Math.min(entity.getInterpolatedData("fiskheroes:flight_timer") * 2, 1);
        bike.render();

        if (Math.max(Math.min(entity.motionInterpolated().length(), 1), 0) > 0.3 && entity.getData("fiskheroes:flight_timer") == 1) {
            bike_booster.progress = Math.max(Math.min(entity.motionInterpolated().length(), 1), 0);
            bike_booster.speedScale = 0.5 * Math.max(Math.min(entity.motionInterpolated().length(), 1), 0);
            bike_booster.anchor.ignoreAnchor(!isFirstPersonArm);
            bike_booster.render();
        }

    }
}
