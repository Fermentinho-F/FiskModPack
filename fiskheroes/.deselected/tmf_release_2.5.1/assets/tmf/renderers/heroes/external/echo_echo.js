var LOADTEXTURES = {
    "null": "tmf:null",
    "echo_echo": "tmf:omnitrix/p3/aliens/echo_echo",
    "echo_echo_lights": "tmf:omnitrix/p3/lights/echo_echo.tx.json",
    "echo_echo_scream_lights": "tmf:omnitrix/p3/lights/echo_echo_scream.tx.json",
    "echo_echo_glow": "tmf:omnitrix/p3/lights/echo_echo_glow.tx.json",
    "echo2x_waves": "tmf:omnitrix/p3/lights/echo2x_waves"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false, false);
    var badge = alienModel(renderer, true, false);
    var glowAlien = alienModel(renderer, false, true);
    var glowBadge = alienModel(renderer, true, true);

    var waves0  = wavesModel(renderer);
    var waves1  = wavesModel(renderer);
    var waves2  = wavesModel(renderer);
    var waves3  = wavesModel(renderer);
    var waves4  = wavesModel(renderer);
    var waves5  = wavesModel(renderer);
    var waves6  = wavesModel(renderer);
    var waves7  = wavesModel(renderer);
    var waves8  = wavesModel(renderer);

    var shield1 = shield(renderer, 1, isCurrent);
    var shield2 = shield(renderer, 5, isCurrent);
    var shield3 = shield(renderer, 10, isCurrent);

    utils.bindParticles(renderer, "tmf:alien_particles_p3").setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_explosion")).setCondition(entity => isCurrent(entity));

    var modelEchoEchoFp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/echo_echo_arm");
    modelEchoEchoFp.texture.set("echo_echo", "echo_echo_lights");
    var echoEchoFp = renderer.createEffect("fiskheroes:model").setModel(modelEchoEchoFp);
    echoEchoFp.anchor.set("rightArm");
    echoEchoFp.setOffset(0, -1, 0);

    addAnimation(renderer, "echo_echo.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
            var heatVisionTimer = entity.getInterpolatedData('fiskheroes:beam_shooting_timer');
            var heatVisionLength = entity.getInterpolatedData('fiskheroes:heat_vision_length') / 12;
            var blockSize = -(((16 / 15) / 1.3) * 16) * heatVisionLength;
            var loop = entity.loop(5);
            var rotX = 5 * Math.sin(2 * Math.PI * entity.loop(6));
            var rotY = 5 * Math.sin(2 * Math.PI * entity.loop(6) + 0.5 * Math.PI);
            var rotZ = 2 * Math.sin(2 * Math.PI * entity.loop(9));
            var beamCharge = entity.getData('fiskheroes:beam_charge');

            if (isFirstPersonArm) {
                echoEchoFp.render(); 
            }
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), null, null, null, heatVisionTimer, entity.getInterpolatedData('fiskheroes:shield_timer'));
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getWornChestplate().nbt().getString("HeroType") == "tmf:omni_recal", null, 0, entity.getInterpolatedData('fiskheroes:shield_timer'));
                glowAlien.render(pull(entity, "color"), null, null, entity.getInterpolatedData('tmf:dyn/pc_8'), 0, 0);
                glowBadge.render(pull(entity, "color"), null, null, entity.getInterpolatedData('tmf:dyn/pc_8'), 0, 0);
    
                var Clone1 = entity.getInterpolatedData("tmf:dyn/pt_1");
                var Clone2 = entity.getInterpolatedData("tmf:dyn/pc_1");
                var Clone3 = entity.getInterpolatedData("tmf:dyn/pt_3");
                var Clone4 = entity.getInterpolatedData("tmf:dyn/pc_3");
                var Clone5 = entity.getInterpolatedData("tmf:dyn/pt_4");
                var Clone6 = entity.getInterpolatedData("tmf:dyn/pc_4");
                var Clone7 = entity.getInterpolatedData("tmf:dyn/pt_7");
                var Clone8 = entity.getInterpolatedData("tmf:dyn/pc_7");
                if (Clone1 != 0) {
                    waves1.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm, Clone1*18, 0, Clone1*-3);
                }
                if (Clone2 != 0) {
                    waves2.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm, Clone2*-16, 0,Clone2*-4);
                }
                if (Clone3 != 0) {
                    waves3.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm, Clone3*32, 0,Clone3*-7);
                }
                if (Clone4 != 0) {
                    waves4.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm,Clone4*-31, 0, Clone4*-6);
                }
                //
                if (Clone5 != 0) {
                    waves5.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm, Clone5*8, 0, Clone5*-9);
                }
                if (Clone6 != 0) {
                    waves6.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm, Clone6*-5, 0,Clone6*-8);
                }
                if (Clone7 != 0) {
                    waves7.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm, Clone7*27, 0,Clone7*-13);
                }
                if (Clone8 != 0) {
                    waves8.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm,Clone8*-28, 0, Clone8*-15);
                }
            }
            waves0.render(heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm,0,0,0);
        }
    };
}

