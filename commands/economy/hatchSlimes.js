const Discord = require("discord.js");
const Canvas = require("canvas"); 
const eco = require("../../economy/economyModule.js");
const slimes = require("../../economy/slimes.js");

module.exports = {
    name: "hatchslimes",
    alias: ["hs", "getslimes"],
    category: "economy",
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimesToHatch = args[0] || 1;
        const applesToSpend = slimesToHatch * 10;
        const userApples = eco.getApples(userID);
        
        if (userApples < applesToSpend) {
            msg.reply(messages[lang].needMoreApples.replace("{{apples}}", applesToSpend.toString()));
        }
        else {
            eco.modifyApples(userID, userApples - applesToSpend);

            let hatchedSlimes = [];
            for (let i = 0; i < slimesToHatch; i++)
                hatchedSlimes.push(slimes[Math.floor(Math.random() * slimes.length)]);

            const embed = new Discord.EmbedBuilder()
                .setTitle("Prueba")
                .setImage("attachment://hatching.png");

            msg.reply({
                content: "**¡Obtuviste estos slimes!**",
                embeds: [embed],
                files: [await getImageAttachment(slimes)]
            });
        }
    }
}

async function getImageAttachment(slimes) {
    const canvas = Canvas.createCanvas(1600, 1600);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("https://i.imgur.com/elinwYQ.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const slime = slimes.shift();
            console.log(slime);

            let link = "";
            if (slime) link = slime.image;
            else link = "https://i.imgur.com/kbetYsZ.png";

            const slimeImg = await Canvas.loadImage(link);
            ctx.drawImage(slimeImg, 150 + (j * 450) , 150 + (i * 450), 400, 400);
        }
    }
    

    return new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "hatching.png"});
}

const messages = {
    es: {
        needMoreApples: "¡No tienes suficientes :green_apple: para eclosionar esa cantidad de slimes!\nNecesitas {{apples}}:green_apple:.",
        slimeObtention: "¡Eclosionaste estos slimes!"
    },
    en: {
        needMoreApples: "You don't have enough :green_apple: to hatch that amount of slimes!\n You need {{apples}}:green_apple:.",
        slimeObtention: "You hatched these slimes!"
    }
}