function isTransformed(entity) {
    return (entity.getData("tmf:dyn/transformed") & 0x80) == 0;
}

function setTransformed(manager, entity, playlist, index) {
    manager.setDataWithNotify(entity, "tmf:dyn/transformed", index & 15 | (playlist & 7) << 4);
}

var canMsgHappen = true;

function create(instance, aliens) {
    var externals = [];
    for (var playlist = 0; playlist < aliens.length; ++playlist) {
        var array = [];
        Object.keys(aliens[playlist]).forEach(key => {
            var ext = instance.implement("tmf:external/" + key);
            ext.id = key;
            if (ext.hasOwnProperty("IMPLEMENTS") && typeof ext.IMPLEMENTS === "object") {
                Object.keys(ext.IMPLEMENTS).forEach(k => {
                    ext[k] = instance.implement(ext.IMPLEMENTS[k]);
                });
            }
            array.push(ext);
        });
        externals.push(array);
    }

    var getAlien = entity => {
        var b = entity.getData("tmf:dyn/transformed");
        if ((b & 0x80) != 0) {
            return null;
        }
        return {
            index: b & 15,
            playlist: (b >> 4) & 7,
            ext: externals[(b >> 4) & 7][b & 15]
        };
    };

    var tickHandler = (entity, manager, hero) => {
        var alien = getAlien(entity);
        var nbt = entity.getWornChestplate().nbt();
        var playerLock = entity.getWornChestplate().nbt().getString("userUUID") == entity.getUUID();
        var recal = nbt.getString("HeroType") == "tmf:omni_recal";
        displayAlien(entity, manager, alien, nbt);
        skillSystem(entity, manager, alien, nbt);
        failsafe(entity, manager, alien, hero, recal);
        tampering(entity, manager, nbt);
        captureMode(entity, manager, nbt, recal);
        selection(entity, manager);
        detransform(entity, manager, recal);

        //timer
        manager.incrementData(entity, "tmf:dyn/transformation_cooldown", recal ? 24000 : 12000, 3000, entity.getData("tmf:dyn/transformation"));

        if (alien != null) {
            externals.forEach((array, playlist) => {
                array.forEach((ext, index) => {
                    if (ext.hasOwnProperty("tick")) {
                        ext.tick(entity, manager, alien.playlist == playlist && alien.index == index, hero);
                    }
                });
            });
    
        }

        if (alien == null || recal) {
            var transTimer = entity.getData("tmf:dyn/transformation_timer");
            if (alien == null) {
                zsSkayr(entity, manager, nbt)
            }
            equipment(entity, manager, nbt, transTimer);
            recalibration(entity, manager, nbt)
            if (playerLock)  {
                equipGalvanicModulator(entity, manager, nbt, transTimer);
            }
            if (recal && entity.getData("tmf:dyn/playlist") != 2) {
                manager.setDataWithNotify(entity, "tmf:dyn/playlist", 2);
            }
            if (entity.getData("fiskheroes:gravity_manip") && (entity.getData("tmf:dyn/transformed") == -1 || recal)) {
                if (entity.getData("tmf:dyn/reset_selected")) {
                    manager.setData(entity, "fiskheroes:gravity_amount", 0);
                    manager.setData(entity, "tmf:dyn/reset_selected", false);
                }
                bind(entity, manager, nbt);
                var playlist = 0 + entity.getData("tmf:dyn/playlist");
                var size = (playlist == 1 ? 10 : Math.min(externals[playlist].length, (playlist == 0 && nbt.getTagList("DNA").getCompoundTag(getEquipmentSlotByIndex(nbt,5)).getBoolean("unlocked") == 1) ? 9 : 10));
                //var f = entity.getData("fiskheroes:gravity_amount");
                //if (f != 0) {
                //    var sel = entity.getData("tmf:dyn/selected");
                //    sel = (sel + Math.round(f * 3)) % size;
                //    while (sel < 0) {
                //        sel += size;
                //    }
                //    manager.setData(entity, "tmf:dyn/selected", sel);
                //    manager.setData(entity, "tmf:dyn/reset_selected", true);
                //}
                
                var f = entity.getData("fiskheroes:gravity_amount");
                if (f != 0) {
                    var dnaList = nbt.getTagList("DNA");
                    var sel = entity.getData("tmf:dyn/selected");
                    var change = Math.round(f * 3); // How much to increase/decrease by
                    
                    // Runs code once, before checking the condition on the while clause
                    do {
                        sel = (sel + change) % size;
                        while (sel < 0) {
                            sel += size;
                        }
                        
                        // For subsequent loops, clamp the change value to (-1, 1)
                        if (change > 1) {
                            change = 1;
                        }
                        else if (change < -1) {
                            change = -1;
                        }

                    }  while (playlist == 1 && dnaList.getCompoundTag(getEquipmentSlotByIndex(nbt,(sel | 0))).getBoolean("unlocked") != 1); // Repeat code until this condition is false
                    manager.setData(entity, "tmf:dyn/selected", sel);
                    manager.setData(entity, "tmf:dyn/reset_selected", true);
                }
                while (playlist == 1 && nbt.getTagList("DNA").getCompoundTag(getEquipmentSlotByIndex(nbt, entity.getData("tmf:dyn/selected"))).getBoolean("unlocked") != 1) {
                    var sel = entity.getData("tmf:dyn/selected");
                    sel = (sel + 1) % 10;
                    while (sel < 0) {
                        sel += 10;
                    }
                    manager.setData(entity, "tmf:dyn/selected", sel);
                }

                var isntSelectedAlien = entity.getData('tmf:dyn/transformed') != ((Math.min(Math.max(entity.getData("tmf:dyn/selected"), 0), size - 1)) & 15 | (playlist & 7) << 4);
                if ((entity.isPunching() && (transTimer == 0 || recal)) && isntSelectedAlien || entity.getData("tmf:dyn/zs_skayr")) {
                    if (recal && transTimer == 1) {
                        manager.setInterpolatedData(entity,"tmf:dyn/transformation_timer", 0)
                        manager.setDataWithNotify(entity,"tmf:dyn/transformation_cooldown", entity.getData("tmf:dyn/transformation_cooldown") + 0.025)
                    }
                    if (entity.getData("tmf:dyn/transformation_timer") == 0) {
                        manager.setDataWithNotify(entity, "tmf:dyn/transformation", true);
                        entity.playSound(recal ? "tmf:omnitrix.recal.transformation" : "tmf:omnitrix.transformation", recal ? 1.5 : 1, 0.9 + 0.2 * Math.random());
                        timerResetList(entity, manager);
                        entity.hurt(hero, "TRANSFORMATION_HEAL", "%1$s transformed too hard", 0.005);
        
                        if (PackLoader.getSide() == "SERVER") {
                            var outcomesAliens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                            var randomOutcomesAliens = outcomesAliens[Math.floor(Math.random() * outcomesAliens.length)];
        
                            var randomizer = [0, 1];
                            var randomizerOutcomes = (nbt.getBoolean("Mistransform") == false ? 1 : randomizer[Math.floor(Math.random() * randomizer.length)]);
        
                            if (randomizerOutcomes == 0 && !entity.getData('tmf:dyn/fusioned')) {
                                manager.setDataWithNotify(entity, "tmf:dyn/playlist", 0);
                                manager.setDataWithNotify(entity, "tmf:dyn/selected", randomOutcomesAliens);
                            }
        
                            var possibleFusions = [10, 11, 12];
                            var fusionResult = possibleFusions[Math.floor(Math.random() * possibleFusions.length)];
                            if (entity.getData('tmf:dyn/fusioned')) {
                                manager.setDataWithNotify(entity, "tmf:dyn/selected", fusionResult);
                            }
        
                            var sel = entity.getData("tmf:dyn/selected");
        
                            if (sel == 4 && playlist == 0 && nbt.getString("HeroType") == "tmf:omnitrix") {
                                manager.setString(nbt, "HeroType", "tmf:omnitrix_grey_matter");
                                manager.setDataWithNotify(entity, "tmf:dyn/grey_matter", true);
                            }
                            else if (sel == 6 && playlist == 1 && nbt.getString("HeroType") == "tmf:omnitrix") {
                                manager.setString(nbt, "HeroType", "tmf:omnitrix_upchuck");
                                manager.setDataWithNotify(entity, "tmf:dyn/upchuck", true);
                            }
                            else if (entity.getData("tmf:dyn/zs_skayr")) {
                                manager.setDataWithNotify(entity, "tmf:dyn/zs_skayr", false);
                                setTransformed(manager, entity, 1, 5);
                            }
                            else if (sel > 9 && sel < 13) {
                                setTransformed(manager, entity, 0, sel);
                                manager.setDataWithNotify(entity, "tmf:dyn/fusioned", false);
                            }
                            else {
                                setTransformed(manager, entity, playlist, Math.min(Math.max(sel, 0), size - 1));
                            }
                        }
                    }
                }
            }
            return;
        }

        return false;
    };

    var getAttributeProfile = entity => {
        var alien = getAlien(entity);
        if (alien == null) {
            return null;
        }
        if (typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("getAttributeProfile")) {
            return alien.ext.getAttributeProfile(entity);
        }
        return null;
    };

    var getDamageProfile = entity => {
        var alien = getAlien(entity);
        if (alien == null) {
            return null;
        }
        if (typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("getDamageProfile")) {
            return alien.ext.getDamageProfile(entity);
        }
        return null;
    };

    var hasPermission = (entity, permission) => {
        var alien = getAlien(entity);
        if (alien == null) {
            return false;
        }
        return typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("hasPermission") && alien.ext.hasPermission(entity, permission);
    };

    var hasProperty = (entity, property) => {
        var alien = getAlien(entity);
        if (alien == null) {
            return false;
        }
        return typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("hasProperty") && alien.ext.hasProperty(entity, property);
    };

    var isModifierEnabled = (entity, modifier) => {
        if (modifier.id().startsWith("always_")) {
            return true;
        }
        var alien = getAlien(entity);
        if (alien == null) {
            return modifier.id().startsWith("omnitrix_");
        }
        if (modifier.id().startsWith("transformation_")) {
            return true;
        }
        if (modifier.id().startsWith("galvanic_mod")) {
            return true;
        }
        if (modifier.id() == "failsafe") {
            return entity.getData("tmf:dyn/failsafe");
        }
        if (typeof alien.ext !== "undefined" && modifier.id().startsWith(alien.ext.id + "_")) {
            return !alien.ext.hasOwnProperty("isModifierEnabled") || alien.ext.isModifierEnabled(entity, modifier);
        }
        return false;
    };

    var isKeyBindEnabled = (entity, keyBind) => {
        var alien = getAlien(entity);
        var nbt = entity.getWornChestplate().nbt();
        var UUID = entity.getUUID();
        var UUIDList = (UUID == "ff3ffbbd-a969-4f65-9e16-93efec2ccf2a" || UUID == "uuid" || UUID == "uuid" || UUID == "ee0d6fcf-4305-4cdb-bf41-d836e3363632" || UUID == "00179667-7d45-4002-9144-a0595790e146" || UUID == "1da53221-4677-4edb-91ef-fa1c37d2902b" || UUID == "2132a3e1-02d9-48b6-86f6-d522688d9328" || UUID == "58c15c42-a9ef-4b3a-9b3d-8a68ab0d4d4f" || UUID == "24dfe4de-66c6-4ca6-ae75-7221a38ad991" || UUID == "936c75c3-c857-4d66-9d4c-a8644cbca3fc" || UUID == "1e451844-9590-4339-bc06-7c4be8274f39" || UUID == "30d4648b-40e0-4246-ae9a-4de188909afd" || UUID == "39a4f722-5156-49bd-84d7-2a60a91b5305" || UUID == "747416ab-7492-4ea8-91eb-1bee357f37b5" || UUID == "3a1d4bf2-134f-4f58-bfc1-e3cc1a45926e" || UUID == "61f38392-6a69-45f9-b728-cfe492519402" || UUID == "0666b4f3-418a-48b2-9c8e-df2e285f20de" || UUID == "5d0fa3d6-048f-4974-9246-3bbf01eacc9c" || UUID == "f3b9c094-c517-4b20-9774-6a97ee236c8a" || UUID == "89a27184-94d1-441c-b6e9-9ed2e27e9034" || UUID == "70958436-1737-465a-9114-c2906977a044" || UUID == "fbabc817-0414-4da4-9231-839d36f8c07d" || UUID == "170efdee-0cbd-4765-b9d5-f4165108c580" || UUID == "199590c0-738d-41a0-900b-2216cd4b6c59" || UUID == "5f08bb4b-5e37-43fa-8edc-83295906bbf8" || UUID == "a1c1df4b-3add-4a16-a714-a5d40aa0d313" || UUID == "a550a100-340d-4f43-bee2-fa76d0f05164" || UUID == "5849435b-3539-4bb9-9ece-eff6e796cb27" || UUID == "31959ac8-edfb-46c1-bba9-8699d9c8c111" || UUID == "9e0e5a82-3275-4f99-acac-95e62285dc25" || UUID == "62e2746c-3f6a-40b9-b54b-630a9f731c49" || UUID == "4c6f2582-7625-4209-a7b1-e708109ce278" || UUID == "770f9407-4e08-4472-9d3a-1c4cca2267e4" || UUID == "5520e168-ad03-4af8-8ec2-174b4ebcfa37" || UUID == "fa4f3e19-a02b-4416-8f7e-819d7358a697" || UUID == "b139f1a5-0cba-440b-b1c6-3dafe3ffcda5" || UUID == "07459db6-35fb-45b7-809c-0f39b976ed56" || UUID == "ba30e09e-5d08-4518-94ef-85da3082ef3d" || UUID == "70397a8c-6c52-49f0-8cd8-b844269a90f0" || UUID == "ea29c89a-6ec7-4c96-a0d7-14f4e46c3302" || UUID == "88dd4a11-2f91-489b-b616-0ff096886a2c" || UUID == "dbe72e2e-9a7b-4282-aac6-994d96f839c6" || UUID == "1c5e1f64-3896-467a-9572-5611b2fc595e" || UUID == "5f555826-cfa2-4604-9cda-5718bc702224" || UUID == "a22f551e-559a-4d0c-a0f6-9e8b0a2f2bc7" || UUID == "7c8d7c79-f641-42e4-8532-677daf4a7b65" || UUID == "7b81eb5e-c995-4688-bc5d-f9b89e0d3e57" || UUID == "ea0e078e-cf78-4530-a221-17e8bf7e813e" || UUID == "26af4156-e897-488c-add2-25ad5c6a95b8" || UUID == "9158afac-7d2f-4d0d-968b-ac5751b27560" || UUID == "f0925d3c-11e2-4bcb-9bd2-0c99dfae7173" || UUID == "199590c0-738d-41a0-900b-2216cd4b6c59" || UUID == "bdc4f0d8-486f-408d-ae34-e57c7b98786f" || UUID == "a5ec9493-7a1a-4d4d-9edd-08d5e15733da" || UUID == "d5175a0b-5d75-408a-a7bb-81cd3ae284f7" || UUID == "7f6cd36c-ac89-46c8-9dbe-9365685756c0");
        var playerLock = entity.getWornChestplate().nbt().getString("userUUID") == entity.getUUID();
        var item = entity.getHeldItem();
        var screwdriverHeld = item.name() == "fisktag:weapon" && item.nbt().getString("WeaponType") == "tmf:screwdriver";
        var galvanicModulator = nbt.getTagList('Equipment').getCompoundTag(0).getCompoundTag('Item').getCompoundTag('tag').getString("WeaponType").contains("tmf:omnitrix_hack");
        var selT = entity.getData("tmf:dyn/selecting_timer");
        var recal = entity.getWornChestplate().nbt().getString("HeroType") == "tmf:omni_recal";

        if ((playerLock || nbt.getBoolean("Used") == false)) {
            if (!galvanicModulator){
                if (entity.getHeldItem().isEmpty()) {
                    if ((((entity.getInterpolatedData("tmf:dyn/transformation_cooldown") <= 0.005 || entity.as("PLAYER").isCreativeMode()) && alien == null)  || recal) && !entity.isSneaking()) {
                        if (keyBind == "GRAVITY_MANIPULATION") {
                            return !nbt.getBoolean("recalReady");
                        }
                        if (keyBind == "CYCLE_PLAYLISTS") {
                            return nbt.getBoolean("p2") && selT>= 0.4 && selT != 1 && !recal;
                        }

                    }
                }
            }
        }

        if (alien == null) {
            if ((playerLock || nbt.getBoolean("Used") == false)) {
                if (galvanicModulator) {
                    if (keyBind == "GALVANIC_MOD") {
                        return true;
                    }
                    if (keyBind == "TAMPER_MISTRANSFORM") {
                        return entity.getData("tmf:dyn/galvan_mod_timer") == 1;
                    }
                    if (keyBind == "TAMPER_FUSION") {
                        return entity.getData("tmf:dyn/galvan_mod_timer") == 1;
                    }
                    if (keyBind == "TAMPER_BWB") {
                        return entity.getData("tmf:dyn/galvan_mod_timer") == 1;
                    }
                }   
                if (!galvanicModulator && !entity.getData("tmf:dyn/recal") ){
                    if (keyBind == "func_TAMPER") {
                        return playerLock && screwdriverHeld && entity.getData("tmf:dyn/tamper_timer") == 0 && !recal && !nbt.getBoolean("recalReady");
                    }
                    if (entity.getHeldItem().isEmpty()) {
                        if (keyBind == "func_COLOR") {
                            return entity.isSneaking() && UUIDList && !nbt.getBoolean("recalReady");
                        }
                        if (keyBind == "func_RECAL") {
                            return nbt.getBoolean("recalReady") && !recal;
                        }
                        if ((entity.getInterpolatedData("tmf:dyn/transformation_cooldown") <= 0.005 || entity.as("PLAYER").isCreativeMode()) && !entity.isSneaking()) {
                            if (keyBind == "CAPTURE_MODE") {
                                return nbt.getBoolean("p2") && selT == 1 && !recal && !nbt.getBoolean("recalReady");
                            }
                        }
                    }
                    if (keyBind == "func_DNA_UPLOAD") {
                        return playerLock && entity.getHeldItem().name() == "fiskheroes:suit_data_drive" && !recal && !nbt.getBoolean("recalReady");
                    }
                }
            }
            return false;
        }

        if (keyBind == "func_REVERT") {
            return entity.getData("tmf:dyn/timeout") == false && ((entity.as("PLAYER").isCreativeMode() && !recal) || (recal && entity.isSneaking()));
        }
        if (keyBind == "AIM") {
            return typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("canAim") && alien.ext.canAim(entity);
        }
        return typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("isKeyBindEnabled") && alien.ext.isKeyBindEnabled(entity, keyBind);
    };

    var canAim = entity => {
        var alien = getAlien(entity);
        if (alien == null) {
            return false;
        }
        return typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("canAim") && alien.ext.canAim(entity);
    };

    var getDefaultScale = entity => {
        var alien = getAlien(entity);
        if (alien != null && typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("getDefaultScale")) {
            return alien.ext.getDefaultScale(entity);
        }
        return 1.0;
    };

    var getTierOverride = entity => {
        var alien = getAlien(entity);
        if (alien != null && typeof alien.ext !== "undefined" && alien.ext.hasOwnProperty("getTierOverride")) {
            return alien.ext.getTierOverride(entity);
        }
        return 0;
    };

    return {
        init: hero => {
            hero.addKeyBind("GRAVITY_MANIPULATION", "\u00A7aSelect Alien", 5);
            hero.addKeyBindFunc("func_REVERT", revertKey, "\u00A7cRevert", 5);
            hero.addKeyBindFunc("CYCLE_PLAYLISTS", playlistKey, "\u00A7aSelect Alien", 5);
            hero.addKeyBindFunc("func_COLOR", colorKey, "\u00A7aChange Color", 5);
            hero.addKeyBindFunc("func_DNA_UPLOAD", dnaUploadKey, "\u00A7aUpload", 4);
            hero.addKeyBindFunc("func_TAMPER", tamperKey, "\u00A7cTamper", 5);
            hero.addKeyBind("GALVANIC_MOD", "\u00A7aActivate Galvanic Modulator", 5);
            hero.addKeyBindFunc("CAPTURE_MODE", captureKey, "\u00A7eCapture Mode", 4);

            hero.addKeyBindFunc("func_RECAL", recalKey, "\u00A7aSelect Alien", 5);

            hero.addKeyBindFunc("TAMPER_MISTRANSFORM", mistransform, "Set Mistransformations", 1);
            hero.addKeyBindFunc("TAMPER_FUSION", fusion, "Trigger Fusion", 2);
            hero.addKeyBindFunc("TAMPER_BWB", BWB, "Set Waybig Size", 3);

            externals.forEach(key => key.forEach(k => k.init(hero)));

            hero.setModifierEnabled(isModifierEnabled);
            hero.setKeyBindEnabled(isKeyBindEnabled);
            hero.setHasPermission(hasPermission);
            hero.setHasProperty(hasProperty);
            hero.setDefaultScale(getDefaultScale);
            hero.supplyFunction("canAim", canAim);

            hero.setAttributeProfile(getAttributeProfile);
            hero.setDamageProfile(getDamageProfile);
            hero.setTierOverride(getTierOverride);

            hero.setTickHandler((entity, manager) => {tickHandler(entity, manager, hero)});

            hero.addDamageProfile("TRANSFORMATION_HEAL", {
                "types": {
                    "BLUNT": 1.0
                },
                "properties": {
                    "HIT_COOLDOWN": 0,
                    "EFFECTS": [
                      {
                        "id": "minecraft:instant_health",
                        "duration": 5,
                        "amplifier": 3,
                        "chance": 1.0
                      }
                    ]
                  }
            });
            hero.addDamageProfile("FAILSAFE", {
                "types": {
                    "BLUNT": 1.0
                },
                "properties": {
                    "HIT_COOLDOWN": 0,
                    "EFFECTS": [
                      {
                        "id": "minecraft:instant_health",
                        "duration": 40,
                        "amplifier": 10000,
                        "chance": 1.0
                      }
                    ]
                  }
            });
            hero.addDamageProfile("FAILSAFE_DAMAGE", {
                "types": {
                    "ENERGY": 1.0
                },
                "properties": {
                    "HIT_COOLDOWN": 5,
                    "EFFECTS": [
                      {
                        "id": "minecraft:slowness",
                        "duration": 60,
                        "amplifier": 1,
                        "chance": 1.0
                      }
                    ]
                  }
            });
        }
    };
}

