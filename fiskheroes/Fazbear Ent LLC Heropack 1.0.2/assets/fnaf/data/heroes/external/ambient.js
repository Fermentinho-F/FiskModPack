function tick(entity, manager, ambient, pitch) {
	if (entity.is("PLAYER") && !entity.is("DISPLAY")) {
		var randomVal = Math.floor(Math.random() * 3000);
		if (randomVal % 3000 == 0) {
			entity.playSound(ambient[Math.floor(Math.random() * ambient.length)], 1, pitch);
		}
	}
}
