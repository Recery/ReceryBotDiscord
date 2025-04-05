const Discord = require("discord.js")

module.exports = {
    name: "discord",
    category: "info",
    alias: ["server", "servidor", "soporte"],
    description: {
        es: "Te muestro un link para invitarte al servidor de Recery, donde ofrecen soporte.",
        en: "I show you a link to join Recery's server, where they offer support."
    },
    syntax: {
        es: "{{prefix}}discord",
        en: "{{prefix}}discord"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setURL("https://discord.gg/8QFAAHVYGk")
            .setTitle("<:GreenApple:1296171434246410380> " + messages[lang].title +" <:GreenApple:1296171434246410380>")
            .setImage("attachment://recerypond.png")
            .setFooter({text: "By: Recery", iconURL: "attachment://recery.png"});
        
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel(messages[lang].buttonLabel)
                    .setStyle('Link')
                    .setURL("https://discord.gg/8QFAAHVYGk")
            );

        msg.reply({
            embeds: [embed],
            files: [
                new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "info/recerypond.png", {name: "recerypond.png"}),
                new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "info/recery.png", {name: "recery.png"})
            ],
            components: [row]
        });
    }
}

const messages = {
    es: {
        title: "!Únete al servidor de soporte!",
        buttonLabel: "¡Click para unirte!"
    },
    en: {
        title: "Join the support server!",
        buttonLabel: "Click to join!"
    }, 
}