function revertKey(player, manager) {
    if (isTransformed(player)) {
        manager.setData(player, "tmf:dyn/timeout", true);
        manager.setData(player, "tmf:dyn/timeout2", true);
        return true;
    }
    return false;
}

function tamperKey(player, manager) {
    manager.setData(player, "tmf:dyn/tamper", true);
    return true;
}

function captureKey(player, manager) {
    manager.setData(player, "tmf:dyn/captureMode", !player.getData('tmf:dyn/captureMode'));
    return true;
}
function playlistKey(player, manager) {
    var playlist = player.getData("tmf:dyn/playlist");
    manager.setData(player, "tmf:dyn/playlist", playlist == 1 ? 0 : playlist + 1);

    return true;
}

function colorKey(player, manager) {
    var nbt = player.getWornChestplate().nbt();
    var currentColor = nbt.getInteger("Color");
    manager.setInteger(nbt, "Color", currentColor % 30 != 0 ? 0 : (currentColor == 360 ? 0 : currentColor + 30));
    return true;
}

function displayAlien(entity, manager, alien, nbt) {
    if (entity.ticksExisted() % 20 == 0) {
        if (entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
            manager.setDouble(nbt, "posY", entity.posY());
        }
        if (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM" && entity.world().blockAt(entity.pos().add(0, 255 + nbt.getDouble("posY"), 0)).name() == "fiskheroes:titanium_block") {
            var displayAlien = entity.world().getBlockMetadata(entity.pos().add(0, 254 + nbt.getDouble("posY"), 0));
            var displayPlaylist = Math.min(entity.world().getBlockMetadata(entity.pos().add(0, 253 + nbt.getDouble("posY"), 0)), 2);
            if (alien == null) {
                var displaySize = (displayPlaylist == 1 ? 9 : 12);

                manager.setDataWithNotify(entity, "tmf:dyn/transformation", true);
                manager.setData(entity, 'tmf:dyn/transformation_cooldown', 0);
                setTransformed(manager, entity, displayPlaylist + 0, Math.min(displayAlien, displaySize) + 0);

                manager.setData(entity, 'tmf:dyn/prevDisplayAlien', displayAlien);
                manager.setData(entity, 'tmf:dyn/prevDisplayPlaylist', displayPlaylist);
            }
            else if (displayAlien != entity.getData('tmf:dyn/prevDisplayAlien') || displayPlaylist != entity.getData('tmf:dyn/prevDisplayPlaylist')) {
                manager.setData(entity, "tmf:dyn/timeout", true);
                manager.setData(entity, "tmf:dyn/timeout2", true);
            }
        }
    }
    return true;
}

