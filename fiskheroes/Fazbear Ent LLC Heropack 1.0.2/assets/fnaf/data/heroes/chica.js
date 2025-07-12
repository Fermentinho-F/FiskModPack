var jumpscare = implement("fnaf:external/jumpscare");
var ambientSounds = implement("fnaf:external/ambient");

var AMBIENT = ["fnaf:groan.1", "fnaf:groan.2", "fnaf:groan.3"]

function init(hero) {
    hero.setName("Chica");
    hero.setVersion("FNaF");
    hero.setTier(6);
    
    hero.setHelmet("Endoskeleton");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fnaf:mr_cupcake}", true, item => item.nbt().getString("WeaponType") == 'fnaf:mr_cupcake');
	
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
    hero.addSoundEvent("STEP", "fnaf:chica_walk");
	
	
	jumpscare.init(hero, 1, (entity, manager) => {
        ambientSounds.tick(entity, manager, AMBIENT, 1.15 - Math.random() * 0.3);
    }, "%1$s was mistaken for %2$s's pizza");

    function hasProperty(entity, property) {
        return property == "BREATHE_SPACE";
    }

    function isKeyBindEnabled(entity, keyBind) {
        switch (keyBind) {
        default:
            return jumpscare.isKeyBindEnabled(entity, keyBind);
        }
    }
}