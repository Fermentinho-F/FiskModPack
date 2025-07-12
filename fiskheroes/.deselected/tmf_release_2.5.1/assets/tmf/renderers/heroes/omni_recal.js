extend("fiskheroes:hero_basic");

var omnitrix = implement("tmf:external/omnitrix_render");
var watch = implement("tmf:external/omnitrix_watch");
omnitrix = omnitrix.create(this, watch, [
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

function init(renderer) {
    parent.init(renderer);
    omnitrix.init(renderer);

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        if ((entity.getData("tmf:dyn/transformed") & 0x80) == 0) {
                return 0.9999;
        }
        return 1.0;
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    omnitrix.render(entity, isFirstPersonArm);
}
