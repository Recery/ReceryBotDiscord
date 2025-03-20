const Discord = require("discord.js");
const Canvas = require("canvas");
const eco = require("../../economy/economyModule.js");
const slimesModule = require("../../economy/slimesModule.js");

// SUBCOMANDOS
const barnAddExecution = (client, msg, args) => {
    const lang = client.langs.get(msg.guildId) || "es";
    const userID = msg.author.id;

    if (!args.length > 0) {
        msg.reply(msgsAdd[lang].notInput);
        return;
    }

    // Vamos a construir el nombre del slime ingresado por el usuario
    // Para eso hay que agregar cada argumento del array a un string hasta encontrar el argumento de cantidad (si es que hay)
    let inputName = "";
    let quantityToAdd = 1; // Por defecto la cantidad de slimes va a ser 1, por si no se ingresa un argumento de cantidad
    for (const arg of args) {
        // El argumento de cantidad empieza con una x
        if (arg.toLowerCase().startsWith("x")) {
            const inputQuantity = Number(arg.toLowerCase().replace("x", ""));
            if (!isNaN(inputQuantity)) quantityToAdd = inputQuantity;
            break;
        }

        inputName += arg + " ";
    }
    inputName = inputName.trim();

    if (quantityToAdd + eco.getBarnSlimesAmount(userID) > eco.getBarnSizeSlimes(userID)) {
        msg.reply(msgsAdd[lang].notEnoughSize);
        return;
    }

    // Buscar si el nombre/ID del slime ingresado existe en los slimes existentes
    let slimeObj;

    if (isNaN(Number(inputName))) slimeObj = slimesModule.getSlimeByName(inputName);
    else slimeObj = slimesModule.getSlime(Number(inputName))

    if (!slimeObj) {
        msg.reply(msgsAdd[lang].notFound);
        return;
    }

    // Para guardar slimes tiene que tener la cantidad necesaria en el corral, vamos a verificar eso
    let hasSlime = false;
    const slimesInCorral = eco.getCorralSlimes(userID);

    for (const slime of slimesInCorral) {
        if (slime.obj.id === slimeObj.id) {
            if (slime.quantity >= quantityToAdd) {
                hasSlime = true;
                break;
            }
        }
    }

    if (!hasSlime) {
        msg.reply(msgsAdd[lang].notEnoughSlimes.replace("{{slime}}", slimeObj.displayName[lang]));
        return;
    }

    for (let i = 0; i < quantityToAdd; i++) {
        eco.addSlimeToBarn(userID, slimeObj.id);
        eco.removeSlimeFromCorral(userID, slimeObj.id);
    }

    msg.reply(msgsAdd[lang].added.replace("{{quantity}}", quantityToAdd.toString()).replace("{{slime}}", slimeObj.displayName[lang]));
}
const msgsAdd = {
    es: {
        notInput: "Debes ingresar el nombre/ID de un slime para añadir a tu granero.",
        notEnoughSize: "No tienes suficiente espacio en tu granero para guardar esa cantidad de slimes.",
        notFound: "No se ha encontrado un slime con ese nombre/ID.",
        notEnoughSlimes: "No tienes esa cantidad de {{slime}} en tu corral.\nConsigue más slimes con `hatchslimes`.",
        added: "¡Has añadido x{{quantity}} {{slime}} a tu granero!"
    },
    en: {
        notInput: "You must enter the name/ID of a slime to add to your barn.",
        notEnoughSize: "You don't have enough space to add this amount of slimes in your barn.",
        notFound: "Couldn't find an slime with that name/ID",
        notEnoughSlimes: "You don't have enough {{slime}} in your corral.\nGet more slimes with `hatchslimes`.",
        added: "You have added x{{quantity}} {{slime}} to your barn!"
    }
}

