export let actions = {
    "pt": {
        "run": "correr até aqui",
        "dig": "cavar",
        "build": "construir..."
    }
}

export function iCommandYouTo(action, obj="") {
    eval(`${action}()`)
}

function run() {
    console.log("Player is running")
}

function dig() {
    console.log("digging a hole")
}

function build() {
    console.log("construir o que?")
}