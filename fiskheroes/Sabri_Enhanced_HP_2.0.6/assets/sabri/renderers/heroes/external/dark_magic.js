function create(renderer, color, shape, beam) {
    var color = 0x93609E;
    var shape = renderer.createResource("SHAPE", "sabri:dark_magic");
    var beam = renderer.createResource("BEAM_RENDERER", "sabri:dark_magic");

    var dark_magic = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    dark_magic.setOffset(1.0, 8.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(4.8);
    dark_magic.color.set(color);
    dark_magic.anchor.set("rightArm");

    return {
        render: (entity, isFirstPersonArm) => {
            dark_magic.opacity = entity.getInterpolatedData("sabri:dyn/aiming_timer");
            dark_magic.render();
        }
    };
}