// Parecido a barn add
const barnRemoveExecution = (client, msg, args) => {
    const lang = client.langs.get(msg.guildId) || "es";
    const userID = msg.author.id;

    // Si no tiene un primer argumento, significa que no ingreso nada mas que solo el comando
    if (!args.length > 0) {
        msg.reply(msgsRemove[lang].notInput);
        return;
    }

    // Construir nombre del slime ingresado
    let inputName = "";
    let quantityToRemove = 1;
    let quantityFound = false;
    for (const arg of args) {
        if (arg.toLowerCase().startsWith("x")) {
            const inputQuantity = Number(arg.toLowerCase().replace("x", ""));
            if (!isNaN(inputQuantity) && !quantityFound) {
                quantityToRemove = inputQuantity;
                quantityFound = true;
            }
            continue;
        }

        inputName += arg + " ";
    }
    inputName = inputName.trim();

    // Obtener el objeto del slime ingresado
    let slimeObj;

    if (isNaN(Number(inputName))) slimeObj = slimesModule.getSlimeByName(inputName);
    else slimeObj = slimesModule.getSlime(inputName);

    if (!slimeObj) {
        msg.reply(msgsRemove[lang].notFound);
        return;
    }

    // Buscar si tiene suficientes slimes
    let hasSlime = false;
    const slimesInBarn = eco.getBarnSlimes(userID);

    for (const slime of slimesInBarn) {
        if (slime.obj.id === slimeObj.id) {
            if (slime.quantity >= quantityToRemove){
                hasSlime = true;
                break;
            }
        }
    }

    if (!hasSlime) {
        msg.reply(msgsRemove[lang].notEnoughSlimes.replace("{{slime}}", slimeObj.displayName[lang]));
        return;
    }

    for (let i = 0; i < quantityToRemove; i++) {
        eco.removeSlimeFromBarn(userID, slimeObj.id);
        eco.addSlimeToCorral(userID, slimeObj.id);
    }

    msg.reply(msgsRemove[lang].removed.replace("{{slime}}", slimeObj.displayName[lang]).replace("{{quantity}}", quantityToRemove.toString()));
}
const msgsRemove = {
    es: {
        notInput: "Debes ingresar el nombre/ID de un slime para eliminar de tu granero.",
        notFound: "No se ha encontrado un slime con ese nombre/ID.",
        notEnoughSlimes: "No tienes esa cantidad de {{slime}} en tu granero para eliminarlos.",
        removed: "Has eliminado x{{quantity}} {{slime}} de tu granero."
    },
    en: {
        notInput: "You must enter the name/ID of a slime to remove from your barn.",
        notFound: "Couldn't find an slime with that name/ID",
        notEnoughSlimes: "You don't have enough {{slime}} in your barn to remove them.",
        removed: "You have removed x{{quantity}} {{slime}} from your barn."
    }
}

const upgradeBarnSlimesExecution = (client, msg, args) => {
    const lang = client.langs.get(msg.guildId) || "es";
    const userID = msg.author.id;

    const currentSize = eco.getBarnSizeSlimes(userID);
    const upgradePrice = currentSize * 50;
    const userApples = eco.getApples(userID)

    if (userApples < upgradePrice) {
        msg.reply(msgsUpgradeSlimes[lang].needMoreApples.replace("{{apples}}", upgradePrice));
        return;
    }

    const newSize = currentSize + 1;
    eco.setApples(userID, userApples - upgradePrice);
    eco.setBarnSizeSlimes(userID, newSize);

    msg.reply(msgsUpgradeSlimes[lang].upgraded.replace("{{size}}", newSize));
}
const msgsUpgradeSlimes = {
    es: {
        needMoreApples: "¡No tienes suficientes :green_apple: para mejorar tu granero de slimes!\nNecesitas {{apples}}<:GreenApple:1296171434246410380>.",
        upgraded: "¡Haz mejorado tu granero de slimes!\nAhora tiene capacidad para {{size}} slimes."
    },
    en: {
        needMoreApples: "You don't have enough :green_apple: to upgrade your slime barn!\nYou need {{apples}}<:GreenApple:1296171434246410380>.",
        upgraded: "Your slime barn has been upgraded!\nIt now has size for {{size}} slimes."
    }
}

const upgradeBarnApplesExecution = (client, msg, args) => {
    const lang = client.langs.get(msg.guildId) || "es";
    const userID = msg.author.id;

    const currentSize = eco.getBarnSizeApples(userID);
    const upgradePrice = currentSize * 5;
    const userApples = eco.getApples(userID);

    if (userApples < upgradePrice) {
        msg.reply(msgsUpgradeApples[lang].needMoreApples.replace("{{apples}}", upgradePrice));
        return;
    }

    const newSize = currentSize + 10;
    eco.setApples(userID, userApples - upgradePrice);
    eco.setBarnSizeApples(userID, newSize);

    msg.reply(msgsUpgradeApples[lang].upgraded.replace("{{size}}", newSize));
}
const msgsUpgradeApples = {
    es: {
        needMoreApples: "¡No tienes suficientes <:GreenApple:1296171434246410380> para mejorar la capacidad de manzanas!\nNecesitas {{apples}}<:GreenApple:1296171434246410380>.",
        upgraded: "¡Haz mejorado tu granero!\nAhora tiene capacidad para {{size}} <:GreenApple:1296171434246410380>."
    },
    en: {
        needMoreApples: "You don't have enough <:GreenApple:1296171434246410380> to upgrade your apples storage!\nYou need {{apples}}<:GreenApple:1296171434246410380>.",
        upgraded: "Your barn has been upgraded!\nIt now has size for {{size}} <:GreenApple:1296171434246410380>."
    }
}

