import { Bicho } from "./objects/Bicho.js";

fetch('scripts/objects/objects.json')
.then(response => response.json())
.then(data => {
    let gato = new Bicho(data.animais.gato_domestico);
    const p = document.getElementById('teste');
    p.innerHTML = gato.speak();
});
