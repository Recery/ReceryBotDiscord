const Discord = require("discord.js");

module.exports = {
    name: "kofi",
    category: "info",
    description: {
        es: "Te envío un link para ver el Ko-Fi de mi creador Recery.",
        en: "I send you a link to the Ko-Fi of my creator Recery."
    },
    syntax: {
        es: "{{prefix}}kofi",
        en: "{{prefix}}kofi"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setURL("https://ko-fi.com/recery")
            .setTitle("<:GreenApple:1296171434246410380> " + messages[lang].embedTitle + " <:GreenApple:1296171434246410380>")
            .setImage("attachment://kofi.png")
            .setFooter({text: "By: Recery", iconURL: process.env.FILES_BASE_URL + "info/recery.png"})
        
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel(messages[lang].buttonLabel)
                    .setStyle('Link')
                    .setURL("https://ko-fi.com/recery")
            );
        
        msg.reply({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "info/recery.png", {name: "kofi.png"})],
            components: [row]
        });
    }
}

const messages = {
    es: {
        embedTitle: "¡Click aquí para ver el Ko-Fi de Recery!",
        buttonLabel: "¡Click para ver!"
    },
    en: {
        embedTitle: "Click here to view Recery's Ko-Fi!",
        buttonLabel: "Click to view!"
    }
}