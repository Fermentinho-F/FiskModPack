extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:silver_surfer_f4_layer1",
    "layer2": "sabri:silver_surfer_f4_layer2",
    "powerless1": "sabri:silver_surfer_f4_powerless_layer1.tx.json",
    "powerless2": "sabri:silver_surfer_f4_powerless_layer2.tx.json",
    "layer1_powerless": "sabri:silver_surfer_f4_powerless_layer1",
    "layer2_powerless": "sabri:silver_surfer_f4_powerless_layer2",
    "surfboard": "sabri:silver_surfer_f4_surfboard"
});

var utils = implement("fiskheroes:external/utils");

var aura_body;
var aura_arms;
var aura_arms2;
var aura_legs;
var aura_legs2;

function initEffects(renderer) {
    var model = renderer.createResource("MODEL", "sabri:silver_surfer_surfboard");
    model.bindAnimation("sabri:cosmic_surfboard_f4")
        .setData((entity, data) => {
            if (cancelAnimations) {
                data.load(0, 0);
                data.load(1, 0);
                return;
            }
            data.load(0, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
            data.load(1, entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer"));
        });
    model.texture.set("surfboard");
    surfboard = renderer.createEffect("fiskheroes:model").setModel(model);
    surfboard.anchor.set("body");

    var trail = renderer.bindProperty("fiskheroes:trail");
    trail.setTrail(renderer.createResource("TRAIL", "sabri:wind_trails"));
    trail.setCondition(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "sabri:silver_surfer_blast", "rightArm", 0xA9C6D3, [
        { "firstPerson": [0.0, 6.0, -16.0], "offset": [4.0, 9.0, 0.0], "size": [20.0, 20.0] }
    ]);

    utils.bindParticles(renderer, "sabri:silver_surfer_f4_charge");

    overlay = renderer.createEffect("fiskheroes:overlay");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimationWithData(renderer, "silver_surfer.AIMING", "fiskheroes:dual_aiming", "fiskheroes:aimed_timer");
    addAnimation(renderer, "silver_surfer.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        data.load(Math.max((entity.getInterpolatedData("fiskheroes:aiming_timer") + entity.getInterpolatedData("fiskheroes:aimed_timer")) / 2 * 4 - 3, 0));
    });

    utils.addHoverAnimation(renderer, "silver_surfer.HOVER", "sabri:flight/idle/silver_surfer_f4");
    utils.addFlightAnimation(renderer, "silver_surfer.FLIGHT", "sabri:flight/silver_surfer_f4.anim.json", (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    cancelAnimations = false;

    if (!entity.is("DISPLAY")) {
        var t = entity.getInterpolatedData("fiskheroes:dyn/steel_timer");
        
        overlay.opacity = 1 - 0.25 * t;
        overlay.texture.set(t == 0 ? renderLayer == "LEGGINGS" ? "layer2_powerless" : "layer1_powerless" : renderLayer == "LEGGINGS" ? "powerless2" : "powerless1");
        if (t < 1) {
            overlay.render();
        }
    }

    var f = entity.getInterpolatedData("fiskheroes:flight_timer");
    var b = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    var s = entity.getData("fiskheroes:flying");

    if (f > 0) {
        surfboard.setOffset(0, 1, (s ? 200 : -200) * (1 - f));
        surfboard.setScale(1 * f);

        if (isFirstPersonArm) {
            surfboard.setOffset(0, -6 * b + (s ? 200 : -entity.rotPitch() * Math.PI) * (1 - f), -2 * b + s ? 0 : -200 * (1 - f));
            surfboard.setRotation(-entity.rotPitch() * (f - b), 0, 0);
            surfboard.anchor.ignoreAnchor(true);

            cancelAnimations = true;
        } else {
            surfboard.setRotation(0, 0, 0);
            surfboard.anchor.ignoreAnchor(false);
        }

        surfboard.render();
    }
}