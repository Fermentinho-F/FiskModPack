var ban = implement("pwt:external/switch");
var domain = [
	"fiskheroes",
	"pwt",
	"uhp",
	"nh",
	"skarredheroes",
	"dhhp",
	"jmctheroes"
];

///avoid combat/archery/acrobatics conflicts

var archery = [
	"arrow",
	"green_arrow",
	"arsenal",
	"prometheus",
	"dark_archer",
	"hawkeye",
	"artemis",
	"tigress"
];

var combat = [
	"batman",
	"deathstroke",
	"crossbones",
	"captain_america",,
	"guardian",
	"black_panther",
	"moon_knight",
	"arkham_knight"
];

var gun = [
	"deathstroke",
	"deadpool",
	"wild_dog",
	"peacemaker",
	"vigilante",
	"bloodsport",
	"red_hood",
	"batman_thomas",
	"arkham_knight"
];

var acrobatics = [
	"ninja",
	"spider",
	"anti_ock",
	"stealth_suit",
	"the_tick",
	"nightwing",
	"robin",
	"red_hood",
	"black_cat",
	"catwoman",
	"daredevil",
	"spodermen"
];

var spodermen = [
	"spodermen"
];

function init(hero) {
    hero.setName("Batman");
    hero.setVersion("Cyberpunk");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:suit_data_drive", true);
	hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);

    hero.addPowers("pwt:batsuit_cyberpunk", "pwt:cybernetic_implant", "pwt:combat");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
	hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 1);
	hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
	hero.addKeyBind("AIM", "key.aim", -1);

	hero.addKeyBind("GUN", "Toggle Gun", 4);
	hero.addKeyBindFunc("func_PROJECTILE_CYCLE", cycle_projectile, "Change Projectile", 1);
	
	hero.addKeyBindFunc("func_SKILL", skill_toggle, "Download Data", 5);
	hero.addKeyBindFunc("func_DOWNLOADED", empty, "\u00A7dDownload Complete", 5);
	hero.addKeyBindFunc("func_ERROR", empty, "\u00A7dUnreadable Data", 5);
	
	hero.addKeyBindFunc("func_NODATA", empty, "\u00A7bNo Data To Download", 5);

	hero.supplyFunction("canAim", canAim);
	hero.setHasProperty(hasProperty);
	hero.setAttributeProfile(getProfile);
	hero.addAttributeProfile("COMBAT", combatProfile);
	hero.addAttributeProfile("COMBAT_BOX", combatBoxProfile);
	hero.addAttributeProfile("ARCHERY", archeryProfile);
	hero.addAttributeProfile("ACROBATICS", acrobaticsProfile);
	hero.addAttributeProfile("PUNISHMENT", punishProfile);
	
	hero.setDamageProfile(getProfile);
    hero.addDamageProfile("COMBAT", {"types": {"BLUNT": 1.0}, "properties": {"HIT_COOLDOWN": 14.5} });
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setModifierEnabled(isModifierEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN" || permission == "USE_GUN");
	
	hero.setTickHandler((entity, manager) => {
		var nbt = entity.getWornChestplate().nbt();
		var drive = nbt.getTagList('Equipment').getCompoundTag(0).getCompoundTag('Item').getCompoundTag('tag');
		var drive_suit_list = drive.getStringList('Suits');
		
		manager.setData(entity, 'fiskheroes:gravity_manip', entity.isSneaking() && !entity.isOnGround() && entity.getData('pwt:dyn/cooldown_6')<1);
		manager.setData(entity, 'fiskheroes:gravity_amount', entity.isSneaking() && !entity.isOnGround() ? -1 : 1);
		
		var projectile = entity.getData("pwt:dyn/cycle2");
		
		if (projectile <= 0 || projectile > 3) {
			manager.setData(entity, "pwt:dyn/cycle2", 1)
		}
		
		if (projectile == 1) {
			manager.setBoolean(nbt, 'dart_stunt', true);
		}
		if (projectile == 2) {
			manager.setBoolean(nbt, 'dart_sleeping', true);
		}
		if (projectile == 3) {
			manager.setBoolean(nbt, 'dart_kriptonite', true);
		}
		
		manager.setBoolean(nbt , "ERROR", drive_suit_list.tagCount() == 0 || drive_suit_list.tagCount() > 1 || drive.isEmpty() ||nbt.getTagList('Equipment').getCompoundTag(0).getByte('Index') != 0 || nbt.getTagList('Equipment').tagCount() == 0);
		if (nbt.getBoolean('ERROR') == false) {
			
			if (entity.getData('pwt:dyn/hacking_cooldown') == 1) {
				manager.setData(entity, 'pwt:dyn/hacking', false)
			}
			manager.incrementData(entity, "pwt:dyn/hacking_cooldown", 1, 30, entity.getData('pwt:dyn/hacking'))
			
			if ( nbt.getStringList('prev_data').getString(0) != drive.getStringList('Suits').getString(0))	{
				manager.setBoolean(nbt, "ARCHERY", false);
				manager.setBoolean(nbt, "COMBAT", false);
				manager.setBoolean(nbt, "GUN", false);
				manager.setBoolean(nbt, "ACROBATICS", false);
			}
		}
		else {
			manager.setBoolean(nbt, "ARCHERY", false);
			manager.setBoolean(nbt, "COMBAT", false);
			manager.setBoolean(nbt, "GUN", false);
			manager.setBoolean(nbt, "ACROBATICS", false);
		}
		
		if (entity.isPunching() && entity.getPunchTimer()==0.0) {
			manager.setData(entity, 'pwt:dyn/counter', entity.getData('pwt:dyn/counter') == 1 ? 0 : entity.getData('pwt:dyn/counter')  + 1)
		}
		
		manager.setData(entity, 'pwt:dyn/toggle_1', false)
		
		manager.incrementData(entity, "pwt:dyn/levitate_timer", 6, entity.getData("fiskheroes:gravity_manip") && !entity.isOnGround());
		ban.tick(entity, manager);
	});
	
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return true;
    default:
        return false;
    }
}

