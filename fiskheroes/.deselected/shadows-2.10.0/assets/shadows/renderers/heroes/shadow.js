extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:custom/shadow/shadow_layer1",
    "layer2": "shadows:custom/shadow/shadow_layer2",
    "cape": "shadows:custom/shadow/shadow_cape.tx.json",
    "tentacles": "shadows:custom/shadow/shadow_tentacles",
    "dome": "shadows:custom/shadow/dome",
    "wings": "shadows:custom/shadow/shadow_wings.tx.json"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");


var cape;
var wings;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("custom/shadow/%s_0", "custom/shadow/%s_1", "custom/shadow/%s_2", "custom/shadow/%s_3");
    
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    var dome = renderer.bindProperty("fiskheroes:shadowdome");
    dome.texture.set("dome");

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));

    var shadow_tentacles = utils.createModel(renderer, "shadows:tentacleArm", "tentacles");

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        { "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
        { "offset": [2.0, -7.5, -2.0], "direction": [13.0, -10.0, -10.0] },
        { "offset": [-2.0, -7.5, -2.0], "direction": [-13.0, -10.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(shadow_tentacles);
    tentacles.segmentLength = 2;
    tentacles.segments = 8;

    model_wings = renderer.createResource("MODEL", "shadows:wings");
    model_wings.bindAnimation("shadows:wings_flapping").setData((entity, data) => data.load(entity.getInterpolatedData("shadows:dyn/2float_interp_reset")*2));
    model_wings.texture.set("wings");

    wings = renderer.createEffect("fiskheroes:model").setModel(model_wings);
    wings.setOffset(0,3,0);
    wings.anchor.set("body");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
   
    utils.addFlightAnimation(renderer, "shadows.FLIGHT", "shadows:wings_flight");

    renderer.reprioritizeDefaultAnimation("PUNCH", -10);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
        wings.opacity = Math.max(0, entity.getData('fiskheroes:flight_timer') - 0.2);
        wings.render();
    }
}
