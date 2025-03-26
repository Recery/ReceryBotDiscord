const Discord = require("discord.js");

module.exports = {
    name: "slimeshoot",
    category: "info",
    description: {
        es: "Te envío un link para que puedas descargar Slime Shoot, el juego de mi creador Recery.",
        en: "I send you a link to download Slime Shoot, the game of my creator Recery."
    },
    syntax: {
        es: "{{prefix}}slimeshoot",
        en: "{{prefix}}slimeshoot"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setURL("https://recery.itch.io/slime-shoot")
            .setTitle("<:GreenApple:1296171434246410380> " + messages[lang].embedTitle + " <:GreenApple:1296171434246410380>")
            .setImage("attachment://slimeshoot.png")
            .setFooter({text: "By: Recery", iconURL: "attachment://recery.png"});
        
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel(messages[lang].buttonLabel)
                    .setStyle('Link')
                    .setURL("https://recery.itch.io/slime-shoot")
            );
        
        msg.reply({
            embeds: [embed],
            files: [
                new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "info/slimeshoot.png", {name: "slimeshoot.png"}),
                new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "info/recery.png", {name: "recery.png"})
            ],
            components: [row]
        });
    }
}

const messages = {
    es: {
        embedTitle: "¡Click aquí para descargar Slime Shoot!",
        buttonLabel: "¡Click para descargar!"
    },
    en: {
        embedTitle: "Click here to download Slime Shoot!",
        buttonLabel: "Click to download!"
    }
}