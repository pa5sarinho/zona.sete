export class Bicho {
    constructor(species) {
        this.species = species.pt;
        this.name    = species.pt;
        this.hp      = species.base_hp;
        this.friendly= species.base_friendliness;
        this.cry     = species.cry;
    }
    speak() {
        console.log(this.cry);
    }
}