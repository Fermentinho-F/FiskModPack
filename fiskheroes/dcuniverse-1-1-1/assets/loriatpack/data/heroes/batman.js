function init(hero) {
    hero.setName("Batman/Bruce Wayne");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("loriatpack:bat_gaget");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_CYCLE_BASS", cycleBrass, "Brass Knuckles", 4);
    //  Object.keys(batarang).forEach((key, index) => {
    //      hero.addKeyBindFunc("func_CHANGE_BATARANG_" + index, changeBatarang, "Current Batarang: " + key, 4);   
    //  });
   // hero.addKeyBindFunc("func_CHANGE_BATARANG_BASIC", changeBatarang, "Current Batarang: Basic", 4); 
   // hero.addKeyBindFunc("func_CHANGE_BATARANG_FIRE", changeBatarang, "Current Batarang: Fire", 4); 
    hero.addKeyBindFunc("func_CHANGE_BATARANG", changeBatarang, "Change Batarang", 1); 
    hero.addKeyBind("REBREATHER", "Toggle Rebreather", 2);
    hero.addKeyBind("CHARGE_ENERGY", "key.chargeEnergy", 3);
    hero.addKeyBind("NIGHT_VISION", "Toggle Night Vision", 3);
    hero.addKeyBind("GRAPPLING", "Toggle Grappling", 5);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "Toggle Grappling", 5);
    
	hero.setHasProperty(hasProperty);
	hero.setHasPermission(hasPermission);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTickHandler(tickHandler);

    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("ELECTRO", electroProfile);
    hero.addAttributeProfile("KRYPTONITE", kryptoniteProfile);
    hero.addDamageProfile("ELECTRO", {"types": {"ELECTRICITY": 1.0, "BLUNT": 1.0}});
    hero.addDamageProfile("KRYPTONITE", {"types": {"KRYPTONITE": 1.0, "THORNS": 1.0}});
   
	hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
	
   }

    function tickHandler(entity, manager) {
	   manager.incrementData(entity, "loriatpack:dyn/mask_open_timer", 10, 15, entity.getData("fiskheroes:mask_open"));
	   
       manager.incrementData(entity, "loriatpack:dyn/electro_timer", 10,15, entity.getData("loriatpack:dyn/electro"));
       manager.incrementData(entity, "loriatpack:dyn/kryptonite_timer", 10, 15, entity.getData("loriatpack:dyn/kryptonite"));
       
       manager.incrementData(entity, "loriatpack:dyn/punch_int", 1, 8, (entity.getData("loriatpack:dyn/kryptonite") && entity.isPunching() && entity.getData('loriatpack:dyn/punch_int') < 1 && entity.getHeldItem().isEmpty()
        || entity.getData("loriatpack:dyn/electro") && entity.isPunching() && entity.getData('loriatpack:dyn/punch_int') < 1 && entity.getHeldItem().isEmpty()));

        if (!entity.getHeldItem().isEmpty()) {
            manager.setData(entity, "loriatpack:dyn/electro", false);
            manager.setData(entity, "loriatpack:dyn/electro_timer", 0);
            manager.setData(entity, "loriatpack:dyn/kryptonite", false);
            manager.setData(entity, "loriatpack:dyn/kryptonite_timer", 0);
        }

        if (entity.getData("loriatpack:dyn/grappling") == false) {
            manager.setDataWithNotify(entity, "fiskheroes:web_swinging", false);
        }

        var type = entity.getData("loriatpack:dyn/batarang_type");
    
         if (type != 1 && type != 2 && type != 3) {
             manager.setData(entity, "loriatpack:dyn/batarang_type", 1);
            }

        manager.incrementData(entity, "loriatpack:dyn/batarang_basic", 1, 1, entity.getData('fiskheroes:utility_belt_type') == 0 && type == 1);
        manager.incrementData(entity, "loriatpack:dyn/batarang_fire", 1, 1, entity.getData('fiskheroes:utility_belt_type') == 0 && type == 2);
        manager.incrementData(entity, "loriatpack:dyn/batarang_electro", 1, 1, entity.getData('fiskheroes:utility_belt_type') == 0 && type == 3);

        if (type == 1) {
            manager.setData(entity, "loriatpack:dyn/batarang_fire", 0);
            manager.setData(entity, "loriatpack:dyn/batarang_electro", 0);
        }

        if (type == 2) {
            manager.setData(entity, "loriatpack:dyn/batarang_basic", 0);
            manager.setData(entity, "loriatpack:dyn/batarang_electro", 0);
        }

        if (type == 3) {
            manager.setData(entity, "loriatpack:dyn/batarang_fire", 0);
            manager.setData(entity, "loriatpack:dyn/batarang_basic", 0);
        }

         return true;

    }

    function changeBatarang(entity, manager) {
        var type = entity.getData("loriatpack:dyn/batarang_type");
        manager.setData(entity, "loriatpack:dyn/batarang_type", type >= 3 ? 1 : type + 1);
        return true;
    }

    function cycleBrass(entity, manager) {
    var flag = entity.getData("loriatpack:dyn/electro");
    var flag2 = entity.getData("loriatpack:dyn/kryptonite");
    if (flag == false && flag2 == false) {
        manager.setData(entity, "loriatpack:dyn/electro", !flag);
    }
    if (flag == true) {
        manager.setData(entity, "loriatpack:dyn/electro", !flag);
        manager.setData(entity, "loriatpack:dyn/kryptonite", true);
    }
    if (flag2 == true) {
        manager.setData(entity, "loriatpack:dyn/kryptonite", !flag2);
    }
    
    return true
    }

    function webSwingingKey(player, manager) {
        var flag = player.getData("fiskheroes:web_swinging");
    
        if (!flag) {
            manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
            manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
            manager.setDataWithNotify(player, "fiskheroes:gliding", false);
        }

        manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);

        return true;
    }

    function electroProfile(profile) {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.inheritDefaults();
    }

    function kryptoniteProfile(profile) {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.inheritDefaults();
    }

    function getProfile(entity) {
        if (entity.getData("loriatpack:dyn/electro_timer") == 1) {
    return "ELECTRO";
        } 
        if (entity.getData("loriatpack:dyn/kryptonite_timer") == 1) {
    return "KRYPTONITE";
        } 
    }

    function isModifierEnabled(entity, modifier) {
        var type = entity.getData("loriatpack:dyn/batarang_type");

        switch (modifier.name()) {
         case "fiskheroes:equipment":
             return modifier.id() == "basic" && type == 1 
             || modifier.id() == "fire" && type == 2 
             || modifier.id() == "electro" && type == 3;
        case "fiskheroes:web_swinging":
            return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:gliding");
        case "fiskheroes:web_zip":
            return !entity.getData("fiskheroes:gliding");
        case "fiskheroes:leaping":
           return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
        case "fiskheroes:gliding":
            return !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem();
        case "fiskheroes:water_breathing":
            return entity.getData("loriatpack:dyn/rebreather");
        case "fiskheroes:transformation":
            return modifier.id() == "rebreather" && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite") && entity.getHeldItem().isEmpty() && !entity.getData("loriatpack:dyn/grappling")
            || modifier.id() == "night" && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite") && entity.getHeldItem().isEmpty() && !entity.getData("loriatpack:dyn/grappling")
            || modifier.id() == "grappling" && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite") && entity.getHeldItem().isEmpty(); 
        default:
            return true;
        }
    }

    function isKeyBindEnabled(entity, keyBind) {
        var type = entity.getData("loriatpack:dyn/batarang_type");

        // if (keyBind == "func_CHANGE_BATARANG_BASIC") {
        //    // return keyBind == ("func_CHANGE_BATARANG_" + (type - 1));// && entity.isSneaking();
        //    return type == 1;
        // }
        // if (keyBind == "func_CHANGE_BATARANG_FIRE") {
        //    // return keyBind == ("func_CHANGE_BATARANG_" + (type - 1));// && entity.isSneaking();
        //    return type == 2;
        // }
        // if (keyBind == "func_CHANGE_BATARANG_ELECTRO") {
        //    // return keyBind == ("func_CHANGE_BATARANG_" + (type - 1));// && entity.isSneaking();
        //    return type == 3;
        // }

        if (keyBind == "func_CHANGE_BATARANG") {
            return entity.isSneaking();
        }

        switch (keyBind) {
            case "GRAPPLING":
                return entity.getHeldItem().isEmpty() && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite");
            case "func_WEB_SWINGING":
                return entity.getHeldItem().isEmpty() && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite");
            case "WEB_ZIP":
                return !entity.getData("fiskheroes:gliding") && entity.getData("loriatpack:dyn/grappling");
            case "func_CYCLE_BASS":
                return !entity.getData("loriatpack:dyn/grappling") && entity.getHeldItem().isEmpty();
            case "NIGHT_VISION":
                return !entity.getData("loriatpack:dyn/grappling") && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite") && !entity.getData("fiskheroes:mask_open");
            case "REBREATHER":
                return !entity.getData("loriatpack:dyn/grappling") && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite");
            case "CHARGE_ENERGY":
                return entity.getHeldItem().isEmpty() && !entity.getData("loriatpack:dyn/grappling") && entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite");
            case "UTILITY_BELT":
                return !entity.getData("loriatpack:dyn/grappling") && !entity.getData("loriatpack:dyn/electro") && !entity.getData("loriatpack:dyn/kryptonite") && !entity.isSneaking();  
                default:
                    return true;
                }
            }

   
function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" ;
}
function hasPermission(entity, permission) {
    return permission == "USE_GRAPPLING_GUN" ;
}