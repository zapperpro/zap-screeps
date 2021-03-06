var roleExtension   = require('role.extension');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var structure;
        
        //State machine concept
        if(creep.store[RESOURCE_ENERGY] === 0){
            creep.memory.state="MineResources";
        }

        if(creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()){
            creep.memory.state="Build";
        }

        if(creep.memory.state === "MineResources") {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);

            if(creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            }
        }

        if(creep.memory.state === "Unload") {
            structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>
                       (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER) && s.energy < s.energyCapacity

            });

            if(structure){
                if(creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
        }

        if(creep.memory.state === "Build"){
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(constructionSite){
                if(creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                } 
            } else{
                structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>
                       (s.structureType === STRUCTURE_TOWER) && s.energy < s.energyCapacity
                });

                if(structure){
                    if(creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                } else{
                    roleExtension.run(creep);
                }
            }
        }
    }
};

module.exports = roleBuilder;