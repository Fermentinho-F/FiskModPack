var jumpscare = implement("fnaf:external/jumpscare");
var ambientSounds = implement("fnaf:external/ambient");

var AMBIENT = ["fnaf:freddy.laugh.1", "fnaf:freddy.laugh.2", "fnaf:freddy.laugh.3"]

function init(hero) {
    hero.setName("Freddy Fazbear");
    hero.setVersion("FNaF");
    hero.setTier(6);
    
    hero.setHelmet("Endoskeleton");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fnaf:microphone}", true, item => item.nbt().getString("WeaponType") == 'fnaf:microphone');
	
    hero.addPowers("fnaf:music_box", "fnaf:classic_endo");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

	hero.addKeyBind("MUSIC_BOX", "Wind Music Box", 2);
	
    hero.setDefaultScale(1.2);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("MUSIC_BOX", musicBoxProfile);
    hero.setAttributeProfile(getProfile);
    hero.addDamageProfile("MUSIC_BOX", {
        "types": {
            "FEAR": 1.0
        },
        "properties": {
          "REDUCE_KNOCKBACK": 1,
          "EFFECTS": [
            {
              "id": "minecraft:blindness",
              "duration": 15,
              "amplifier": 2,
              "chance": 1.0
            },
            {
              "id": "minecraft:slowness",
              "duration": 15,
              "amplifier": 5,
              "chance": 1.0
            }
          ]
        }
    });
	
    hero.addSoundEvent("STEP", "fnaf:freddy_walk");
	
	jumpscare.init(hero, 1, (entity, manager) => {
        //music box
        if (entity.getData("fnaf:dyn/music_box")) {
            var list = entity.world().getEntitiesInRangeOf(entity.pos(), 10);
            list.forEach(other => {
                if (other.isLivingEntity() && !other.equals(entity) && isLookingAtTarget(entity, other, 30, 5)) {
                        other.hurtByAttacker(hero, "MUSIC_BOX", "%1$s ran out of power", 1.0, entity);
                }
            });
        }

        //ambient sounds
        ambientSounds.tick(entity, manager, AMBIENT, 1.15 - Math.random() * 0.3);

		var suit = entity.getWornHelmet();
		var nbt = suit.nbt();
        
		if(PackLoader.getSide() === "SERVER" && nbt.getBoolean("worn") == false) {
			var randomVal = Math.floor(Math.random() * 10);
			if (randomVal % 10 == 0) {
                for (i = 0; i < 15; i++) {
                    entity.as("PLAYER").addChatMessage("\u00A7kIE\u00A7rI\u00A7kT'I\u00A7rT\u00A7k'EIT\u00A7r'\u00A7kST'\u00A7rS\u00A7kMET'S\u00A7rM\u00A7kE'M\u00A7rE\u00A7kIT");
                }
                manager.setBoolean(nbt, "NeedsUnlock", false);
                if (entity.getWornHelmet().suitType() == 'fnaf:freddy_fazbear/movie') {
				    manager.setString(nbt, "HeroType", "fnaf:golden_freddy/movie")
                } else {
				    manager.setString(nbt, "HeroType", "fnaf:golden_freddy")
                }
			}
			manager.setBoolean(nbt, "worn", true);
		}
    }, "%1$s got stuffed into %2$s's spare suit");

    function hasProperty(entity, property) {
        return property == "BREATHE_SPACE";
    }

    function isKeyBindEnabled(entity, keyBind) {
        switch (keyBind) {
            case "MUSIC_BOX":
                return !entity.getData("fnaf:dyn/jumpscare")
            default:
                return jumpscare.isKeyBindEnabled(entity, keyBind);
        }
    }
}

function isLookingAtTarget(entity, other, angleRange, eyeRadius) {
    var otherEye = other.eyePos();
    var entityEye = entity.eyePos();

    var distance = otherEye.distanceTo(entityEye);

    if (distance > eyeRadius) {
        return false;
    }

    var targetDirection = otherEye.subtract(entityEye).normalized();
    var dotProduct = Math.max(-1, Math.min(1, entity.getLookVector().dot(targetDirection)));
    var angle = Math.acos(dotProduct) * (180 / Math.PI);

    return Math.abs(angle) < angleRange;
}

function musicBoxProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.5, 1);
}

function getProfile(entity) {
    return entity.getData("fnaf:dyn/music_box") ? "MUSIC_BOX" : null;
}
