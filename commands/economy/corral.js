const Discord = require("discord.js");
const Canvas = require("canvas");
const slimesModule = require("../../economy/slimesModule.js");
const eco = require("../../economy/economyModule.js");
const timeModule = require("../../economy/timeModule.js");

module.exports = {
    name: "corral",
    category: "economy",
    description: {
        es: "Muestra los slimes que tienes en tu corral.\n" +
        "Cada una hora, todos los slimes se irán de tu corral.\nGanarás :green_apple: según el valor de cada slime.",
        en: "Shows all slimes from your corral.\n" +
        "Every hour, all slimes from your corral will leave.\nYou will earn :green_apple: according to the value of each slime."
    },
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimesInCorral = eco.getCorralSlimes(userID);

        let page = 0; // Página 0 = página 1 para el usuario
        const images = await getImagesAttachment(slimesInCorral, lang);

        let accumulatedApples = 0;
        for (const pair of slimesInCorral)
            accumulatedApples += pair.obj.appleGeneration * pair.quantity;

        const cycleTimeLeft = timeModule.getTimeMinimumExpressedUnit(eco.getCycleTimeLeft(userID));

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: messages[lang].authorHeader.replace("{{user}}", msg.author.displayName),
                iconURL: msg.author.avatarURL()
            })
            .setColor("Red")
            .setDescription(`**${messages[lang].resetInfo}**`)
            .addFields(
                {name: messages[lang].resetField, value: `${cycleTimeLeft.time} ${timeModule.units[lang][cycleTimeLeft.unit]}`, inline: true},
                {name: messages[lang].applesField, value: `${accumulatedApples}`, inline: true},
            )
            .setImage(`attachment://${images[page].name}`)
            .setFooter({
                text: `${messages[lang].pageTitle} ${page+1}/${images.length}`,
                iconURL: "https://i.imgur.com/igkTvXQ.png"
            });

        const leftButton = new Discord.ButtonBuilder() 
            .setCustomId("slideLeft")
            .setEmoji("<:LeftArrow:1334663458687287296>")
            .setStyle("Primary")
            .setDisabled(true);
        const rightButton = new Discord.ButtonBuilder() 
            .setCustomId("slideRight")
            .setEmoji("<:RightArrow:1334663426043154472>")
            .setStyle("Primary")
            .setDisabled(page >= images.length - 1);
        
        const buttonsRow = new Discord.ActionRowBuilder()
            .addComponents(
                leftButton,
                rightButton
            );
        
        const sentMessage = await msg.reply({
            embeds: [embed],
            files: [images[page]],
            components: [buttonsRow]
        });

        const collector = sentMessage.createMessageComponentCollector({time: 120000});

        collector.on("collect", (interaction) => {
            if (interaction.customId === "slideLeft") page -= 1;
            else if (interaction.customId === "slideRight") page += 1;
            else return;

            leftButton.setDisabled(page <= 0);
            rightButton.setDisabled(page >= images.length - 1);

            embed.setFooter({
                text: `${messages[lang].pageTitle} ${page+1}/${images.length}`,
                iconURL: "https://i.imgur.com/igkTvXQ.png"
            });
            embed.setImage(`attachment://${images[page].name}`);

            const newButtonsRow = new Discord.ActionRowBuilder()
                .addComponents(
                    leftButton,
                    rightButton
                );
            
            interaction.update({
                embeds: [embed],
                files: [images[page]],
                components: [newButtonsRow]
            });

            collector.resetTimer();
        });

        collector.on("end", () => {
            sentMessage.edit({components: []});
        });
    }
}

const messages = {
    es: {
        authorHeader: "Corral de {{user}}",
        pageTitle: "Página",
        resetField: "Reinicio :alarm_clock:",
        applesField: "Manzanas <:GreenApple:1296171434246410380>",
        resetInfo: "Al reiniciarse el corral, todos los slimes que haya dentro desaparecerán, " +
        "y obtendrás <:GreenApple:1296171434246410380> en función del valor de cada uno."
    },
    en: {
        authorHeader: "{{user}}'s corral",
        pageTitle: "Page",
        resetField: "Reset :alarm_clock:",
        applesField: "Apples <:GreenApple:1296171434246410380>",
        resetInfo: "When the corral resets, all slimes in it will disappear, " +
        "and you will get <:GreenApple:1296171434246410380> depending on the value of each one."
    }
};


// PARTE DE GENERACION DE IMAGENES

let imagesLoaded = false;
const slimeImages = new Map();
loadSlimesImages();
async function loadSlimesImages() {
    slimeImages.set("background", await Canvas.loadImage("https://i.imgur.com/elinwYQ.png"));
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

async function getImagesAttachment(slimes, lang) {
    await waitImagesLoad();

    const canvas = Canvas.createCanvas(1600, 1600);
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#000000";

    const positions = [];
    const starterPoint = 75;
    for (let i = 0; i < 3; i++) { // Crear puntos claves para generar la imagen
        for (let j = 0; j < 3; j++) {
            positions.push({
                x: starterPoint + j * (600 - starterPoint),
                y: starterPoint + i * (600 - starterPoint),
                textX: starterPoint + j * (600 - starterPoint) + 200,
                textY: starterPoint + i * (600 - starterPoint) + 390,
                quantityX: starterPoint + j * (600 - starterPoint),
                quantityY: starterPoint + i * (600 - starterPoint) + 50,
                quantity: 1
            })
        }
    }
    
    ctx.drawImage(slimeImages.get("background"), 0, 0, canvas.width, canvas.height);

    const images = [];

    let positionIndex = 0;
    for (const pair of slimes) {
        // Verificar si se debe continuar haciendo la misma imagen, o si terminarla y empezar con una nueva
        if (positionIndex >= positions.length) {
            images.push(new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `barn${images.length + 1}.png`}));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(slimeImages.get("background"), 0, 0, canvas.width, canvas.height);
            positionIndex = 0;
        }

        const slime = pair.obj;

        ctx.drawImage(slimeImages.get(slime.id), positions[positionIndex].x, positions[positionIndex].y, 400, 400);

        // Escribir nombre del slime
        ctx.font = "56px silkscreen";
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 8;
        ctx.textAlign = "center";
        ctx.strokeText(slime.displayName[lang], positions[positionIndex].textX, positions[positionIndex].textY); // Dibujar borde del texto
        ctx.fillText(slime.displayName[lang], positions[positionIndex].textX, positions[positionIndex].textY);

        // Escribir cantidad de slimes
        ctx.font = "100px silkscreen";
        ctx.fillStyle = "#ff1100";
        ctx.lineWidth = 12;
        ctx.textAlign = "left";
        ctx.strokeText("x" + pair.quantity.toString(), positions[positionIndex].quantityX, positions[positionIndex].quantityY);
        ctx.fillText("x" + pair.quantity.toString(), positions[positionIndex].quantityX, positions[positionIndex].quantityY);

        positionIndex += 1;
    }

    images.push(new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `almanac${images.length + 1}.png`}));

    return images;
}