function alienModel(renderer, badge, glowTf) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_echo_echo" : "tmf:omnitrix/aliens/echo_echo");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/echo_echo").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(48));
        data.load(3, entity.getInterpolatedData("tmf:dyn/pt_1"));
        data.load(4, entity.getInterpolatedData("tmf:dyn/pc_1"));
        data.load(5, entity.getInterpolatedData("tmf:dyn/pt_3"));
        data.load(6, entity.getInterpolatedData("tmf:dyn/pc_3"));
        data.load(7, entity.getInterpolatedData("tmf:dyn/pt_4"));
        data.load(8, entity.getInterpolatedData("tmf:dyn/pc_4"));

        var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
        data.load(9, f > 0 ? Math.min((1 - f) * 2.5, 1) : 0);
        var beamCharge = entity.getInterpolatedData('fiskheroes:beam_charge');
        data.load(10, entity.getData("fiskheroes:beam_charging") ? beamCharge : 0);
        data.load(11, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));

        data.load(12, entity.getInterpolatedData("tmf:dyn/pt_7"));
        data.load(13, entity.getInterpolatedData("tmf:dyn/pc_7"));
        data.load(14, entity.getInterpolatedData("fiskheroes:shield_timer"));
    });
    modelAlien.texture.set("echo_echo", "echo_echo_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(1.4);
    alien.setOffset(0, -10.5,0);
    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, recal, glow, scream, shield) => {
            if (glowTf) {
                alien.opacity = glow;
                modelAlien.texture.set(null, "echo_echo_glow");
            }
            if (!glowTf) {
                if (badge) {
                    if (timeout) {
                        modelAlien.texture.set("omnitrix_recal", "omnitrix_timeout");
                    }
                    else if ((color == 0 && !recal) || color == 360) {
                        modelAlien.texture.set("omnitrix_recal", "omnitrix_white");
                    }
                    else {
                        modelAlien.texture.set("omnitrix_recal", "omnitrix_lights");
                    }
                }
                if (!badge) {
                    if ((scream + shield == 0)) {
                        modelAlien.texture.set("echo_echo", "echo_echo_lights");
                    }
                    else {
                        modelAlien.texture.set("echo_echo", "echo_echo_scream_lights");
                    }
                }
            }
            alien.setOffset(0, -10.5,-24*shield);
            alien.render();
        }
    };
}

function shield(renderer, scale, isCurrent) {
    var echoShield = renderer.bindProperty("fiskheroes:forcefield");
    echoShield.color.set(0xFFD3A8);
    echoShield.setShape(36, 18).setOffset(0.0, 6.0, 0.0);
    echoShield.setCondition(entity => {
        echoShield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * (0.15-0.01*scale) * (1-entity.loop(20));
        echoShield.setScale(1.55+scale*entity.getInterpolatedData("fiskheroes:shield_blocking_timer")*entity.loop(20));
        return isCurrent(entity);
    });
}