function skillSystem(entity, manager, alien, nbt) {
    if (alien != null && alien.ext.id && entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
        var SL = nbt.getByte(alien.ext.id);
        if (SL < 60) {
            if (entity.getHeldItem().name() == 'minecraft:bedrock') {
                manager.setByte(nbt, alien.ext.id, 15);
            }
            if (entity.getHeldItem().name() == 'fisktag:barrier') {
                manager.setByte(nbt, alien.ext.id, 59);
            }
            if (SL > 15 && entity.getData('tmf:dyn/levelUp') == 1) {
                manager.setData(entity, "tmf:dyn/levelUp", 0);
            }
            else {
                var time_worn = entity.getData("tmf:dyn/time_worn");
                if (time_worn > 1200) {
                    time_worn = 0;
                    manager.setByte(nbt, alien.ext.id, SL + 1);
                }
                manager.setData(entity, "tmf:dyn/time_worn", time_worn + 1);
            }
            
            manager.incrementData(entity, "tmf:dyn/levelUp", 20, SL == 15 || SL == 59);
    
            if (entity.getData("tmf:dyn/levelUp") == 1 && SL == 59) {
                manager.setByte(nbt, alien.ext.id, 60);
            }
        }
    }
    return true;
}

function failsafe(entity, manager, alien, hero, recal) {
    if (alien == null) {
        if (entity.getHealth() < 3 && entity.getData("fiskheroes:time_since_damaged") == 2) {
            manager.setData(entity, "tmf:dyn/failsafe", true);
            entity.playSound(recal ? "tmf:omnitrix.recal.transformation" : "tmf:omnitrix.transformation", recal ? 1.5 : 1.0, 0.9 + 0.2 * Math.random());
        }
        manager.incrementData(entity, "tmf:dyn/failsafe_timer", 4, entity.getData("tmf:dyn/failsafe")); 
        if (entity.getData("tmf:dyn/failsafe_timer") == 1) {
            entity.hurt(hero, "FAILSAFE", "%1$s's Failsafe Failed", 0.005);
            manager.setData(entity, "tmf:dyn/transformation_cooldown", 0);
            manager.setData(entity, "tmf:dyn/failsafe", false);
    
            var list = entity.world().getEntitiesInRangeOf(entity.pos(), 10);
            for (var i = 0; i < list.size(); ++i) {
                var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
                    other.hurtByAttacker(hero, "FAILSAFE_DAMAGE", "%2$s got killed by %1$s's Failsafe", 20, entity);
                }
            }
        }
    }
    return true;
}

