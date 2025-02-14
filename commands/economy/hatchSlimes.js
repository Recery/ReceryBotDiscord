const Discord = require("discord.js");
const Canvas = require("canvas"); 
const eco = require("../../economy/economyModule.js");
const slimesModule = require("../../economy/slimesModule.js");

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
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

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

        const applesToSpend = slimesToHatch * 10;
        const userApples = eco.getApples(userID);
        
        if (userApples < applesToSpend) {
            msg.reply(messages[lang].needMoreApples.replace("{{apples}}", applesToSpend.toString()));
            return;
        }

        // No se pueden eclosionar más de nueve slimes en un mismo comando
        if (slimesToHatch > 9) {
            msg.reply(messages[lang].tooMuchHatches);
            return;
        }
        
        eco.setApples(userID, userApples - applesToSpend);

        let hatchedSlimes = [];
        for (let i = 0; i < slimesToHatch; i++) {
            const slime = chooseSlime();

            hatchedSlimes.push(slime);
            eco.addSlimeToCorral(userID, slime.id);
            eco.addSlimeToTotal(userID, slime.id);
        }


        const embed = new Discord.EmbedBuilder()
            .setTitle(`**${messages[lang].slimeObtention}**`)
            .setColor("#12bcff")
            .setImage("attachment://hatching.png");

        const loadingReaction = await msg.react("<a:Loading:1334664535914844253>");
        const imageAttachment = getImageAttachment(hatchedSlimes, lang);

        msg.reply({
            embeds: [embed],
            files: [imageAttachment]
        });

        loadingReaction.remove();
    }
}

function chooseSlime() {
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

    const possibleSlimes = slimesModule.getSlimesByRarity(rarity);

    return possibleSlimes[Math.floor(Math.random() * possibleSlimes.length)];
}

const slimeImages = new Map();
loadSlimesImages();
async function loadSlimesImages() {
    slimeImages.set("background", await Canvas.loadImage("https://i.imgur.com/elinwYQ.png"));
    slimeImages.set(0, await Canvas.loadImage("https://i.imgur.com/kbetYsZ.png"));
    for (const slime of slimesModule.slimes) {
        const image = await Canvas.loadImage(slime.image);
        slimeImages.set(slime.id, image);
    }
}

Canvas.registerFont("fonts/slkscr.ttf", {family: "silkscreen"});
function getImageAttachment(slimes, lang) {
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