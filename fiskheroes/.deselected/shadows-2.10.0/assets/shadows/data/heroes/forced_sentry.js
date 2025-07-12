/*theres a bug that you can scroll wheel to change distance of telekinesis which isnt a bug but it can
go above the range set for some reason(idk why, ive tried rules modifer. tick handlers and even the power file setting of range ofc)*/
var dome = implement("shadows:external/shadow_dome");
var value = 100;
function init(hero) {
    hero.setName("Forced Sentry");
    hero.setTier(1);
    hero.hide();

    hero.setChestplate("Suit");

    hero.addPowers("shadows:forced_sentry_power");

    hero.addKeyBind("TELEKINESIS", "Forced Sentry", 1);
    hero.addKeyBind("AIM", "Forced Sentry", 1);
    hero.addKeyBind("SHADOW_DOME", "Radius Forced Sentry", 2)

    hero.supplyFunction("canAim", canAim);

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("shadows:dyn/dome_forced_sentry_timer") != 0 && !entity.getData("shadows:dyn/2boolean_reset") && !entity.getData("shadows:dyn/dome_forced_sentry_cooldown")) {
            manager.setData(entity, "shadows:dyn/dome_forced_sentry_timer", 0);
        }
        if (entity.getData("shadows:dyn/forced_sentry_timer") == 1 && !entity.getData("shadows:dyn/forced_sentry")) {
            manager.setData(entity, "shadows:dyn/forced_sentry", true);
        } else if (entity.getData("shadows:dyn/forced_sentry_timer") == 0 && entity.getData("shadows:dyn/forced_sentry")) {
            manager.setData(entity, "shadows:dyn/forced_sentry", false);
        }

        if (entity.getData("fiskheroes:grab_id") > -1) {
            var entityGrabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));

            if (entityGrabbed.getData("fiskheroes:suit_open") == false && entityGrabbed.is("PLAYER")) {
                manager.setData(entityGrabbed, "fiskheroes:suit_open", true);

            }
            if (entityGrabbed.is("PLAYER") == false || entity.getData("shadows:dyn/forced_sentry")) {
                manager.setData(entity, "fiskheroes:grab_id", -1);
            }
        }

        if (entity.getData("shadows:dyn/dome_forced_sentry_timer") == 1 && !entity.getData("shadows:dyn/dome_forced_sentry_cooldown")) {
            manager.setData(entity, "fiskheroes:lightsout", true);
            manager.setData(entity, "shadows:dyn/dome_forced_sentry_cooldown", true);
        } else if (entity.getData("shadows:dyn/dome_forced_sentry_timer") == 0 && entity.getData("shadows:dyn/dome_forced_sentry_cooldown")) {
            manager.setData(entity, "shadows:dyn/dome_forced_sentry_cooldown", false);
        }
        dome.forceSentryShadowDome(entity, manager);
    });

    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function canAim(entity) {
    return entity.getData("fiskheroes:grab_id") > -1;
}

function isKeyBindEnabled(entity, keyBind) {
    
    switch (keyBind) {
    case "SHADOW_DOME":
        return !entity.getData("shadows:dyn/dome_forced_sentry_cooldown");
    case "TELEKINESIS":
        return entity.getData('shadows:dyn/dome_forced_sentry_timer') == 0 && entity.getData("shadows:dyn/forced_sentry_timer") == 0 || entity.getData("fiskheroes:grab_id") > -1;
    case "AIM":
        return entity.getData('shadows:dyn/dome_forced_sentry_timer') == 0;
    default:
        return true;
    }
}
