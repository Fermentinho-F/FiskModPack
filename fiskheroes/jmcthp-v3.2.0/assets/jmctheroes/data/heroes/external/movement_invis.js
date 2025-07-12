//Thank you Candy
function tick(entity, manager) {
    if (entity.getData('jmctheroes:dyn/invis')) {
        manager.setData(entity, 'fiskheroes:invisible', entity.getData('jmctheroes:dyn/invis_timer') ==1 && !entity.getData('fiskheroes:moving'));
    }
}