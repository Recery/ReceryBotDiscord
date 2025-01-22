const Discord = require("discord.js");
const Canvas = require("canvas"); 
const eco = require("../../economy/economyModule.js");
const slimesModule = require("../../economy/slimesModule.js");

module.exports = {
    name: "hatchslimes",
    alias: ["hs", "getslimes"],
    category: "economy",
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
    const weightedList = [];

    for (const slime of slimesModule.slimes) {
        switch (slime.rarity) {
            case 1:
                for (let i = 0; i < 30; i++) weightedList.push(slime);
                break;
            case 2:
                for (let i = 0; i < 12; i++) weightedList.push(slime);
                break;
            case 3:
                for (let i = 0; i < 5; i++) weightedList.push(slime);
                break;
            case 4:
                for (let i = 0; i < 1; i++) weightedList.push(slime);
                break;
        }
    }

    return weightedList[Math.floor(Math.random() * weightedList.length)];
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

            let link = ""; 
            if (slime) link = slime.image;
            else link = "https://i.imgur.com/kbetYsZ.png";
            

            const slimeImg = await Canvas.loadImage(link);
            const x = 150 + j * 450;
            const y = 150 + i * 450;

            ctx.drawImage(slimeImg, x , y, 400, 400);

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