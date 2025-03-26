const banners = Object.freeze({
    REGULAR: Symbol("REGULAR"),
    VOCALOID: Symbol("VOCALOID")
});

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
        image: process.env.FILES_BASE_URL + "slimeImages/greenSlime.png",
        banner: banners.REGULAR
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
        image: process.env.FILES_BASE_URL + "slimeImages/yellowSlime.png",
        banner: banners.REGULAR
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
        image: process.env.FILES_BASE_URL + "slimeImages/whiteSlime.png",
        banner: banners.REGULAR
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
        image: process.env.FILES_BASE_URL + "slimeImages/creamySlime.png",
        banner: banners.REGULAR
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
        image: process.env.FILES_BASE_URL + "slimeImages/pooSlime.png",
        banner: banners.REGULAR
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
        image: process.env.FILES_BASE_URL + "slimeImages/cosmicSlime.png",
        banner: banners.REGULAR
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
        image: process.env.FILES_BASE_URL + "slimeImages/goldfishSlime.png",
        banner: banners.REGULAR
    },
    {
        name: "leadslime",
        displayName: {
            es: "Slime De Plomo",
            en: "Lead Slime"
        },
        id: 8,
        rarity: 3,
        appleGeneration: 8,
        image: process.env.FILES_BASE_URL + "slimeImages/leadSlime.png",
        banner: banners.REGULAR
    },
    {
        name: "blueslime",
        displayName: {
            es: "Slime Azul",
            en: "Blue Slime"
        },
        id: 9,
        rarity: 1,
        appleGeneration: 2,
        image: process.env.FILES_BASE_URL + "slimeImages/blueSlime.png",
        banner: banners.REGULAR
    },
    {
        name: "copperslime",
        displayName: {
            es: "Slime De Cobre",
            en: "Copper Slime"
        },
        id: 10,
        rarity: 2,
        appleGeneration: 5,
        image: process.env.FILES_BASE_URL + "slimeImages/copperSlime.png",
        banner: banners.REGULAR
    },
    {
        name: "pinkyslime",
        displayName: {
            es: "Slime Rosita",
            en: "Pinky Slime"
        },
        id: 11,
        rarity: 1,
        appleGeneration: 3,
        image: process.env.FILES_BASE_URL + "slimeImages/pinkySlime.png",
        banner: banners.REGULAR
    },
    {
        name: "grayslime",
        displayName: {
            es: "Slime Gris",
            en: "Gray Slime"
        },
        id: 12,
        rarity: 1,
        appleGeneration: 2,
        image: process.env.FILES_BASE_URL + "slimeImages/graySlime.png",
        banner: banners.REGULAR
    },
    {
        name: "redslime",
        displayName: {
            es: "Slime Rojo",
            en: "Red Slime"
        },
        id: 13,
        rarity: 4,
        appleGeneration: 15,
        image: process.env.FILES_BASE_URL + "slimeImages/redSlime.png",
        banner: banners.REGULAR
    },
    {
        name: "rgbslime",
        displayName: {
            es: "Slime RGB",
            en: "RGB Slime" 
        },
        id: 14,
        rarity: 3,
        appleGeneration: 8,
        image: process.env.FILES_BASE_URL + "slimeImages/rgbSlime.png",
        banner: banners.REGULAR
    },
    {
        name: "tetoslime",
        displayName: {
            es: "Slime Teto",
            en: "Teto Slime"
        },
        id: 15,
        rarity: 4,
        appleGeneration: 15,
        image: process.env.FILES_BASE_URL + "slimeImages/tetoSlime.png",
        banner: banners.VOCALOID
    },
    {
        name: "appleslime",
        displayName: {
            es: "Slime Manzana",
            en: "Apple Slime"
        },
        id: 16,
        rarity: 4,
        appleGeneration: 15,
        image: process.env.FILES_BASE_URL + "slimeImages/appleSlime.png",
        banner: banners.REGULAR
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

function getSlimesByRarity(rarity) {
    const slimesList = [];

    for (const slime of slimes)
        if (slime.rarity === rarity) slimesList.push(slime);

    return slimesList;
}

module.exports = {
    banners,
    slimes,
    getSlime,
    getSlimeByName,
    getSlimesByRarity
}