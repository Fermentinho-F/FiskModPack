var uuid = implement("sabri:external/uuid");

function init(hero) {
    hero.setName("Doctor Doom");
    hero.setVersion("Comics");
    hero.setTier(8);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("sabri:titanium_armor", "sabri:mystical_magic", "sabri:dark_magic", "fiskheroes:shield_throwing");
    hero.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    hero.addKeyBind("CHARGED_BEAM", "Electricity Blast", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
    hero.addKeyBindFunc("func_TELEPORT", (player, manager) => {
        if (player.getData("sabri:dyn/teleport_timer") == 0) {
            manager.setData(player, "sabri:dyn/teleport", true);
            manager.setData(player, "fiskheroes:teleport_delay", 10);
        }
        return true;
    }, "key.teleport", 3);
    hero.addKeyBind("SHIELD", "key.forcefield", 4);
    hero.addKeyBind("SPELL_MENU", "key.spellMenu", 5);

    hero.setDefaultScale(1.1);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission(hasPermission);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addSoundEvent("STEP", "sabri:doctor_doom_comics_walk");

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "sabri:dyn/teleport_timer", 10, entity.getData("sabri:dyn/teleport"));
        
        if (entity.getData("sabri:dyn/teleport_timer") == 1) {
            manager.setData(entity, "sabri:dyn/teleport", false);
        }

        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
        manager.incrementData(entity, "sabri:dyn/aiming_timer", 5, entity.getData('fiskheroes:telekinesis') && entity.getData('fiskheroes:grab_id') > -1);

        if (uuid.getPriority(entity) && entity.getData("fiskheroes:grab_id") > -1 && entity.isSneaking()) {
            entity.as("PLAYER").addChatMessage(entity.getData("fiskheroes:grab_id"));
        }
    });
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.85, 1);
    profile.addAttribute("SPRINT_SPEED", 0.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "SHIELD_THROW":
            return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && !entity.getData("fiskheroes:shield_blocking") && !entity.getData("fiskheroes:telekinesis"); 
        case "CHARGED_BEAM":
            return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:shield_blocking") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "SPELL_MENU":
            return !entity.getData("fiskheroes:shield_blocking") && entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:telekinesis");
        case "TELEPORT":
            return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:shield_blocking") && entity.getData("sabri:dyn/teleport_timer") == 0;
        case "SHIELD":
            return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:beam_charge") == 0 && entity.isOnGround() && !entity.getData("fiskheroes:telekinesis");
        case "TELEKINESIS":
            return !entity.getData("fiskheroes:shield_blocking") && entity.getData("fiskheroes:beam_charge") == 0 && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        default:
            return true;
    }
}

function hasPermission(entity, permission) {
    return permission == "USE_SHIELD";
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}