function init(renderer, trailType, utils) {

    utils.bindTrail(renderer, trailType).setCondition(entity => entity.getData("loriatpack:dyn/charge_kinetic_cooldown") > 0.1 || entity.getData("fiskheroes:speed") >= 5 && entity.getData("fiskheroes:speeding"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", null, "body", 0xF0F0F0, []);
    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", null, "body", 0xF0F0F0, []);

    var anim = renderer.createResource("ANIMATION", "loriatpack:wall_run");
    anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:flight_animation")));
    renderer.addCustomAnimation("WALL_RUN", anim);

    var anim2 = renderer.createResource("ANIMATION", "loriatpack:vortex_charge");
    anim2.setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    });
    renderer.addCustomAnimation("VORTEX", anim2);

    var anim3 = renderer.createResource("ANIMATION", "loriatpack:vortex");
    anim3.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:beam_shooting_timer") > 0.4 ? entity.getInterpolatedData("fiskheroes:beam_shooting") * 1000 : 0));
    renderer.addCustomAnimation("CHARGED_BEAM", anim3);
}











