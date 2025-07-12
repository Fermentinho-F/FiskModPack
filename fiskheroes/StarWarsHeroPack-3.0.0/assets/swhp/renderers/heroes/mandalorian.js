extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:mandalorian/mandalorian_layer1",
    "layer2": "swhp:mandalorian/mandalorian_layer2",
    "cape": "swhp:mandalorian/mandalorian_cape",
    "blaster": "swhp:mandalorian/mandalorian_blaster",
    "rifle": "swhp:mandalorian/mandalorian_rifle",
    "rifle_lights": "swhp:mandalorian/mandalorian_rifle_lights",
    "grapple_rope": "swhp:mandalorian/grapple_rope_brown",
    "grapple_null": "swhp:mandalorian/grapple_null",
    "grogu": "swhp:mandalorian/grogu"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

function init(renderer) {
    parent.init(renderer);
    initEffects(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "mandalorian.FLAMETHROWER", "fiskheroes:aiming", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("fiskheroes:beam_shooting")));
}

function initEffects(renderer) {
    var livery_rifle = renderer.bindProperty("fiskheroes:livery");
    livery_rifle.texture.set("rifle", "rifle_lights");
    livery_rifle.weaponType = "CHRONOS_RIFLE";

    utils.addLivery(renderer, "RIPS_GUN", "blaster");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 22, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 12;

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0xFFFF00);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [-7.5, -1.0, 3.0], "rotation": [0.0, -90.0, 60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 3.0).slotIndex = 0;;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.5, "offset": [-2.8, 0.5, 2.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;

    var grapple = renderer.bindProperty("fiskheroes:webs");
    grapple.textureRope.set("grapple_rope");
    grapple.textureRopeBase.set("grapple_null");
    grapple.textureSmall.set("grapple_null");
    grapple.textureLarge.set("grapple_null");

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xe25822, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]);

    utils.bindParticles(renderer, "swhp:flamethrower").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0);

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

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
}
