extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:rex",
    "layer2": "emo:rex",
    "sword": "emo:rextest",
    "punch": "emo:rextest",
    "punch2": "emo:rextest",
    "flight": "emo:rextest",    
    "blast": "emo:blast",
    "blast2": "emo:omega",
    "axe": "emo:omega",
    "axe2": "emo:omega",
    "fun": "emo:omega",
    "fun2": "emo:omega",
    "eldiven": "emo:omega",
    "icel": "emo:rextest"
});

var utils = implement("fiskheroes:external/utils");

var sword;
var punch;
var punch2;
var flight;
var blast;
var blast2;
var fun;
var fun2;
var axe;
var axe2;
var eldiven;
var icel;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:big_fat_sword", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    punch = renderer.createEffect("fiskheroes:model");
    punch.setModel(utils.createModel(renderer, "emo:rexsag", "punch"));
    punch.anchor.set("rightArm");
    punch.mirror = false;
    
    punch2 = renderer.createEffect("fiskheroes:model");
    punch2.setModel(utils.createModel(renderer, "emo:rexsol", "punch2"));
    punch2.anchor.set("leftArm");
    punch2.mirror = false;

    flight = renderer.createEffect("fiskheroes:model");
    flight.setModel(utils.createModel(renderer, "emo:booge", "flight"));
    flight.anchor.set("body");
    flight.mirror = false;

    blast = renderer.createEffect("fiskheroes:model");
    blast.setModel(utils.createModel(renderer, "emo:casteee", "blast"));
    blast.anchor.set("rightArm");
    blast.mirror = false;

    blast2 = renderer.createEffect("fiskheroes:model");
    blast2.setModel(utils.createModel(renderer, "emo:blastarka", "blast2"));
    blast2.anchor.set("body");
    blast2.mirror = false;

    axe = renderer.createEffect("fiskheroes:model");
    axe.setModel(utils.createModel(renderer, "emo:axesag", "axe"));
    axe.anchor.set("rightArm");
    axe.mirror = false;

    axe2 = renderer.createEffect("fiskheroes:model");
    axe2.setModel(utils.createModel(renderer, "emo:axesol", "axe2"));
    axe2.anchor.set("leftArm");
    axe2.mirror = false;0

    fun = renderer.createEffect("fiskheroes:model");
    fun.setModel(utils.createModel(renderer, "emo:funchuckssag", "fun"));
    fun.anchor.set("rightArm");
    fun.mirror = false;

    fun2 = renderer.createEffect("fiskheroes:model");
    fun2.setModel(utils.createModel(renderer, "emo:funchuckssol", "fun2"));
    fun2.anchor.set("leftArm");
    fun2.mirror = false;0

    eldiven = renderer.createEffect("fiskheroes:model");
    eldiven.setModel(utils.createModel(renderer, "emo:rexeldiven", "eldiven"));
    eldiven.anchor.set("rightArm");
    eldiven.mirror = false;

    icel = renderer.createEffect("fiskheroes:model");
    icel.setModel(utils.createModel(renderer, "emo:icel", "icel"));
    icel.anchor.set("rightArm");
    icel.mirror = false;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x40E7F9);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "emo:invisible_beam", "body", 0xFF0000, [
        { "firstPerson": [0, 5, -9], "offset": [0.0, 4.0, -6.0], "size": [12.0, 12.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer,"orex.SWORD", "emo:rex", "emo:dyn/sword");
    addAnimationWithData(renderer,"orex.SWORD", "emo:rex2", "emo:dyn/sword");
    addAnimationWithData(renderer,"orex.EL", "emo:rex", "emo:dyn/el");
    addAnimationWithData(renderer,"orex.SWORDEL", "emo:rex", "emo:dyn/swordel");
    addAnimationWithData(renderer,"orex.BLAST", "emo:rex", "emo:dyn/blast");
    addAnimationWithData(renderer,"orex.BLAST", "emo:rex2", "emo:dyn/blast");
    addAnimationWithData(renderer,"orex.FUNCHUCKS", "emo:rex", "emo:dyn/funchucks");
    addAnimationWithData(renderer,"orex.AXES", "emo:rex", "emo:dyn/axes");
    addAnimationWithData(renderer,"orex.PARTY", "emo:rex", "emo:dyn/party");
    addAnimationWithData(renderer,"orex.PARTY", "emo:rex2", "emo:dyn/party");
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "emo:clap", "fiskheroes:beam_charge");
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (entity.getData("emo:dyn/sword") > 0.6) {
        sword.render();
    } 
    if (entity.getData("emo:dyn/el") > 0.6) {
        punch.render();
    } 
    if (entity.getData("emo:dyn/el") > 0.6) {
        punch2.render();
    } 
    if (entity.getData("emo:dyn/boogie") > 0.6) {
        flight.render();
    } 
    if (entity.getData("emo:dyn/swordel") > 0.6) {
        sword.render();
    } 
    if (entity.getData("emo:dyn/swordel") > 0.6) {
        punch2.render();
    } 
    if (entity.getData("emo:dyn/blast") > 0.6) {
        blast.render();
    } 
    if (entity.getData("emo:dyn/blast") > 0.6) {
        blast2.render();
    } 
    if (entity.getData("emo:dyn/axes") > 0.6) {
        axe.render();
    } 
    if (entity.getData("emo:dyn/axes") > 0.6) {
        axe2.render();
    } 
    if (entity.getData("emo:dyn/funchucks") > 0.6) {
        fun.render();
    } 
    if (entity.getData("emo:dyn/funchucks") > 0.6) {
        fun2.render();
    } 
    if (entity.getData("emo:dyn/party_timer") > 0.6) {
        eldiven.render();
    } 
    if (entity.getData("emo:dyn/party") > 0.6) {
        eldiven.render();
    } 
    if (entity.getData("emo:dyn/sword") > 0.6) {
        icel.render();
    } 
    if (entity.getData("emo:dyn/el") > 0.6) {
        icel.render();
    } 
    if (entity.getData("emo:dyn/swordel") > 0.6) {
        icel.render();
    } 
    if (entity.getData("emo:dyn/blast") > 0.6) {
        icel.render();
    } 
    if (entity.getData("emo:dyn/axes") > 0.6) {
        icel.render();
    } 
    if (entity.getData("emo:dyn/funchucks") > 0.6) {
        icel.render();
    } 
    if (!isFirstPersonArm) {
        sword.opacity = entity.getInterpolatedData("emo:dyn/sword_timer");
        sword.render();
    }
    if (!isFirstPersonArm) {
        punch.opacity = entity.getInterpolatedData("emo:dyn/el_timer");
        punch.render();
    }
    if (!isFirstPersonArm) {
        punch2.opacity = entity.getInterpolatedData("emo:dyn/el_timer");
        punch2.render();
    }
    if (!isFirstPersonArm) {
        sword.opacity = entity.getInterpolatedData("emo:dyn/swordel_timer");
        sword.render();
    }
    if (!isFirstPersonArm) {
        punch2.opacity = entity.getInterpolatedData("emo:dyn/swordel_timer");
        punch2.render();
    }
    if (!isFirstPersonArm) {
        flight.opacity = entity.getInterpolatedData("emo:dyn/boogie_timer");
        flight.render();
    }
    if (!isFirstPersonArm) {
        blast.opacity = entity.getInterpolatedData("emo:dyn/blast_timer");
        blast.render();
    }
    if (!isFirstPersonArm) {
        blast2.opacity = entity.getInterpolatedData("emo:dyn/blast_timer");
        blast2.render();
    }
    if (!isFirstPersonArm) {
        axe.opacity = entity.getInterpolatedData("emo:dyn/axes_timer");
        axe.render();
    }
    if (!isFirstPersonArm) {
        axe2.opacity = entity.getInterpolatedData("emo:dyn/axes_timer");
        axe2.render();
    }
    if (!isFirstPersonArm) {
        fun.opacity = entity.getInterpolatedData("emo:dyn/funchucks_timer");
        fun.render();
    }
    if (!isFirstPersonArm) {
        fun2.opacity = entity.getInterpolatedData("emo:dyn/funchucks_timer");
        fun2.render();
    }
}