function raycast(entity, distance) {
    var speed = 0.1;
    var distanceTraveled = 0;
    var yaw = -entity.rotYaw() * (Math.PI / 180),
    pitch = -entity.rotPitch() * (Math.PI / 180);
    var direction = [Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch), Math.cos(pitch) * Math.cos(yaw)];
    var position = [entity.posX(), entity.posY() + 1.620, entity.posZ()];

    while (distanceTraveled < distance) {
        var blockPosition = position.map(Math.floor);
        var block = entity.world().blockAt(blockPosition[0], blockPosition[1], blockPosition[2]);
        if (block.isSolid()) {
            return {
                block: block,
                name: block.name(),
                metaData: block.metadata(),
                blockPosition: blockPosition
            };
        }
        position = position.map((key, index) => key + direction[index] * speed);
        distanceTraveled += speed;
    }
    return null;
}

function safeY(entity, position, structure) {
    var block = (x, y, z) => {
        return entity.world().blockAt(x, y, z).isSolid();
    };
    var i = 0,
    complete = false,
    allow = true,
    allowIndex = [];
    while (!complete) {
        i += 1;
        if (!block(position[0], position[1] + i, position[2]) &&
            !block(position[0], position[1] + i + 1, position[2]) && !block(position[0], position[1] + i + 2, position[2])) {
            complete = true;
        }
    }
    if (complete && structure !== undefined) {
        if (Array.isArray(structure) && typeof structure[0] == "number") {
            structure.forEach((key, index) => {
                if (index > 0) {
                    allowIndex[index - 1] = 0;
                    key.forEach(key => {
                        if (entity.world().blockAt(position[0] + key[0], position[1] + i - key[1] - 1, position[2] + key[2]).isSolid()) {
                            allowIndex[index - 1] += 1;
                        }
                    })
                }
            });
            allowIndex.forEach(key => {
                if (key >= structure[0]) {
                    allow = false;
                }
            });
        }
    }
    var fence = entity.world().blockAt(position[0], position[1] + i - 1, position[2]).name().contains("fence");
    var wall = entity.world().blockAt(position[0], position[1] + i - 1, position[2]).name().contains("wall");
    return {
        safe: allow && complete,
        position: complete ? fence || wall ? position[1] + i + 2 : position[1] + i + 1 : 0,
        y: position[1] + i
    };
}

function extractCoords(entity, input) {
    var sections = input.split(" ");
    var same = (index, pos) => {
        return sections[index] == "~" ? pos : parseInt(sections[index], 10);
    };
    if (sections.length === 3 || sections.length === 4) { // Make sure input is formatted correctly
        var pos = [entity.posX(), entity.posY(), entity.posZ()]
        var x = same(0, pos[0] <= -1 ? pos[0]-1 : pos[0]);
        var y = same(1, pos[1] <= -1 ? pos[1]-1 : pos[1]);
        var z = same(2, pos[2] <= -1 ? pos[2]-1 : pos[2]);
        var dim = sections.length === 4 ? parseInt(sections[3], 10) : 0;
        return {
            x: x,
            y: y,
            z: z,
            dim: dim,
            isValid: () => {
                return !isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(dim);
            }
        };
    }
    return {
        isValid: () => false
    };
}

function moveForward(entity, manager, distance, condition, delay) {
    if (typeof condition != "boolean") {
        condition = true;
    }
    if (typeof delay != "number") {
        delay = 1;
    }
    // 0 = x, 1 = y and 3 = z
    if (typeof distance != "number") {
        distance = 10
    }
    distance = Math.round(distance);

    var pos = [Math.floor(entity.posX()), entity.posY() + 1.5, Math.floor(entity.posZ())];
    var yawRad = (Math.PI / 180) * entity.rotYaw();
    var pitchRad = (-entity.rotPitch() * Math.PI) / 180;

    var motionPos = [-Math.sin(yawRad) * Math.cos(pitchRad), Math.sin(pitchRad), Math.cos(yawRad) * Math.cos(pitchRad)]

    for (var i = 0; i < distance; i++) {
        var oldPos = [pos[0], pos[1], pos[2]];
        pos[0] += motionPos[0];
        pos[1] += motionPos[1];
        pos[2] += motionPos[2];
        if (!entity.world().blockAt(pos[0], pos[1], pos[2]).isSolid() || !condition) {
            var teleportPos = [pos[0] - motionPos[0], pos[1] - motionPos[1] + 1, pos[2] - motionPos[2]]
            manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(teleportPos[0], teleportPos[1], teleportPos[2], entity.world().getDimension()));
            manager.setData(entity, "fiskheroes:teleport_delay", delay);
        } else {
            pos[0] = oldPos[0];
            pos[1] = oldPos[1];
            pos[2] = oldPos[2];
            distance = i;
        }
    }
    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(pos[0], pos[1], pos[2], entity.world().getDimension()));
    manager.setData(entity, "fiskheroes:teleport_delay", delay);

    return true;
}

function solidAbove(entity, distance) {
    var distance = typeof distance == "undefined" ? 16 : distance;
    for (var i = 0; i < distance; i++) {
        if (entity.world().blockAt(entity.pos().add(0, i, 0)).isSolid()) {
            return true;
        }
    }
    return false;
}
