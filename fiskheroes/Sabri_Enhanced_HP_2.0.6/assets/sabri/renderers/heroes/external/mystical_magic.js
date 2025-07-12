function create(renderer, color, shape, beam) {
    var shape = renderer.createResource("SHAPE", "sabri:mystical_portal");
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:line");
    var color = 0xBBECFF;

    var mystical_portal = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    mystical_portal.setOffset(0.0, 8.0, 0.0).setRotation(90.0, 0.0, 0.0);
    mystical_portal.color.set(color);
    mystical_portal.anchor.set("body");

    return {
        render: (entity, isFirstPersonArm) => {
            mystical_portal.opacity = entity.getInterpolatedData("sabri:dyn/teleport_timer");
            mystical_portal.setScale(5 * entity.getInterpolatedData("sabri:dyn/teleport_timer"))
            mystical_portal.render();
        }
    };
}
