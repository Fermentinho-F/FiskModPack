var ban = implement("pwt:external/switch");
function init(hero) {
    hero.setName("Spider-Man");
	hero.setVersion("Venom Suit (Webb)");
    hero.setTier(8);
	

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");


    hero.addPowers("fiskheroes:spider_physiology", "pwt:symbiot_venom_spider_man_webb")
	
	hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.3, 0);
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.60, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.6, 1);
	
	
	hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
	hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
	hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
	hero.addKeyBindFunc("BLADE", Funcblade,"Blade", 5);
	
	

	hero.addAttributeProfile("BLADE", bladeProfile);
	hero.addAttributeProfile("PUNISHMENT", punishProfile);
    hero.setAttributeProfile(getAttributeProfile);
	hero.setModifierEnabled(isModifierEnabled);
	
	hero.setKeyBindEnabled(isKeyBindEnabled);	
	hero.setHasProperty(hasProperty);
	
	hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0
        },
        "properties": {
           "EFFECTS": [
				{
                    "id": "minecraft:poison",
                    "duration": 80,
                    "amplifier": 1,
                    "chance": 0.8
                }
            ]
        }
    });

	hero.setTickHandler((entity, manager) => {
		ban.tick(entity, manager);
        ///manager.incrementData(entity, "pwt:dyn/cooldown_interp_1", 10, 30, entity.loop(1200)>=0.98 && entity.motion().length() < 0.1 && entity.getData('fiskheroes:mask_open_timer2')==0);
    });
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return true;
    case "BREATHE_SPACE":
        return !entity.getData("fiskheroes:mask_open") ;
    default:
        return false;
    }
}



function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
	profile.addAttribute("REACH_DISTANCE", 1.7, 0);
}

function punishProfile(profile) {
    profile.revokeAugments();
	profile.addAttribute("MAX_HEALTH", -10000000.0, 0);

}

function getAttributeProfile(entity) {
	if (entity.getData('pwt:dyn/punishment')) {
        return "PUNISHMENT";
    }
	if (entity.getData("fiskheroes:blade") ) {
        return "BLADE";
    }
	
	
    return null;
}




function Funcblade(player, manager) {
    var flag = player.getData("fiskheroes:blade");
	manager.setDataWithNotify(player, "fiskheroes:web_swinging", false);
	manager.setDataWithNotify(player, "fiskheroes:blade", flag);
	
    return true;
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    manager.setDataWithNotify(player, "fiskheroes:blade", false);
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }

    
	manager.setDataWithNotify(player, "fiskheroes:tentacles_retracting", !flag);
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
	
    return true;
}


function isModifierEnabled(entity, modifier) {


	switch (modifier.name()) {
	case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData('fiskheroes:blade');
	
	case "fiskheroes:blade":
        return !entity.getData("fiskheroes:web_swinging") ;	
	
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5) ;
	

	
	case "fiskheroes:equipment":
        return entity.getData("fiskheroes:tentacles") == null ;


    default:
        return true;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
	
    switch (keyBind) {
	case "WEB_ZIP":
        return entity.getData("fiskheroes:tentacles") == null ;
	case "UTILITY_BELT":
        return entity.getData("fiskheroes:tentacles") == null;
	case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() ;
    default:
        return true;
    }
}

