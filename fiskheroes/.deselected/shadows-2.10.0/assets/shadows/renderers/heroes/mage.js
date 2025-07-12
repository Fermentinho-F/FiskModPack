extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:custom/mage/mage_layer1",
    "layer2": "shadows:custom/mage/mage_layer2",
    "nothing": "shadows:nothing",
    "health": "shadows:custom/mage/health_bar.tx.json"
});
var utils = implement("fiskheroes:external/utils");

var spell;
var spell_default;
var health_bar;

function init(renderer) {
    parent.init(renderer);
    renderer.fixHatLayer("CHESTPLATE");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.setItemIcons("custom/mage/%s_0", "custom/mage/%s_1", "custom/mage/%s_2", "custom/mage/%s_3");
}

function initEffects(renderer) {
    var dome = renderer.bindProperty("fiskheroes:shadowdome");
    dome.texture.set("nothing");

    var color = 0x4169e1;
    var spell_symbol = renderer.createResource("BEAM_RENDERER", "shadows:spell");
    var beam = renderer.createResource("BEAM_RENDERER", "shadows:spell");

    spell_default = renderer.createResource("SHAPE", "shadows:spell");

    spell = renderer.createEffect("fiskheroes:lines").setRenderer(spell_symbol);

    spell.color.set(color);
    spell.anchor.set("head");

    utils.bindBeam(renderer, "fiskheroes:heat_vision", beam, "head", color, [{
                "firstPerson": [0.0, 9, -15.0],
                "offset": [0.0, 1.0, -22.0],
                "size": [2.0, 2.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(color);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    health_bar = renderer.createEffect("fiskheroes:model");
    health_bar.setModel(utils.createModel(renderer, "shadows:healthBar", "health", null));
    health_bar.anchor.ignoreAnchor(true);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);

    addAnimation(renderer, "shadows.NOTHING", "shadows:nothing").setData((entity, data) =>
        data.load(!entity.isOnGround() && entity.getData("shadows:dyn/2integer_reset") == 3 ? 1 : 0)).priority = -10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    spell.setShape(spell_default);
    var timer = entity.getInterpolatedData("shadows:dyn/1float_reset");
    var spell_used = entity.getData("shadows:dyn/2integer_reset");
    spell.progress = timer;
    if (spell_used != 7) {
        if (isFirstPersonArm) {
            spell.setOffset(0, 7, -14);
            spell.setScale(6).setRotation(80, 0, 0);
            spell.anchor.ignoreAnchor(true);
        } else {
            var pitch = entity.rotPitch() * Math.PI / 180;
            spell.setOffset(0, 2 * Math.cos(pitch), -15 - 12 * Math.pow(Math.sin(Math.max(pitch, 0)), 2));
            spell.setScale(6).setRotation(90, 0, 0);
            spell.anchor.ignoreAnchor(false);

            if (spell_used == 5 || spell_used == 6) {
                var pitch = entity.rotPitch() * Math.PI / 180;
                spell.setOffset(0, 2 * Math.cos(pitch), -7 - 20 * Math.pow(Math.sin(Math.max(pitch, 0)), 2));
                spell.setScale(6).setRotation(90, 0, 0);
                spell.anchor.ignoreAnchor(false);
            }

            if (spell_used == 3 || spell_used == 4) {
                spell.anchor.ignoreAnchor(true);
                spell.setOffset(0, 3, -1.8);
                spell.setScale(3).setRotation(90, 0, 0);
            }
            if (!entity.isOnGround() && spell_used == 3) {
                spell.anchor.ignoreAnchor(true);
                spell.setOffset(0, (entity.isSneaking() ? 22 : 25), (entity.isSneaking() ? 5 : 0));
                spell.setScale(6).setRotation(0, 0, 0);
            }
        }
        spell.render();
    }
    if (spell_used == 7) {
        health_bar.opacity = timer;
        health_bar.render();
    }

}
