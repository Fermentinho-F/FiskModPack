var min = 600;
var max = 800;

function init(hero) {
    hero.setName("Spider-Man Noir");
    hero.setTier(7);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jmctheroes:luger, display:{Lore:[\"\u00A75\u00A7lJMCT Heroes\u00A7r\"]}}", true, item => item.nbt().getString("WeaponType") == "jmctheroes:luger");

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("fiskheroes:spider_physiology", "jmctheroes:upgraded_web_shooters_noir");
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
	hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "Spider-Sense", 4);

    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("jmctheroes:dyn/1float_interp_reset") == 1  || (entity.getData("fiskheroes:moving") || entity.isSneaking())&& entity.getData("jmctheroes:dyn/1integer_reset") != 0) {
            manager.setDataWithNotify(entity, "jmctheroes:dyn/1integer_reset", 0);
            manager.setData(entity, "jmctheroes:dyn/1boolean_reset", false);
            if (!entity.getData("fiskheroes:moving") || !entity.isSneaking()) {
                manager.setDataWithNotify(entity, "jmctheroes:dyn/1float_interp_reset", 0);
            }
        }
        if (entity.getData("jmctheroes:dyn/1float_interp_reset") == 0 && (!entity.getData("fiskheroes:moving") || !entity.isSneaking())) {
            if (entity.getData("jmctheroes:dyn/1boolean_reset")) {
                manager.setDataWithNotify(entity, "jmctheroes:dyn/1integer_reset", entity.getData("jmctheroes:dyn/1integer_reset") + 1);
            } else {
                manager.setDataWithNotify(entity, "jmctheroes:dyn/2integer_reset", Math.ceil(min + Math.random() * max));
                manager.setData(entity, "jmctheroes:dyn/1boolean_reset", true);
            }
        }
    });
}


function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }
    
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:equipment":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "WEB_ZIP":
        return entity.getHeldItem().isEmpty();
    case "UTILITY_BELT":
        return entity.getHeldItem().isEmpty();
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function hasPermission(entity, permission) {
    return permission == "USE_GRAPPLING_GUN" || permission == "USE_LUGER";
}

function canAim(entity) {
    return entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == 'jmctheroes:luger';
}
