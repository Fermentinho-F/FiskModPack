var initHero;
var cosmicKeys = ["COSMIC_PENANCE_STARE", "TELEKINESIS", "CHARGED_BEAM", "AIM_COSMIC"];
var ignoreList = ["DISABLE_PUNCH", "AIM", "COSMIC", "DISABLE_PUNCH", "TELEPORT"];
function init(hero) {
    initHero = hero;
    hero.setName("Cosmic Ghost Rider");
    hero.setTier(10);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("dmh:power_cosmic", "dmh:spirit_of_vengeance");
    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
    hero.addAttribute("MAX_HEALTH", 5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("DISABLE_PUNCH", "NO Punch", -1);

    hero.addKeyBind("PENANCE_STARE", "\u00A76\u00A7lPenance Stare", 1);
    hero.addKeyBind("PENANCE_STARE_VISUAL", "\u00A76\u00A7m\u00A7lPenance Stare", 1);

    hero.addKeyBindFunc("COSMIC_PENANCE_STARE", (player, manager) => {
        penanceStare(player, 24, 100000, "%1$s was evaporated by %2$s", 60);
        manager.setData(player, "dmh:dyn/cosmic_penance", true);
        return true;
    }, "\u00A75\u00A7lCosmic Penance Stare", 1);
    hero.addKeyBind("COSMIC_PENANCE_STARE_VISUAL", "\u00A75\u00A7m\u00A7lCosmic Penance Stare", 1);

    hero.addKeyBind("AIM", "\u00A76\u00A7lHell Fire", 2);
    hero.addKeyBind("AIM_VISUAL", "\u00A76\u00A7m\u00A7lHell Fire", 2);

    hero.addKeyBind("AIM_COSMIC", "\u00A75\u00A7lCosmic Blasters", 2);
    hero.addKeyBind("AIM_COSMIC_VISUAL", "\u00A75\u00A7m\u00A7lCosmic Blasters", 2);

    hero.addKeyBind("BLADE", "\u00A76\u00A7lMystical Chains", 3);
    hero.addKeyBind("BLADE_VISUAL", "\u00A76\u00A7m\u00A7lMystical Chains", 3);

    hero.addKeyBind("TELEKINESIS_AIM", "\u00A75\u00A7lTelekinesis", 3);
    hero.addKeyBind("TELEKINESIS", "\u00A75\u00A7lTelekinesis", 3);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A75\u00A7m\u00A7lTelekinesis", 3);

    hero.addKeyBind("CHARGED_BEAM", "\u00A75\u00A7lCosmic Energy Beam", 4);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "\u00A75\u00A7m\u00A7lCosmic Energy Beam", 4);

    hero.addKeyBind("COSMIC", "\u00A75\u00A7lToggle Cosmic Mode", 5);
    hero.addKeyBind("COSMIC_VISUAL", "\u00A75\u00A7m\u00A7lToggle Cosmic Mode", 5);

    hero.addKeyBind("TELEPORT", "\u00A7b\u00A7lTeleport", 5);

    hero.supplyFunction("canAim", canAim);

    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE" || property == "MASK_TOGGLE");
    hero.setKeyBindEnabled(getKeyBindEnabled);
    hero.setModifierEnabled(getModiferEnabled);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:flame_off");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:flame_on");
    hero.addSoundEvent("AIM_START", ["dmh:cgr/aim_on", "dmh:cgr/hellfire"]);
    hero.addSoundEvent("AIM_STOP", "dmh:cgr/aim_off");

    hero.addDamageProfile("FLAME", {
        "types": {
            "FIRE": 1.0
        },
        "properties": {
            "COOK_ENTITY": true,
            "HEAT_TRANSFER": 160,
            "IGNITE": 40
        }
    });

    hero.setDamageProfile(entity => entity.getData("fiskheroes:blade") && entity.isPunching() ? "FLAME" : null);
    hero.addAttributeProfile("CHAIN", chainProfile);
    hero.setAttributeProfile(entity => entity.getData("fiskheroes:blade") && entity.isPunching() ? "CHAIN" : null);

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "dmh:dyn/penance_timer", 30, entity.getData("dmh:dyn/ignite"));
        manager.incrementData(entity, "dmh:dyn/penance_duration", 150, 1, entity.getData("dmh:dyn/ignite") && entity.getData("dmh:dyn/penance_timer") == 1);
        if (entity.getData("dmh:dyn/penance_duration") > 0) {
            penanceStare(entity, 12.0, 20.0, "%2$s made %1$s pay for their sins", 30);
            if (entity.getData("dmh:dyn/penance_duration") == 1) {
                manager.setData(entity, "dmh:dyn/ignite", false);
            }

        }

        manager.incrementData(entity, "dmh:dyn/cosmic_penance_cooldown", 150, 5, entity.getData("dmh:dyn/cosmic_penance"));
        if (entity.getData("dmh:dyn/cosmic_penance_cooldown") == 1) {
            manager.setData(entity, "dmh:dyn/cosmic_penance", false);
        }

    });

}

function chainProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
    profile.addAttribute("REACH_DISTANCE", 4.0, 0);
}

function isLookingAtTarget(basePos, baseRot, targetPos, fov) {
    var directionToEntity = targetPos.subtract(basePos).normalized();
    var dotProduct = Math.max(-1, Math.min(1, baseRot.dot(directionToEntity)));

    var angle = Math.acos(dotProduct) * (180 / Math.PI);

    return Math.abs(angle) < fov;
}

function penanceStare(entity, range, dmg, deathMessage, fov) {
    var list = entity.world().getEntitiesInRangeOf(entity.eyePos(), range);
    list.forEach(other => {
        if (entity.canSee(other) && !entity.equals(other)) {
            if (isLookingAtTarget(entity.eyePos(), entity.getLookVector(), other.eyePos(), fov) && isLookingAtTarget(other.eyePos(), other.getLookVector(), entity.eyePos(), 30)) {
                other.hurtByAttacker(initHero, "FLAME", deathMessage, dmg, entity);
            }
        }
    });
}
function getKeyBindEnabled(entity, keyBind) {
    var isCosmicKey = cosmicKeys.indexOf(keyBind.split("_VISUAL")[0].split("_AIM")[0]) > -1;
    if (ignoreList.indexOf(keyBind) == -1 && (!isCosmicKey && entity.getData("dmh:dyn/cosmic") && !entity.getData("fiskheroes:flying") || isCosmicKey && !entity.getData("dmh:dyn/cosmic")) || entity.getData("fiskheroes:flying") && keyBind != "TELEPORT" && keyBind != "DISABLE_PUNCH") {
        return false;
    }
    switch (keyBind) {
    case "DISABLE_PUNCH":
        return entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:flying") || entity.getData("dmh:dyn/ignite");
    case "PENANCE_STARE":
        return (entity.getData("dmh:dyn/ignite") || entity.getData("dmh:dyn/penance_timer") == 0) && !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:aiming");
    case "PENANCE_STARE_VISUAL":
        return (!entity.getData("dmh:dyn/ignite") && entity.getData("dmh:dyn/penance_timer") > 0) || entity.getData("fiskheroes:blade")  || entity.getData("fiskheroes:aiming") ;
    case "COSMIC_PENANCE_STARE":
        return !entity.getData("dmh:dyn/cosmic_penance") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:aiming");
    case "COSMIC_PENANCE_STARE_VISUAL":
        return entity.getData("dmh:dyn/cosmic_penance") || entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming");

    case "AIM":
    case "AIM_COSMIC":
        return canAim(entity);
    case "AIM_VISUAL":
    case "AIM_COSMIC_VISUAL":
        return !canAim(entity);
    case "BLADE":
    case "TELEKINESIS":
         return canAim(entity) && !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:beam_charging");
    case "BLADE_VISUAL":
    case "TELEKINESIS_VISUAL":
        return !canAim(entity) || entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:beam_charging");
    case "TELEKINESIS_AIM":
        return entity.getData("fiskheroes:grab_id") > -1;
    case "CHARGED_BEAM":
        return !entity.getData("fiskheroes:aiming") && (entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_charge") == 0);
    case "CHARGED_BEAM_VISUAL":
        return entity.getData("fiskheroes:aiming") || !entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") > 0;

    case "COSMIC":
        return !entity.getData("fiskheroes:aiming") && !entity.getData("dmh:dyn/ignite");
    case "COSMIC_VISUAL":
        return entity.getData("fiskheroes:aiming") || entity.getData("dmh:dyn/ignite");
    case "TELEPORT":
        return entity.getData("fiskheroes:flying");
    default:
        return true;
    }
}

function getModiferEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:controlled_flight" && modifier.name() != "fiskheroes:teleportation" && entity.getData("fiskheroes:flying")) {
        return false;
    }
    switch (modifier.name()) {
    case "fiskheroes:blade":
    case "fiskheroes:flame_blast":
        return !entity.getData("dmh:dyn/cosmic") && !entity.getData("fiskheroes:flying");
    case "fiskheroes:repulsor_blast":
        return entity.getData("dmh:dyn/cosmic") || entity.getData("fiskheroes:flying");
    default:
        return true;
    }
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData("dmh:dyn/ignite") && !entity.getData("fiskheroes:beam_charging");
}
