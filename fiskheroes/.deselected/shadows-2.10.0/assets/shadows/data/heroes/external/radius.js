function isLookingAtTarget(basePos, baseRot, targetPos, fov) {
    var directionToEntity = targetPos.subtract(basePos).normalized();
    var dotProduct = Math.max(-1, Math.min(1, baseRot.dot(directionToEntity)));

    var angle = Math.acos(dotProduct) * (180 / Math.PI);

    return Math.abs(angle) < fov;
}

function lookingAtVampire(entity, radius) {
    radius = radius == undefined ? 10.0 : radius;
    var list = entity.world().getEntitiesInRangeOf(entity.eyePos(), radius);
    var output = null;

    list.forEach(other => {
        if (!entity.equals(other) && other.isLivingEntity() && output == null) {
            if (isLookingAtTarget(entity.eyePos(), entity.getLookVector(), other.eyePos(), 60) && other.canSee(entity) && other.getWornHelmet().suitType() == "shadows:vampire") {
                output = other;
            }
        }
    });

    return output;
}