function tampering(entity, manager, nbt) {
    var item = entity.getHeldItem();
    var screwdriverHeld = item.name() == "fisktag:weapon" && item.nbt().getString("WeaponType") == "tmf:screwdriver";
        manager.incrementData(entity, "tmf:dyn/tamper_timer", 160, entity.getData("tmf:dyn/tamper"));   
            if (entity.getData('tmf:dyn/tamper_timer') != 0 && !screwdriverHeld) {
                manager.setData(entity, 'tmf:dyn/tamper', false);
            }
            if (entity.getData('tmf:dyn/tamper_timer') >= 0.6 && entity.getData('tmf:dyn/tamper_timer') <= 0.7 && entity.getData("tmf:dyn/tamper")) {
                entity.playSound("tmf:omnitrix.alien_cycle", 0.5, 0.9 + 0.2 * Math.random());
            }
            if (entity.getInterpolatedData('tmf:dyn/tamper_timer') == 1 && entity.getData("tmf:dyn/tamper")) {
                if (PackLoader.getSide() == "SERVER") {
                    var BWB = nbt.getBoolean("BigWayBig");
                    var waybig = nbt.getTagList("DNA").getCompoundTag(getEquipmentSlotByIndex(nbt,9)).getBoolean("unlocked") == 1 ? 5 : 0;
                    var tamperOutcomes = [waybig, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3];
                    // 0 mistransformations // 1 mistransformation fix // 2 change cooldown // 3 fusion // 4 Alien // 5 BWB
                    
                    var randomTamperOutcomes = tamperOutcomes[Math.floor(Math.random() * tamperOutcomes.length)];
                    var cooldown = entity.getData("tmf:dyn/transformation_cooldown");
                
                    manager.setDataWithNotify(entity, 'tmf:dyn/randomTamperOutcomes', randomTamperOutcomes);
                    var randomTamperOutcomes2 = entity.getData("tmf:dyn/randomTamperOutcomes");
                
                    if (randomTamperOutcomes2 == 0) {
                        manager.setBoolean(nbt, "Mistransform", true);
                        if (entity.is("PLAYER")) {
                            entity.as("PLAYER").addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A7c Mistransformations On");
                        }
                    }
                    if (randomTamperOutcomes2 == 1) {
                        manager.setBoolean(nbt, "Mistransform", false);
                        if (entity.is("PLAYER")) {
                            entity.as("PLAYER").addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A72 Mistransformations Off");
                        }
                    }
                    if (randomTamperOutcomes2 == 2) {
                        manager.setDataWithNotify(entity, "tmf:dyn/transformation_cooldown", cooldown < 0.6 ? cooldown+0.3 : cooldown);
                        if (entity.is("PLAYER")) {
                            entity.as("PLAYER").addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A7c Cooldown Added");
                        }
                    }
                    if (randomTamperOutcomes2 == 3) {
                        manager.setDataWithNotify(entity, "tmf:dyn/fusioned", true);
                        if (entity.is("PLAYER")) {
                            entity.as("PLAYER").addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A74 MalfunctionDetected");
                        }
                    }
                    if (randomTamperOutcomes2 == 5) {
                        manager.setBoolean(nbt, "BigWayBig", !BWB);
                        if (entity.is("PLAYER")) {
                            entity.as("PLAYER").addChatMessage("Way..." + (nbt.getBoolean("BigWayBig") ? "Bigger?" : "Smaller."));
                        }
                    }
                }
                manager.setDataWithNotify(entity, 'tmf:dyn/tamper', false);
            }
    return true;
}

