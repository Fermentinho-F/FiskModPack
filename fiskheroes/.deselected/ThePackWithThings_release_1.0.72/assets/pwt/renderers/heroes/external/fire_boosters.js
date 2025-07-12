

function create(renderer, icon, anchor, mirror) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var hand1 = renderer.createEffect("fiskheroes:booster");
    hand1.setIcon(icon).setOffset(2.5, 10.0, -1.3).setRotation(0.0, 110.0, 180.0).setSize(2.0, 3.0);
    hand1.anchor.set(anchor);
	hand1.mirror = mirror;
	
    var hand2 = renderer.createEffect("fiskheroes:booster");
    hand2.setIcon(icon).setOffset(2.7, 10.0, 0.0).setRotation(0.0, 0.0, 170.0).setSize(2.0, 3.5);
    hand2.anchor.set(anchor);
	hand2.mirror = mirror;
    
	var hand3 = renderer.createEffect("fiskheroes:booster");
    hand3.setIcon(icon).setOffset(2.5, 10.0, 1.3).setRotation(0.0, 70.0, 180.0).setSize(2.0, 3.0);
    hand3.anchor.set(anchor);
	hand3.mirror = mirror;
	
	var hand_palm = renderer.createEffect("fiskheroes:booster");
    hand_palm.setIcon(icon).setOffset(1.0, 10.2, 0.0).setRotation(0.0, 0.0, 180.0).setSize(4.2, -0.3);
    hand_palm.anchor.set(anchor);
    hand_palm.mirror = mirror;
	
	var hand_full = renderer.createEffect("fiskheroes:booster");
    hand_full.setIcon(icon).setOffset(1.0, 10.2, 0.0).setRotation(0.0, 0.0, 170.0).setSize(4.3, 2.0);
    hand_full.anchor.set(anchor);
    hand_full.mirror = mirror;

    
	return {
        hand1: hand1,
        hand2: hand2,
        hand3: hand3,
        hand_palm: hand_palm,
		hand_full: hand_full,
        render: (entity, renderLayer, isFirstPersonArm, all, timer, x) => {
            if (all) {

			hand1.opacity = hand2.opacity = hand3.opacity = hand_palm.opacity = hand_full.opacity = timer*0.8;
			hand1.progress = hand2.progress = hand3.progress = hand_palm.progress = hand_full.progress = timer*x;

			hand1.speedScale = hand2.speedScale = hand3.speedScale = hand_palm.speedScale = hand_full.speedScale = 0.2 * timer;
			hand1.flutter = hand2.flutter = hand3.flutter = hand_palm.flutter = hand_full.flutter = 1 + timer;

			hand1.render();
			hand2.render();
			hand3.render();
			hand_palm.render();
			hand_full.render();
			
			}
		}
    };
	
	

}
