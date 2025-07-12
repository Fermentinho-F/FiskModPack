function init(hero) {
    hero.setName("Aelita Schaeffer/\u00A7c\u00A7lAP 3");
    hero.setVersion("Code Lyoko");
    hero.setTier(3);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:virtualization_aelita");
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    
    hero.addKeyBind("AIM", "Energy Fields", 1);

    hero.supplyFunction("canAim", canAim);

    hero.setTickHandler((entity, manager) => {
        if (!entity.isSneaking() && !entity.isOnGround() && entity.motionY() < -0.8) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
    });
}
function canAim(entity) {
  return entity.getHeldItem().isEmpty();
}