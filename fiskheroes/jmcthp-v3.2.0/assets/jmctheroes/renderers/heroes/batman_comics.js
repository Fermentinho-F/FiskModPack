extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:bat/batman_layer1",
    "layer2": "jmctheroes:bat/batman_layer2",
    "eyes": "jmctheroes:bat/batman_eye_lights",
    "rebreather": "jmctheroes:bat/rebreather",
    "knuckles_lights": "jmctheroes:bat/knuckles_lights",
    "spikes": "jmctheroes:bat/bat_spikes",
    "knuckles": "jmctheroes:bat/knuckles",
    "cape2": "jmctheroes:bat/batman_cape2",
    "cape1": "jmctheroes:bat/batman_cape1"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape1
var cape2
var rebreather;
var handrebreather;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? null : "eyes";
    });
}
function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;

    cape1 = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape1.effect.texture.set("cape1");

    cape2 = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape2.effect.texture.set("cape2");

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x000000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]);

    rebreather = renderer.createEffect("fiskheroes:model");
    rebreather.setModel(utils.createModel(renderer, "jmctheroes:headrebreather", "rebreather", null));
    rebreather.anchor.set("head");

    var knuckles = utils.createModel(renderer, "jmctheroes:brassknuckles", "knuckles", "knuckles_lights");
    knuckles.generateMirror();
    
    knucklesEffect = renderer.createEffect("fiskheroes:model");
    knucklesEffect.setModel(knuckles);
    knucklesEffect.anchor.set("rightArm");
    knucklesEffect.mirror = true;

    var spikes = utils.createModel(renderer, "jmctheroes:batspikes", "spikes", null);
    spikes.generateMirror();
    
    spikesEffect = renderer.createEffect("fiskheroes:model");
    spikesEffect.setModel(spikes);
    spikesEffect.anchor.set("rightArm");
    spikesEffect.mirror = true;

    handrebreather = renderer.createEffect("fiskheroes:model");
    handrebreather.setModel(utils.createModel(renderer, "jmctheroes:handrebreather", "rebreather", null));
    handrebreather.anchor.set("rightArm");

    handrebreather = renderer.createEffect("fiskheroes:model");
    handrebreather.setModel(utils.createModel(renderer, "jmctheroes:handrebreather", "rebreather", null));
    handrebreather.anchor.set("rightArm");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "belt.REBREATHER", "jmctheroes:rebreather").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData('jmctheroes:dyn/rebreather_timer')));
    });
    addAnimation(renderer, "belt.KNUCKLES", "jmctheroes:brass").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData('fiskheroes:blade_timer')));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    var blade = entity.getData("fiskheroes:blade_timer") > 0.55;
    var gliding = entity.getData("fiskheroes:gliding");
    var underwater = entity.getData("jmctheroes:dyn/rebreather_timer") > 0.55;
    var underwater1 = entity.getData("jmctheroes:dyn/rebreather_timer") > 0.2 && entity.getData("jmctheroes:dyn/rebreather_timer") < 0.55;
    
    if (!isFirstPersonArm && !gliding && renderLayer == "CHESTPLATE") {
        cape1.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
    }
    if (!isFirstPersonArm && gliding && renderLayer == "CHESTPLATE") {
        cape2.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
    }
    if (renderLayer == "HELMET" && underwater) {
        rebreather.render();
    }
    if (renderLayer == "CHESTPLATE" && underwater1) {
        handrebreather.render();
    }
    if (renderLayer == "CHESTPLATE" && blade) {
        knucklesEffect.render();
    }
    if (renderLayer == "CHESTPLATE") {
        spikesEffect.render();
    }
}
