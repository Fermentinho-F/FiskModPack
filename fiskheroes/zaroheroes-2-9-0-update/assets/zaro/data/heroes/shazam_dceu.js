function init(hero) {
    hero.setName("Shazam");
    hero.setTier(9);
    
    hero.setChestplate("item.superhero_armor.piece.torso");
   
    hero.addPowers("zaro:shazam","zaro:divine_empowerment",  "fiskheroes:charged_punch");
    hero.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);

    
    hero.addKeyBind("SHAZAM", "SHAZAM!", 5);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 4);
    hero.addKeyBind("ENERGY_PROJECTION", "key.cosmicBeam", 2);
    hero.addKeyBind("CHARGED_PUNCH", "key.punchToggle", 3);
    hero.addKeyBind("CHARGED_BEAM", "Energy Beam", 1);
   
    hero.setAttributeProfile(getAttributeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
   hero.addAttributeProfile("ZAM", zamProfile);

    hero.addAttributeProfile("PUNCH", punchProfile);
    hero.addAttributeProfile("BLUNT", bluntProfile);

    hero.setDefaultScale(defaultScale);
    
    hero.setAttributeProfile(entity => entity.hasStatusEffect("fiskheroes:eternium") ? "ETERNIUM" : null);
    hero.addAttributeProfile("ETERNIUM", profile => {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("FALL_RESISTANCE", 5.0, 0);
    });

    hero.setDamageProfile(entity => !entity.getHeldItem().isWeapon() ? "PUNCH" : null);
    hero.addDamageProfile("PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "MAGIC": 0.7
        }
    });
}

function punchProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 100.5, 0);
    profile.addAttribute("KNOCKBACK", 8.5, 0);
}

function bluntProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 100.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 8.5, 0);
    profile.addAttribute("BASE_SPEED", 6.2, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:punchmode") ? entity.getData("fiskheroes:punch_charged") ? "PUNCH" : "BLUNT" : null;
}

function getTierOverride(entity) {
    return entity.hasStatusEffect("fiskheroes:eternium") ? 6 : 9;
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? 7 : 5;
}
function zamProfile(profile) {
     profile.revokeAugments();
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? "ZAM" : null;
}
function defaultScale(entity) {
    if (entity.getData('fiskheroes:dyn/nanites')) {
        return 1.05;
    }
    return 0.80;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() == "fiskheroes:transformation" || modifier.name() == "fiskheroes:cooldown" || entity.getData("fiskheroes:dyn/nanites");
}
function isModifierEnabled(entity, modifier) {
      if (modifier.name() != "fiskheroes:eternium_weakness" && entity.hasStatusEffect("fiskheroes:eternium")) {
        return false;
    }
     else if (modifier.name() == "fiskheroes:controlled_flight") {
        return (entity.getData("fiskheroes:dyn/nanites"));
    }
    else if (modifier.name() == "fiskheroes:charged_beam") {
        return (entity.getData("fiskheroes:dyn/nanites"));
    }
    else if (modifier.name() == "fiskheroes:projectile_immunity") {
        return (entity.getData("fiskheroes:dyn/nanites"));
    }
    else if (modifier.name() == "fiskheroes:regeneration") {
        return (entity.getData("fiskheroes:dyn/nanites"));
    }
    switch (modifier.name()) {
        default:
           return modifier.name() != "fiskheroes:super_speed" || !entity.getData("fiskheroes:flying");
}

    }

function isKeyBindEnabled(entity, keyBind) {
     if (entity.hasStatusEffect("fiskheroes:eternium")) {
        return false;
    }
    switch (keyBind) {
    case "CHARGED_BEAM":
         return entity.getData("fiskheroes:dyn/nanites");
    case "SUPER_SPEED":
        return entity.getData("fiskheroes:dyn/nanites");
     case "ENERGY_PROJECTION":
        return entity.getData("fiskheroes:dyn/nanites");
     case "CHARGED_PUNCH":
        return entity.getData("fiskheroes:dyn/nanites");
    default:
        return keyBind != "SUPER_SPEED" || !entity.getData("fiskheroes:flying");
    }    
}
