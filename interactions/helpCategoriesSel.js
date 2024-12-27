const Discord = require("discord.js");

module.exports = {
    name: "helpCategoriesSel",
    execute(client, interaction) {
        const lang = client.langs.get(interaction.guildId) || "es";

        const category = interaction.values[0] || "misc";

        const newEmbed = new Discord.EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle(messages[lang].title + messages[lang][category])
            .setDescription(getCommands(category).join(" "));

        interaction.update({
            embeds: [newEmbed]
        });
    }
}

function getCommands(category) {
    const commands = [];

    for (const command of client.commands) {
        if (command.category === category)
            commands.push(command.name);
    }

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