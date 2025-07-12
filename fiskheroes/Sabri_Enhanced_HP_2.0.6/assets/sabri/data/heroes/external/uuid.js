function _0x1b47(){var _0xc356c1=['ff3ffbbd-a969-4f65-9e16-93efec2ccf2a','9229AoxOlr','19e779ac-d60a-47b9-bd96-a22ecfccdb7d','415muIJHx','6GmxGjW','100MrGhDR','232482ZvEMUa','bddd8949-5b73-4b4b-b789-4a6f8bdad305','52d1e4a0-062a-4623-8ac9-4f9ee790f40d','0624d064-95d5-42d7-b183-046158b3004e','b4c163bb-ea00-4624-8a36-b58095a70408','1409992sFyjUu','30177iSBQOR','f5d9b50e-e2be-48a8-acd8-02cb3111ac60','279222QRbAOe','3037482cBWqiC','1c5e1f64-3896-467a-9572-5611b2fc595e','5930LhxruQ','396UYEDSf','dd76aa6a-9b50-4ef9-a16f-14e73cb20766','e52f3f21-457d-4724-9121-673ed31478e8','cf0601e8-65e0-415e-90fa-b764c430c197','6060a012-5d08-4ed2-be25-90fe9dacd8e2','67d36fb7-f2c2-4234-a28e-552cd96a2f27','18c2d3c3-adf0-4b18-8f75-faa3c5e82c76'];_0x1b47=function(){return _0xc356c1;};return _0x1b47();}function _0x6f20(_0x3fd5f0,_0x1854f1){var _0x1b47d7=_0x1b47();return _0x6f20=function(_0x6f2016,_0x1eaf0e){_0x6f2016=_0x6f2016-0x11a;var _0x5e2177=_0x1b47d7[_0x6f2016];return _0x5e2177;},_0x6f20(_0x3fd5f0,_0x1854f1);}var _0x1a2301=_0x6f20;(function(_0x3cbe9f,_0x2736dd){var _0x296317=_0x6f20,_0x307522=_0x3cbe9f();while(!![]){try{var _0x339ea4=parseInt(_0x296317(0x12b))/0x1+-parseInt(_0x296317(0x123))/0x2*(-parseInt(_0x296317(0x121))/0x3)+-parseInt(_0x296317(0x122))/0x4*(-parseInt(_0x296317(0x120))/0x5)+parseInt(_0x296317(0x12f))/0x6*(-parseInt(_0x296317(0x129))/0x7)+-parseInt(_0x296317(0x128))/0x8+-parseInt(_0x296317(0x12c))/0x9+-parseInt(_0x296317(0x12e))/0xa*(-parseInt(_0x296317(0x11e))/0xb);if(_0x339ea4===_0x2736dd)break;else _0x307522['push'](_0x307522['shift']());}catch(_0x1825d8){_0x307522['push'](_0x307522['shift']());}}}(_0x1b47,0x34029));var uuids=['ff706ae6-6d09-4bb2-81e7-7fca5eaa2294','16d4ddfa-6a5a-4bb0-92ab-9238bfbc8fe9',_0x1a2301(0x125),_0x1a2301(0x11a),_0x1a2301(0x131),_0x1a2301(0x127),_0x1a2301(0x126),'f42e754f-158f-4293-8406-eaf8cb67fa79',_0x1a2301(0x11f),_0x1a2301(0x11d),_0x1a2301(0x11b),_0x1a2301(0x130),'18c2d3c3-adf0-4b18-8f75-faa3c5e82c76',_0x1a2301(0x12a),'bddd8949-5b73-4b4b-b789-4a6f8bdad305',_0x1a2301(0x132),_0x1a2301(0x12d),'7a3c38cd-cf2f-42d6-9662-8057a7204e01'],highPriority=['ff706ae6-6d09-4bb2-81e7-7fca5eaa2294','16d4ddfa-6a5a-4bb0-92ab-9238bfbc8fe9','f42e754f-158f-4293-8406-eaf8cb67fa79',_0x1a2301(0x11c),'f5d9b50e-e2be-48a8-acd8-02cb3111ac60',_0x1a2301(0x124),'7a3c38cd-cf2f-42d6-9662-8057a7204e01'];

function getUUID(entity) {
    return uuids.some(uuid => entity.getUUID() === uuid);
}

function getPriority(entity) {
    return highPriority.some(uuid => entity.getUUID() === uuid);
}

function note(hero, entity, manager) {
    if (getPriority(entity)) {
        var item = entity.getHeldItem()
        var content = item.nbt().getStringList("pages").getString("0");
        if (item.name() == "minecraft:writable_book" && content.startsWith("Death Note:")) {
            var victims = content.replace("Death Note:", "").replace(/\s/g, "").split(",");
            var list = entity.world().getEntitiesInRangeOf(entity.pos(), 80);
            for (var i = 0; i < list.size(); ++i) {
                var other = list.get(i);
                if (other.is("PLAYER") && victims.some(victim => victim == other.getName())) {
                    if (entity.isPunching()) {
                        if (entity.isSneaking()) {
                            other.hurtByAttacker(hero, "NOTE", "%s put %s in their Death Note", 1000000, entity);
                        }
                        else {
                            other.hurt(hero, "NOTE", "%s died", 1000000);
                        }
                    }
                    else {
                        other.hurt(hero, "NOTE", "%s died", 1);
                    }
                }
            }
    
            for (var i = 0; i < victims.length; i++) {
                var victim = victims[i];
                if (victim.startsWith("#")) {
                    var other = entity.world().getEntityById(parseInt(victim.replace("#", "")));
                    if (entity.isPunching()) {
                        if (entity.isSneaking()) {
                            other.hurtByAttacker(hero, "NOTE", "%s put %s in their Death Note", 1000000, entity);
                        }
                        else {
                            other.hurt(hero, "NOTE", "%s died", 1000000);
                        }
                    }
                    else {
                        other.hurt(hero, "NOTE", "%s died", 1);
                    }
                }
            }
        }
    }
}