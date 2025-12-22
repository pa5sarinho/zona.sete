export class Bicho {
    constructor(species) {
        this.species  = species.pt;
        this.name     = species.pt;
        this.hp       = species.base_hp;
        this.friendly = species.base_friendliness;
        this.cry      = species.cry;
        this.hunger   = 50;
        this.stress   = 0;
        this.temp     = 50;
        this.knowledge= [];
        this.skills   = [];
    }
    speak() {
        return this.cry;
    }
}