function wavesModel(renderer) {
    var modelWaves = renderer.createResource("MODEL", "tmf:omnitrix/powers/waves");
    modelWaves.texture.set("null", "echo2x_waves");
    var echo2xwaves = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var echo2xwaves1 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var echo2xwaves2 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var echo2xwaves3 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var echo2xwaves4 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    var echo2xwaves5 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);

    echo2xwaves.anchor.set("head");
    echo2xwaves1.anchor.set("head");
    echo2xwaves2.anchor.set("head");
    echo2xwaves3.anchor.set("head");
    echo2xwaves4.anchor.set("head");
    echo2xwaves5.anchor.set("head");

    return {
        echo2xwaves: echo2xwaves,
        echo2xwaves1: echo2xwaves1,
        echo2xwaves2: echo2xwaves2,
        echo2xwaves3: echo2xwaves3,
        echo2xwaves4: echo2xwaves4,
        echo2xwaves5: echo2xwaves5,
        render: (heatVisionTimer, heatVisionLength, blockSize, loop, rotX, rotY, rotZ,beamCharge, isFirstPersonArm, x,y,z) => {
            if (isFirstPersonArm) {
                echo2xwaves.anchor.ignoreAnchor(true);
                echo2xwaves1.anchor.ignoreAnchor(true);
                echo2xwaves2.anchor.ignoreAnchor(true);
                echo2xwaves3.anchor.ignoreAnchor(true);
                echo2xwaves4.anchor.ignoreAnchor(true);
                echo2xwaves5.anchor.ignoreAnchor(true);
                if (beamCharge) {
                    echo2xwaves.setScale(6.5 - (1 - heatVisionLength));
                    echo2xwaves.setOffset(0, 0, 12 * blockSize);
                    echo2xwaves.setRotation(-10 + rotX, rotY, rotZ);
                    echo2xwaves.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                    echo2xwaves1.setScale(5.5 + loop - (1 - heatVisionLength));
                    echo2xwaves1.setOffset(0, 0, 7 * blockSize + 5 * loop * blockSize);
                    echo2xwaves1.setRotation(-10 + rotX, rotY, rotZ);
                    echo2xwaves1.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                    echo2xwaves2.setScale(4.5 + loop - (1 - heatVisionLength));
                    echo2xwaves2.setOffset(0, 0, 4 * blockSize + 3 * loop * blockSize);
                    echo2xwaves2.setRotation(-10 + rotX, rotY, rotZ);
                    echo2xwaves2.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                    echo2xwaves3.setScale(3.75 + 0.75 * loop - (1 - heatVisionLength));
                    echo2xwaves3.setOffset(0, 0, 3 * blockSize + loop * blockSize);
                    echo2xwaves3.setRotation(-10 + rotX, rotY, rotZ);
                    echo2xwaves3.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                    echo2xwaves4.setScale(3.25 + 0.5 * loop - (1 - heatVisionLength));
                    echo2xwaves4.setOffset(0, 0, 2 * blockSize + loop * blockSize);
                    echo2xwaves4.setRotation(-10 + rotX, rotY, rotZ);
                    echo2xwaves4.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                    echo2xwaves5.setScale(3 + 0.25 * loop - (1 - heatVisionLength));
                    echo2xwaves5.setOffset(0, 0, 0.5 * blockSize + 1.5 * loop * blockSize);
                    echo2xwaves5.setRotation(-10 + rotX, rotY, rotZ);
                    echo2xwaves5.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;

                    echo2xwaves.render();
                    echo2xwaves1.render();
                    echo2xwaves2.render();
                    echo2xwaves3.render();
                    echo2xwaves4.render();
                    echo2xwaves5.render();
                }
            }
            if (!isFirstPersonArm) {
                echo2xwaves.anchor.ignoreAnchor(false);
                echo2xwaves1.anchor.ignoreAnchor(false);
                echo2xwaves2.anchor.ignoreAnchor(false);
                echo2xwaves3.anchor.ignoreAnchor(false);
                echo2xwaves4.anchor.ignoreAnchor(false);
                echo2xwaves5.anchor.ignoreAnchor(false);
                if (beamCharge) {
                    echo2xwaves.setScale(4.5 - (1 - heatVisionLength));
                    echo2xwaves.setOffset(x, y, z + 12 * blockSize * heatVisionTimer);
                    echo2xwaves.setRotation(rotX, rotY, rotZ);
                    echo2xwaves.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                    echo2xwaves1.setScale(3.5 + loop - (1 - heatVisionLength));
                    echo2xwaves1.setOffset(x, y, z+ 7 * blockSize * heatVisionTimer + 5 * loop * blockSize * heatVisionTimer);
                    echo2xwaves1.setRotation(rotX, rotY, rotZ);
                    echo2xwaves1.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                    echo2xwaves2.setScale(2.5 + loop - (1 - heatVisionLength));
                    echo2xwaves2.setOffset(x, y,z+  4 * blockSize * heatVisionTimer + 3 * loop * blockSize * heatVisionTimer);
                    echo2xwaves2.setRotation(rotX, rotY, rotZ);
                    echo2xwaves2.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                    echo2xwaves3.setScale(1.75 + 0.75 * loop - (1 - heatVisionLength));
                    echo2xwaves3.setOffset(x, y, z+3 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                    echo2xwaves3.setRotation(rotX, rotY, rotZ);
                    echo2xwaves3.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                    echo2xwaves4.setScale(1.25 + 0.5 * loop - (1 - heatVisionLength));
                    echo2xwaves4.setOffset(x, y,z+ 2 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                    echo2xwaves4.setRotation(rotX, rotY, rotZ);
                    echo2xwaves4.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                    echo2xwaves5.setScale(1 + 0.25 * loop - (1 - heatVisionLength));
                    echo2xwaves5.setOffset(x, y, z+ 0.5 * blockSize * heatVisionTimer + 1.5 * loop * blockSize * heatVisionTimer);
                    echo2xwaves5.setRotation(rotX, rotY, rotZ);
                    echo2xwaves5.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;

                    echo2xwaves.render();
                    echo2xwaves1.render();
                    echo2xwaves2.render();
                    echo2xwaves3.render();
                    echo2xwaves4.render();
                    echo2xwaves5.render();
                }
            }
        }
    };
}

function duplicateFuse(entity, blockDistance) {
    var angle = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle >= 315 || angle <= 45) && entity.world().blockAt(entity.pos().add(-blockDistance, 0.5, 0.5)).isSolid());
    var moveLook_Z = ((angle >= 135 && angle <= 225) && entity.world().blockAt(entity.pos().add(blockDistance, 0.5, -0.5)).isSolid());
    var moveLookX = ((angle > 45 && angle < 135) && entity.world().blockAt(entity.pos().add(0.5, 0.5, blockDistance)).isSolid());
    var moveLook_X = ((angle > 225 && angle < 315) && entity.world().blockAt(entity.pos().add(-0.5, 0.5, -blockDistance)).isSolid());

    var moveLookZ2 = ((angle >= 315 || angle <= 45) && entity.isOnGround() &&  !entity.world().blockAt(entity.pos().add(-blockDistance, -0.5, 0.5)).isSolid());
    var moveLook_Z2 = ((angle >= 135 && angle <= 225) && entity.isOnGround() && !entity.world().blockAt(entity.pos().add(blockDistance, -0.5, -0.5)).isSolid());
    var moveLookX2 = ((angle > 45 && angle < 135) && entity.isOnGround() && !entity.world().blockAt(entity.pos().add(0.5, -0.5, blockDistance)).isSolid());
    var moveLook_X2 = ((angle > 225 && angle < 315) && entity.isOnGround() && !entity.world().blockAt(entity.pos().add(-0.5, -0.5, -blockDistance)).isSolid());

    return ((moveLookZ || moveLook_Z || moveLookX || moveLook_X) || (moveLookZ2 || moveLook_Z2 || moveLookX2 || moveLook_X2));
}