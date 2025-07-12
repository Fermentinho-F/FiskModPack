function init(hero) {
    hero.setName("8-Ball");
    hero.setVersion("item.superhero_armor.version.comics");
    hero.setAliases("8");
    hero.setTier(4);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jmctheroes:cue_stick, display:{Lore:[\"\u00A75\u00A7lJMCT Heroes\u00A7r\"]}, AttributeModifiers:[{Operation:0,UUIDLeast:1,UUIDMost:1,Amount:4.5,AttributeName:generic.attackDamage,Name:Stick}]}", true, item => item.nbt().getString("WeaponType") == "jmctheroes:cue_stick");
    
    hero.setHelmet("Helmet");
    hero.setChestplate("Chest");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");
    
    hero.addPowers("jmctheroes:8ball_suit", "jmctheroes:8ball_gear");
    hero.addAttribute("PUNCH_DAMAGE", 5.3, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.9, 1);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
}