function captureMode(entity, manager, nbt, recal) {
    manager.incrementData(entity, "tmf:dyn/captureModeTimer", 1200, entity.getData("tmf:dyn/captureMode"));

    if (entity.getData("tmf:dyn/captureModeTimer") == 1) {
        manager.setData(entity, 'tmf:dyn/captureMode', false);
    }

    var nbt = entity.getWornChestplate().nbt();
    var dnaList = nbt.getTagList("DNA");

    var list = entity.world().getEntitiesInRangeOf(entity.pos(), 5);
    if (entity.ticksExisted() % 4000 == 0 && entity.getData("tmf:dyn/captureMode")) {
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (!entity.equals(other) && other.getWornChestplate().nbt().getString("HeroType").startsWith("tmf:omnitrix") && other.getData("tmf:dyn/transformed") > 15 && dnaList.getCompoundTag(getEquipmentSlotByIndex(nbt,((other.getData("tmf:dyn/transformed")-16) | 0))).getBoolean("unlocked") != 1) {
                manager.removeTag(dnaList, getEquipmentSlotByIndex(nbt, ((other.getData("tmf:dyn/transformed")-16) | 0)));
                var ItemTag = manager.newCompoundTag("{Index:"+((other.getData("tmf:dyn/transformed")-16) | 0)+", unlocked:true}");
                manager.appendTag(dnaList, ItemTag);

                manager.setDataWithNotify(entity, "tmf:dyn/transformed", other.getData("tmf:dyn/transformed"));
                manager.setDataWithNotify(other, "tmf:dyn/transformed", other.getData("tmf:dyn/transformed")-16);
                manager.setDataWithNotify(entity, "tmf:dyn/transformation", true);
                entity.playSound(recal ? "tmf:omnitrix.recal.transformation" : "tmf:omnitrix.transformation", recal ? 1.5 : 1, 0.9 + 0.2 * Math.random());
                timerResetList(entity, manager);

                if (!nbt.getBoolean("p2")) {
                    manager.setBoolean(nbt, "p2", true);
                }
            }
        }       
    }

    manager.setTagList(nbt, "DNA", dnaList);

}

