extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:phantasm/phantasm_layer1",
    "layer2": "jmctheroes:phantasm/phantasm_layer2",
    "blade": "jmctheroes:phantasm/phantasm_blade",
    "eyes": "jmctheroes:phantasm/phantasm_eyes",
    "cape": "jmctheroes:phantasm/phantasm_cape"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? null : "eyes";
    });
}
function initEffects(renderer) {
    bladestill = renderer.createEffect("fiskheroes:model");
    bladestill.setModel(utils.createModel(renderer, "jmctheroes:phantasm/BladeStill", "blade", null));
    bladestill.anchor.set("rightArm");

    var model = renderer.createResource("MODEL", "jmctheroes:phantasm/Phantasm_Blade");
    model.texture.set("blade");
    model.bindAnimation("jmctheroes:pose/phantasm_blade").setData((entity, data) => {
        data.load(entity.getInterpolatedData("jmctheroes:dyn/equip_timer"));
    });
    blade = renderer.createEffect("fiskheroes:model").setModel(model);
    blade.anchor.set("body");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;

    cape = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape.effect.texture.set("cape");

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x000000);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "phantasm.BLADE", "jmctheroes:pose/phantasm_blade").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("jmctheroes:dyn/equip_timer")));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {    
    var equipped = entity.getData("jmctheroes:dyn/equip_timer") > 0.62;
    var equip = entity.getData("jmctheroes:dyn/equip_timer") < 0.62 && entity.getData("jmctheroes:dyn/equip_timer") > 0.2;
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
    }
    if (renderLayer == "CHESTPLATE" && equip) {
        blade.render();
    }
    if (renderLayer == "CHESTPLATE" && equipped) {
        bladestill.render();
    }
}
