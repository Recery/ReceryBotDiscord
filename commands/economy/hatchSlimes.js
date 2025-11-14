const Discord = require("discord.js");
const Canvas = require("canvas"); 
const eco = require("../../economy/economyModule.js");
const slimesModule = require("../../economy/slimesModule.js");
const bannersModule = require("../../economy/bannersModule.js");

module.exports = {
    name: "hatchslimes",
    alias: ["hs", "getslimes"],
    category: "economy",
    description: {
        es: "Eclosiona slimes aleatorios de distintas rarezas.\n" +
            "Se pueden eclosionar hasta 9 slimes a la vez.\n" +
            "**<:GreenApple:1296171434246410380> x10 = slime x1.**",
        en: "Hatches random slimes of different rarities.\n" +
            "Up to 9 slimes can be hatched at the same time.\n" +
            "**<:GreenApple:1296171434246410380> x10 = slime x1.**",
    },
    examples: ["{{prefix}}hatchslimes", "{{prefix}}hs x4", "{{prefix}}getslimes x9"],
    syntax: {
        es: "{{prefix}}hatchslimes [cantidad]",
        en: "{{prefix}}hatchslimes [quantity]"
    },
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userId = msg.author.id;

        let slimesToHatch = 1;

        // El único argumento que se tiene en cuenta debería ser la cantidad de slimes a eclosionar
        // El argumento es opcional, si no se incluye siempre va a ser 1 slime
        // Verificamos si existe el argumento, si es un numero, y si es mayor a 0
        for (const arg of args) {
            if (arg.toLowerCase().startsWith("x")) {
                const quantity = Number(arg.toLowerCase().replace("x", ""));
                if (!isNaN(quantity))
                    if (quantity > 0) slimesToHatch = quantity;
                break;
            }
        }

        const banner = bannersModule.getPlayerBanner(userId);

        const applesToSpend = banner.name === "Regular" 
        ? slimesToHatch * 10
        : slimesToHatch * 15; // si no es el banner regular, eclosionar un slime sale 15 manzanas en lugar de 10

        const userApples = eco.getApples(userId);
        if (userApples < applesToSpend) {
            msg.reply(messages[lang].needMoreApples.replace("{{apples}}", applesToSpend.toString()));
            return;
        }

        // No se pueden eclosionar más de nueve slimes en un mismo comando
        if (slimesToHatch > 9) {
            msg.reply(messages[lang].tooMuchHatches);
            return;
        }

        eco.setApples(userId, userApples - applesToSpend);

        let hatchedSlimes = [];
        for (let i = 0; i < slimesToHatch; i++) {
            const slime = chooseSlime(banner);

            hatchedSlimes.push(slime);
            eco.addSlimeToCorral(userId, slime.id);
            eco.addSlimeToTotal(userId, slime.id);
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(`**${messages[lang].slimeObtention}**`)
            .setColor("#12bcff")
            .setImage("attachment://hatching.png")
            .setFooter({ text: "Banner: " + banner.name})

        const loadingReaction = await msg.react("<a:Loading:1334664535914844253>");
        const imageAttachment = await getImageAttachment(hatchedSlimes, lang);

        msg.reply({
            embeds: [embed],
            files: [imageAttachment]
        });

        loadingReaction.users.remove(client.user.id);
    }
}

function chooseSlime(banner /* objeto del banner, no el nombre en string */) {
    const commonChance = 90;
    const rareChance = 25;
    const epicChance = 5;
    const ultraChance = 1;

    const totalChance = commonChance + rareChance + epicChance + ultraChance;

    const rand = Math.floor(Math.random() * totalChance);

    let rarity = 1;
    if (rand < commonChance)
        rarity = 1;
    else if (rand < commonChance + rareChance)
        rarity = 2;
    else if (rand < commonChance + rareChance + epicChance)
        rarity = 3
    else
        rarity = 4;
    
    let possibleSlimes = [];
    const raritySlimes = slimesModule.getSlimesByRarity(rarity);
    for (const id of banner.slimesIds) {
        const slime = slimesModule.getSlime(id);
        if (raritySlimes.includes(slime))
            possibleSlimes.push(slime);
    }

    // si el banner no es el regular, hay que hacer un 50/50
    // es decir 50% de que salga un slime del banner regular, y 50% de que salga uno del banner seleccionado
    if (banner.name !== "Regular") {
        const chance = Math.random() < 0.5;

        const temp = [];
        for (const slime of possibleSlimes)
            if (slime.regularBanner === chance)
                temp.push(slime);
        
        possibleSlimes = temp.slice();
    }

    if (possibleSlimes.length === 0)
        return slimesModule.getSlime(1);

    return possibleSlimes[Math.floor(Math.random() * possibleSlimes.length)];
}

let imagesLoaded = false;
const slimeImages = new Map();
loadSlimesImages();
async function loadSlimesImages() {
    slimeImages.set("background", await Canvas.loadImage(process.env.FILES_BASE_URL + "slimeImages/background.png"));
    slimeImages.set(0, await Canvas.loadImage(process.env.FILES_BASE_URL + "slimeImages/noSlime.png"));
    for (const slime of slimesModule.slimes) {
        const image = await Canvas.loadImage(slime.image);
        slimeImages.set(slime.id, image);
    }

    imagesLoaded = true;
}

async function waitImagesLoad() {
    while (!imagesLoaded)
        await new Promise((resolve) => setTimeout(resolve, 100));
}

Canvas.registerFont("fonts/slkscr.ttf", {family: "silkscreen"});
async function getImageAttachment(slimes, lang) {
    await waitImagesLoad();

    const canvas = Canvas.createCanvas(1600, 1600);
    const ctx = canvas.getContext("2d");

    ctx.font = "56px silkscreen";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000000"; // Color borde
    ctx.lineWidth = 8; // Grosor borde

    const background = slimeImages.get("background");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const slime = slimes.shift();
            
            const starterPoint = 75;
            const x = starterPoint + j * (600 - starterPoint);
            const y = starterPoint + i * (600 - starterPoint);

            if (slime) 
                ctx.drawImage(slimeImages.get(slime.id), x , y, 400, 400);
            else
                ctx.drawImage(slimeImages.get(0), x , y, 400, 400);

            if (slime) {
                const textX = x + 200;
                const textY = y + 390;

                ctx.strokeText(slime.displayName[lang], textX, textY); // Dibujar borde del texto
                ctx.fillText(slime.displayName[lang], textX, textY);
            }
        }
    }

    return new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "hatching.png"});
}

const messages = {
    es: {
        needMoreApples: "¡No tienes suficientes <:GreenApple:1296171434246410380> para eclosionar esa cantidad de slimes!\nNecesitas {{apples}}<:GreenApple:1296171434246410380>.",
        tooMuchHatches: "¡No puedes eclosionar más de 9 slimes a la vez!",
        slimeObtention: "¡Eclosionaste estos slimes!"
    },
    en: {
        needMoreApples: "You don't have enough <:GreenApple:1296171434246410380> to hatch that amount of slimes!\n You need {{apples}}<:GreenApple:1296171434246410380>.",
        tooMuchHatches: "You can't hatch more than 9 slimes at the same time!",
        slimeObtention: "You hatched these slimes!"
    }
}