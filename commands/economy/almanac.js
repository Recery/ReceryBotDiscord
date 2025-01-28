const Canvas = require("canvas");
const Discord = require("discord.js");
const eco = require("../../economy/economyModule.js");
const slimesModule = require("../../economy/slimesModule.js");

module.exports = {
    name: "almanac",
    category: "economy",
    description: {
        es: "Muestra el almanaque de slimes.\n" +
        "Se pueden ver la cantidad de slimes conseguidos de cada tipo.\n" +
        "También muestra los slimes aún no desbloqueados.",
        en: "Shows the slime almanac.\n" +
        "You can see the quantity of slimes obtained from each type.\n" + 
        "Also shows the locked slimes."
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const imageAttachments = getAlmanacImages(eco.getTotalSlimes(userID), lang);
        Discord.butt

        const embed = new Discord.EmbedBuilder()
            .setTitle("Almanac")
            .setImage(`attachment://${imageAttachments[1].name}`);

        msg.reply({
            embeds: [embed],
            files: imageAttachments,
        });
    }
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

function getAlmanacImages(slimes, lang) {
    const images = [];

    const canvas = Canvas.createCanvas(1600, 1600);
    const ctx = canvas.getContext("2d");

    ctx.font = "50px silkscreen";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000000"; // Color borde
    ctx.lineWidth = 6; // Grosor borde

    const positions = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            positions.push({
                x: 150 + j * 450,
                y: 150 + i * 450,
                textX: 150 + j * 450 + 200,
                textY: 150 + i * 450 + 390
            })
        }
    }

    ctx.drawImage(slimeImages.get("background"), 0, 0, canvas.width, canvas.height);

    let positionIndex = 0;
    for (const slime of slimesModule.slimes) {
        if (positionIndex >= positions.length) {
            images.push(new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `almanac${images.length + 1}.png`}));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(slimeImages.get("background"), 0, 0, canvas.width, canvas.height);
            positionIndex = 0;
        }

        let found = false;
        for (const pair of slimes) {
            if (pair.obj.id !== slime.id) continue;
            found = true;

            ctx.drawImage(slimeImages.get(slime.id), positions[positionIndex].x , positions[positionIndex].y, 400, 400);
    
            ctx.strokeText(slime.displayName[lang] + "x" + pair.quantity, positions[positionIndex].textX, positions[positionIndex].textY); // Dibujar borde del texto
            ctx.fillText(slime.displayName[lang] + "x" + pair.quantity, positions[positionIndex].textX, positions[positionIndex].textY);

            break;
        }

        if (!found) ctx.drawImage(slimeImages.get(0), positions[positionIndex].x , positions[positionIndex].y, 400, 400);
        positionIndex += 1;
    }

    images.push(new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `almanac${images.length + 1}.png`}));

    return images;
}