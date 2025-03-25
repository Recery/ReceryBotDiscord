const Discord = require("discord.js");

module.exports = {
    name: "invite",
    category: "info",
    alias: ["invitar", "invitation"],
    description: {
        es: "Te envío un link para que puedas invitarme a los servidores que administres.",
        en: "I send you a link to invite me to the servers that you're administrating."
    },
    syntax: {
        es: "{{prefix}}invite",
        en: "{{prefix}}invite"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setURL("https://discord.com/oauth2/authorize?client_id=1295826584153882744&permissions=1689934340028480&integration_type=0&scope=bot+applications.commands")
            .setTitle("<:GreenApple:1296171434246410380> " + messages[lang].embedTitle + " <:GreenApple:1296171434246410380>")
            .setImage("attachment://recerybot.png")
            .setFooter({text: "By: Recery", iconURL: process.env.FILES_BASE_URL + "info/recery.png"})
        
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel(messages[lang].buttonLabel)
                    .setStyle('Link')
                    .setURL("https://discord.com/oauth2/authorize?client_id=1295826584153882744&permissions=1689934340028480&integration_type=0&scope=bot+applications.commands")
            );
        
        msg.reply({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(client.user.avatarURL(), {name: "recerybot.png"})],
            components: [row]
        })
    }
}

const messages = {
    es: {
        embedTitle: "¡Click aquí para invitarme a tu servidor!",
        buttonLabel: "¡Click para invitar!"
    },
    en: {
        embedTitle: "Click here to invite me to your server!",
        buttonLabel: "Click to invite!"
    }
}