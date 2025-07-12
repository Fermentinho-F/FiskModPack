function create(renderer, color, shape, beam) {
    var aim_shape1 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape1.setOffset(1, 11, 2.05).setScale(3.2);
    aim_shape1.color.set(color);
    aim_shape1.anchor.set("rightArm");
    aim_shape1.mirror = true;

    var aim_shape2 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape2.setOffset(2.77, 11, -1.02).setRotation(0, -119.95, 0).setScale(3.2);
    aim_shape2.color.set(color);
    aim_shape2.anchor.set("rightArm");
    aim_shape2.mirror = true;

    var aim_shape3 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape3.setOffset(-0.77, 11, -1.02).setRotation(0, 119.95, 0).setScale(3.2);
    aim_shape3.color.set(color);
    aim_shape3.anchor.set("rightArm");
    aim_shape3.mirror = true;

    return {
        render: (entity, isFirstPersonArm) => {
            aim_shape1.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape1.render();
            aim_shape2.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape2.render();
            aim_shape3.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape3.render();
        }
    };
}
