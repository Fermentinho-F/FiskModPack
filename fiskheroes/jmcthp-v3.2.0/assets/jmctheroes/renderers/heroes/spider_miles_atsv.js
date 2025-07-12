extend("jmctheroes:spider_miles");
loadTextures({
    "layer1": "jmctheroes:miles/spider_man_miles_atsv_layer1",
    "layer2": "jmctheroes:miles/spider_man_miles_atsv_layer2"
});
var utils = implement("fiskheroes:external/utils");

var sense;
var R_bio_beam;
var L_bio_beam;

function init(renderer) {
    parent.init(renderer);
    sense = renderer.createEffect("fiskheroes:model");
    sense.setModel(utils.createModel(renderer, "jmctheroes:spideysense", null, "spidersense"));
    sense.anchor.set("head");
    
    parent.init(renderer);

    renderer.setItemIcon("HELMET", "spider_miles_itsv_0");
    renderer.setItemIcon("CHESTPLATE", "spider_miles_atsv_1");
    renderer.setItemIcon("LEGGINGS", "spider_miles_itsv_2");
    renderer.setItemIcon("BOOTS", "spider_miles_itsv_3");
}
function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x0069FF);
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        var timer = entity.getInterpolatedData("jmctheroes:dyn/invis_timer");
        var partial = Math.min(Math.max(entity.motion().length() / 20, 0), 0.7);
        return 1 + (partial - 1) * timer;
    });

    var lightning_color = 0x0069FF;
    var beam_type = renderer.createResource("BEAM_RENDERER", "jmctheroes:bio_electricity");
    R_bio_beam = utils.createLines(renderer, beam_type, lightning_color, [
        {"start": [0.2, 0.0, -1.8], "end": [-2.3, 4.5, -1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 4.5, -1.8], "end": [0.2, 6.0, -1.8], "size": [10.0, 10.0]},

        {"start": [-2.3, 4.5, -1.8], "end": [-2.3, 1.0, 1.8], "size": [10.0, 10.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [-2.3, 4.5, -1.8], "size": [10.0, 10.0]},

        {"start": [0.2, 0.0, 1.8], "end": [-2.3, 1.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 1.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
    ]);
    R_bio_beam.anchor.set("rightArm");
    R_bio_beam.setScale(1.5);
    R_bio_beam.mirror = false;
    
    L_bio_beam = utils.createLines(renderer, beam_type, lightning_color, [
        {"start": [0.2, 0.0, -1.8], "end": [-2.3, 4.5, -1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 4.5, -1.8], "end": [0.2, 6.0, -1.8], "size": [10.0, 10.0]},

        {"start": [-2.3, 4.5, -1.8], "end": [-2.3, 1.0, 1.8], "size": [10.0, 10.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [-2.3, 4.5, -1.8], "size": [10.0, 10.0]},

        {"start": [0.2, 0.0, 1.8], "end": [-2.3, 1.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 1.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
    ]);
    L_bio_beam.anchor.set("leftArm");
    L_bio_beam.setRotation(0, 180.0, 0).setScale(1.5);
    L_bio_beam.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x0069FF, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 7.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm){
    if (renderLayer == "CHESTPLATE"){
        R_bio_beam.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        R_bio_beam.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        R_bio_beam.render();
        L_bio_beam.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        L_bio_beam.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        L_bio_beam.render();
    }
    var slow = entity.getData("fiskheroes:slow_motion");
    if (renderLayer == "HELMET" && slow) {
        sense.render();
    }
}