function selection(entity, manager) {
    var selected = entity.getData('tmf:dyn/selected');
    var selTimer2 = entity.getData('tmf:dyn/selecting_timer2');
    var gravManip = entity.getData('fiskheroes:gravity_manip');

    manager.incrementData(entity, "tmf:dyn/selecting_timer", 5, gravManip);
    manager.incrementData(entity, "tmf:dyn/selecting_timer2", 10, !entity.getData('tmf:dyn/selecting') && gravManip && ((entity.getData('tmf:dyn/selected2') != selected) || selTimer2 != 0));
    manager.setData(entity, "tmf:dyn/selected2", selected);
    if (selTimer2 == 1) {
        manager.setData(entity, "tmf:dyn/selecting", true);
    }
    if (selTimer2 == 0) {
        manager.setData(entity, "tmf:dyn/selecting", false);
    }
    if (!gravManip && selected > 9 && selected < 13) {
        manager.setData(entity, "tmf:dyn/selected", 0);
    }
}

function detransform(entity, manager, recal) {
    if (isTransformed(entity) && entity.getInterpolatedData("tmf:dyn/transformation_cooldown") > 0.985 && !entity.getData("tmf:dyn/timeout")) {
        manager.setData(entity, "tmf:dyn/timeout", true);
        manager.setData(entity, "tmf:dyn/timeout2", true);
        return true;
    }
    if (entity.getData("tmf:dyn/timeout") == true) {
        manager.incrementData(entity, "tmf:dyn/timeout_timer", recal ? 5 : 70, 1);
        if (entity.getData("tmf:dyn/timeout_timer") == 1) {
            manager.setData(entity, "tmf:dyn/selected", 0);
            manager.setData(entity, "tmf:dyn/timeout", false);
            manager.setData(entity, "tmf:dyn/timeout_timer", 0);
            manager.setData(entity, "tmf:dyn/transformation", false);
            manager.setData(entity, "tmf:dyn/transformed", -1);
        }
    }
}

