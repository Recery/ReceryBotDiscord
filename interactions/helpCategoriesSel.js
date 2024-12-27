const Discord = require("discord.js");

module.exports = {
    id: "helpCategoriesSel",
    execute(client, interaction) {
        const lang = client.langs.get(interaction.guildId) || "es";

        const category = interaction.values[0] || "misc";
        console.log(category);

        const newEmbed = new Discord.EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle(messages[lang].title + messages[lang][category])
            .setDescription(getCommands(category, client).join(" "));

        interaction.update({
            embeds: [newEmbed]
        });
    }
}

function getCommands(category, client) {
    const commands = [];

    for (const command of client.commands) {
        console.log(command.name);
        if (command.category === category) {
            commands.push(command.name);
        }
    }

    if (!commands.length > 0) commands.push("...");

    return commands;
}

const messages = {
    es: {
        title: "Categoría: ",
        action: "Acción"
    },
    en: {
        title: "Category: ",
        action: "Action"
    }
}