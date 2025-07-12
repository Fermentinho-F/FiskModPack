var jumpscare = implement("fnaf:external/jumpscare");
var ambientSounds = implement("fnaf:external/ambient");

var AMBIENT = ["fnaf:foxy.sing.1", "fnaf:foxy.sing.2", "fnaf:foxy.sing.3"]

function init(hero) {
    hero.setName("Foxy");
    hero.setVersion("FNaF");
    hero.setTier(6);
    
    hero.setHelmet("Endoskeleton");
	
    hero.addPowers("fnaf:classic_endo");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
	
    hero.setDefaultScale(1.2);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("HOOK", hookProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("HOOK", {"types": {"SHARP": 1.0}});
	
    hero.addSoundEvent("MASK_OPEN", ["fnaf:fnaf_jumpscare", "fnaf:joint"]);
    hero.addSoundEvent("MASK_CLOSE", "fnaf:joint");
    hero.addSoundEvent("STEP", "fnaf:foxy_walk");
	
	jumpscare.init(hero, 1, (entity, manager) => {
        ambientSounds.tick(entity, manager, AMBIENT, 1.0);
    }, "%1$s did not pay enough attention to Pirate's Cove");

    function hookProfile(profile) {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    }
    
    function getProfile(entity) {
        return entity.getHeldItem().isEmpty() ? "HOOK" : null;
    }

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