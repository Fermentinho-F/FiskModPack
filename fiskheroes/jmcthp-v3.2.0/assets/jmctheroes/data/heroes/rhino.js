function init(hero) {
    hero.setName("Rhino");
    hero.setVersion("item.superhero_armor.version.comics");
    hero.setAliases("rhino", "aleksei");
    hero.setTier(7);
    
    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");

    hero.addPowers("jmctheroes:superhuman_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 9.7, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.8, 1);
    hero.addAttribute("WEAPON_DAMAGE", -0.75, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);

    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);
    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 2);

    hero.setDefaultScale(1.35);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("Charged Ram", rhinoProfile);
    hero.setTickHandler((entity, manager) => {
        var speeding = entity.isSprinting() && entity.isOnGround() && entity.getHeldItem().isEmpty();
        var notspeeding = !entity.isSprinting() || !entity.isOnGround() || !entity.getHeldItem().isEmpty();
        manager.setData(entity, "fiskheroes:energy_projection", speeding);
        if (speeding) {
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setData(entity, "fiskheroes:shield_blocking", true);
        }
        if (notspeeding) {
            manager.setData(entity, "fiskheroes:shield", false);
            manager.setData(entity, "fiskheroes:shield_blocking", false);
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "EARTHQUAKE":
        return !entity.isSprinting() && entity.isOnGround() && !entity.isSneaking();
    case "GROUND_SMASH":
        return !entity.isSprinting() && entity.isOnGround() && !entity.isSneaking();
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:ground_smash":
        return !entity.isSprinting() && entity.isOnGround() && !entity.isSneaking();
    case "fiskheroes:earthquake":
        return !entity.isSprinting() && entity.isOnGround() && !entity.isSneaking();
    default:
        return true;
    }
}

function rhinoProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 4.7, 0);
    profile.addAttribute("SPRINT_SPEED", 2.3, 1);
}


function getProfile(entity) {
    if (entity.isSprinting() && entity.isOnGround() && entity.getHeldItem().isEmpty()) {
        return "Charged Ram";
    }
}