const collectExecution = (client, msg, args) => {
    const lang = client.langs.get(msg.guildId) || "es";
    const userID = msg.author.id;

    const applesInBarn = eco.getBarnApples(userID);
    if (!applesInBarn > 0) {
        msg.reply(msgsCollect[lang].noApples);
        return;
    }

    const userApples = eco.getApples(userID);
    const totalApples = userApples + applesInBarn;
    eco.setApples(userID, totalApples);
    eco.setBarnApples(userID, 0);

    msg.reply(msgsCollect[lang].collected.replace("{{newApples}}", applesInBarn).replace("{{totalApples}}", totalApples));
}
const msgsCollect = {
    es: {
        noApples: "No tienes ninguna <:GreenApple:1296171434246410380> en tu granero para recolectar.",
        collected: "¡Haz recolectado {{newApples}}<:GreenApple:1296171434246410380> de tu granero! Ahora tienes {{totalApples}} <:GreenApple:1296171434246410380> en total."
    },
    en: {
        noApples: "You don't have any <:GreenApple:1296171434246410380> in your barn to collect.",
        collected: "You collected {{newApples}}<:GreenApple:1296171434246410380> from your barn! Now you have {{totalApples}} <:GreenApple:1296171434246410380> in total."
    }
}


// COMANDO PRINCIPAL
// Si no se ingresa un subcomando, muestra el contenido del granero del usuario
module.exports = {
    name: "barn",
    alias: ["granero"],
    category: "economy",
    description: {
        es: "Permite interactuar con tu granero.\n" +
        "Si no ingresas ningún subcomando, muestra información de tu granero.",
        en: "Allows to interact with your barn.\n" + 
        "If you don't enter any subcommand, shows your barn information."
    },
    subcommands: [
        {
            name: "add",
            description: {
                es: "Añade un slime a tu granero.",
                en: "Adds a slime to your barn."
            },
            examples: [
                "{{prefix}}barn add green slime",
                "{{prefix}}barn add 3 x3",
                "{{prefix}}barn add cosmic slime x2"
            ],
            syntax: {
                es: "{{prefix}}barn add <nombre/ID del slime> [cantidad]",
                en: "{{prefix}}barn add <name/ID of the slime> [quantity]"
            },
            execute: barnAddExecution
        },
        {
            name: "remove",
            description: {
                es: "Elimina un slime de tu granero.",
                en: "Removes a slime from your barn."
            },
            examples: [
                "{{prefix}}barn remove yellow slime",
                "{{prefix}}barn remove 1 x2",
                "{{prefix}}barn remove white slime x4"
            ],
            syntax: {
                es: "{{prefix}}barn remove <nombre/ID del slime> [cantidad]",
                en: "{{prefix}}barn remove <name/ID of the slime> [quantity]"
            },
            execute: barnRemoveExecution
        },
        {
            name: "upgradeslimes",
            description: {
                es: "Mejora el espacio de almacenamiento de slimes de tu granero.",
                en: "Upgrades your storage size for slimes from your barn."
            },
            syntax: {
                es: "{{prefix}}barn upgradeslimes",
                en: "{{prefix}}barn upgradeslimes"
            },
            execute: upgradeBarnSlimesExecution
        },
        {
            name: "upgradeapples",
            description: {
                es: "Mejora la cantidad de <:GreenApple:1296171434246410380> que puede contener tu granero.",
                en: "Upgrades the quantity of <:GreenApple:1296171434246410380> that your barn can hold."
            },
            syntax: {
                es: "{{prefix}}barn upgradeapples",
                en: "{{prefix}}barn upgradeapples"
            },
            execute: upgradeBarnApplesExecution
        },
        {
            name: "collect",
            description: {
                es: "Recolecta las <:GreenApple:1296171434246410380> de tu granero.",
                en: "Collects the <:GreenApple:1296171434246410380> of your barn."
            },
            syntax: {
                es: "{{prefix}}barn collect",
                en: "{{prefix}}barn collect"
            },
            execute: collectExecution
        },
    ],
    syntax: {
        es: "{{prefix}}barn [subcomando]",
        en: "{{prefix}}barn [subcommand]"
    },
    async execute(client, msg, args) {
        let subcommandName = args.shift();
        if (subcommandName) subcommandName = subcommandName.toLowerCase().trim();
        for (const subcommand of this.subcommands) {
            //console.log(subcommand.name, subcommandName);
            if (subcommand.name === subcommandName) {
                subcommand.execute(client, msg, args);
                return;
            }
        }

        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimes = eco.getBarnSlimes(userID);

        let content = "\n";
        if (!slimes.length > 0) content += "¡Ninguno!";

        for (const slime of eco.getBarnSlimes(userID)) {
            content += "`ID: " + slime.obj.id.toString() + "` "; // Agregar el id primero
            content += slime.obj.displayName[lang] + " x" + slime.quantity.toString() + "\n";
        }

        let page = 0; // Página 0 = página 1 para el usuario

        const images = await getImagesAttachment(eco.getBarnSlimes(userID), lang);
        const userBarnApples = eco.getBarnApples(userID);

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: messages[lang].authorHeader.replace("{{name}}", msg.author.displayName),  
                iconURL: msg.author.avatarURL()
            })
            .addFields(
                {name: "Slimes", value: `${eco.getBarnSlimesAmount(userID)}/${eco.getBarnSizeSlimes(userID)}`, inline: true},
                {name: messages[lang].applesSizeTitle, value: `${userBarnApples}/${eco.getBarnSizeApples(userID)} <:GreenApple:1296171434246410380>`, inline: true},
                {name: messages[lang].appleGenerationTitle, value: `${eco.getBarnApplesGeneration(userID)}<:GreenApple:1296171434246410380> /h`, inline: true},
            )
            .setColor("Red")
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
        const collectButton = new Discord.ButtonBuilder()
            .setCustomId("collect")
            .setEmoji("<:GreenApple:1296171434246410380>")
            .setLabel(messages[lang].collectButtonText)
            .setStyle("Success")
            .setDisabled(!userBarnApples > 0);
        const rightButton = new Discord.ButtonBuilder()
            .setCustomId("slideRight")
            .setEmoji("<:RightArrow:1334663426043154472>")
            .setStyle("Primary")
            .setDisabled(page >= images.length - 1);
        
        const buttonsRow = new Discord.ActionRowBuilder()
            .addComponents(
                leftButton,
                collectButton,
                rightButton
            );

        const sentMessage = await msg.reply({
            embeds: [embed],
            files: [images[page]],
            components: [buttonsRow]
        });

        const collector = sentMessage.createMessageComponentCollector({time: 120000});
        const messageDeleteListener = (deletedMessage) => {
            if (deletedMessage.id === sentMessage.id)
                collector.stop();
        }
        client.on("messageDelete", messageDeleteListener);

        collector.on("collect", (interaction) => {
            if (interaction.customId === "slideLeft") page -= 1;
            else if (interaction.customId === "slideRight") page += 1;
            else if (interaction.customId === "collect") {
                if (interaction.user.id !== userID) {
                    interaction.reply({
                        content: messages[lang].notYourBarn,
                        ephemeral: true
                    });
                    return;
                }
                
                const newUserBarnApples = eco.getBarnApples(userID);

                const newButtonsRow = new Discord.ActionRowBuilder()
                    .addComponents(
                        leftButton,
                        collectButton.setDisabled(true),
                        rightButton
                    );

                eco.setBarnApples(userID, 0);
                eco.setApples(eco.getApples(userID) + newUserBarnApples);

                embed.spliceFields(
                    1,
                    1,
                    {name: messages[lang].applesSizeTitle, value: `0/${eco.getBarnSizeApples(userID)} <:GreenApple:1296171434246410380>`, inline: true}
                );

                interaction.update({
                    embeds: [embed],
                    components: [newButtonsRow]
                });
                interaction.channel.send(messages[lang].applesCollected.replace("{{apples}}", newUserBarnApples));
                
                collector.resetTimer();

                return;
            }
            else return;

            leftButton.setDisabled(page <= 0);
            rightButton.setDisabled(page >= images.length - 1);

            const newButtonsRow = new Discord.ActionRowBuilder()
                .addComponents(
                    leftButton,
                    collectButton,
                    rightButton
                );

            embed.setFooter({
                    text: `${messages[lang].pageTitle} ${page+1}/${images.length}`,
                    iconURL: "https://i.imgur.com/igkTvXQ.png"
                });
            embed.setImage(`attachment://${images[page].name}`);
            
            interaction.update({
                embeds: [embed],
                files: [images[page]],
                components: [newButtonsRow]
            })
            
            collector.resetTimer();
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

const messages = {
    es: {
        authorHeader: "Granero de {{name}}",
        applesSizeTitle: "Manzanas",
        appleGenerationTitle: "Producción",
        pageTitle: "Página",
        collectButtonText: "Recolectar",
        applesCollected: "Haz recolectado {{apples}} <:GreenApple:1296171434246410380> de tu granero.",
        notYourBarn: "No puedes recolectar manzanas que no son de tu granero."
    },
    en: {
        authorHeader: "{{name}}'s barn",
        applesSizeTitle: "Apples",
        appleGenerationTitle: "Production",
        pageTitle: "Page",
        collectButtonText: "Collect",
        applesCollected: "You have collected {{apples}} <:GreenApple:1296171434246410380> from your barn.",
        notYourBarn: "You cannot collect apples that are not from your barn."
    }
}


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