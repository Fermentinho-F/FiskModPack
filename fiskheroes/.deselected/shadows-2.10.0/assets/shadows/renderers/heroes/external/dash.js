function defaultDashVisual(renderer, utils, info) {
    utils.bindParticles(renderer, info["effects"]["particles"]).setCondition(entity => entity.getData(info["datas"]["dash"]));

    var sprint = renderer.bindProperty("fiskheroes:trail");
    sprint.setTrail(renderer.createResource("TRAIL", info["effects"]["trail"]));
    sprint.setCondition(entity => entity.isSprinting() && entity.isOnGround() && !entity.getData(info["datas"]["dash"]) &&
        entity.getData(info["datas"]["didDash"]) && !entity.getData("shadows:dyn/stamina_out"));

    renderer.removeCustomAnimation("basic.BLOCKING");
}
