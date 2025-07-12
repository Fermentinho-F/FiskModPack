//1 : isEntityInTheirOwnDome(entity)
function isEntityInTheirOwnDome(entity) {
    var domeId = entity.getData("fiskheroes:lightsout_id");
    var dome = entity.world().getEntityById(domeId);
    if (dome.exists()) {
        var contained = dome.as("SHADOWDOME").getContainedEntities();
        for (var i = 0; i < contained.size(); ++i) {
            var other = contained.get(i);
            if (other.getUUID() === entity.getUUID()) {
                return true;
            }
        }
    }
    return false;
}
//2 : forceSentryShadowDome(entity, manager)
function forceSentryShadowDome(entity, manager) {
    var domeId = entity.getData("fiskheroes:lightsout_id");
    var dome = entity.world().getEntityById(domeId);
    if (dome.exists()) {
        var contained = dome.as("SHADOWDOME").getContainedEntities();
        for (var i = 0; i < contained.size(); ++i) {
            var other = contained.get(i);
            if (other.getUUID() !== entity.getUUID() && other.is("PLAYER")) {
                manager.setData(other, "fiskheroes:suit_open", true);
            }
        }
    }
}
//3 : isDupeInDome(entity, manager)
function isDupeInDome(entity, manager) {
    var domeId = entity.getData("fiskheroes:lightsout_id");
    var dome = entity.world().getEntityById(domeId);
    if (dome.exists()) {
        var contained = dome.as("SHADOWDOME").getContainedEntities();
        for (var i = 0; i < contained.size(); ++i) {
            var other = contained.get(i);
            if (other.getEntityName() === "fiskheroes.SpellDuplicate") {
                PackLoader.printChat("TEST");
            }
        }
    }
}