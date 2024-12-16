const Discord = require("discord.js");

module.exports = {
    name: "help",
    category: "Info",
    execute(client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId);

        let embed = new Discord.EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle(messages[lang].title)
            .addFields(
            )

        msg.reply({embeds: [embed]});
    }
}

const messages = {
    es: {
        title: "Comandos de Recery Bot"
    },
    en: {
        title: "Recery Bot commands"
    }
}