extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:mandalorian/mandalorian_beskar_layer1",
    "layer2": "swhp:mandalorian/mandalorian_beskar_layer2",
    "cape": "swhp:mandalorian/mandalorian_beskar_cape",
    "mandalorian_jetpack": "swhp:mandalorian/mandalorian_jetpack",
    "blaster": "swhp:mandalorian/mandalorian_blaster",
    "rifle": "swhp:mandalorian/mandalorian_rifle",
    "rifle_lights": "swhp:mandalorian/mandalorian_rifle_lights",
    "grapple_rope": "swhp:mandalorian/grapple_rope_grey",
    "grapple_null": "swhp:mandalorian/grapple_null",
    "darksaber": "swhp:lightsaber/lightsaber_darksaber",
    "grogu": "swhp:mandalorian/grogu"
});

var utils = implement("fiskheroes:external/utils");
var lightsaber = implement("swhp:external/lightsaber");
var jetpack_boosters = implement("swhp:external/jetpack_boosters");
var capes = implement("fiskheroes:external/capes");

var boosters;

function init(renderer) {
    parent.init(renderer);
    initEffects(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "mandalorian.FLAMETHROWER", "fiskheroes:aiming", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("fiskheroes:beam_shooting")));
    utils.addFlightAnimation(renderer, "mandalorian.FLIGHT", getFlightAnimation(), (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
    utils.addHoverAnimation(renderer, "mandalorian.HOVER", "fiskheroes:flight/idle/falcon");
    addAnimationWithData(renderer, "mandalorian.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "mandalorian.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
    lightsaber.initSingleAnimations(renderer, "mandalorian", "mandalorian")
}

function getFlightAnimation() {
    return "fiskheroes:flight/falcon.anim.json";
}

function initEffects(renderer) {
    saber = lightsaber.initDarkSaber(renderer, "darksaber", 0xFFFFFF);

    lightsaber.initDarkSaberParticles(renderer, "darksaber");

    var livery_rifle = renderer.bindProperty("fiskheroes:livery");
    livery_rifle.texture.set("rifle", "rifle_lights");
    livery_rifle.weaponType = "CHRONOS_RIFLE";

    utils.addLivery(renderer, "RIPS_GUN", "blaster");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.01;
    physics.flareFactor = 0.01;
    cape = capes.createDefault(renderer, 22, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 12;

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0xFFFF00);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.5, "offset": [-2.8, 0.5, 2.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 0;

    var grapple = renderer.bindProperty("fiskheroes:webs");
    grapple.textureRope.set("grapple_rope");
    grapple.textureRopeBase.set("grapple_null");
    grapple.textureSmall.set("grapple_null");
    grapple.textureLarge.set("grapple_null");

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xe25822, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]);

    utils.bindParticles(renderer, "swhp:flamethrower").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0);

    mandalorian_jetpack = renderer.createEffect("fiskheroes:model");
    mandalorian_jetpack.setModel(utils.createModel(renderer, "swhp:mandalorian_jetpack", "mandalorian_jetpack"));
    mandalorian_jetpack.anchor.set("body");
    mandalorian_jetpack.setOffset(0.0, 2.0, 0.0);

    boosters = initBoosters(renderer, utils, jetpack_boosters);

    var grogu = utils.createModel(renderer, "swhp:grogu", "grogu");
    grogu.bindAnimation("swhp:grogu").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [10.0, -4.5, -2.0], "direction": [13.0, 0.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setHeadModel(grogu);
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
    saber.render(entity, renderLayer);
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" && !entity.getData("fiskheroes:flying")) {
        cape.render(entity);
    }
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:flying")) {
        mandalorian_jetpack.render();
    }
    if (!isFirstPersonArm) {
        boosters.render(entity);
    }
}
