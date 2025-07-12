var suits = [
    "shadows:aragami",
    "shadows:hue_man",
    "shadows:shadow",
    "shadows:silver_speed",
    "shadows:superior_spider"
];
function init(hero) {
    hero.setName("Random Suit");
    hero.setTier(8);

    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");

    hero.addKeyBindFunc("Func_RANDOM", pickRandom, "Randomize", 2);
    hero.addKeyBind("SAY", "Health Too Low", 2);

    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        if (!nbt.getString("SuitPick") || nbt.getString("SuitPick") == "null") {
            manager.setString(nbt, "SuitPick", suits[Math.floor(Math.random() * suits.length)]);
        }
        if (nbt.getFloat("SuitPicked") < 0.5) {
            manager.setFloat(nbt, "SuitPicked", nbt.getFloat("SuitPicked") + 0.1);
        }
    });

    hero.setKeyBindEnabled((entity, keybind) => entity.getHealth() < 5 ? keybind == "SAY" : keybind != "SAY");

}
function pickRandom(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    if (entity.getWornChestplate().nbt().getFloat("SuitPicked") >= 0.5) {
        manager.setInteger(nbt, "Upgrades", nbt.getInteger(nbt.getString("SuitPick")));
        manager.setString(entity.getWornHelmet().nbt(), "HeroType", nbt.getString("SuitPick"));
        manager.setString(nbt, "HeroType", nbt.getString("SuitPick"));
        manager.setString(entity.getWornLeggings().nbt(), "HeroType", nbt.getString("SuitPick"));
        manager.setString(entity.getWornBoots().nbt(), "HeroType", nbt.getString("SuitPick"));
    }
    return true;
}
