var speedster_base = implement("fiskheroes:external/speedster_base");

var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Slipstream");
    hero.setTier(8);

    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");

    hero.addPowers("moopack:jade_speed_force_powerup");
    hero.addPowers("moopack:negative_speed_force_powerup");
    hero.addPowers("moopack:void_speed_force_powerup");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);

    hero.addKeyBind("JADE", "Toggle Jade Speed Force", 3);
    hero.addKeyBind("VOID", "Toggle Void Speed Force", 4);
    hero.addKeyBind("NEGATIVE", "Toggle Negative Speed Force", 5);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "SUPER_SPEED":
            return entity.getData("moopack:dyn/speed_dna_active") || entity.getData("moopack:dyn/cosmic_dna_active") || entity.getData("moopack:dyn/mutant_dna_active");
        case "SLOW_MOTION":
            return entity.getData("moopack:dyn/speed_dna_active") || entity.getData("moopack:dyn/cosmic_dna_active") || entity.getData("moopack:dyn/mutant_dna_active");

            case "JADE":
                return !entity.getData("moopack:dyn/cosmic_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active");
            case "VOID":
                return !entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active");
            case "NEGATIVE":
                return !entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active");
                default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "SUPER_SPEED":
            return entity.getData("moopack:dyn/speed_dna_active") || entity.getData("moopack:dyn/cosmic_dna_active") || entity.getData("moopack:dyn/mutant_dna_active");
        case "SLOW_MOTION":
            return entity.getData("moopack:dyn/speed_dna_active") || entity.getData("moopack:dyn/cosmic_dna_active") || entity.getData("moopack:dyn/mutant_dna_active");

        case "JADE":
            return !entity.getData("moopack:dyn/cosmic_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active");
        case "VOID":
            return !entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active");
        case "NEGATIVE":
            return !entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active");
            default:
                return true;
            }
        }