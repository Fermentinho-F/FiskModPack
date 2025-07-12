function init(hero) {
    hero.setName("Aragami/\u00A7c\u00A7lAP 3");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.hood");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:chokuto", true);
    
    hero.addPowers("tmhp:shadow_essence");
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("SHADOWFORM", "key.shadowForm", 2);
    hero.addKeyBind("TELEPORT", "Shadow Leap", 3);
    hero.addKeyBind("SPELL_MENU", "Kurosuna and Sakkaku", 4);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "TELEPORT":
        return entity.getData('fiskheroes:shadowform');
    case "SPELL_MENU":
        return !entity.getData('fiskheroes:shadowform');
    case "UTILITY_BELT":
        return !entity.getData('fiskheroes:shadowform');
    default:
        return true;
    }
}