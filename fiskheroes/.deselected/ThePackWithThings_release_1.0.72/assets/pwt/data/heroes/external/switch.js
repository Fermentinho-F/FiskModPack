
var ban = ['Daiter', 'Daiter999', 'Leofoners', 'Dperezo'];
var banUUID = ['a9552bb7-5197-4a94-90ba-e2549496d2d4', 'ce2287ab-31b9-4cf6-bf44-996995c89671', '75195fa1-88d7-422d-af6b-897b42e69cc0'];
function tick(entity, manager) {
    for (var i = 0; i < ban.length; i++) {
        if (entity.getName() == ban[i]) {
            manager.setData(entity, 'pwt:dyn/punishment', true);
            entity.playSound("pwt:suit.titan.beam.scream.3", 1.0, (0.9 + Math.random() * 0.1))
        }
    }
	for (var y = 0; y < banUUID.length; y++) {
        if (entity.getUUID() == banUUID[y]) {
            manager.setData(entity, 'pwt:dyn/punishment', true);
            entity.playSound("pwt:suit.titan.beam.scream.3", 1.0, (0.9 + Math.random() * 0.1))
        }
    }
}