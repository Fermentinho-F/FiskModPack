extend("swhp:mandalorian_beskar");
loadTextures({
    "grogu": "swhp:mandalorian/grogu_darthmaul"
});

function initEffects(renderer) {
    parent.initEffects(renderer);
    var grogu = utils.createModel(renderer, "swhp:grogu_darthmaul", "grogu");
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
}