function empty(player, manager) {
    return true;
}

function skill_toggle(player, manager) {
    var nbt = player.getWornChestplate().nbt();
	var drive = nbt.getTagList('Equipment').getCompoundTag(0).getCompoundTag('Item').getCompoundTag('tag');
	var drive_suit_list = drive.getStringList('Suits');
	var suit = drive_suit_list.getString(0).split(':')[1];
	
	manager.setBoolean(nbt, "ARCHERY", false);
	manager.setBoolean(nbt, "COMBAT", false);
	manager.setBoolean(nbt, "GUN", false);
	manager.setBoolean(nbt, "ACROBATICS", false);
	if (drive_suit_list.getString(0) != "pwt:batman_cyberpunk") {
		///for (var i = 0; i < domain.length; i++) {
			Object.keys(archery).forEach((key) => {
				if (suit.match(archery[key])!=null) {
					manager.setBoolean(nbt, "ARCHERY", true);
				}
			});
			Object.keys(combat).forEach((key) => {
				if (suit.match(combat[key])!=null) {
					manager.setBoolean(nbt, "COMBAT", true);
				}
			});
			Object.keys(gun).forEach((key) => {
				if (suit.match(gun[key])!=null) {
					manager.setBoolean(nbt, "GUN", true);
				}
			});
			Object.keys(acrobatics).forEach((key) => {
				if (suit.match(acrobatics[key])!=null) {
					manager.setBoolean(nbt, "ACROBATICS", true);
				}
			});
			Object.keys(spodermen).forEach((key) => {
				if (suit.match(spodermen[key])!=null) {
					player.playSound("fiskheroes:batfish.death", 1.0, (0.7 + Math.random() * 0.1));
				}
			});
		///}
	}
	
	manager.setTagList(nbt, "prev_data", drive_suit_list);
	
	manager.setData(player, "pwt:dyn/hacking", (!nbt.getBoolean('ARCHERY') && !nbt.getBoolean('COMBAT') && !nbt.getBoolean('GUN') && !nbt.getBoolean('ACROBATICS')));
    return true;
}

function cycle_projectile(player, manager) {
    var nbt = player.getWornChestplate().nbt();
	
	var cycle2 = player.getData("pwt:dyn/cycle2");

	

	if (!player.isSneaking() ) {
		manager.setData(player, 'pwt:dyn/cycle2', cycle2 == 3 ? 1 : cycle2 + 1 );
	}
	
	if (player.isSneaking() ) {
		
		manager.setData(player, 'pwt:dyn/cycle2', cycle2 == 1 ? 3 : cycle2-1 );
	}
	
	manager.setBoolean(nbt, 'missile', false);
	manager.setBoolean(nbt, 'dart_stunt', false);
	manager.setBoolean(nbt, 'dart_sleeping', false);
	manager.setBoolean(nbt, 'dart_kriptonite', false);
		
	player.playSound("pwt:modifier.tracking.on", 1.0, (0.7 + Math.random() * 0.1));

    return true;
}

function combatProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
	profile.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 7.0, 0);
	profile.addAttribute("SPRINT_SPEED", 0.3, 1);
}

function combatBoxProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
	profile.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 7.0, 0);
	profile.addAttribute("SPRINT_SPEED", -0.23, 1);
}

function archeryProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BOW_DRAWBACK", 0.5, 1);
}

function acrobaticsProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", 1.2, 0);
    profile.addAttribute("FALL_RESISTANCE", 12.0, 0);
	profile.addAttribute("SPRINT_SPEED", 0.4, 1);
	profile.addAttribute("STEP_HEIGHT", 0.5, 0);
}

