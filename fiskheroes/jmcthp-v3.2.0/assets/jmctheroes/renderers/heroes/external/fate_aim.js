function create(renderer, color, shape, beam) {
    var aim_shape1 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape1.setOffset(1, 11, 3.15).setScale(2.65);
    aim_shape1.color.set(color);
    aim_shape1.anchor.set("rightArm");
    aim_shape1.mirror = true;

    var aim_shape2 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape2.setOffset(1, 11, -3.15).setScale(2.65);
    aim_shape2.color.set(color);
    aim_shape2.anchor.set("rightArm");
    aim_shape2.mirror = true;

    var aim_shape3 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape3.setOffset(4.15, 11, 0).setScale(2.65);
    aim_shape3.color.set(color);
    aim_shape3.anchor.set("rightArm");
    aim_shape3.mirror = true;

    var aim_shape4 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape4.setOffset(-2.15, 11, 0).setScale(2.65);
    aim_shape4.color.set(color);
    aim_shape4.anchor.set("rightArm");
    aim_shape4.mirror = true;

    var aim_shape5 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape5.setOffset(3.25, 11, 2.25).setRotation(0, -45, 0).setScale(2.65);
    aim_shape5.color.set(color);
    aim_shape5.anchor.set("rightArm");
    aim_shape5.mirror = true;

    var aim_shape6 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape6.setOffset(3.25, 11, -2.25).setRotation(0, 45, 0).setScale(2.65);
    aim_shape6.color.set(color);
    aim_shape6.anchor.set("rightArm");
    aim_shape6.mirror = true;

    var aim_shape7 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape7.setOffset(-1.25, 11, 2.25).setRotation(0, -45, 0).setScale(2.65);
    aim_shape7.color.set(color);
    aim_shape7.anchor.set("rightArm");
    aim_shape7.mirror = true;

    var aim_shape8 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aim_shape8.setOffset(-1.25, 11, -2.25).setRotation(0, 45, 0).setScale(2.65);
    aim_shape8.color.set(color);
    aim_shape8.anchor.set("rightArm");
    aim_shape8.mirror = true;

    return {
        render: (entity, isFirstPersonArm) => {
            aim_shape1.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape1.render();
            aim_shape2.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape2.render();
            aim_shape3.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape3.render();
            aim_shape4.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape4.render();
            aim_shape5.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape5.render();
            aim_shape6.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape6.render();
            aim_shape7.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape7.render();
            aim_shape8.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
            aim_shape8.render();
        }
    };
}