function timerResetList(entity, manager) {
    manager.setData(entity, "tmf:dyn/p_1", false);
    manager.setData(entity, "tmf:dyn/p_2", false);
    manager.setData(entity, "tmf:dyn/p_3", false);
    manager.setData(entity, "tmf:dyn/p_4", false);
    manager.setData(entity, "tmf:dyn/p_5", false);
    manager.setData(entity, "tmf:dyn/p_6", false);
    manager.setData(entity, "tmf:dyn/p_7", false);
    manager.setData(entity, "tmf:dyn/p_8", 0)
    manager.setData(entity, "tmf:dyn/p_9", 0)

    manager.setData(entity, "tmf:dyn/pt_1", 0);
    manager.setData(entity, "tmf:dyn/pt_2", 0);
    manager.setData(entity, "tmf:dyn/pt_3", 0);
    manager.setData(entity, "tmf:dyn/pt_4", 0)
    manager.setData(entity, "tmf:dyn/pt_5", 0)
    manager.setData(entity, "tmf:dyn/pt_6", 0)
    manager.setData(entity, "tmf:dyn/pt_7", 0)
    manager.setData(entity, "tmf:dyn/pt_8", 0)
    manager.setData(entity, "tmf:dyn/pt_9", 0)

    manager.setData(entity, "tmf:dyn/pc_1", 0);
    manager.setData(entity, "tmf:dyn/pc_2", 0);
    manager.setData(entity, "tmf:dyn/pc_3", 0);
    manager.setData(entity, "tmf:dyn/pc_4", 0);
    manager.setData(entity, "tmf:dyn/pc_5", 0);
    manager.setData(entity, "tmf:dyn/pc_6", 0);
    manager.setData(entity, "tmf:dyn/pc_7", 0);
    manager.setData(entity, "tmf:dyn/pc_8", 0)
    manager.setData(entity, "tmf:dyn/pc_9", 0)

    manager.setData(entity, "tmf:dyn/time_worn", 0);
    manager.setData(entity, "tmf:dyn/levelUp", 0);
    manager.setData(entity, "tmf:dyn/pi_4", 0);
    manager.setData(entity, "fiskheroes:dyn/intangibility_cooldown", 0);
    manager.setData(entity, "tmf:dyn/upgrade_liquified", false);
    manager.setData(entity, "tmf:dyn/upgrade_liquified_timer", 0);
    manager.setData(entity, "tmf:dyn/upgrade_liquified_cooldown", 0);
    manager.setData(entity, "tmf:dyn/upgrade", null);
    manager.setData(entity, "tmf:dyn/captureMode", false);
    manager.setData(entity, "tmf:dyn/captureModeTimer", 0);
    manager.setData(entity, "tmf:dyn/heatblast_tornado", false);
    manager.setData(entity, "tmf:dyn/heatblast_tornado_timer", 0);
    manager.setData(entity, "tmf:dyn/heatblast_meteor", false);
    manager.setData(entity, "tmf:dyn/heatblast_meteor_timer", 0);
    manager.setData(entity, "tmf:dyn/xlrate_punch", false);
    manager.setData(entity, "tmf:dyn/xlrate_punch_timer", 0);
    manager.setData(entity, "tmf:dyn/grey_matter_panther", false);
    manager.setData(entity, "tmf:dyn/grey_matter_panther_timer", 0);
}

function bind(entity, manager, nbt) {
    if (nbt.getBoolean("Used") == false && nbt.getString("HeroType") == "tmf:omnitrix" && entity.is("PLAYER")) {
            manager.setBoolean(nbt, "Used", true);
                if (PackLoader.getSide() == "SERVER") {
                    entity.as("PLAYER").addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A7a\u00A7lThe Omnitrix \u00A7rhas been genetically bound to \u00A75\u00A7l" + entity.getName());
                }
            var display = nbt.getCompoundTag("display");
            manager.setString(nbt, "userUUID", entity.getUUID());

            manager.setCompoundTag(nbt, "display", display);
            manager.setString(display, "Name", "The Omnitrix Prototype");

        }
    if (nbt.getBoolean("NeedsUnlock") == true && nbt.getString("HeroType") == "tmf:omnitrix") {
        manager.setBoolean(nbt, "NeedsUnlock", false);
    }
    var dnaList = nbt.getTagList("DNA");
    if (dnaList.tagCount() < 1) {
        for (var i = 0; i < 10; ++i) {
            var ItemTag = manager.newCompoundTag("{Index:"+i+", unlocked:false}");
            manager.appendTag(dnaList, ItemTag);
        }
        manager.setTagList(nbt, "DNA", dnaList);
    }
}

function equipment(entity, manager, nbt, transTimer) {
    if (nbt.getString("HeroType") != "tmf:omnitrix" && nbt.getString("HeroType").startsWith("tmf:omnitrix_") && transTimer == 0) {
        if (!entity.getData("tmf:dyn/grey_matter") && !entity.getData("tmf:dyn/grey_matter_crafting") && !entity.getData("tmf:dyn/upchuck")) {
            manager.setTagList(nbt, nbt.getString("HeroType"), nbt.getTagList("Equipment"));
            manager.setString(nbt, "HeroType", "tmf:omnitrix");
        }
        var gm = (nbt.getString("HeroType") == "tmf:omnitrix_grey_matter" && entity.getData("tmf:dyn/grey_matter"));
        var gm2 = (nbt.getString("HeroType") == "tmf:omnitrix_grey_matter_crafting" && entity.getData("tmf:dyn/grey_matter_crafting"));
        var uc = (nbt.getString("HeroType") == "tmf:omnitrix_upchuck" && entity.getData("tmf:dyn/upchuck"));
        if (gm || uc || gm2) {
            if (gm) {
                manager.setDataWithNotify(entity, "tmf:dyn/grey_matter", false);
                setTransformed(manager, entity, 0, 4);
            }
            if (gm2) {
                manager.setDataWithNotify(entity, "tmf:dyn/grey_matter_crafting", false);
                setTransformed(manager, entity, 0, 4);
            }
            if (uc) {
                manager.setDataWithNotify(entity, "tmf:dyn/upchuck", false);
                setTransformed(manager, entity, 1, 6);
            }
            manager.setTagList(nbt, "Equipment", nbt.getTagList(nbt.getString("HeroType")));
            manager.setDataWithNotify(entity, "tmf:dyn/transformation", true);
        }
    }
}

function equipGalvanicModulator(entity, manager, nbt, transTimer) {
    var nbt = entity.getWornChestplate().nbt();	
    var nbtHeld = entity.getHeldItem().nbt();	
    var galvanicModulator = nbt.getTagList('Equipment').getCompoundTag(0).getCompoundTag('Item').getCompoundTag('tag').getString("WeaponType").contains("tmf:omnitrix_hack");

    if (nbtHeld.getString("WeaponType") == "tmf:omnitrix_hack" && nbt.getString("HeroType") == "tmf:omnitrix" && transTimer == 0) {
            manager.setString(nbt, "HeroType", "tmf:omni_galvanic_modulator");
    }
    if (!galvanicModulator && nbtHeld.getString("WeaponType") != "tmf:omnitrix_hack" && nbt.getString("HeroType") == "tmf:omni_galvanic_modulator") {
            manager.setString(nbt, "HeroType", "tmf:omnitrix");
    }
    if (nbt.getBoolean("Fusion") && entity.ticksExisted() % 20 == 0 && nbt.getString("HeroType") == "tmf:omnitrix") {
        manager.setBoolean(nbt, "Fusion", false);
        manager.setDataWithNotify(entity, "tmf:dyn/fusioned", true);
    }
}