function punishProfile(profile) {
    profile.revokeAugments();
	profile.addAttribute("MAX_HEALTH", -10000000.0, 0);

}

function getProfile(entity) {
	if (entity.getData('pwt:dyn/punishment')) {
        return "PUNISHMENT";
    }
	
    if (entity.getData("pwt:dyn/combat_cooldown") == 1) {
		var held_item = (entity.getHeldItem().isEmpty() || entity.getHeldItem().name() == 'fiskheroes:tactical_tonfa' || entity.getHeldItem().name() == 'fiskheroes:captain_americas_shield')
		if (entity.isPunching() && held_item) {
			return "COMBAT_BOX";
		}
		else {
			return "COMBAT";
		}
    }
	else if (entity.getData("pwt:dyn/archery_cooldown") == 1) {
        return "ARCHERY";
    }
	else if (entity.getData("pwt:dyn/acrobatics_cooldown") == 1) {
        return "ACROBATICS";
    }
    return null;
}

function isKeyBindEnabled(entity, keyBind) {
	var nbt = entity.getWornChestplate().nbt();
	var drive = nbt.getTagList('Equipment').getCompoundTag(0).getCompoundTag('Item').getCompoundTag('tag');
	var archery = entity.getData('pwt:dyn/archery_cooldown') == 1;
	var combat = entity.getData('pwt:dyn/combat_cooldown') == 1;
	var gun = entity.getData('pwt:dyn/gun_cooldown') == 1;
	var acrobatics = entity.getData('pwt:dyn/acrobatics_cooldown') == 1;
	
    switch (keyBind) {
	case "UTILITY_BELT":
		return !entity.getData('fiskheroes:dyn/nanites') && entity.getHeldItem().name() != "fiskheroes:compound_bow" && !(gun && entity.getHeldItem().isGun());
	case "GUN_RELOAD":
		return gun && entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
	case "func_PROJECTILE_CYCLE":
		return entity.getData('fiskheroes:dyn/nanites') && !(gun && entity.getHeldItem().isGun()) && !(archery && entity.getHeldItem().name() == "fiskheroes:compound_bow");
	case "HORIZONTAL_BOW":
		return archery && entity.getHeldItem().name() == "fiskheroes:compound_bow";
		
	case "func_SKILL":
		return !nbt.getBoolean('ERROR') && !(archery || combat || gun || acrobatics);
		
	case "func_NODATA":
		return !nbt.getBoolean('ERROR') && entity.getData('pwt:dyn/hacking_cooldown') < 1 && entity.getData('pwt:dyn/hacking_cooldown') > 0;
		
	case "func_DOWNLOADED":
		return (archery || combat || gun ||acrobatics) && (nbt.getStringList('prev_data').getString(0) == drive.getStringList('Suits').getString(0));
	case "func_ERROR":
		return nbt.getBoolean('ERROR') && nbt.getTagList('Equipment').getCompoundTag(0).getByte('Index') == 0 && nbt.getTagList('Equipment').tagCount() > 0;
	
	}
	return true;
	
}

function isModifierEnabled(entity, modifier) {
	var nbt = entity.getWornChestplate().nbt();
	var archery = entity.getData('pwt:dyn/archery_cooldown') == 1;
	var combat = entity.getData('pwt:dyn/combat_cooldown') == 1;
	var gun = entity.getData('pwt:dyn/gun_cooldown') == 1;
	var acrobatics = entity.getData('pwt:dyn/acrobatics_cooldown') == 1;
	
    switch (modifier.name()) {
	case "fiskheroes:energy_bolt":
        return false;
	case "fiskheroes:repulsor_blast":
        return modifier.id() == "stunt" == (nbt.getBoolean("dart_stunt") == true) && modifier.id() == "sleeping" == (nbt.getBoolean("dart_sleeping") == true) && modifier.id() == "kriptonite" == (nbt.getBoolean("dart_kriptonite") == true) && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:dyn/nanites");
	case "fiskheroes:equipment":
        return  !entity.getData('fiskheroes:dyn/nanites') && entity.getHeldItem().name() != "fiskheroes:compound_bow" && !(gun && entity.getHeldItem().isGun());
	case "fiskheroes:archery":
        return archery;
	case "fiskheroes:leaping":
        return acrobatics;
    }
	return true;
}

function canAim(entity) {
	var archery = entity.getData('pwt:dyn/archery_cooldown') == 1;
	var combat = entity.getData('pwt:dyn/combat_cooldown') == 1;
	var gun = entity.getData('pwt:dyn/gun_cooldown') == 1;
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:dyn/nanites") && !entity.getData("fiskheroes:gliding") || (gun && (entity.getHeldItem().isGun() || entity.getHeldItem().name() == "fisktag:weapon"));
}