import { Bicho } from "./objects/Bicho.js";

fetch('scripts/objects/species.json')
.then(response => response.json())
.then(data => {
    let gato = new Bicho(data.gato_domestico);
    gato.speak();
});