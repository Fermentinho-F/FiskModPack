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