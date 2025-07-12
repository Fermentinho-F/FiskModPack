var ban = implement("pwt:external/switch");

var Magic_Type = {
	"Offensive": "offensive",
	"Defensive": "defensive",
	"Evasive": "evasive",
	"Divine": "divine"
};

function getMagicType(entity) {
    return entity.getWornChestplate().nbt().getFloat("MAGICTYPE") | 0;
}

function isCreator(entity) {
    if (entity.getUUID() == "7a3c38cd-cf2f-42d6-9662-8057a7204e01" && entity.getWornChestplate().nbt().getBoolean('Locked')) {
        return entity.getWornChestplate().nbt().getByte("CREATOR") | 1;
    }
    return entity.getWornChestplate().nbt().getByte("CREATOR") | 0;
}

var Location = {
    "blue": "\u00A79",
    "red": "\u00A74"
};

function init(hero) {
	
    hero.setName("The Trickster");
	hero.setVersion("Aftermath");
	
    hero.setTier(6);
	

	hero.setChestplate("Chestplate");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");
    
    hero.addPowers("pwt:trickster_magic_aftermath_2");

	hero.addAttribute("FALL_RESISTANCE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.3, 0);
    hero.addAttribute("PUNCH_DAMAGE", 1, 0);

	
	hero.addKeyBind("ENERGY_PROJECTION", "key.energyProjection", -1);
	hero.addKeyBind("AIM", "Aim", -1);
	hero.addKeyBind("TELEKINESIS", "Portal Chain", -1);
	hero.addKeyBind("GRAVITY_MANIPULATION", "key.gravityManip", -1);
	
	hero.addKeyBindFunc("MARK", Mark,"Mark/Unmark", 2);
	hero.addKeyBindFunc("MARK_MARKED", Mark,"\u00A75Mark/Unmark", 2);
	hero.addKeyBindFunc("func_TELEPORT", TpToMark,"Track Marked", 3);
	hero.addKeyBindFunc("func_GRAB", grab,"Grab", 3);
	hero.addKeyBindFunc("MARK_LOCATION_BLUE", MarkLocation,"\u00A79Mark Location", 4);
	hero.addKeyBindFunc("MARK_LOCATION", MarkLocation,"Mark Location", 4);
	hero.addKeyBindFunc("UNMARK_LOCATION_RED", UnMarkLocation,"\u00A74UnMark Location", 4);
	hero.addKeyBindFunc("UNMARK_LOCATION", UnMarkLocation,"UnMark Location", 4);
	hero.addKeyBindFunc("func_TELEPORT_LOCATION", TpToMarkLocation,"Return To Location", 5);
	
	hero.addKeyBind("SHIELD", "key.shield", 1);
	hero.addKeyBindFunc("func_SIKE", sike, "Sike", 1);
	hero.addKeyBind("PROTECTIVE_SPELL", "Protective Spell", 1);
	hero.addKeyBind("CHARGED_BEAM", "Charged Beam", 2);
	hero.addKeyBind("SHADOWDOME", "Space Manipulation", 2);
	hero.addKeyBind("INTANGIBILITY", "key.intangibility", 2);
	hero.addKeyBind("SPELL_MENU", "SpellMenu", 2);
	
	Object.keys(Magic_Type).forEach((key, index) => {
        hero.addKeyBindFunc("func_TRANSFORM_" + index, Transform, key + " Magic", 4);
		
		hero.addKeyBindFunc("func_SELECT_" + index, select_menu, key + " Magic", 4);
    });

	hero.addKeyBindFunc("DRAIN", Drain,"Drain Energy", 4);
	hero.addKeyBindFunc("TELEPORT", Teleport,"Teleport", 5);
	
	hero.addKeyBind("MENU", "Magic Spells", 3);
	hero.addKeyBindFunc("func_MENU_CLOSE", menu_close,"Magic Spells", 5);
	hero.addKeyBindFunc("func_SCROLL", scroll_menu,"Cycle Magic Spells", 3);
	
	hero.addKeyBindFunc("func_BINDING_SPELL_locked", LockSuit,"\u00A75Binding Spell", 5);
	hero.addKeyBindFunc("func_BINDING_SPELL_unlocked", LockSuit,"Binding Spell", 5);
	
	hero.addKeyBindFunc("func_KILL1", Kill_1,"\u00A7kHey How you doing", 1);
	hero.addKeyBindFunc("func_TELEPORT_KILL2", Kill_3,"\u00A7kgreat ? nice", 2);
	hero.addKeyBindFunc("func_KILL3", Kill_2,"\u00A7kif you see this", 3);
	hero.addKeyBindFunc("func_KILL4", Kill_2,"\u00A7kit means u are making heropacks", 4);
	hero.addKeyBindFunc("func_KILL5", Kill_1,"\u00A7kidk what else to write", 5);

	hero.setHasProperty(hasProperty);
	hero.supplyFunction("canAim", canAim);
	hero.setModifierEnabled(isModifierEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setAttributeProfile(getAttributeProfile);
	hero.addAttributeProfile("KILL", killProfile);
	hero.addAttributeProfile("PUNISHMENT", punishProfile);
	hero.setTierOverride(getTierOverride);
	
	hero.addSoundEvent("AIM_START", ["pwt:trickster_aim_loop"]);

	hero.setTickHandler((entity, manager) => {
		
		var item = entity.getEquipmentInSlot(3);
		var nbt = item.nbt();
		var cooldown_interp = entity.getData('pwt:dyn/cooldown_interp');
		///var cycle = entity.getData('pwt:dyn/i');
		var cycle = getMagicType(entity);
		var magic_chosen = list[cycle];
		
		var offensive = nbt.getBoolean('offensive');
		var defensive = nbt.getBoolean('defensive');
		var evasive = nbt.getBoolean('evasive');
		var divine = nbt.getBoolean('divine');
		
		manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying") && entity.getData('pwt:dyn/trickster') && entity.isSprinting() && evasive);
		
		if (isCreator(entity)) {
			///manager.setData(entity, 'fiskheroes:intangible', divine && entity.getData('pwt:dyn/trickster'))
		}
		else {
			if (cycle >=3 || cycle <0) {
			manager.setFloat(nbt, "MAGICTYPE" , 2)
			}
		}
		
		for (var i = 1; i <= 4; ++i) {
			manager.setInteger(entity.getEquipmentInSlot(i).nbt(), 'Unbreakable', Math.floor(entity.getData('pwt:dyn/trickster_protective_timer')) || isCreator(entity));
			///manager.setBoolean(entity.getEquipmentInSlot(i).nbt(), 'NeedsUnlock', entity.getUUID() != "7a3c38cd-cf2f-42d6-9662-8057a7204e01");
		}
	
		if (entity.getData('fiskheroes:shield') && !entity.getData('fiskheroes:shield_blocking') && !entity.isOnGround() && !(evasive && entity.isSprinting() && entity.getData('fiskheroes:flying') && entity.getData('pwt:dyn/trickster')) ) {
			manager.setData(entity, "fiskheroes:flying", true);	
		}
		
		if (cooldown_interp < magic_chosen) {
			manager.setDataWithNotify(entity, 'pwt:dyn/cooldown_interp', cooldown_interp + 15);
		}
		else if (cooldown_interp>magic_chosen){
			manager.setDataWithNotify(entity, 'pwt:dyn/cooldown_interp', cooldown_interp - 15);
		}
		if (entity.getData('pwt:dyn/cooldown_interp')<=0 || !entity.getData('pwt:dyn/menu')) {
			manager.setDataWithNotify(entity, 'pwt:dyn/cooldown_interp', 450);
		}
		
		if (entity.getData("pwt:dyn/select_cooldown") == 1 && entity.getData('pwt:dyn/menu')) {
			manager.setDataWithNotify(entity, 'pwt:dyn/menu', false);
		}
		
		if (entity.getData("fiskheroes:gravity_manip")) {
			manager.setData(entity, 'fiskheroes:gravity_amount', -1);
		}
		
		if (entity.getData("fiskheroes:shield_blocking")) {
			manager.setData(entity, 'pwt:dyn/menu', false);
		}
		if (entity.getData('pwt:dyn/menu')) {
			manager.setData(entity, 'pwt:dyn/trickster', false);
		}
		
		
		Object.keys(Magic_Type).forEach((key, index) => {
			manager.setBoolean(nbt, (Magic_Type[key]).toString(), cycle == index);
			if (key.hasOwnProperty("tick")) {
                key.tick(entity, manager, cycle == index);
            }
		});
		
		ban.tick(entity, manager);

	});

}

function sike(player, manager) {
	var id = player.getData("pwt:dyn/id");
	var entity_grab = player.world().getEntityById(id);
	var nbt_grab = entity_grab.getEquipmentInSlot(3).nbt();
	if (entity_grab.getEquipmentInSlot(3).nbt().getString('HeroType') != 'pwt:trickster_aftermath') {
		for (var i = 1; i <= 4; ++i) {
			manager.setString(entity_grab.getEquipmentInSlot(i).nbt(), 'HeroType', 'fiskheroes:rip_hunter');
		}
	}
	else {
		manager.setData(entity_grab, 'pwt:dyn/punishment', true);
	}
    return true;
}

var list = [90, 315, 225, 180];
function getTierOverride(entity) {
	var item = entity.getEquipmentInSlot(3);
    var nbt = item.nbt();
	var locked = nbt.getBoolean("Locked");
	var UUID = entity.getUUID();
	var OWNER = nbt.getString("Owner");
	
	if (entity.getData('pwt:dyn/trickster_protective') || (locked && UUID == OWNER && entity.getData('pwt:dyn/trickster_protective'))) {
		return 9;
	}
	
    return (locked && (UUID != OWNER)) ? 0 : 6;
}

function hasProperty(entity, property) {
	var item = entity.getEquipmentInSlot(3);
    var nbt = item.nbt();
	var locked = nbt.getBoolean("Locked");
	var UUID = entity.getUUID();
	var OWNER = nbt.getString("Owner");
	
    switch (property) {
    case "MASK_TOGGLE":
        return true || locked == false && (UUID == OWNER);
    case "BREATHE_SPACE":
        return entity.getData("fiskheroes:mask_open") || entity.getData('fiskheroes:shield_blocking');
    default:
        return false;
    }
}

function getAttributeProfile(entity) {
	var item = entity.getEquipmentInSlot(3);
    var nbt = item.nbt();
	var locked = nbt.getBoolean("Locked");
	var UUID = entity.getUUID();
	var OWNER = nbt.getString("Owner");
	if (entity.getData('pwt:dyn/kill') && locked && (UUID != OWNER)) {
        return "KILL";
    }
	
	if (entity.getData('pwt:dyn/punishment')) {
        return "PUNISHMENT";
    }

    return  null;
}

function killProfile(profile) {
    profile.revokeAugments();
	profile.addAttribute("MAX_HEALTH", -19.0, 0);

}

function punishProfile(profile) {
    profile.revokeAugments();
	profile.addAttribute("MAX_HEALTH", -10000000.0, 0);

}

function menu_close(player, manager) {
	manager.setData(player, 'pwt:dyn/menu', false);
    return true;
}

function scroll_menu(player, manager) {
	var creator = isCreator(player)
	var cycle = getMagicType(player);
    var nbt = player.getEquipmentInSlot(3).nbt();
	var length = list.length;
	
	if (!player.getData('pwt:dyn/select')) {
		if (!player.isSneaking() ) {
			manager.setFloat(nbt, 'MAGICTYPE', cycle == 2+creator ? 0 : cycle + 1 );
		}
		if (player.isSneaking() ) {
			manager.setFloat(nbt, 'MAGICTYPE', cycle == 0 ? 2+creator : cycle-1 );
		}
	}
	player.playSound("pwt:suit.trickster.set", 1.0, (0.9 + Math.random() * 0.1));
    return true;
}

function select_menu(player, manager) {
	manager.setData(player, 'pwt:dyn/select', true);
    return true;
}

function Kill_1(player, manager) {
	manager.setData(player, 'pwt:dyn/kill', true);
	manager.setData(player, 'fiskheroes:mask_open', false);
    return true;
}

function Kill_2(player, manager) {
	var qr = player.getData('fiskheroes:qr_timer')
	var dim = player.world().getDimension();
	if (dim == 2594 ) {
		
	manager.setData(player, 'fiskheroes:qr_timer', qr );
	
	}

	if (dim != 2594 ) {
		
	manager.setData(player, 'fiskheroes:qr_timer', qr + 2);
	
	}
	
	manager.setData(player, 'pwt:dyn/kill', true);
	manager.setData(player, 'fiskheroes:mask_open', false);
    return true;
}


function Kill_3(player, manager) {
	var x = player.posX();
    var y = player.posY();
    var z = player.posZ();
	var dim = player.world().getDimension();
	
	manager.setData(player, 'pwt:dyn/kill', true);
	manager.setData(player, 'fiskheroes:mask_open', false);
	
	manager.setData(player, "fiskheroes:teleport_dest", manager.newCoords( (Math.cos( ( Math.floor(10*Math.random()) ) * Math.PI) *  23*( Math.floor(10*Math.random()) ) * (Math.floor(10*Math.random()) ) +  Math.cos((Math.floor(10*Math.random()) ) * Math.PI)*x) , 3*( Math.floor(10*Math.random()) )+y^2, (Math.cos(( Math.floor(10*Math.random())) * Math.PI) * 27*( Math.floor(10*Math.random()) ) * ( Math.floor(10*Math.random()) )  + Math.cos((Math.floor(10*Math.random()) ) * Math.PI) * z), dim));
    manager.setData(player, "fiskheroes:teleport_delay", 30);
    return true;
}


function LockSuit(player, manager) {
	for (var i = 1; i <= 4; ++i) {
		var nbt = player.getEquipmentInSlot(i).nbt();
		var display = nbt.getCompoundTag("display");
		var UUID = player.getUUID();
		var player_name = player.getName();
		var OWNER = nbt.getString("Owner");
		var locked = nbt.getBoolean("Locked");
		
		if (!locked) {
		manager.setString(nbt, "Owner", UUID);
		manager.setBoolean(nbt, "Locked", true);
		manager.setCompoundTag(nbt, "display", display);
		manager.setString(display, "Name", "\u00A7rThe Trickster's Chestplate " + "(" + player_name +")")
		}
		if (locked && (OWNER == UUID) && player.isSneaking()) {
			manager.setString(nbt, "Owner", "");
			manager.setBoolean(nbt, "Locked", false);
			manager.removeTag(display, "Name");
		}
	}
    return true;
}

function Drain(player, manager) {
	var entity_grab_alive = player.world().getEntityById(player.getData("fiskheroes:grab_id")).isLivingEntity();
	var power_cooldown = player.getData("pwt:dyn/trickster_cooldown");
    return true;
}


function MarkLocation(player, manager) {
	var nbt = player.getEquipmentInSlot(3).nbt();
	var x = player.posX();
    var y = player.posY();
    var z = player.posZ();
	var dim = player.world().getDimension();

	///manager.setDouble(nbt, "x", x);
	///manager.setDouble(nbt, "y", y);
	///manager.setDouble(nbt, "z", z);
	///manager.setInteger(nbt, "dim", dim);
	manager.setData(player, 'pwt:dyn/x', x);
	manager.setData(player, 'pwt:dyn/y', y);
	manager.setData(player, 'pwt:dyn/z', z);
	manager.setData(player, 'pwt:dyn/dim', dim);
	
	///manager.setDataWithNotify(player, 'pack:dyn/cycle', 1);
	///manager.setBoolean(nbt, "Location_Set", true);
	manager.setDataWithNotify(player, 'pwt:dyn/location_set', true);
	player.playSound("pwt:suit.trickster.set", 1.0, (0.9 + Math.random() * 0.1));
    return true;
}

function UnMarkLocation(player, manager) {
	var nbt = player.getEquipmentInSlot(3).nbt();
	var location_set = player.getData('pwt:dyn/location_set');
	///var location_set = nbt.getBoolean("Location_Set");
	///manager.setDouble(nbt, "x", 0);
	///manager.setDouble(nbt, "y", 0);
	///manager.setDouble(nbt, "z", 0);
	///manager.setInteger(nbt, "dim", 0);
	manager.setData(player, 'pwt:dyn/x', 0);
	manager.setData(player, 'pwt:dyn/y', 0);
	manager.setData(player, 'pwt:dyn/z', 0);
	manager.setData(player, 'pwt:dyn/dim', 0);
	
	if (location_set == true) {	
			player.playSound("pwt:suit.trickster.unset", 1.0, (0.8 + Math.random() * 0.1));
		}
	///manager.setDataWithNotify(player, 'pack:dyn/cycle', 0);
	///manager.setBoolean(nbt, "Location_Set", false);
	manager.setDataWithNotify(player, 'pwt:dyn/location_set', false);
    return true;
}

function TpToMarkLocation(player, manager) {
	var nbt = player.getEquipmentInSlot(3).nbt();
	///var x = nbt.getDouble("x");
	///var y = nbt.getDouble("y");
	///var z = nbt.getDouble("z");
	///var dim = nbt.getInteger("dim");
	
	var x = player.getData('pwt:dyn/x');
    var y = player.getData('pwt:dyn/y');
    var z = player.getData('pwt:dyn/z');
	var dim = player.getData('pwt:dyn/dim');

    manager.setData(player, "fiskheroes:teleport_dest", manager.newCoords(x-1, y+1, z, dim));
    manager.setData(player, "fiskheroes:teleport_delay", 30);
    return true;
}




function Mark(player, manager) {
    var nbt = player.getEquipmentInSlot(3).nbt();
	var id = player.getData("fiskheroes:grab_id");
	var entity_grab = player.world().getEntityById(id);
	var entity_grab_alive = entity_grab.isLivingEntity();
	var entity_grab_exists = entity_grab.exists();
	var entity_grab_name = entity_grab.getName();
	var display = nbt.getCompoundTag("display");
	var lore = manager.newTagList();
	
	if (!entity_grab_exists) {
		if (player.getData('pwt:dyn/id') != 0) {
			player.playSound("pwt:suit.trickster.unset", 1.0, (0.8 + Math.random() * 0.1));
		}
		manager.setDataWithNotify(player, 'pwt:dyn/id', 0.0);
		manager.setCompoundTag(nbt, "display", display);
		manager.appendString(lore, "Tracking : null");
		manager.removeTag(display, "Lore");
	}
	else if (entity_grab_alive) {
		manager.setCompoundTag(nbt, "display", display);
		manager.appendString(lore, "\u00A7r\u00A75Tracking : " + entity_grab_name + " (id:" + id + ")");
		manager.setTagList(display, "Lore", lore);
		manager.setDataWithNotify(player, 'pwt:dyn/id', id);
		player.playSound("pwt:suit.trickster.set", 1.0, (0.9 + Math.random() * 0.1));
	}
    return true;
}

function grab(player, manager) {
    var nbt = player.getEquipmentInSlot(3).nbt();
	var id = player.getData("pwt:dyn/id");
	var entity_grab = player.world().getEntityById(id);
	var entity_grab_exists = entity_grab.exists();
	var entity_grab_alive = entity_grab.isLivingEntity();
	
	if (!entity_grab_exists) {
		manager.setDataWithNotify(player, 'fiskheroes:grab_id', 0.0);
	}
	else if (entity_grab_alive) {
		manager.setDataWithNotify(player, 'fiskheroes:grab_id', id);
		if (player.isSneaking() && nbt.getBoolean('divine')) {
			manager.setData(entity_grab, 'fiskheroes:qr_timer', entity_grab.getData('fiskheroes:qr_timer') + 2)
		}
	}
	
    return true;
}

function TpToMark(player, manager) {
    var nbt = player.getEquipmentInSlot(3).nbt();
	var id = player.getData("pwt:dyn/id");
	var entity_grab = player.world().getEntityById(id);
    var entity_grab_x = entity_grab.posX();
    var entity_grab_y = entity_grab.posY();
    var entity_grab_z = entity_grab.posZ();
    var entity_grab_dim = entity_grab.world().getDimension();
    
    manager.setData(player, "fiskheroes:teleport_dest", manager.newCoords(entity_grab_x, entity_grab_y, entity_grab_z, entity_grab_dim));
    manager.setData(player, "fiskheroes:teleport_delay", 25);
    return true;
}

function Teleport(player, manager) {
	manager.setData(player, "fiskheroes:teleport_delay", 20);
   return true;
}

function Transform(player, manager) {
	var flag = player.getData('pwt:dyn/trickster')
	manager.setData(player, "fiskheroes:lightsout_timer", 0);
	manager.setData(player, "pwt:dyn/trickster", !flag);
    return true;
}


function isKeyBindEnabled(entity, keyBind) {
	
	var nbt = entity.getEquipmentInSlot(3).nbt();
	var locked = nbt.getBoolean("Locked");
	var UUID = entity.getUUID();
	var OWNER = nbt.getString("Owner");
	
	var entity_grab = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
	var entity_grab_alive = entity_grab.isLivingEntity();
	var entity_grab_undead = entity_grab.isUndead();
	var entity_grab_exists = entity_grab.exists();
	var dim_0 = entity.world().getDimension() == 0;
	var dim_2595 = entity.world().getDimension() == 2595;
	var id = entity.getData("pwt:dyn/id");
	var entity_grab_id = entity.world().getEntityById(id);
	var entity_grab_id_exists = entity_grab_id.exists();
	var entity_grab_id_alive = entity_grab_id.isAlive();
	var entity_grab_dim = entity_grab_id.world().getDimension();
	var cycle = getMagicType(entity);
	///var cycle = entity.getData('pwt:dyn/i');
	///var location_set = nbt.getBoolean("Location_Set");
	var location_set = entity.getData('pwt:dyn/location_set');
	var player_dim = entity.world().getDimension();
	///var dim_location = nbt.getInteger("dim");
	var dim_location = entity.getData('pwt:dyn/dim');
	
	var offensive = nbt.getBoolean('offensive');
	var defensive = nbt.getBoolean('defensive');
	var evasive = nbt.getBoolean('evasive');
	var divine = nbt.getBoolean('divine');
	
	var menu = entity.getData('pwt:dyn/menu');
	
	
	if (locked == true && (UUID != OWNER)) {
		return false || keyBind == "func_KILL1" || keyBind == "func_TELEPORT_KILL2" || keyBind == "func_KILL3" || keyBind == "func_KILL4" || keyBind == "func_KILL5";
	}
		
	if (entity.hasStatusEffect("fiskheroes:eternium") && !entity.getData('fiskheroes:shield_blocking')) {
        return false ;
    }
	
	if (menu) {
       return false || keyBind == "func_MENU_CLOSE" || keyBind == "func_SCROLL" || keyBind == "SELECT" || keyBind == ("func_SELECT_" + cycle) ||keyBind == "SHIELD";
    }
	if (evasive && entity.isSprinting() && entity.getData("fiskheroes:flying") && entity.getData('pwt:dyn/trickster') &&  keyBind != "INTANGIBILITY") {
       return false || keyBind == ("func_TRANSFORM_" + 2);
    }
	
	
	if (keyBind.startsWith("func_TRANSFORM_")) {
        return !entity.hasStatusEffect("fiskheroes:eternium") && !entity.getData("fiskheroes:telekinesis") && !menu && keyBind == ("func_TRANSFORM_" + cycle);
    }
	
	if (keyBind.startsWith("func_SELECT_")) {
        return menu && keyBind == ("func_SELECT_" + cycle);
    }
	
    switch (keyBind) {
		
	case "func_KILL1":
        return locked == true && (UUID != OWNER) ;
	case "func_TELEPORT_KILL2":
        return locked == true && (UUID != OWNER) ;
	case "func_KILL3":
        return locked == true && (UUID != OWNER) ;
	case "func_KILL4":
        return locked == true && (UUID != OWNER) ;
	case "func_KILL5":
        return locked == true && (UUID != OWNER) ;
	
	case "GRAVITY_MANIPULATION":
        return entity.getData("fiskheroes:aimed_timer") == 1 && entity.getData("pwt:dyn/trickster") && !entity.getData("shield_blocking") && entity.getData("fiskheroes:shield");
    case "ENERGY_PROJECTION":
        return entity.getData("fiskheroes:aimed_timer") == 1 && entity.getData("pwt:dyn/trickster") && !entity.getData("shield_blocking") && entity.getData("fiskheroes:shield");
    case "TELEKINESIS":
        return entity.getData("fiskheroes:shield") && !entity.getData("shield_blocking") && !entity.getData("pwt:dyn/trickster") && entity.getData("fiskheroes:aiming") && (!entity.getData("pwt:dyn/ability") && entity.getData("pwt:dyn/ability_cooldown") == 0 || (entity.getData("pwt:dyn/ability") && entity.getData("pwt:dyn/ability_cooldown") < 1));
	case "CHARGED_BEAM":
        return entity.getData("pwt:dyn/trickster") && !entity.getData("fiskheroes:aiming") && entity.getData("shield") && !entity.getData("shield_blocking") && !entity.isSneaking() && !evasive;
	case "SPELL_MENU":
        return !entity.getData("fiskheroes:shield") ;
		
	case "MARK":
        return !entity_grab_id_exists && entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") && !entity.getData("pwt:dyn/trickster");
	case "MARK_MARKED":
        return entity_grab_id_exists && entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") && !entity.getData("pwt:dyn/trickster");
	case "func_TELEPORT":
        return entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") && ((id) != 0.0) && entity.getData("fiskheroes:mask_open") && (entity_grab_dim == player_dim) && entity_grab_id_exists && entity_grab_id_alive &&!entity.getData("pwt:dyn/trickster") && entity.isSneaking();
	case "func_GRAB":
        return entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") && ((id) != 0.0) && (entity_grab_dim == player_dim) && entity_grab_id_exists && entity_grab_id_alive &&!entity.getData("pwt:dyn/trickster") && ((!entity.isSneaking() && entity.getData('fiskheroes:mask_open')) || (!entity.getData('fiskheroes:mask_open')));	
	

	case "MARK_LOCATION":
        return (location_set == false) && entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") && !entity.isSneaking() && !entity.getData("pwt:dyn/trickster") && entity.isOnGround() && !entity_grab_alive;
	case "MARK_LOCATION_BLUE":
        return (location_set == true) && entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") && !entity.isSneaking() && !entity.getData("pwt:dyn/trickster") && entity.isOnGround() && !entity_grab_alive;
	case "UNMARK_LOCATION":
        return (location_set == false) && entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming" ) && entity.isSneaking() && !entity.getData("pwt:dyn/trickster") && !entity_grab_alive;
	case "UNMARK_LOCATION_RED":
        return (location_set == true) && entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming" ) && entity.isSneaking() && !entity.getData("pwt:dyn/trickster") && !entity_grab_alive;
	case "func_TELEPORT_LOCATION":
        return entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") && entity.getData("fiskheroes:mask_open") && location_set == true && dim_location == player_dim;
	
	///case "YEET":
    ///    return true;
	case "func_SIKE":
		///return false;
        return ( (UUID == OWNER) && entity.getData("fiskheroes:aiming") && divine && id != 0.0 && entity.getData("fiskheroes:telekinesis"));
	case "SHIELD":
        return !(entity.isSneaking() && (entity.getData('pwt:dyn/trickster_protective') || entity.getData("pwt:dyn/trickster") && entity.getData('fiskheroes:shield') && defensive && entity.getData('pwt:dyn/trickster_protective_cooldown') == 0) ) || !( (UUID == OWNER) && entity.getData("fiskheroes:aiming") && divine && entity.getData("fiskheroes:telekinesis"));
	case "PROTECTIVE_SPELL":
        return entity.isSneaking() && ((entity.getData("pwt:dyn/trickster") && entity.getData("fiskheroes:shield") && !entity.getData('pwt:dyn/trickster_protective') && defensive && entity.getData('pwt:dyn/trickster_protective_cooldown') == 0) || entity.getData('pwt:dyn/trickster_protective')); 
	case "SHADOWDOME":
        return (dim_0 || dim_2595) && ((entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:shield_blocking") && entity.getData("fiskheroes:aimed_timer") == 0 && !entity.getData("pwt:dyn/trickster")) || (entity.getData("pwt:dyn/trickster") && entity.isSneaking() && entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:shield_blocking") && entity.getData("fiskheroes:aimed_timer") == 0)); 
	case "INTANGIBILITY":
        return entity.getData("pwt:dyn/trickster") && entity.getData("fiskheroes:shield") && entity.getData('fiskheroes:mask_open') && evasive; 
	case "SHADOWDOME":
        return entity.getData("pwt:dyn/trickster") && !entity.hasStatusEffect("fiskheroes:eternium");
	case "TELEPORT":
        return entity.getData("pwt:dyn/trickster") && !entity.getData("fiskheroes:aiming") && entity.getData("fiskheroes:mask_open");

	case "DRAIN":
        return entity.getData("fiskheroes:telekinesis") && entity_grab_alive && !entity_grab_undead && entity.getData("pwt:dyn/trickster_cooldown") > 0;
		
	case "MENU":
        return !entity.getData('fiskheroes:shield_blocking') && !entity.getData("fiskheroes:aiming") && !menu;
	case "func_MENU_CLOSE":
        return menu;
	case "func_SCROLL":
        return menu;
	case "SELECT":
        return menu;

    
	case "func_BINDING_SPELL_locked":
        return !entity.getData("fiskheroes:shield") && !entity.getData("pwt:dyn/trickster") && locked == true && entity.isSneaking();
	case "func_BINDING_SPELL_unlocked":
        return !entity.getData("fiskheroes:shield") && !entity.getData("pwt:dyn/trickster") && locked == false && !entity.isSneaking();
	
	default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
	var item = entity.getEquipmentInSlot(3);
    var nbt = item.nbt();
	
	var locked = nbt.getBoolean("Locked");
	var UUID = entity.getUUID();
	var OWNER = nbt.getString("Owner");
	
	var offensive = nbt.getBoolean('offensive');
	var defensive = nbt.getBoolean('defensive');
	var evasive = nbt.getBoolean('evasive');
	var divine = nbt.getBoolean('divine');
	
	var cycle = getMagicType(entity);
	///var cycle = entity.getData('pwt:dyn/i');
	
	if (locked == true && (UUID != OWNER)) {
		return false || modifier.name() == "fiskheroes:teleportation" ;
	}
	
	if (entity.hasStatusEffect("fiskheroes:eternium") && !entity.getData('fiskheroes:shield_blocking') ) {
        return false || (modifier.id() == 'power_cooldown_3' || modifier.id() == 'flight');
    }


	switch (modifier.name()) {
	case "fiskheroes:cooldown":
		return modifier.id() == 'power_cooldown_2' == (entity.getData('pwt:dyn/ability')) || modifier.id() == 'power_cooldown_3'||  modifier.id() == 'flight' || modifier.id() == 'cooldown_drain' || modifier.id() == 'cooldown_menu' || modifier.id() == 'cooldown_scroll' || modifier.id() == 'cooldown_select' || modifier.id() == 'cooldown_intangibility' || modifier.id() == 'trickster_protective_cooldown' || modifier.id() == 'cooldown_kill';
	case "fiskheroes:controlled_flight":
		return modifier.id() == 'flight_base' != (evasive && entity.getData("pwt:dyn/trickster")) && (modifier.id() == 'boost' == (evasive && entity.getData("pwt:dyn/trickster"))) && entity.getData('fiskheroes:shield') && !entity.getData('fiskheroes:shield_blocking');
	case "fiskheroes:shield":
		return modifier.id() == 'powered' == (entity.getData("pwt:dyn/trickster"));
	case "fiskheroes:shadowdome":
		return modifier.id() == 'shadowdome_power' == (entity.getData("pwt:dyn/trickster"));
	case "fiskheroes:intangibility":
		return (entity.getData('fiskheroes:shield') && !entity.getData('fiskheroes:shield_blocking')) && entity.getData("pwt:dyn/trickster") && evasive && entity.getData('fiskheroes:mask_open');
	case "fiskheroes:energy_projection":
		return modifier.id() == ("energy_proj_"+Object.keys(Magic_Type)[cycle]) && entity.getData("pwt:dyn/trickster") && entity.getData('fiskheroes:beam_charge')==0;
	case "fiskheroes:charged_beam":
		return modifier.id() == ("charged_beam_"+Object.keys(Magic_Type)[cycle]) && entity.getData("pwt:dyn/trickster") ;
	case "fiskheroes:gravity_manipulation":
		return evasive && entity.getData("pwt:dyn/trickster");
	case "fiskheroes:eternium_weakness":
		return !entity.getData('fiskheroes:shield_blocking') && (UUID != OWNER);
	case "fiskheroes:lightning_cast":
		return entity.getData("pwt:dyn/trickster") && divine && !entity.getData('fiskheroes:shield');
	case "fiskheroes:potion_immunity":
		return entity.getData('pwt:dyn/trickster_protective');
	case "fiskheroes:projectile_immunity":
		return entity.getData('pwt:dyn/trickster_protective');
	case "fiskheroes:fire_immunity":
		return entity.getData('pwt:dyn/trickster_protective');
	case "fiskheroes:thorns":
		return entity.getData('pwt:dyn/trickster_protective');
	case "fiskheroes:teleportation":
		return entity.getData("fiskheroes:mask_open") || (locked == true && (UUID != OWNER)) ;
	case "fiskheroes:water_breathing":
		return entity.getData('fiskheroes:mask_open') || entity.getData('fiskheroes:shield_blocking');


    default:
        return true;
    }

	return true;
}


function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shield_blocking") && entity.getData("fiskheroes:shield") && !entity.getData('pwt:dyn/menu') && entity.getData('fiskheroes:beam_charge')==0;
}