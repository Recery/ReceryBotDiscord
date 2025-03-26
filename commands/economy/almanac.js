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
    syntax: {
        es: "{{prefix}}almanac",
        en: "{{prefix}}almanac"
    },
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const loadingReaction = await msg.react("<a:Loading:1334664535914844253>");
        const imageAttachments = await getAlmanacImages(eco.getTotalSlimes(userID), lang);
        const almanacAttachment = new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "slimeImages/almanac.png", {name: "almanac.png"});

        const buttonsRow = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("slideLeft")
                    .setEmoji("<:LeftArrow:1334663458687287296>")
                    .setStyle("Primary")
                    .setDisabled(true),
                new Discord.ButtonBuilder()
                    .setCustomId("slideRight")
                    .setEmoji("<:RightArrow:1334663426043154472>")
                    .setStyle("Primary")
            );

        let page = 0; // Página 0 = página 1 para el usuario

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: messages[lang].authorHeader.replace("{{name}}", msg.author.displayName),
                iconURL: msg.author.avatarURL()
            })
            .setFooter({
                text: messages[lang].pageTitle.replace("{{page}}", (page + 1).toString()) + "/" + imageAttachments.length, 
                iconURL: "attachment://almanac.png"
            })
            .setImage(`attachment://${imageAttachments[page].name}`);

        const sentMessage = await msg.reply({
            embeds: [embed],
            files: [
                imageAttachments[page],
                almanacAttachment
            ],
            components: [buttonsRow]
        });

        loadingReaction.users.remove(client.user.id);

        /// MENSAJE ENVIADO, AHORA ACTUALIZACION DEL MENSAJE

        const collector = sentMessage.createMessageComponentCollector({time: 300000});
        const messageDeleteListener = (deletedMessage) => {
            if (deletedMessage.id === sentMessage.id)
                collector.stop();
        }
        client.on("messageDelete", messageDeleteListener);
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "slideLeft") page -= 1;
            else if (interaction.customId === "slideRight") page += 1;
            else return;

            const newButtonsRow = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("slideLeft")
                        .setEmoji("<:LeftArrow:1334663458687287296>")
                        .setStyle("Primary")
                        .setDisabled(page <= 0),
                    new Discord.ButtonBuilder()
                        .setCustomId("slideRight")
                        .setEmoji("<:RightArrow:1334663426043154472>")
                        .setStyle("Primary")
                        .setDisabled(page >= imageAttachments.length - 1)
                );

            const newEmbed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: messages[lang].authorHeader.replace("{{name}}", msg.author.displayName),
                    iconURL: msg.author.avatarURL()
                })
                .setFooter({
                    text: messages[lang].pageTitle.replace("{{page}}", (page + 1).toString()) + "/" + imageAttachments.length,
                    iconURL: "attachment://almanac.png"
                })
                .setImage(`attachment://${imageAttachments[page].name}`);

            interaction.update({
                embeds: [newEmbed],
                files: [
                    imageAttachments[page],
                    almanacAttachment
                ],
                components: [newButtonsRow]
            });
        });

        collector.on("end", async () => {
            try {
                await sentMessage.edit({components: []});
            }
            catch (err) {
                console.log("Mensaje desconocido");
            }
            client.off("messageDelete", messageDeleteListener);
        });
    }
}

// PARTE DE GENERACION DE IMAGENES

let imagesLoaded = false;
const slimeImages = new Map();
loadSlimesImages();
async function loadSlimesImages() {
    slimeImages.set("background", await Canvas.loadImage(process.env.FILES_BASE_URL + "slimeImages/background.png"));
    slimeImages.set(0, await Canvas.loadImage(process.env.FILES_BASE_URL + "slimeImages/lockedSlime.png"));
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

async function getAlmanacImages(slimes, lang) {
    await waitImagesLoad();

    const images = [];

    const canvas = Canvas.createCanvas(1600, 1600);
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#000000"; // Color borde

    const positions = [];

    const starterPoint = 75;
    for (let i = 0; i < 3; i++) {
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

            break;
        }

        if (!found) ctx.drawImage(slimeImages.get(0), positions[positionIndex].x , positions[positionIndex].y, 400, 400);
        positionIndex += 1;
    }

    images.push(new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `almanac${images.length + 1}.png`}));

    return images;
}

const messages = {
    es: {
        authorHeader: "Almanaque de {{name}}",
        pageTitle: "Página {{page}}"
    },
    en: {
        authorHeader: "{{name}}'s almanac",
        pageTitle: "Page {{page}}"
    }
}