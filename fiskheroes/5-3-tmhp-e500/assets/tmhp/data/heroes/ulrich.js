var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Ulrich Stern/\u00A7c\u00A7lAP 3");
    hero.setVersion("Code Lyoko");
    hero.setTier(3);
    
    hero.setHelmet("Headband");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:katana{Dual:1}", true, item => item.nbt().getBoolean("Dual"));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
    
    hero.addPowers("tmhp:virtualization_ulrich");
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    
    hero.addKeyBind("SPELL_MENU", "Triplicate", 1);
    hero.addKeyBind("SUPER_SPEED", "Super Sprint", 2);
}