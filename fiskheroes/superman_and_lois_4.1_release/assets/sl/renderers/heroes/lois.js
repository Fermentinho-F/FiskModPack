extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sl:lois/lois_layer1",
    "layer2": "sl:lois/lois_layer2",
    "hair": "sl:lois/lois_hair",
    "chest": "sl:lois/lois_chest",
    "cape": "sl:lois/lois_haircape",
    "superman_model_texture": "sl:superman_model_texture",
    "cape_model_texture": "sl:superman_model_texture",

});

var capes = implement("fiskheroes:external/capes");
var chest;
var superman;
var superman_cape;
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornHelmet().suitType() == $SUIT_NAME ? "layer1" : "chest";
        }
        return renderLayer == "HELMET" ? "hair" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.showModel("HELMET", "head", "headwear", "body");
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 0;
}


function initEffects(renderer) {

  utils.bindParticles(renderer, "sl:wave_lois").setCondition(entity => entity.getData("fiskheroes:beam_shooting_timer") > 0.9 && entity.getData("fiskheroes:beam_shooting_timer") < 1 && entity.getInterpolatedData('fiskheroes:beam_charging'));

utils.bindBeam(renderer, "fiskheroes:charged_beam", "sl:null", "head", 0xD3D3D3, [
    { "firstPerson": [0.0, 0.0, 0.0], "offset": [0.0, 0.0, 0.0], "size": [0.0, 0.0] }
]);

    var superman_model = renderer.createResource("MODEL", "sl:superman_model");
    superman_model.bindAnimation("sl:summon_superman").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    data.load(1, entity.getInterpolatedData("fiskheroes:beam_charge") >= 0.75 ? (entity.getInterpolatedData("fiskheroes:beam_charge") - 0.75) * 4 : 0);
    });
    superman_model.texture.set("superman_model_texture");
    superman = renderer.createEffect("fiskheroes:model").setModel(superman_model); 
    superman.anchor.set("head");

    var cape_model = renderer.createResource("MODEL", "sl:superman_cape_model");
    cape_model.bindAnimation("sl:summon_superman").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    data.load(1, entity.getInterpolatedData("fiskheroes:beam_charge") >= 0.75 ? (entity.getInterpolatedData("fiskheroes:beam_charge") - 0.75) * 4 : 0);
    });
    cape_model.texture.set("cape_model_texture");
    superman_cape = renderer.createEffect("fiskheroes:model").setModel(cape_model); 
    superman_cape.anchor.set("head");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.4;
    physics.maxFlare = 0.6;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 4;

    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.70).setYOffset(1);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xA020F0);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.10;
        return true;
    });

}

function initAnimations(renderer) {
  parent.initAnimations(renderer);
  renderer.removeCustomAnimation("basic.AIMING");
  addAnimationWithData(renderer, "lois.AIM", "sl:low_aiming", "fiskheroes:aiming_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") >= 0.75) {
        superman.setOffset(0, 0, -10);
        superman.render();
        superman_cape.setOffset(0, -1.0, -10);
        superman_cape.render();
    }

    if (renderLayer === "HELMET") {
        cape.render(entity);
    }

    if (renderLayer === "CHESTPLATE") {
        if (!isFirstPersonArm) {
            chest.render();
        }
    }
}
