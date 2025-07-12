extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:slipstream/slipstream_layer1",
    "layer2": "moopack:slipstream/slipstream_layer2",
    "lights": "moopack:slipstream/slipstream_lights",
    "lights_jade": "moopack:slipstream/slipstream_lights_jade",
    "lights_void": "moopack:slipstream/slipstream_lights_void",
    "lights_negative": "moopack:slipstream/slipstream_lights_negative",
    "mask_lights": "moopack:slipstream/slipstream_lights_mask",
    "mask_lights_jade": "moopack:slipstream/slipstream_lights_jade_mask",
    "mask_lights_void": "moopack:slipstream/slipstream_lights_void_mask",
    "mask_lights_negative": "moopack:slipstream/slipstream_lights_negative_mask"
});

var speedster = implement("fiskheroes:external/speedster_utils");

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("moopack:dyn/speed_dna_active") && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights_jade";
        }
        else if (entity.getData("moopack:dyn/speed_dna_active")) {
            return "lights_jade";
        }
        else if (entity.getData("moopack:dyn/cosmic_dna_active") && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights_void";
        }
        else if (entity.getData("moopack:dyn/cosmic_dna_active")) {
            return "lights_void";
        }
        else if (entity.getData("moopack:dyn/mutant_dna_active") && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights_negative";
        }
        else if (entity.getData("moopack:dyn/mutant_dna_active")) {
            return "lights_negative";
        }
        else if (!entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active") && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        else if (!entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active")) {
            return "lights";
        }
    });
}

function initEffects(renderer) { 

    var trail = renderer.bindProperty("fiskheroes:trail");
    trail.setTrail(renderer.createResource("TRAIL", "fiskheroes:lightning_white"));
    trail.setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active"));

    trail = renderer.bindProperty("fiskheroes:trail");
    trail.setTrail(renderer.createResource("TRAIL", "moopack:lightning_jade"));
    trail.setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData("moopack:dyn/speed_dna_active"));

    trail = renderer.bindProperty("fiskheroes:trail");
    trail.setTrail(renderer.createResource("TRAIL", "moopack:lightning_void"));
    trail.setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData("moopack:dyn/cosmic_dna_active"));

    trail = renderer.bindProperty("fiskheroes:trail");
    trail.setTrail(renderer.createResource("TRAIL", "fiskheroes:lightning_red"));
    trail.setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData("moopack:dyn/mutant_dna_active"));

    speedster.init(renderer);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });
}

function render(entity, renderLayer, isFirstPersonArm) {

}