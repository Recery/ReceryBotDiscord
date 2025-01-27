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
            "**:green_apple: x10 = slime x1.**",
        en: "Hatches random slimes of different rarities.\n" +
            "Up to 9 slimes can be hatched at the same time.\n" +
            "**:green_apple: x10 = slime x1.**",
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
        }


        const embed = new Discord.EmbedBuilder()
            .setTitle(`**${messages[lang].slimeObtention}**`)
            .setColor("#12bcff")
            .setImage("attachment://hatching.png");

        const loadingReaction = await msg.react("<a:loading:1330598692008493076>");
        const imageAttachment = await getImageAttachment(hatchedSlimes, lang);

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

const slimesImages = new Map();
loadSlimesImages();
async function loadSlimesImages() {
    slimesImages.set(0, Canvas.loadImage("https://i.imgur.com/kbetYsZ.png"));
    for (const slime of slimesModule.slimes) {
        const image = await Canvas.loadImage(slime.image);
        slimesImages.set(slime.id, image);
    }
}

Canvas.registerFont("fonts/slkscr.ttf", {family: "silkscreen"});
async function getImageAttachment(slimes, lang) {
    const canvas = Canvas.createCanvas(1600, 1600);
    const ctx = canvas.getContext("2d");

    ctx.font = "50px silkscreen";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000000"; // Color borde
    ctx.lineWidth = 6; // Grosor borde

    const background = await Canvas.loadImage("https://i.imgur.com/elinwYQ.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const slime = slimes.shift();
            
            const x = 150 + j * 450;
            const y = 150 + i * 450;

            if (slime) 
                ctx.drawImage(slimesImages.get(slime.id), x , y, 400, 400);
            else
                ctx.drawImage(slimesImages.get(0), x , y, 400, 400);

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
        needMoreApples: "¡No tienes suficientes :green_apple: para eclosionar esa cantidad de slimes!\nNecesitas {{apples}}:green_apple:.",
        tooMuchHatches: "¡No puedes eclosionar más de 9 slimes a la vez!",
        slimeObtention: "¡Eclosionaste estos slimes!"
    },
    en: {
        needMoreApples: "You don't have enough :green_apple: to hatch that amount of slimes!\n You need {{apples}}:green_apple:.",
        tooMuchHatches: "You can't hatch more than 9 slimes at the same time!",
        slimeObtention: "You hatched these slimes!"
    }
}