function mistransform(player, manager) {
    var nbt = player.getWornChestplate().nbt();;
    manager.setBoolean(nbt, "Mistransform", !nbt.getBoolean("Mistransform"));
    if (PackLoader.getSide() == "SERVER") {
        if (!nbt.getBoolean("Mistransform")) {
            player.addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A72 Mistransformations Off");
        }
        else {
            player.addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A7c Mistransformations On");
        }
    }
    return true;
}

function fusion(player, manager) {
    var nbt = player.getWornChestplate().nbt();;
    manager.setBoolean(nbt, "Fusion", true);
    if (PackLoader.getSide() == "SERVER") {
        player.addChatMessage("\u00A72\u00A7l<\u00A7aOMNITRIX\u00A72\u00A7l>\u00A74 MalfunctionDetected");
    }
    return true;
}
function BWB(player, manager) {
    var nbt = player.getWornChestplate().nbt();
    manager.setBoolean(nbt, "BigWayBig", !nbt.getBoolean("BigWayBig"));
    if (PackLoader.getSide() == "SERVER") {
        player.addChatMessage("Way..." + (nbt.getBoolean("BigWayBig") ? "Bigger?" : "Smaller."));
    }
    return true;
}

function dnaUploadKey(player, manager) {
    var nbt = player.getWornChestplate().nbt();
    var datadrive = player.getHeldItem().name() == "fiskheroes:suit_data_drive";
    var suitList = player.getHeldItem().nbt().getStringList('Suits');
    var dnaList = nbt.getTagList("DNA");

    for (var i = 0; i < suitList.tagCount(); ++i) {
        var entry = suitList.getString(i);
            if (entry.startsWith("tmf:dna_") && dnaList.getCompoundTag(getEquipmentSlotByIndex(nbt,((entry.slice(-2)-16) | 0))).getBoolean("unlocked") != 1) {
                manager.removeTag(dnaList, getEquipmentSlotByIndex(nbt, ((entry.slice(-2)-16) | 0)));
                var ItemTag = manager.newCompoundTag("{Index:"+((entry.slice(-2)-16) | 0)+", unlocked:true}");
                manager.appendTag(dnaList, ItemTag);

                if (!nbt.getBoolean("p2")) {
                    manager.setBoolean(nbt, "p2", true);
                }
            }
            if (entry == "tmf:not_hero_time" && dnaList.getCompoundTag(0).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(1).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(2).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(3).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(4).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(5).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(6).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(7).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(8).getBoolean("unlocked") == 1 && dnaList.getCompoundTag(9).getBoolean("unlocked") == 1) {
                manager.setBoolean(nbt, "recalReady", true);
                }        
            }        

    manager.setTagList(nbt, "DNA", dnaList);
    return true;
}

function getEquipmentSlotByIndex(nbt, slot) {
    var dnaList = nbt.getTagList("DNA");
    for (var i = 0; i < dnaList.tagCount(); ++i) {
        var entry = dnaList.getCompoundTag(i);
        if (entry.getByte("Index") == slot) {
            return i;
        }
    }
    return null;
}

function recalKey(player, manager) {
    var nbt = player.getWornChestplate().nbt();
    manager.setData(player, "tmf:dyn/recal", true);
    manager.setInteger(nbt, "Color", 0);
    player.playSound("tmf:omnitrix.recal.recalibration", 2, 0.9 + 0.2 * Math.random());
    return true;
}

function recalibration(entity, manager, nbt) {
    manager.incrementData(entity, "tmf:dyn/recal_timer", 1200, entity.getData("tmf:dyn/recal"));
    if (entity.getData("tmf:dyn/recal_timer") == 1 && entity.getData("tmf:dyn/recalibrating") == 0) {
        entity.playSound("tmf:omnitrix.recal.recalibrating", 2, 1.0);
    }
    manager.incrementData(entity, "tmf:dyn/recalibrating", 35, entity.getData("tmf:dyn/recal_timer") == 1);
    if (entity.getData("tmf:dyn/recalibrating") == 1) {
        manager.setInterpolatedData(entity, 'tmf:dyn/recalibrating', 0);  
        manager.setBoolean(nbt, "recalReady", false);
        manager.setString(nbt, "HeroType", "tmf:omni_recal");

        var display = nbt.getCompoundTag("display");
        manager.setCompoundTag(nbt, "display", display);
        manager.setString(display, "Name", "The Recalibrated Omnitrix");
    }
}
function zsSkayr(entity, manager, nbt) {
    if (nbt.getByte("ghostfreak") >= 60 && entity.getData("tmf:dyn/playlist") == 0 && entity.getData('fiskheroes:gravity_manip') && entity.getData('tmf:dyn/selected') == 9 && !entity.getData('tmf:dyn/zs_skayr')) {
        if (entity.getData('tmf:dyn/pc_1') == 0) {
            entity.playSound("tmf:zsSkayr.unlocked", 1, 0.9 + 0.2 * Math.random());
        } 
        manager.incrementData(entity, "tmf:dyn/pc_1", 20, true);
        if (entity.getData('tmf:dyn/pc_1') == 1) {
            var dnaList = nbt.getTagList("DNA");
            manager.removeTag(dnaList, getEquipmentSlotByIndex(nbt, 5));
            var ItemTag = manager.newCompoundTag("{Index:5, unlocked:true}");
            manager.appendTag(dnaList, ItemTag);
            manager.setData(entity, "tmf:dyn/zs_skayr", true);
        } 
    } 
    else {
        manager.setInterpolatedData(entity, "tmf:dyn/pc_1", 0);
    }
}
