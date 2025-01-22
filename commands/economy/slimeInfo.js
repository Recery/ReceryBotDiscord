const Discord = require("discord.js");
const slimesModule = require("../../economy/slimesModule.js");

module.exports = {
    name: "slimeinfo",
    category: "economy",
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

        inputName.trim();

        let slimeObj;
        if (isNaN(Number(inputName))) slimeObj = slimesModule.getSlimeByName(inputName);
        else slimeObj = slimesModule.getSlime(Number(inputName));

        if (!slimeObj) {
            msg.reply(messages[lang].notFound);
            return;
        }

        let description = "**" + messages[lang].rarity;
        for (let i = 0; i < slimeObj.rarity; i++)
            description += ":star:";

        description += "\n" + messages[lang].appleGeneration.replace("{{aples}}", slimeObj.appleGeneration.toString()) + "**";

        const embed = new Discord.EmbedBuilder()
            .setTitle(messages[lang].embedTitle.replace("{{slime}}", slimeObj.displayName[lang]))
            .setColor("#12bcff")
            .setDescription(description)
            .setThumbnail(slimeObj.image);

        msg.reply({
            embeds: [embed],
        });
    }
}

const messages = {
    es: {
        notInput: "Debes ingresar el nombre/ID de un slime para eliminar de tu granero.",
        notFound: "No se ha encontrado un slime con ese nombre/ID.",
        rarity: "Rareza: ",
        appleGeneration: "{{apples}} por hora",
        embedTitle: "Información sobre {{slime}}"
    },
    en: {
        notInput: "You must enter the name/ID of a slime to remove from your barn.",
        notFound: "Couldn't find an slime with that name/ID",
        rarity: "Rarity: ",
        appleGeneration: "{{apples}} per hour",
        embedTitle: "Information about {{slime}}"
    }
}