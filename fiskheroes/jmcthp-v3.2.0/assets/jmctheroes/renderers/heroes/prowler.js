extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:prowler/prowler_layer1",
    "layer2": "jmctheroes:prowler/prowler_layer2",
    "lights": "jmctheroes:prowler/prowler_lights.tx.json",
    "cape": "jmctheroes:prowler/prowler_cape",
    "claws": "fiskheroes:black_panther_claws",
    "hood": "jmctheroes:prowler/prowler_hood",
    "claws": "fiskheroes:black_panther_claws"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var overlay;
var lights;
var cape;
var hood;

function initEffects(renderer) {
    utils.bindTrail(renderer, "jmctheroes:prowler");

    hood = renderer.createEffect("fiskheroes:model");
    hood.setModel(utils.createModel(renderer, "jmctheroes:hood", "hood", null));
    hood.anchor.set("head");
    
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("claws");
    lights = renderer.createEffect("fiskheroes:overlay");
    lights.texture.set(null, "lights");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.0;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;
    
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:blade")) {
        overlay.render();
    }
    if (renderLayer == "HELMET") {
        hood.render();
    }
    if (renderLayer == "CHESTPLATE"|| renderLayer == "BOOTS") {
        lights.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "speedster.SPRINT", "jmctheroes:speedsters/prowler_sprint").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    });
}
