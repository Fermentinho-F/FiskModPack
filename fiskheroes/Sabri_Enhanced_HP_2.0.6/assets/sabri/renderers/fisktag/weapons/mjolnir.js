loadTextures({
    "base": "sabri:mjolnir",
    "inventory": "sabri:inventory/mjolnir"
});

var utils = implement("fisktag:external/utils");
var inventory_icon = implement("sabri:external/inventory_icon");
var mjolnir_lightning = implement("sabri:external/mjolnir_lightning");

var lines;
var cancelAnimations = false;

var icon;
var model;

function init(renderer) {
    icon = inventory_icon.create(renderer);
    icon.texture.set(null, "inventory");
    
    model = utils.createModel(renderer, "sabri:weapons/mjolnir", "base");
    model.bindAnimation("sabri:mjolnir").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0, 0);
            data.load(1, 0);
            data.load(2, 0);
            data.load(3, 0);
            data.load(4, 0);
            data.load(5, 0);
            return;
        } 
        var c = entity.getInterpolatedData("fiskheroes:beam_charge");
        var f = entity.getInterpolatedData("fiskheroes:flight_timer");
        var b = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        var m = Math.min(b * 10, 1);
        data.load(0, Math.min(Math.max(entity.getInterpolatedData("sabri:dyn/aiming_timer") - m, 0) * 10, 1));
        data.load(1, (entity.getInterpolatedData("sabri:dyn/aiming_timer") - m) > 0 ? entity.loop(4) : 0);
        data.load(2, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(3, entity.getData("fiskheroes:beam_charging") ? Math.max(c * 4 - 3, 0) : Math.max(c * 5 - 4, 0));
        data.load(4, Math.max(f - m, 0));
        data.load(5, entity.getInterpolatedData("fiskheroes:reload_timer"))
    });

    lines = mjolnir_lightning.create(renderer, "sabri:mjolnir_charge", 0x00AAF6, [
        { "start": [1, 0, 6], "end": [-0.5, 0, 12], "size": [0.25, 0.25] },
        { "start": [-2, 0, 7], "end": [1, 0, 6], "size": [0.25, 0.25] },
        { "start": [-2, 3, 7], "end": [-2, 0, 7], "size": [0.25, 0.25] },
        { "start": [-2, 4, 11], "end": [-2, 3, 7], "size": [0.25, 0.25] },
        { "start": [-2, 0, 10], "end": [-2, 4, 11], "size": [0.25, 0.25] },
        { "start": [-0.5, 0, 12], "end": [-2, 0, 10], "size": [0.25, 0.25] },
        { "start": [-1.5, 2.5, 12.8581], "end": [-2, 4, 11], "size": [0.25, 0.25] },
        { "start": [1.5, 0.5, 12.8581], "end": [-1.5, 2.5, 12.8581], "size": [0.25, 0.25] },
        { "start": [2, 0, 9], "end": [-2, 0, 10], "size": [0.25, 0.25] },
        { "start": [2, 2, 7], "end": [2, 0, 9], "size": [0.25, 0.25] },
        { "start": [2, 4, 12], "end": [2, 2, 7], "size": [0.25, 0.25] },
        { "start": [2, 4, 12], "end": [1.5, 0.5, 12.8581], "size": [0.25, 0.25] },
        { "start": [0.5, 3.5, 5.1419], "end": [2, 2, 7], "size": [0.25, 0.25] },
        { "start": [-1.5, 0.5, 5.1419], "end": [0.5, 3.5, 5.1419], "size": [0.25, 0.25] },
        { "start": [-1.5, 0.5, 5.1419], "end": [1, 0, 6], "size": [0.25, 0.25] },
        { "start": [-2, 3, 7], "end": [-1.5, 0.5, 5.1419], "size": [0.25, 0.25] },
        { "start": [-2, 4, 11], "end": [-0.41, 8, 9], "size": [0.25, 0.25] },
        { "start": [0.41, 8, 9], "end": [2, 4, 12], "size": [0.25, 0.25] }
    ]);
    lines.effect.setOffset(0, -13.5, -9);
    lines.effect.setAnchorCube(model.getCubeOffset("mjolnir"));

    charge = mjolnir_lightning.create(renderer, "sabri:thor_lightning", 0x00AAF6, [
        { "start": [0, -240, 9.5], "end": [0, 0, 9.5], "size": [3.5, 3.5, 3.5] },
    ]);
    charge.effect.setOffset(0, -13.5, -9);
    charge.effect.setAnchorCube(model.getCubeOffset("mjolnir"));
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "INVENTORY") {
        icon.render(glProxy, isLeftSide, false);
        return;
    }
    
    var suit = entity.getWornChestplate().suitType().startsWith("sabri:thor");
    var r = entity.getData("fiskheroes:reload_timer");
    cancelAnimations = !suit;

    if (renderType === "EQUIPPED" || renderType === "EQUIPPED_FIRST_PERSON") {
        if (suit) {
            lines.effect.opacity = Math.max(entity.getInterpolatedData("sabri:dyn/mjolnir_leap_cooldown"), entity.getInterpolatedData("sabri:dyn/mjolnir_leap_timer"), entity.getInterpolatedData("fiskheroes:beam_charge"));
            lines.render();
        }

        if (renderType === "EQUIPPED_FIRST_PERSON") {
            glProxy.translate(0, 0, 0);
        }
        else {
            glProxy.translate(0, 0, 0);
        }
    }
    else if (renderType === "ENTITY") {
        glProxy.translate(0.0, -0.5, -0.25);
        glProxy.rotate(180, 1, 0, 0);
        cancelAnimations = true;
    }
    
    glProxy.translate(0, -1.7, -0.05);
    glProxy.scale(1.5);
    renderer.setModel(model);
}