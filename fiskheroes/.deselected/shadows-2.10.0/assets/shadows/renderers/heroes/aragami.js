extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:aragami/aragami_layer1",
    "layer2": "shadows:aragami/aragami_layer2",
    "lights_layer1": "shadows:aragami/aragami_lights_layer1",
    "cape": "shadows:aragami/aragami_cape",
    "cape_lights": "shadows:aragami/aragami_cape_lights",
    "dragon": "shadows:aragami/shadow_dragon",
    "dragon_lights": "shadows:aragami/shadow_dragon_lights",
    "nothing": "shadows:nothing",
    "sword": "shadows:aragami/aragami_sword",
    "sword_lights": "shadows:aragami/aragami_sword_lights"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var dash = implement("shadows:external/dash");

var domain = "shadows:";
var info = {
    "datas": {
        "dash": domain + "dyn/dash",
        "didDash": domain + "dyn/did_dash"
    },
    "effects": {
        "particles": domain + "aragami/shadow_dash",
        "trail": domain + "sprint"
    }
};
var cape;
var shadow_kill;
var sheath;
var whisper;
var shadow_kill_beam;
function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return entity.getData("shadows:dyn/3float_interp_reset") == 0 && entity.getData(info["datas"]["dash"]) &&
        entity.getHeldItem().isEmpty() ? "nothing" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        return entity.getData("shadows:dyn/3float_interp_reset") == 0 && entity.getData(info["datas"]["dash"]) &&
        entity.getHeldItem().isEmpty() ? "nothing" : "lights_layer1";
    });
    renderer.setItemIcons("aragami/%s_0", "aragami/%s_1", "aragami/%s_2", "aragami/%s_3");
    dash.defaultDashVisual(renderer, utils, info);
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape", "cape_lights");

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "shadows:invisible", "rightArm", 0x6D0000, [{
                "firstPerson": [-3, 3, -1],
                "offset": [-1, 12.0, 0.0],
                "size": [1, 1]
            }
        ]);

    var model = utils.createModel(renderer, "shadows:aragami/dragon", "dragon", "dragon_lights");

    model.bindAnimation("shadows:aragami/shadow_kill").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge"));
        data.load(1, entity.getData("fiskheroes:beam_charging"))
    });

    shadow_kill = renderer.createEffect("fiskheroes:model");
    shadow_kill.setModel(model);
    shadow_kill.setScale(0.5);
    shadow_kill.anchor.ignoreAnchor(true);

    var sword = renderer.bindProperty("fiskheroes:livery");
    sword.weaponType = "KATANA";
    sword.texture.set("sword", "sword_lights");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([{
                "anchor": "body",
                "scale": 0.55,
                "offset": [-6, 9, 2.83],
                "rotation": [90.0, -90.0, 0.0]
            }
        ]).setCondition(entity => !entity.getData(info["datas"]["dash"]) && entity.getData("shadows:dyn/3float_interp_reset") == 0 && entity.getData("fiskheroes:teleport_timer") == 0 && entity.getData("shadows:dyn/4float_interp_reset") == 0);

    utils.bindParticles(renderer, "shadows:aragami/blood_smoke").setCondition(entity => entity.getData("shadows:dyn/4float_interp_reset") > 0.5);

    utils.bindParticles(renderer, "shadows:aragami/shadow_pull").setCondition(entity => entity.getData("fiskheroes:grab_id") > -1 && entity.getData("shadows:dyn/1string_reset") == "Sneaking");

    utils.bindParticles(renderer, "shadows:aragami/shadow_kill").setCondition(entity => entity.getData("fiskheroes:beam_charge") > 0 && !entity.isSprinting() && entity.isOnGround());

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(0x000000);

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return entity.getData("shadows:dyn/4float_interp_reset") > 0 ? Math.max(1 - entity.getInterpolatedData("shadows:dyn/4float_interp_reset"), 0) : entity.getData(info["datas"]["dash"]) && entity.getHeldItem().isEmpty() ? 0.999 : Math.max(1 - entity.getInterpolatedData("shadows:dyn/3float_interp_reset"), 0);
    });

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(cape.effect);
    glow.color.set(0x000000);

    whisper = utils.createLines(renderer, "shadows:whisper", "0x000000", [{
                    "start": [0, 0, 0],
                    "end": [0, 0.05, 0],
                    "size": [1, 1]
                }
            ]);
    whisper.anchor.set("rightArm");
    whisper.setOffset(1, 6.0, 0);

    shadow_kill_beam = utils.createLines(renderer, "shadows:shadow_kill", "0x000000", [{
                    "start": [0, -0.1, 0],
                    "end": [0, 4, 0],
                    "size": [1, 1]
                }
            ]);
    shadow_kill_beam.anchor.set("body");
    shadow_kill_beam.setOffset(0, 23, -14).setScale(500, 20, 500);
    shadow_kill_beam.opacity = 0.2;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.PROP_FLIGHT");

    addAnimation(renderer, "aragami.DEFAULT", "shadows:aragami/default").setData((entity, data) =>
        data.load(entity.getInterpolatedData("shadows:dyn/1float_interp_reset")));

    addAnimation(renderer, "aragami.DOUBLE_JUMP", "fiskheroes:swing_roll5")
    .setData((entity, data) => {
        data.load(entity.getData("shadows:dyn/1boolean_reset") ? entity.getInterpolatedData("shadows:dyn/2float_interp_reset") : 0);
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    var dash = entity.getData(info["datas"]["dash"]);
    if (entity.isWearingFullSuit()) {
        if (renderLayer == "CHESTPLATE") {
            whisper.setScale(entity.getInterpolatedData("shadows:dyn/5float_interp_reset") * 100);
            whisper.render()
            if (!isFirstPersonArm) {
                if ((!dash || dash && !entity.getHeldItem().isEmpty()) /*&& (entity.getData("shadows:dyn/4boolean_reset") && entity.getData("shadows:dyn/2float_reset") < 1)*/) {
                    cape.render(entity);
                }
            }
            if (entity.getData("fiskheroes:beam_charge") > 0.04 && entity.isOnGround()) {
                shadow_kill_beam.render();
                shadow_kill.render();
            }
        }
        glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
        glow.render();
    }
}
