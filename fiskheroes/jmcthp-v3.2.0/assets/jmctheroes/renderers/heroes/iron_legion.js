extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:ultron/iron_legion_drone_layer1",
    "layer2": "jmctheroes:ultron/iron_legion_drone_layer2",
    "lights": "jmctheroes:ultron/iron_legion_drone_lights",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "blank": "jmctheroes:blank"
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");

var boosters;

var repulsor;
var metal_heat;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? null : "lights";
    });
}

function initEffects(renderer) {
    reactor = renderer.createEffect("fiskheroes:model");
    reactor.setModel(utils.createModel(renderer, "jmctheroes:ArcReactor", "layer1", null));
    reactor.anchor.set("body");

    repulsor = renderer.createEffect("fiskheroes:overlay");

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(reactor);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;
    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;
}

function hasBootLights() {
    return true;
}
function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
        }
        else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
            reactor.render();
        }
        else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}