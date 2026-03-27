import { Map } from "../Map.js";

export let actions = {
    "pt": {
        "run": "correr até aqui",
        "dig": "cavar",
        "build": "construir...",
        "addProp": "adicionar prop"
    }
}

export function iCommandYouTo(action, x, y, obj1="0", obj2="0") {
    eval(`${action}(${x},${y},${obj1},${obj2})`)
}

function run(x, y, filler1, filler2) {
    console.log("Player is running")
}

function dig(x, y, filler1, filler2) {
    console.log("digging a hole")
}

function build(x, y, filler1, filler2) {
    console.log("construir o que?")
}

function addProp(x, y, map, prop) {
	map.createSpriteOnTile(xy.x, xy.y, prop);
}
