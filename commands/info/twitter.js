const Discord = require("discord.js");

module.exports = {
    name: "twitter",
    category: "info",
    description: {
        es: "Te envío un link para ver el twitter de mi creador Recery.",
        en: "I send you a link to the twitter of my creator Recery."
    },
    syntax: {
        es: "{{prefix}}twitter",
        en: "{{prefix}}twitter"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setURL("https://x.com/Recery_")
            .setTitle("<:GreenApple:1296171434246410380> " + messages[lang].embedTitle + " <:GreenApple:1296171434246410380>")
            .setImage("attachment://twitter.png")
            .setFooter({text: "By: Recery", iconURL: process.env.FILES_BASE_URL + "info/recery.png"})
        
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel(messages[lang].buttonLabel)
                    .setStyle('Link')
                    .setURL("https://x.com/Recery_")
            );
        
        msg.reply({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "info/recery.png", {name: "twitter.png"})],
            components: [row]
        });
    }
}

const messages = {
    es: {
        embedTitle: "¡Click aquí para ver el twitter de Recery!",
        buttonLabel: "¡Click para ver!"
    },
    en: {
        embedTitle: "Click here to view Recery's twitter!",
        buttonLabel: "Click to view!"
    }
}