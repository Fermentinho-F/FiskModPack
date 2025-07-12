function isLookingAtTarget(entity, other, angleRange, eyeRadius) {
    var otherEye = other.eyePos();
    var entityEye = entity.eyePos();

    var distance = otherEye.distanceTo(entityEye);

    if (distance > eyeRadius) {
        return false;
    }

    var targetDirection = otherEye.subtract(entityEye).normalized();
    var dotProduct = Math.max(-1, Math.min(1, entity.getLookVector().dot(targetDirection)));
    var angle = Math.acos(dotProduct) * (180 / Math.PI);

    return Math.abs(angle) < angleRange;
}

function init(hero, key, tickHandler, deathMessage) {
    hero.addKeyBind("JUMPSCARE", "Jumpscare", key);
    hero.addDamageProfile("JUMPSCARE", {
        "types": {
            "FEAR": 1.0
        }
    });

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fnaf:dyn/jumpscare")) {
            if (!entity.getHeldItem().isEmpty() || entity.getData("fiskheroes:invisible")) {
                manager.setData(entity, "fnaf:dyn/jumpscare", false);
            }
            var list = entity.world().getEntitiesInRangeOf(entity.pos(), 6);
            list.forEach(other => {
                if (other.isLivingEntity() && !other.equals(entity) && isLookingAtTarget(entity, other, 30, 5)) {
                    other.hurtByAttacker(hero, "JUMPSCARE", deathMessage, 8.0, entity);
                }
            });
        }
        if (typeof tickHandler !== "undefined") {
            tickHandler(entity, manager);
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "JUMPSCARE") {
		return entity.getData("fnaf:dyn/jumpscare_cooldown") == 0 && entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:invisible") && !entity.getData("fnaf:dyn/music_box");
    }
    return true;
}
