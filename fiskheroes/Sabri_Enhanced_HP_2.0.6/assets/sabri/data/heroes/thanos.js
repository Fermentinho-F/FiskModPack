var uuid = implement("sabri:external/uuid");

function init(hero) {
    hero.setName("Thanos");
    hero.setTier(9);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sabri:double_edged_sword}", true, item => item.nbt().getString("WeaponType") == "sabri:double_edged_sword");
    
    hero.addPowers("sabri:mutated_titan_physiology", "sabri:double_edged_sword");
    hero.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    
	hero.setDefaultScale(1.4);
    
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");
    hero.setHasPermission((entity, permission) => permission == "USE_THANOS_SWORD");

    hero.setModifierEnabled(isModifierEnabled);

    hero.addDamageProfile("NOTE", {
    });

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "sabri:dyn/shield_blocking_timer", 3, entity.getHeldItem().nbt().getString("WeaponType") == "sabri:double_edged_sword" && entity.as("PLAYER").isUsingItem());
        uuid.note(hero, entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    if (modifier.id() == "fiskheroes:flight") {
        return uuid.getUUID(entity) && entity.getData("sabri:dyn/shield_blocking_timer") == 1 && entity.rotPitch() <= -60
    }
    return true;
}