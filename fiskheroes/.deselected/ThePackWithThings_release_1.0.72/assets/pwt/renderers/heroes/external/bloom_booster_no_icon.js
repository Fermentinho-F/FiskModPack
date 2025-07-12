function create(renderer, anchor, mirror, color, icon, beam) {
    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    var shape = renderer.createResource("SHAPE", null);
    var line = shape.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [0.0, 0.0] });
    var bloom = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shape);
    bloom.anchor.set(anchor);
    bloom.color.set(color);
    bloom.mirror = mirror;
    bloom.setScale(16.0);

	var handR = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shape);
    handR.setOffset(1.0, 10.0, 0.0).setSize(2.0, 2.0);
    handR.anchor.set("rightArm");

    var handL = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shape);
    handL.setOffset(-1.0, 10.0, 0.0).setSize(2.0, 2.0);
    handL.anchor.set("leftArm");
    
    var boots = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shape);
    boots.setOffset(0.0, 12.0, 0.0).setSize(2.5, 3.0);
    boots.anchor.set("rightLeg");
    boots.mirror = true;

    var size = { x: 1.0, y: 1.0 };
    var obj = {
        bloom: bloom,
		handR: handR,
        handL: handL,
        back: back,
        boots: boots,
        render: (entity, progress) => {
            var f = Math.PI * 2;
            f = Math.sin((entity.loop(f) * f) % f * 3) / 5;
            line.size.x = line.size.y = (1 + f * booster.flutter) * size.x;
            line.end.y = (1 + f * booster.flutter / 4) * size.x * size.y / 8;

            bloom.progress = bloom.opacity = progress;
            bloom.render();
        }
		render: (entity, renderLayer, isFirstPersonArm, all) => {
            if (!isFirstPersonArm) {
                if (all || renderLayer == "CHESTPLATE") {
                    var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    var fR = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
                    var fL = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
        
                    handR.progress = fR;
                    handL.progress = fL;
                    handR.speedScale = handL.speedScale = 0.5 * boost;
                    handR.flutter = handL.flutter = 1 + boost;
        
                    handR.setRotation(0, 0, -7 * flight - 10 * boost);
                    handL.setRotation(0, 0, 7 * flight + 10 * boost);
                    handR.render();
                    handL.render();
        
                    if (back != null && entity.getData('fiskheroes:suit_open_timer') == 0) {
                        back.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                        back.speedScale = 0.5 * boost;
                        back.setRotation(25 - 10 * boost, 0.0, 10 - 5 * boost);
                        back.render();
                    }
                }
        
                if (all || renderLayer == "BOOTS") {
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    boots.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                    boots.speedScale = 0.5 * boost;
                    boots.flutter = 1 + boost;
        
                    var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
                    f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
                    boots.setSize(2.5 + f * 4, 3.0 - f * 3.9);
                    boots.render();
                }
            }
        }
    };
    return obj;
}
