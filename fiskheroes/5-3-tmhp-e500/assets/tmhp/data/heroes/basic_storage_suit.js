function init(hero) {
    hero.setName("Basic Storage Suit/\u00A7c\u00A7lAP 1");
    hero.setTier(1);
    hero.hide();
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.addPowers("tmhp:storage_suit");

    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);

    hero.addKeyBind("WEB_ZIP", "Grapling Hook", 1);
    hero.addAttribute("IMPACT_DAMAGE", -5.0, 1);

    hero.addPrimaryEquipment("minecraft:coal", false);
    hero.addPrimaryEquipment("minecraft:torch", false);
    hero.addPrimaryEquipment("minecraft:stick", false);
    hero.addPrimaryEquipment("minecraft:diamond", false);
    hero.addPrimaryEquipment("minecraft:redstone", false);
    hero.addPrimaryEquipment("minecraft:ender_pearl", false);
    hero.addPrimaryEquipment("minecraft:water_bucket", false);
    hero.addPrimaryEquipment("minecraft:iron_ore", false);
    hero.addPrimaryEquipment("minecraft:gold_ore", false);
    hero.addPrimaryEquipment("minecraft:quartz", false);
    hero.addPrimaryEquipment("fiskheroes:tutridium_gem", false);
    hero.addPrimaryEquipment("fiskheroes:titanium_ore", false);
    hero.addPrimaryEquipment("fiskheroes:quantum_matter", false);
    hero.addPrimaryEquipment("fiskheroes:unstable_quantum_matter", false);
}
function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/lantern") ? 9 : 0;
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return !entity.getData("fiskheroes:dyn/super_boost_cooldown") || entity.getData("fiskheroes:flying");
    default:
        return true;
    }
}