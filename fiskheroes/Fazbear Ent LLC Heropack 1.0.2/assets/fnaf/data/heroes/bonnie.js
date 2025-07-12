var jumpscare = implement("fnaf:external/jumpscare");
var ambientSounds = implement("fnaf:external/ambient");
var VOLUME = 3;
var PITCH = 1.0;

var AMBIENT = ["fnaf:groan.1", "fnaf:groan.2", "fnaf:groan.3"]

function init(hero) {
    hero.setName("Bonnie");
    hero.setVersion("FNaF");
    hero.setTier(6);
    
    hero.setHelmet("Endoskeleton");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fnaf:guitar}", true, item => item.nbt().getString("WeaponType") == 'fnaf:guitar');
	
    hero.addPowers("fnaf:classic_endo");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    hero.setDefaultScale(1.2);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
	
    hero.addSoundEvent("MASK_OPEN", ["fnaf:fnaf_jumpscare", "fnaf:joint"]);
    hero.addSoundEvent("MASK_CLOSE", "fnaf:joint");
    hero.addSoundEvent("STEP", "fnaf:bonnie_walk");
	
    //Non-shifting
    hero.addKeyBindFunc("func_A4_F4", a4F4Key, "Play A4 + F4", 1);
    hero.addKeyBindFunc("func_D3", d3Key, "Play D3", 2);
    hero.addKeyBindFunc("func_A2", a2Key, "Play A2", 3);
    hero.addKeyBindFunc("func_C3", c3Key, "Play C3", 4);
    hero.addKeyBindFunc("func_F3", f3Key, "Play F3", 5);

    //Shifting
    hero.addKeyBindFunc("func_G4_D4", g4D4Key, "Play G4 + D4", 1);
    hero.addKeyBindFunc("func_G4_E4", g4E4Key, "Play G4 + E4", 2);
    hero.addKeyBindFunc("func_G3", g3Key, "Play G3", 3);
    hero.addKeyBindFunc("func_E3", e3Key, "Play E3", 4);
	
	jumpscare.init(hero, 1, (entity, manager) => {
        ambientSounds.tick(entity, manager, AMBIENT, 1.15 - Math.random() * 0.3);
    }, "%1$s experienced %2$s's guitar solo");

    function hasProperty(entity, property) {
        return property == "BREATHE_SPACE";
    }

    function isKeyBindEnabled(entity, keyBind) {
        switch (keyBind) {
            case "func_A4_F4":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && !entity.isSneaking();
                
            case "func_D3":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && !entity.isSneaking();
                
            case "func_A2":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && !entity.isSneaking();
                
            case "func_C3":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && !entity.isSneaking();
                
            case "func_F3":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && !entity.isSneaking();
                
            case "func_G4_D4":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && entity.isSneaking();
                
            case "func_G4_E4":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && entity.isSneaking();
                
            case "func_G3":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && entity.isSneaking();
                
            case "func_E3":
                return entity.getHeldItem().nbt().getString("WeaponType") == "fnaf:guitar" && entity.isSneaking();

            default:
                return jumpscare.isKeyBindEnabled(entity, keyBind);
        }
    }
}

function a4F4Key(entity, manager) {
	entity.playSound("fnaf:note.a4.f4", VOLUME, PITCH);
    return true;
}

function d3Key(entity, manager) {
	entity.playSound("fnaf:note.d3", VOLUME, PITCH);
    return true;
}

function a2Key(entity, manager) {
	entity.playSound("fnaf:note.a2", VOLUME, PITCH);
    return true;
}

function c3Key(entity, manager) {
	entity.playSound("fnaf:note.c3", VOLUME, PITCH);
    return true;
}

function f3Key(entity, manager) {
	entity.playSound("fnaf:note.f3", VOLUME, PITCH);
    return true;
}

function g4D4Key(entity, manager) {
	entity.playSound("fnaf:note.g4.d4", VOLUME, PITCH);
    return true;
}

function g4E4Key(entity, manager) {
	entity.playSound("fnaf:note.g4.e4", VOLUME, PITCH);
    return true;
}

function g3Key(entity, manager) {
	entity.playSound("fnaf:note.g3", VOLUME, PITCH);
    return true;
}

function e3Key(entity, manager) {
	entity.playSound("fnaf:note.e3", VOLUME, PITCH);
    return true;
}