extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:yuta/yuta_layer1",
    "layer2": "jjkp:yuta/yuta_layer2",
    "segment": "jjkp:blank",
    "claw": "jjkp:yuta/rika",
    "katana": "jjkp:yuta/yuta_katana",
    "megaphone": "jjkp:yuta/yuta_megaphone"
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("fiskheroes:external/flames");

var hand_flames;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var fire = renderer.createResource("ICON", "jjkp:yuta_cursed_energy_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xC26BA0, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.55, "offset": [-2.5, 3.0, 3.0], "rotation": [0.0, -90.0, 125.0] }
    ]);

    var arm = utils.createModel(renderer, "fiskheroes:ock_arm", "segment");
    var claw = utils.createModel(renderer, "jjkp:rika_tubes", "claw");
    claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
      { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 7.5, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(arm);
    tentacles.setHeadModel(claw);
    tentacles.segmentLength = 1.7;
    tentacles.segments = 13;

    var model = renderer.createResource("MODEL", "jjkp:yuta_megaphone");
    model.texture.set("megaphone");
    megaphone = renderer.createEffect("fiskheroes:model").setModel(model);
    megaphone.setOffset(0, 0, 0)
    megaphone.setScale(1.0);
    megaphone.anchor.set("head");

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.weaponType = "KATANA";
    livery.texture.set("katana");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "YUTA.noarm", "jjkp:megaphone_arm").setData((entity, data) => data.load(entity.getData("fiskheroes:shooting")));
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        //hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
    if (renderLayer == "HELMET" && entity.getData("fiskheroes:shooting")) {
        megaphone.render();
    }
    if (renderLayer == "CHESTPLATE") {
        hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
}
