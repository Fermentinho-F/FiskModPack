var omnitrix = implement("tmf:external/omnitrix_logic");
omnitrix = omnitrix.create(this, [
    {
        "heatblast": "Heatblast",
        "wildmutt": "Wildmutt",
        "diamondhead": "Diamondhead",
        "xlr8": "XLR8",
        "grey_matter": "Grey Matter",
        "four_arms": "Four Arms",
        "stinkfly": "Stinkfly",
        "ripjaws": "Ripjaws",
        "upgrade": "Upgrade",
        "ghostfreak": "Ghostfreak",
        "heatjaws": "Heatjaws",
        "stinkarms": "Stinkarms",
        "diamondmatter": "Diamondmatter"
    },
    {
        "cannonbolt": "Cannonbolt",
        "wildvine": "Wildvine",
        "blitzwolfer": "Blitzwolfer",
        "snare_oh": "Snare-oh",
        "frankenstrike": "Frankenstrike",
        "zs_skayr": "Zs'Skayr",
        "upchuck": "Upchuck",
        "ditto": "Ditto",
        "eyeguy": "Eyeguy",
        "waybig": "Waybig"
    },
    {
        "swampfire": "Swampfire",
        "echo_echo": "Echo Echo",
        "hummungousaur": "Hummungousaur"
    },
    {
        "foo": "Foo 1",
        "bar": "Bar 2",
        "baz": "Baz 3"
    }
]);

function init(hero) {
    hero.setName("Omnitrix");
    hero.setTier(10);
    hero.hide();
    
    hero.setChestplate("Watch");
    
    hero.addPowers("tmf:omnitrix");

    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:\"sabri:black_panther\"}", false, item => item.nbt().getString("HeroType") == "sabri:black_panther");
    hero.addPrimaryEquipment("fiskheroes:superhero_helmet{HeroType:\"stellar:pepsi_man\"}", false, item => item.nbt().getString("HeroType") == "stellar:pepsi_man");
    hero.addPrimaryEquipment("fiskheroes:superhero_leggings{HeroType:\"stellar:pepsi_man\"}", false, item => item.nbt().getString("HeroType") == "stellar:pepsi_man");
    hero.addPrimaryEquipment("fiskheroes:superhero_helmet{HeroType:\"fiskheroes:vision\"}", false, item => item.nbt().getString("HeroType") == "fiskheroes:vision");

    omnitrix.init(hero);
}
