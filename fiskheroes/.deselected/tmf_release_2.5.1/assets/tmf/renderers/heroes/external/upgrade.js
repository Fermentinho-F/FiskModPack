var LOADTEXTURES = {
    "null": "tmf:null",
    "upgrade": "tmf:omnitrix/p1/aliens/upgrade",
    "upgrade1": "tmf:omnitrix/p1/aliens/upgrade_1",
    "upgrade2": "tmf:omnitrix/p1/aliens/upgrade_2",
    "upgrade3": "tmf:omnitrix/p1/aliens/upgrade_3",
    "upgrade_lights": "tmf:omnitrix/p1/lights/upgrade_lights.tx.json",
    "upgrades_lights": "tmf:omnitrix/p1/lights/upgrades_lights.tx.json",
    "upgrade_piston": "tmf:omnitrix/p1/aliens/upgrade_piston",
    "upgrade_speaker": "tmf:omnitrix/p1/aliens/upgrade_speaker",
    "upgrade_anvil": "tmf:omnitrix/p1/aliens/upgrade_anvil",
    "upgrade_candy": "tmf:omnitrix/p1/aliens/upgrade_candy",
    "upgrade_waves": "tmf:omnitrix/p1/lights/upgrade_waves.tx.json",
    "mk50": "tmf:omnitrix/p1/aliens/upgrade_mk50.tx.json",
    "mk50_lights": "tmf:omnitrix/p1/lights/upgrade_mk50.tx.json",
    "upgradeMk50_segment": "tmf:omnitrix/p1/aliens/upgradeMk50_segment",
    "upgradeMk50_segment_lights": "tmf:omnitrix/p1/lights/upgradeMk50_segment_lights.tx.json",
    "upgrade_mk50_blade": "tmf:omnitrix/p1/aliens/upgrade_mk50_blade",
    "upgrade_mk50_blade_lights": "tmf:omnitrix/p1/lights/upgrade_mk50_blade_lights.tx.json",
    "upgrade_mk50_booster": "tmf:omnitrix/p1/aliens/upgrade_mk50_booster",
    "upgrade_mk50_booster_lights": "tmf:omnitrix/p1/lights/upgrade_mk50_booster_lights.tx.json",
    "cannon1": "tmf:omnitrix/p1/aliens/upgrade_c1",
    "cannon2": "tmf:omnitrix/p1/aliens/upgrade_c2",
    "cannon1_lights": "tmf:omnitrix/p1/lights/upgrade_c1_lights.tx.json",
    "cannon2_lights": "tmf:omnitrix/p1/lights/upgrade_c2_lights.tx.json",
    "cannon_inner": "tmf:omnitrix/p1/lights/upgrade_cinner.tx.json"

};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien1 = alienModel(renderer, false, 1);
    var alien2 = alienModel(renderer, false, 2);
    var alien3 = alienModel(renderer, false, 3);
    var badge = alienModel(renderer, true, 1);

    var beam = utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:upgrade_beam", "body", 0xbaf43c, [
        { "offset": [0.0, -6.5, -4.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => {
        if (isCurrent(entity) && entity.getData("tmf:dyn/upgrade") == null) {
            beam.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            return true;
        }
        return false;
    });
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "body", 0xF3985B, [
        { "firstPerson": [0, 4.75, -10.0], "offset": [0.0, 7.0, -24.0], "size": [1.5, 1.5, -1.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData('tmf:dyn/upgrade') == "fiskheroes:masonry_oven" && entity.getData('tmf:dyn/pc_2') == 1 && isCurrent(entity));

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));

    var upgradeNightVision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        upgradeNightVision.factor = 0.5;
        upgradeNightVision.firstPersonOnly = true;
        return isCurrent(entity);
    });

    addAnimation(renderer, "upgrade.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' ? 0 : 1);
    }).setCondition(entity => isCurrent(entity));

    var modelUpgradeLiquid = renderer.createResource("MODEL", "tmf:omnitrix/aliens/upgrade_liquid");
    modelUpgradeLiquid.texture.set("upgrade", "upgrade_lights");
    var upgradeLiquid = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeLiquid);
    upgradeLiquid.anchor.ignoreAnchor(true);

    var modelUpgradeArm1 = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_rArm");
    modelUpgradeArm1.texture.set("upgrade1", "upgrade_lights");
    var upgradeArm1 = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeArm1);
    upgradeArm1.anchor.set("rightArm");

    var modelUpgradeArm2 = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_rArm");
    modelUpgradeArm2.texture.set("upgrade2", "upgrade_lights");
    var upgradeArm2 = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeArm2);
    upgradeArm2.anchor.set("rightArm");

    var modelUpgradeArm3 = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_rArm");
    modelUpgradeArm3.texture.set("upgrade3", "upgrade_lights");
    var upgradeArm3 = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeArm3);
    upgradeArm3.anchor.set("rightArm");

    var modelUpgradePiston = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_piston");
    modelUpgradePiston.bindAnimation("tmf:omnitrix/powers/upgrade_piston").setData((entity, data) => {
        data.load(0, entity.getData('fiskheroes:beam_charging') ? entity.getInterpolatedData('fiskheroes:beam_charge') : 0);
        data.load(1, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
        data.load(2, entity.getInterpolatedData('tmf:dyn/pt_2'));
        data.load(3, entity.isSneaking() ? 1 : 0);
        data.load(4, entity.loop(120));
    });
    modelUpgradePiston.texture.set("upgrade_piston", "upgrades_lights");
    var upgradePiston = renderer.createEffect("fiskheroes:model").setModel(modelUpgradePiston);
    upgradePiston.anchor.ignoreAnchor(true);


    var modelUpgradeNoteblock = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_speaker");
    modelUpgradeNoteblock.bindAnimation("tmf:omnitrix/powers/upgrade_speaker").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('fiskheroes:heat_vision_timer'));
        data.load(1, entity.getData('fiskheroes:heat_vision'));
        data.load(2, entity.loop(32));
    });
    modelUpgradeNoteblock.texture.set("upgrade_speaker", "upgrades_lights");
    var upgradeNoteblock = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeNoteblock);
    upgradeNoteblock.anchor.ignoreAnchor(true);

    var modelUpgradeAnvil = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_anvil");
    modelUpgradeAnvil.bindAnimation("tmf:omnitrix/powers/upgrade_anvil").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('fiskheroes:flight_boost_timer'));
    });
    modelUpgradeAnvil.texture.set("upgrade_anvil", "upgrades_lights");
    var upgradeAnvil = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeAnvil);
    upgradeAnvil.anchor.ignoreAnchor(true);
    var modelUpgradeAnvil2 = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_anvil_boosters");
    modelUpgradeAnvil2.texture.set("upgrade_anvil", "upgrades_lights");
    var upgradeAnvil2 = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeAnvil2);
    upgradeAnvil2.anchor.ignoreAnchor(true);

    var modelUpgradeCandy = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_candy");
    modelUpgradeCandy.bindAnimation("tmf:omnitrix/powers/upgrade_candy").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pc_2'));
        data.load(1, entity.loop(24));
        data.load(2, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
    });
    modelUpgradeCandy.texture.set("upgrade_candy", "upgrades_lights");
    var upgradeCandy = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeCandy);
    upgradeCandy.anchor.ignoreAnchor(true);

    var modelUpgradeMk50Booster = renderer.createResource("MODEL", "tmf:omnitrix/powers/upgrade_mk50_booster");
    modelUpgradeMk50Booster.texture.set("upgrade_mk50_booster", "upgrade_mk50_booster_lights");
    var upgradeMk50Booster = renderer.createEffect("fiskheroes:model").setModel(modelUpgradeMk50Booster);
    upgradeMk50Booster.anchor.set("body");
    upgradeMk50Booster.setRotation(3, 0, 0);

    iconUpgrade = renderer.createResource("ICON", "fiskheroes:repulsor_layer_%s");

    var upgradehandR = renderer.createEffect("fiskheroes:booster").setIcon(iconUpgrade);
    upgradehandR.setOffset(1.0, 10.0, 0.0).setSize(2.0, 2.0);
    upgradehandR.anchor.set("rightArm");

    var upgradehandL = renderer.createEffect("fiskheroes:booster").setIcon(iconUpgrade);
    upgradehandL.setOffset(-1.0, 10.0, 0.0).setSize(2.0, 2.0);
    upgradehandL.anchor.set("leftArm");

    var upgradeboots = renderer.createEffect("fiskheroes:booster").setIcon(iconUpgrade);
    upgradeboots.setOffset(0.0, 12.0, 0.0).setSize(2.5, 3.0);
    upgradeboots.anchor.set("rightLeg");
    upgradeboots.mirror = true;

    upgradeback = renderer.createEffect("fiskheroes:booster").setIcon(iconUpgrade);
    upgradeback.setOffset(2.5, 3.6, 1.75).setSize(1.25, 3.0);
    upgradeback.anchor.set("body");
    upgradeback.mirror = true;

    var upgradeBoost = renderer.createEffect("fiskheroes:booster").setIcon(iconUpgrade);
    upgradeBoost.setOffset(0.0, 24.0, 0.0).setRotation(11, 0, 0).setSize(7.0, 1.7);
    upgradeBoost.anchor.set("body");

    utils.addFlightAnimation(renderer, "upgrade.FLIGHT", "fiskheroes:flight/default.anim.json").setCondition(entity => isCurrent(entity) && (entity.getData('tmf:dyn/upgrade') == 'minecraft:anvil' && entity.getData('tmf:dyn/upgrade_liquified')));


    utils.addFlightAnimationWithLanding(renderer, "upgrade_iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json").setCondition(entity => isCurrent(entity) && (entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' && entity.getData('tmf:dyn/upgrade_liquified')));
    utils.addHoverAnimation(renderer, "upgrade_iron_man.HOVER", "fiskheroes:flight/idle/iron_man").setCondition(entity => isCurrent(entity) && (entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' && entity.getData('tmf:dyn/upgrade_liquified')));

    addAnimationWithData(renderer, "upgrade_iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .setCondition(entity => isCurrent(entity) && (entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' && entity.getData('tmf:dyn/upgrade_liquified'))).priority = -8;

    addAnimationWithData(renderer, "upgrade_iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .setCondition(entity => isCurrent(entity) && (entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' && entity.getData('tmf:dyn/upgrade_liquified'))).priority = 10;

    var forcefieldUpgrade = renderer.bindProperty("fiskheroes:forcefield");
    forcefieldUpgrade.color.set(0xbaf43c);
    forcefieldUpgrade.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefieldUpgrade.setCondition(entity => {
        if ((isCurrent(entity) && (entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' && entity.getData('tmf:dyn/upgrade_liquified')))) {
            forcefieldUpgrade.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            forcefieldUpgrade.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
            return true;
        }
        return false;
    });

    renderer.removeCustomAnimation("basic.BLOCKING");

    var beam2 = utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "tmf:upgrade_beam", "rightArm", 0xbaf43c, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [4.5, 4.5] }
    ]).setCondition(entity => {
        if (isCurrent(entity) && entity.getData("tmf:dyn/upgrade") == 'fiskheroes:superhero_chestplate' && entity.getData('tmf:dyn/upgrade_liquified')) {
            beam2.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            return true;
        }
        return false;
    });




    var modelWaves = renderer.createResource("MODEL", "tmf:omnitrix/powers/waves");
    modelWaves.texture.set("null", "upgrade_waves");
    var waves = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves.anchor.ignoreAnchor(true);
    var waves1 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves1.anchor.ignoreAnchor(true);
    var waves2 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves2.anchor.ignoreAnchor(true);
    var waves3 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves3.anchor.ignoreAnchor(true);
    var waves4 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves4.anchor.ignoreAnchor(true);
    var waves5 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves5.anchor.ignoreAnchor(true);
    var waves6 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves6.anchor.ignoreAnchor(true);
    var waves7 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves7.anchor.ignoreAnchor(true);
    var waves8 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves8.anchor.ignoreAnchor(true);
    var waves9 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves9.anchor.ignoreAnchor(true);
    var waves10 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves10.anchor.ignoreAnchor(true);
    var waves11 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves11.anchor.ignoreAnchor(true);
    var waves12 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves12.anchor.ignoreAnchor(true);
    var waves13 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves13.anchor.ignoreAnchor(true);
    var waves14 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves14.anchor.ignoreAnchor(true);
    var waves15 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves15.anchor.ignoreAnchor(true);
    var waves16 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves16.anchor.ignoreAnchor(true);
    var waves17 = renderer.createEffect("fiskheroes:model").setModel(modelWaves);
    waves17.anchor.ignoreAnchor(true);


    var upgradeMk50TentacleArm = utils.createModel(renderer, "fiskheroes:ock_arm", "upgradeMk50_segment", "upgradeMk50_segment_lights");
    var upgradeMk50TentacleClaw = utils.createModel(renderer, "tmf:omnitrix/powers/upgrade_mk50_claw", "upgrade_mk50_blade", "upgrade_mk50_blade_lights");
    var tentaclesUpgrade = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        { "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] }
    ]);
    tentaclesUpgrade.anchor.set("body");
    tentaclesUpgrade.setSegmentModel(upgradeMk50TentacleArm);
    tentaclesUpgrade.setHeadModel(upgradeMk50TentacleClaw);
    tentaclesUpgrade.segmentLength = 1.8;
    tentaclesUpgrade.segments = 16;
    tentaclesUpgrade.setCondition(entity => isCurrent(entity));

    addAnimationWithData(renderer, "upgrade.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
    .setCondition(entity => isCurrent(entity) && !entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
    .priority = 10;

    return {
        getTexture: entity => entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' ? 'mk50' : "null",
        getLights: entity => entity.getData('tmf:dyn/upgrade') == 'fiskheroes:superhero_chestplate' ? 'mk50_lights' : "null",
        render: (entity, isFirstPersonArm) => {
            var mot = Math.sqrt(Math.pow(entity.motionInterpolated().x(), 2) + Math.pow(entity.motionInterpolated().z(), 2));
            var mot1 = Math.max(2 * Math.sin(Math.PI * 2 * entity.loop(30)) * mot, mot * 0.8);
            var mot2 = 1.4 * Math.sin(Math.PI * -2 * entity.loop(34)) * mot;
            var motY = Math.min(entity.motionInterpolated().y(), 0.8);
            var liquified = entity.getInterpolatedData('tmf:dyn/upgrade_liquified_timer');
            var Upgrade = entity.getData('tmf:dyn/upgrade');
            var timer2 = (Math.min(1.1 * liquified, 1));
            var timer3 = (Math.min(1.2 * liquified, 1));
            var glideTimer = entity.getInterpolatedData('fiskheroes:gliding_timer');
            var flightTimer = entity.getInterpolatedData('fiskheroes:flight_timer');
            var loop = entity.loop(5);
            var heatVisionTimer = entity.getInterpolatedData('fiskheroes:heat_vision_timer');
            var heatVisionLength = entity.getInterpolatedData('fiskheroes:heat_vision_length') / 12;
            var blockSize = -(((16 / 15) / 1.3) * 16) * heatVisionLength;
            var rotX = 5 * Math.sin(2 * Math.PI * entity.loop(6));
            var rotY = 5 * Math.sin(2 * Math.PI * entity.loop(6) + 0.5 * Math.PI);
            var rotZ = 2 * Math.sin(2 * Math.PI * entity.loop(9));
            var PT2 = entity.getInterpolatedData('tmf:dyn/pt_2');
            var flightBoost = entity.getInterpolatedData('tmf:dyn/pt_3');

            if (isFirstPersonArm) {
                if (glideTimer == 0 && liquified != 1) {
                    upgradeArm1.setScale(2 * liquified + 1, 1 - liquified, 2 * liquified + 1);
                    upgradeArm1.setOffset(0, 12 + 12 * liquified, 7);
                    upgradeArm1.render();

                    upgradeArm2.setScale(2 * liquified + 1 - 0.05 * timer2, 1 - timer2, 2 * liquified + 1 - 0.05 * timer2);
                    upgradeArm2.setOffset(0, 12 + 12 * timer2, 7);
                    upgradeArm2.render();

                    upgradeArm3.setScale(2 * liquified + 1, 1 - timer3, 2 * liquified + 1);
                    upgradeArm3.setOffset(0, 12 + 12 * timer3, 7);
                    upgradeArm3.render();
                }
                if (liquified != 0) {
                    if (Upgrade == "minecraft:noteblock") {
                        if (entity.getData("fiskheroes:heat_vision")) {
                            waves.setScale(6.5 - (1 - heatVisionLength));
                            waves.setOffset(0, 0, 12 * blockSize);
                            waves.setRotation(-10 + rotX, rotY, rotZ);
                            waves.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                            waves.render();
                            waves1.setScale(5.5 + loop - (1 - heatVisionLength));
                            waves1.setOffset(0, 0, 7 * blockSize + 5 * loop * blockSize);
                            waves1.setRotation(-10 + rotX, rotY, rotZ);
                            waves1.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                            waves1.render();
                            waves2.setScale(4.5 + loop - (1 - heatVisionLength));
                            waves2.setOffset(0, 0, 4 * blockSize + 3 * loop * blockSize);
                            waves2.setRotation(-10 + rotX, rotY, rotZ);
                            waves2.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                            waves2.render();
                            waves3.setScale(3.75 + 0.75 * loop - (1 - heatVisionLength));
                            waves3.setOffset(0, 0, 3 * blockSize + loop * blockSize);
                            waves3.setRotation(-10 + rotX, rotY, rotZ);
                            waves3.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                            waves3.render();
                            waves4.setScale(3.25 + 0.5 * loop - (1 - heatVisionLength));
                            waves4.setOffset(0, 0, 2 * blockSize + loop * blockSize);
                            waves4.setRotation(-10 + rotX, rotY, rotZ);
                            waves4.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                            waves4.render();
                            waves5.setScale(3 + 0.25 * loop - (1 - heatVisionLength));
                            waves5.setOffset(0, 0, 0.5 * blockSize + 1.5 * loop * blockSize);
                            waves5.setRotation(-10 + rotX, rotY, rotZ);
                            waves5.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;
                            waves5.render();

                            waves6.setScale(6.5 - (1 - heatVisionLength));
                            waves6.setOffset(0, 16, 12 * blockSize);
                            waves6.setRotation(10 + rotX, rotY, rotZ);
                            waves6.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                            waves6.render();
                            waves7.setScale(5.5 + loop - (1 - heatVisionLength));
                            waves7.setOffset(0, 16, 7 * blockSize + 5 * loop * blockSize);
                            waves7.setRotation(10 + rotX, rotY, rotZ);
                            waves7.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                            waves7.render();
                            waves8.setScale(4.5 + loop - (1 - heatVisionLength));
                            waves8.setOffset(0, 16, 4 * blockSize + 3 * loop * blockSize);
                            waves8.setRotation(10 + rotX, rotY, rotZ);
                            waves8.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                            waves8.render();
                            waves9.setScale(3.75 + 0.75 * loop - (1 - heatVisionLength));
                            waves9.setOffset(0, 16, 3 * blockSize + loop * blockSize);
                            waves9.setRotation(10 + rotX, rotY, rotZ);
                            waves9.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                            waves9.render();
                            waves10.setScale(3.25 + 0.5 * loop - (1 - heatVisionLength));
                            waves10.setOffset(0, 16, 2 * blockSize + loop * blockSize);
                            waves10.setRotation(10 + rotX, rotY, rotZ);
                            waves10.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                            waves10.render();
                            waves11.setScale(3 + 0.25 * loop - (1 - heatVisionLength));
                            waves11.setOffset(0, 16, 0.5 * blockSize + 1.5 * loop * blockSize);
                            waves11.setRotation(10 + rotX, rotY, rotZ);
                            waves11.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;
                            waves11.render();
                        }
                    }
                }
            }
            if (!isFirstPersonArm) {
                if (liquified != 1) {
                    alien1.render(pull(entity, "color"), pull(entity, "timeout"), liquified, glideTimer, timer2, timer3);
                    alien2.render(pull(entity, "color"), pull(entity, "timeout"), liquified, glideTimer, timer2, timer3);
                    alien3.render(pull(entity, "color"), pull(entity, "timeout"), liquified, glideTimer, timer2, timer3);
                    badge.render(pull(entity, "color"), pull(entity, "timeout"), liquified, glideTimer, timer2, timer3);    
                }
                if (liquified != 0) {
                    if (Upgrade == null) {
                        upgradeLiquid.setScale((1 + mot1 - motY) * 10 * liquified, 1, (1 + mot2 - motY) * 10 * liquified);
                        upgradeLiquid.setOffset(0, -entity.isSneaking(), 0);
                        upgradeLiquid.render();
                    }
                    if (Upgrade != null && liquified != 1) {
                        upgradeLiquid.setScale(Math.sin(Math.PI * liquified) * 6, 1, Math.sin(Math.PI * liquified) * 6);
                        upgradeLiquid.setOffset(0, -entity.isSneaking(), 0);
                        upgradeLiquid.render();
                    }
                    if (Upgrade == "minecraft:piston") {
                        upgradePiston.setScale(0.4 + 0.6 * liquified, liquified, 0.4 + 0.6 * liquified);
                        upgradePiston.setOffset(0, 24 * (1 - liquified), 0);
                        upgradePiston.render();
                    }
                    if (Upgrade == "minecraft:noteblock") {
                        upgradeNoteblock.setScale(0.4 + 0.6 * liquified, liquified, 0.4 + 0.6 * liquified);
                        upgradeNoteblock.setOffset(0, 24 * (1 - liquified), 0);
                        upgradeNoteblock.render();

                        if (entity.getData("fiskheroes:heat_vision")) {
                            waves.setScale(4.5 - (1 - heatVisionLength));
                            waves.setOffset(0, 0, 12 * blockSize * heatVisionTimer);
                            waves.setRotation(rotX, rotY, rotZ);
                            waves.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                            waves.render();
                            waves1.setScale(3.5 + loop - (1 - heatVisionLength));
                            waves1.setOffset(0, 0, 7 * blockSize * heatVisionTimer + 5 * loop * blockSize * heatVisionTimer);
                            waves1.setRotation(rotX, rotY, rotZ);
                            waves1.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                            waves1.render();
                            waves2.setScale(2.5 + loop - (1 - heatVisionLength));
                            waves2.setOffset(0, 0, 4 * blockSize * heatVisionTimer + 3 * loop * blockSize * heatVisionTimer);
                            waves2.setRotation(rotX, rotY, rotZ);
                            waves2.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                            waves2.render();
                            waves3.setScale(1.75 + 0.75 * loop - (1 - heatVisionLength));
                            waves3.setOffset(0, 0, 3 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                            waves3.setRotation(rotX, rotY, rotZ);
                            waves3.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                            waves3.render();
                            waves4.setScale(1.25 + 0.5 * loop - (1 - heatVisionLength));
                            waves4.setOffset(0, 0, 2 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                            waves4.setRotation(rotX, rotY, rotZ);
                            waves4.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                            waves4.render();
                            waves5.setScale(1 + 0.25 * loop - (1 - heatVisionLength));
                            waves5.setOffset(0, 0, 0.5 * blockSize * heatVisionTimer + 1.5 * loop * blockSize * heatVisionTimer);
                            waves5.setRotation(rotX, rotY, rotZ);
                            waves5.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;
                            waves5.render();

                            waves6.setScale(4.5 - (1 - heatVisionLength));
                            waves6.setOffset(0, 16, 12 * blockSize * heatVisionTimer);
                            waves6.setRotation(rotX, rotY, rotZ);
                            waves6.opacity = (0.1 - 0.1 * loop) * heatVisionTimer;
                            waves6.render();
                            waves7.setScale(3.5 + loop - (1 - heatVisionLength));
                            waves7.setOffset(0, 16, 7 * blockSize * heatVisionTimer + 5 * loop * blockSize * heatVisionTimer);
                            waves7.setRotation(rotX, rotY, rotZ);
                            waves7.opacity = (0.3 - 0.2 * loop) * heatVisionTimer;
                            waves7.render();
                            waves8.setScale(2.5 + loop - (1 - heatVisionLength));
                            waves8.setOffset(0, 16, 4 * blockSize * heatVisionTimer + 3 * loop * blockSize * heatVisionTimer);
                            waves8.setRotation(rotX, rotY, rotZ);
                            waves8.opacity = (0.5 - 0.2 * loop) * heatVisionTimer;
                            waves8.render();
                            waves9.setScale(1.75 + 0.75 * loop - (1 - heatVisionLength));
                            waves9.setOffset(0, 16, 3 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                            waves9.setRotation(rotX, rotY, rotZ);
                            waves9.opacity = (0.4 + 0.1 * loop) * heatVisionTimer;
                            waves9.render();
                            waves10.setScale(1.25 + 0.5 * loop - (1 - heatVisionLength));
                            waves10.setOffset(0, 16, 2 * blockSize * heatVisionTimer + loop * blockSize * heatVisionTimer);
                            waves10.setRotation(rotX, rotY, rotZ);
                            waves10.opacity = (0.3 + 0.1 * loop) * heatVisionTimer;
                            waves10.render();
                            waves11.setScale(1 + 0.25 * loop - (1 - heatVisionLength));
                            waves11.setOffset(0, 16, 0.5 * blockSize * heatVisionTimer + 1.5 * loop * blockSize * heatVisionTimer);
                            waves11.setRotation(rotX, rotY, rotZ);
                            waves11.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;
                            waves11.render();
                        }
                        if (entity.motionY() > 0.1) {
                            waves12.setScale(4.5 - (1 - PT2));
                            waves12.setOffset(0, 16 * PT2 * 8, 0);
                            waves12.setRotation(90 + rotX, rotY, rotZ);
                            waves12.opacity = (0.1 - 0.1 * loop) * PT2;
                            waves12.render();
                            waves13.setScale(3.5 + loop - (1 - PT2));
                            waves13.setOffset(0, 16 * PT2 * 6, 0);
                            waves13.setRotation(90 + rotX, rotY, rotZ);
                            waves13.opacity = (0.3 - 0.2 * loop) * PT2;
                            waves13.render();
                            waves14.setScale(2.5 + loop - (1 - PT2));
                            waves14.setOffset(0, 16 * PT2 * 4.5, 0);
                            waves14.setRotation(90 + rotX, rotY, rotZ);
                            waves14.opacity = (0.5 - 0.2 * loop) * PT2;
                            waves14.render();
                            waves15.setScale(1.75 + 0.75 * loop - (1 - PT2));
                            waves15.setOffset(0, 16 * PT2 * 3, 0);
                            waves15.setRotation(90 + rotX, rotY, rotZ);
                            waves15.opacity = (0.4 + 0.1 * loop) * PT2;
                            waves15.render();
                            waves16.setScale(1.25 + 0.5 * loop - (1 - PT2));
                            waves16.setOffset(0, 16 * PT2 * 2, 0);
                            waves16.setRotation(90 + rotX, rotY, rotZ);
                            waves16.opacity = (0.3 + 0.1 * loop) * PT2;
                            waves16.render();
                            waves17.setScale(1 + 0.25 * loop - (1 - PT2));
                            waves17.setOffset(0, 16 * PT2, 0);
                            waves17.setRotation(90 + rotX, rotY, rotZ);
                            waves17.opacity = (0.2 + 0.1 * loop) * heatVisionTimer;
                            waves17.render();
                        }
                    }
                    if (Upgrade == "minecraft:anvil") {
                        upgradeAnvil.setScale(0.1 + 0.9 * liquified, liquified, 0.1 + 0.9 * liquified);
                        upgradeAnvil.setOffset(0, 24 * (1 - liquified), 0);
                        upgradeAnvil.render();
                        if (flightTimer > 0) {
                            upgradeAnvil2.setScale(0.1 + 0.9 * flightTimer * liquified, flightTimer * liquified, 0.1 + 0.9 * flightTimer * liquified);
                            upgradeAnvil2.setOffset(0, 24 * (1 - flightTimer * liquified), 0);
                            upgradeAnvil2.render();
                        }
                    }
                    if (Upgrade == "fiskheroes:masonry_oven") {
                        upgradeCandy.setScale(0.1 + 0.9 * liquified, liquified, 0.1 + 0.9 * liquified);
                        upgradeCandy.setOffset(0, 24 * (1 - liquified), 0);
                        upgradeCandy.render();
                    }
                    if (Upgrade == "fiskheroes:superhero_chestplate") {
                        if (flightBoost > 0) {
                            upgradeMk50Booster.setScale(0.6 + 0.4 * flightBoost, 0.6+0.4*flightBoost, 0.6 + 0.4 * flightBoost);
                            upgradeMk50Booster.render();
                        }

                        var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
                        var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                        var fR = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
                        var fL = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");

                        upgradehandR.progress = fR;
                        upgradehandL.progress = fL;
                        upgradehandR.speedScale = upgradehandL.speedScale = 0.5 * boost;
                        upgradehandR.flutter = upgradehandL.flutter = 1 + boost;

                        upgradehandR.setRotation(0, 0, -7 * flight - 10 * boost);
                        upgradehandL.setRotation(0, 0, 7 * flight + 10 * boost);
                        upgradehandR.render();
                        upgradehandL.render();

                        upgradeback.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                        upgradeback.speedScale = 0.5 * boost;
                        upgradeback.setRotation(25 - 10 * boost, 0.0, 10 - 5 * boost);
                        upgradeback.render();

                        var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                        upgradeboots.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer") * (1-flightBoost);
                        upgradeboots.speedScale = 0.5 * boost;
                        upgradeboots.flutter = 1 + boost;

                        var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
                        f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
                        upgradeboots.setSize(2.5 + f * 4, 3.0 - f * 3.9);
                        upgradeboots.render();

                        upgradeBoost.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer") * flightBoost;
                        upgradeBoost.speedScale = 0.5 * boost;
                        upgradeBoost.render();
                    }
                }
            }
        }
    };
}

function alienModel(renderer, badge, texture) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_upgrade" : "tmf:omnitrix/aliens/upgrade");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/upgrade").setData((entity, data) => {
        data.load(0, entity.loop(100));
        data.load(1, entity.getPunchTimerInterpolated());
        data.load(2, entity.isSneaking() ? 1 : 0);
        data.load(3, entity.getInterpolatedData('fiskheroes:gliding_timer'));
    });
    modelAlien.texture.set("upgrade"+texture, "upgrade_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setOffset(0,0,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, liquified, glideTimer, timer2, timer3) => {
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
            if (texture == 1) {
                alien.setScale(2 * liquified + 0.9 + 4 * glideTimer, 0.9 - liquified + 2 * glideTimer, 2 * liquified + 0.9 - 0.5 * glideTimer);
                alien.setOffset(0, 24 * liquified+3, 0);
            }
            else if (texture == 2) {
                alien.setScale(2 * liquified + 0.9 - 0.05 * timer2 + 4 * glideTimer, 0.9 - timer2 + 2 * glideTimer, 2 * liquified + 0.9 - 0.05 * timer2 - 0.5 * glideTimer);
                alien.setOffset(0, 24 * timer2+3, 0);
            }
            else {
                alien.setScale(2 * liquified + 0.9 + 4 * glideTimer, 0.9 - timer3 + 2 * glideTimer, 2 * liquified + 0.9 - 0.5 * glideTimer);
                alien.setOffset(0, 24 * timer3+3, 0);
            }
            alien.render();
        }
    };
}