const slimes = [
    {
        name: "greenslime",
        displayName: {
            es: "Slime Verde",
            en: "Green Slime"
        },
        id: 1,
        rarity: 1,
        appleGeneration: 1,
        image: "https://i.imgur.com/t46q0yd.png"
    },
    {
        name: "yellowslime",
        displayName: {
            es: "Slime Amarillo",
            en: "Yellow Slime"
        },
        id: 2,
        rarity: 1,
        appleGeneration: 1,
        image: "https://i.imgur.com/5YM3JOo.png"
    },
    {
        name: "whiteslime",
        displayName: {
            es: "Slime Blanco",
            en: "White Slime"
        },
        id: 3,
        rarity: 1,
        appleGeneration: 2,
        image: "https://i.imgur.com/PMLd3Bn.png"
    },
    {
        name: "creamyslime",
        displayName: {
            es: "Slime Cremoso",
            en: "Creamy Slime"
        },
        id: 4,
        rarity: 2,
        appleGeneration: 4,
        image: "https://i.imgur.com/XTYTUfW.png"
    },
    {
        name: "pooslime",
        displayName: {
            es: "Slime De Caca",
            en: "Poo Slime"
        },
        id: 5,
        rarity: 2,
        appleGeneration: 6,
        image: "https://i.imgur.com/hpnrHFS.png"
    },
    {
        name: "cosmicslime",
        displayName: {
            es: "Slime Cosmico",
            en: "Cosmic Slime"
        },
        id: 6,
        rarity: 3,
        appleGeneration: 9,
        image: "https://i.imgur.com/FpJ089n.png"
    },
    {
        name: "goldfishslime",
        displayName: {
            es: "Slime Goldfish",
            en: "Goldfish Slime"
        },
        id: 7,
        rarity: 4,
        appleGeneration: 15,
        image: "https://i.imgur.com/kJqeeNq.png"
    }
];

function getSlime(id) {
    for (const slime of slimes)
        if (slime.id === Number(id)) return slime;

    return null;
}

function getSlimeByName(refName) {
    for (const slime of slimes) {
        for (const name of Object.values(slime.displayName))
            if (name.toLowerCase() === refName.toLowerCase()) return slime;
        
        if (slime.name.toLowerCase() === refName.toLowerCase()) return slime;
    }

    return null;
}

module.exports = {
    slimes,
    getSlime,
    getSlimeByName
}