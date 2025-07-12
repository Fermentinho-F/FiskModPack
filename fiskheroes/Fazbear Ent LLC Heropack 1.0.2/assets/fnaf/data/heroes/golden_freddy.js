var jumpscare = implement("fnaf:external/jumpscare");
var ambientSounds = implement("fnaf:external/ambient");

var AMBIENT = ["fnaf:golden.freddy.laugh"]

function init(hero) {
    hero.setName("Golden Freddy");
    hero.setVersion("FNaF");
    hero.setTier(6);
    hero.hide();
    
    hero.setHelmet("Suit");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fnaf:microphone}", true, item => item.nbt().getString("WeaponType") == 'fnaf:microphone');
	
    hero.addPowers("fnaf:ghost_physiology", "fnaf:classic_endo");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", -10.0, 1);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", -1.0, 1);
    hero.addAttribute("BASE_SPEED", -2.0, 1);
	
    hero.setDefaultScale(1.2);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
	
    hero.addKeyBind("TELEPORT", "key.teleport", 2);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 3);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 4);   
    
    hero.addSoundEvent("EQUIP", "fnaf:golden_freddy_glitch");
    
    hero.addSoundOverrides("GOLDEN_FREDDY", {"powers": {"fnaf:classic_endo": {"fiskheroes:transformation": {"ENABLE": ["fnaf:golden_freddy_jumpscare"], "DISABLE": []}}}});

	jumpscare.init(hero, 1, (entity, manager) => {
        ambientSounds.tick(entity, manager, AMBIENT, 1.15 - Math.random() * 0.3);
    }, "\u00A7kIE\u00A7rI\u00A7kT'I\u00A7rT\u00A7k'EIT\u00A7r'\u00A7kST'\u00A7rS\u00A7kMET'S\u00A7rM\u00A7kE'M\u00A7rE\u00A7kIT");

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