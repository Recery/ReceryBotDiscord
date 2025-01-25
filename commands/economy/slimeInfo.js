const Discord = require("discord.js");
const slimesModule = require("../../economy/slimesModule.js");

module.exports = {
    name: "slimeinfo",
    category: "economy",
    description: {
        es: "Muestra información sobre un slime.\n" +
        "Puedes usar el nombre del slime o su ID.",
        en: "Shows information about an slime.\n" + 
        "You can use the slime name or the ID."
    },
    examples: ["{{prefix}}slimeinfo green slime", "{{prefix}}slimeinfo 5", "{{prefix}}slimeinfo creamy slime"],
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (args.length <= 0) {
            msg.reply(messages[lang].notInput);
            return;
        }

        let inputName = "";

        // Construir el nombre/ID del slime ingresado
        for(const arg of args)
            inputName += arg + " ";

        inputName = inputName.trim();

        let slimeObj;
        if (isNaN(Number(inputName))) slimeObj = slimesModule.getSlimeByName(inputName);
        else slimeObj = slimesModule.getSlime(Number(inputName));

        if (!slimeObj) {
            msg.reply(messages[lang].notFound);
            return;
        }

        let description = "**ID: `" + slimeObj.id.toString() + "`\n" + messages[lang].rarity;
        for (let i = 0; i < slimeObj.rarity; i++)
            description += ":star:";
        description += "\n" + messages[lang].appleGeneration.replace("{{apples}}", slimeObj.appleGeneration.toString()) + "**";

        const embed = new Discord.EmbedBuilder()
            .setTitle(messages[lang].embedTitle.replace("{{slime}}", slimeObj.displayName[lang]))
            .setColor("#12bcff")
            .setDescription(description)
            .setThumbnail(slimeObj.image)
            .setFooter({text: msg.author.displayName, iconURL: msg.author.avatarURL()});

        msg.reply({
            embeds: [embed]
        });
    }
}

const messages = {
    es: {
        notInput: "Debes ingresar el nombre/ID de un slime para eliminar de tu granero.",
        notFound: "No se ha encontrado un slime con ese nombre/ID.",
        rarity: "Rareza: ",
        appleGeneration: "Producción por hora: x{{apples}} :green_apple:",
        embedTitle: "Información sobre {{slime}}"
    },
    en: {
        notInput: "You must enter the name/ID of a slime to remove from your barn.",
        notFound: "Couldn't find an slime with that name/ID",
        rarity: "Rarity: ",
        appleGeneration: "Production per hour: x{{apples}} :green_apple:",
        embedTitle: "Information about {{slime}}"
    }
}