var LOADTEXTURES = {
	"null": "tmf:null",
	"blitzwolfer": "tmf:omnitrix/p2/aliens/blitzwolfer",
    "blitzwolfer_lights": "tmf:omnitrix/p2/lights/blitzwolfer_lights.tx.json",
    "blitzwolfer_lights_eyes": "tmf:omnitrix/p2/lights/blitzwolfer_lights_eyerlay.tx.json",
    "blitzwolfer_waves": "tmf:omnitrix/p2/lights/blitzwolfer_waves.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false, false);
    var alienEyes = alienModel(renderer, false, true);
    var badge = alienModel(renderer, true, false);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));
    
    addAnimation(renderer, "blitzwolfer.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_blitzwolfer_leap"
    )).setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_Lexplosion")).setCondition(entity => isCurrent(entity));

    var modelBlitzwolferArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/blitzwolfer_arm");
    modelBlitzwolferArm.texture.set("blitzwolfer", "null");
    var blitzwolferArm = renderer.createEffect("fiskheroes:model").setModel(modelBlitzwolferArm);
    blitzwolferArm.anchor.set("rightArm");
    blitzwolferArm.setScale(0.85);
    
    var blitzwolferNightVision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        blitzwolferNightVision.factor = 1.0;
        blitzwolferNightVision.firstPersonOnly = true;
        return isCurrent(entity);
    });

    var modelWaves = renderer.createResource("MODEL", "tmf:omnitrix/powers/waves");
    modelWaves.texture.set("null", "blitzwolfer_waves");
    var blitzwaves = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var blitzwaves1 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var blitzwaves2 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var blitzwaves3 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var blitzwaves4 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var blitzwaves5 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);

    blitzwaves.anchor.set("head");
    blitzwaves1.anchor.set("head");
    blitzwaves2.anchor.set("head");
    blitzwaves3.anchor.set("head");
    blitzwaves4.anchor.set("head");
    blitzwaves5.anchor.set("head");

    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            var heatVisionTimer = entity.getInterpolatedData('fiskheroes:beam_shooting_timer');
            var heatVisionLength = entity.getInterpolatedData('fiskheroes:heat_vision_length') / 12;
            var blockSize = -(((16 / 15) / 1.3) * 16) * heatVisionLength;
            var loop = entity.loop(5);
            var rotX = 5 * Math.sin(2 * Math.PI * entity.loop(6));
            var rotY = 5 * Math.sin(2 * Math.PI * entity.loop(6) + 0.5 * Math.PI);
            var rotZ = 2 * Math.sin(2 * Math.PI * entity.loop(9));

            if (!isFirstPersonArm) {
                blitzwaves.anchor.ignoreAnchor(false);
                blitzwaves1.anchor.ignoreAnchor(false);
                blitzwaves2.anchor.ignoreAnchor(false);
                blitzwaves3.anchor.ignoreAnchor(false);
                blitzwaves4.anchor.ignoreAnchor(false);
                blitzwaves5.anchor.ignoreAnchor(false);

                alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.isSneaking(), 0);
                alienEyes.render(pull(entity, "color"), pull(entity, "timeout"), entity.isSneaking(), entity.getInterpolatedData('tmf:dyn/pt_1'));
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.isSneaking(), 0);
                
                if (entity.getData("fiskheroes:beam_charge") != 0) {

                    blitzwaves.setScale(4.5 - (1 - heatVisionLength));
                    blitzwaves.setOffset(0, 0, 12 * blockSize * heatVisionTimer);
                    blitzwaves.setRotation(rotX, rotY, rotZ);
                    blitzwaves.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                    blitzwaves1.setScale(3.5 + loop - (1 - heatVisionLength));
                    blitzwaves1.setOffset(0, 0, 7 * blockSize * heatVisionTimer + 5 * loop * blockSize * heatVisionTimer);
                    blitzwaves1.setRotation(rotX, rotY, rotZ);
                    blitzwaves1.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                    blitzwaves2.setScale(2.5 + loop - (1 - heatVisionLength));
                    blitzwaves2.setOffset(0, 0, 4 * blockSize * heatVisionTimer + 3 * loop * blockSize * heatVisionTimer);
                    blitzwaves2.setRotation(rotX, rotY, rotZ);
                    blitzwaves2.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                    blitzwaves3.setScale(1.75 + 0.75 * loop - (1 - heatVisionLength));
                    blitzwaves3.setOffset(0, 0, 3 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                    blitzwaves3.setRotation(rotX, rotY, rotZ);
                    blitzwaves3.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                    blitzwaves4.setScale(1.25 + 0.5 * loop - (1 - heatVisionLength));
                    blitzwaves4.setOffset(0, 0, 2 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                    blitzwaves4.setRotation(rotX, rotY, rotZ);
                    blitzwaves4.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                    blitzwaves5.setScale(1 + 0.25 * loop - (1 - heatVisionLength));
                    blitzwaves5.setOffset(0, 0, 0.5 * blockSize * heatVisionTimer + 1.5 * loop * blockSize * heatVisionTimer);
                    blitzwaves5.setRotation(rotX, rotY, rotZ);
                    blitzwaves5.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;

                    blitzwaves.render();
                    blitzwaves1.render();
                    blitzwaves2.render();
                    blitzwaves3.render();
                    blitzwaves4.render();
                    blitzwaves5.render();
                }

            }
            if (isFirstPersonArm) {
                blitzwaves.anchor.ignoreAnchor(true);
                blitzwaves1.anchor.ignoreAnchor(true);
                blitzwaves2.anchor.ignoreAnchor(true);
                blitzwaves3.anchor.ignoreAnchor(true);
                blitzwaves4.anchor.ignoreAnchor(true);
                blitzwaves5.anchor.ignoreAnchor(true);

                blitzwolferArm.render();

                if (entity.getData("fiskheroes:beam_charge") != 0) {

                    blitzwaves.setScale(6.5 - (1 - heatVisionLength));
                    blitzwaves.setOffset(0, 0, 12 * blockSize);
                    blitzwaves.setRotation(-10 + rotX, rotY, rotZ);
                    blitzwaves.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                    blitzwaves1.setScale(5.5 + loop - (1 - heatVisionLength));
                    blitzwaves1.setOffset(0, 0, 7 * blockSize + 5 * loop * blockSize);
                    blitzwaves1.setRotation(-10 + rotX, rotY, rotZ);
                    blitzwaves1.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                    blitzwaves2.setScale(4.5 + loop - (1 - heatVisionLength));
                    blitzwaves2.setOffset(0, 0, 4 * blockSize + 3 * loop * blockSize);
                    blitzwaves2.setRotation(-10 + rotX, rotY, rotZ);
                    blitzwaves2.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                    blitzwaves3.setScale(3.75 + 0.75 * loop - (1 - heatVisionLength));
                    blitzwaves3.setOffset(0, 0, 3 * blockSize + loop * blockSize);
                    blitzwaves3.setRotation(-10 + rotX, rotY, rotZ);
                    blitzwaves3.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                    blitzwaves4.setScale(3.25 + 0.5 * loop - (1 - heatVisionLength));
                    blitzwaves4.setOffset(0, 0, 2 * blockSize + loop * blockSize);
                    blitzwaves4.setRotation(-10 + rotX, rotY, rotZ);
                    blitzwaves4.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                    blitzwaves5.setScale(3 + 0.25 * loop - (1 - heatVisionLength));
                    blitzwaves5.setOffset(0, 0, 0.5 * blockSize + 1.5 * loop * blockSize);
                    blitzwaves5.setRotation(-10 + rotX, rotY, rotZ);
                    blitzwaves5.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;

                    blitzwaves.render();
                    blitzwaves1.render();
                    blitzwaves2.render();
                    blitzwaves3.render();
                    blitzwaves4.render();
                    blitzwaves5.render();
                }
            }
        }
    };
}

function alienModel(renderer, badge, eyes) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_blitzwolfer" : "tmf:omnitrix/aliens/blitzwolfer");
    modelAlien.texture.set("blitzwolfer", "blitzwolfer_lights");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/blitzwolfer").setData((entity, data) => {
        data.load(0, entity.loop(82));
        data.load(1, entity.getPunchTimerInterpolated());
        data.load(2, entity.isSneaking() ? 1 : 0);
        data.load(3, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(4, entity.getInterpolatedData('fiskheroes:beam_charge'));
    });
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(0.85);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, sneaking, timer) => {
            if (badge) {
                if (timeout) {
                    modelAlien.texture.set("omnitrix", "omnitrix_timeout");
                }
                else if (color == 0 || color == 360) {
                    modelAlien.texture.set("omnitrix", "omnitrix_white");
                }
                else {
                    modelAlien.texture.set("omnitrix", "omnitrix_lights");
                }
            }
            if (eyes) {
                modelAlien.texture.set(null , "blitzwolfer_lights_eyes");
                alien.opacity = 0.4*timer;
            }
            alien.setOffset(0,sneaking ? 1.5 : 3.5,0);
            alien.render();
        }
    };
}