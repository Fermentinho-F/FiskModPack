extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:clone_jet_trooper/clone_jet_trooper_layer1",
    "layer2": "swhp:clone_jet_trooper/clone_jet_trooper_layer2",
    "jetpack": "swhp:clone_jet_trooper/clone_jet_trooper_jetpack"
});

var utils = implement("fiskheroes:external/utils");
var jetpack_boosters = implement("swhp:external/jetpack_boosters");

var boosters;

function init(renderer) {
    parent.init(renderer);
    initEffects(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "mandalorian.FLIGHT", getFlightAnimation(), (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    utils.addHoverAnimation(renderer, "mandalorian.HOVER", "fiskheroes:flight/idle/falcon");
    addAnimationWithData(renderer, "mandalorian.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "mandalorian.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function getFlightAnimation() {
    return "fiskheroes:flight/falcon.anim.json";
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x00FFFF);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.5, "offset": [-2.8, 0.5, 2.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 0;

    jetpack = renderer.createEffect("fiskheroes:model");
    jetpack.setModel(utils.createModel(renderer, "swhp:mandalorian_jetpack", "jetpack"));
    jetpack.anchor.set("body");
    jetpack.setOffset(0.0, 2.0, 0.0);

    boosters = initBoosters(renderer, utils, jetpack_boosters);
}

function initBoosters(renderer, utils, jetpack_boosters) {
    utils.bindParticles(renderer, "swhp:jetpack").setCondition(entity => entity.getData("fiskheroes:flying"));
    return jetpack_boosters.create(renderer, 0x0033FF, "fiskheroes:orange_fire_layer_%s", {
        boosters: [
            { anchor: "body", offset: [3.3, 7.2, 3.3], size: [1.5, 2.0], mirror: true },
            { anchor: "body", offset: [3.3, 7.2, 3.3], size: [1.25, 1.0], mirror: true }
        ],
        bloom: [
            { anchor: "body", offset: [3.3, 7.2, 3.3], size: [3.0, 1.75, 5.5], mirror: true }
        ]
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        jetpack.render();
    }
    if (!isFirstPersonArm) {
        boosters.render(entity);
    }
}
