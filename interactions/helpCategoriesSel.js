const Discord = require("discord.js");

module.exports = {
    id: "helpCategoriesSel",
    execute(client, interaction) {
        const lang = client.langs.get(interaction.guildId) || "es";

        const category = interaction.values[0] || "misc";

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

    let charsSum = 0;

    for (const command of client.commands) {
        if (command[1].category === category) {
            const commandStr = "`" + command[1].name + "`";

            // Si todos los comandos agregados hasta ahora en esta linea suman 50 caracteres, hace un salto de linea
            charsSum += commandStr.length;
            if (charsSum > 50) {
                charsSum = 0;
                commands.push("\n");
            }
            commands.push(commandStr);
        }
    }

    if (!commands.length > 0) commands.push("...");

    return commands;
}

const messages = {
    es: {
        title: "Categoría: ",
        action: "Acción",
        administration: "Administración",
        economy: "Economía",
        fun: "Diversión",
        info: "Información"
    },
    en: {
        title: "Category: ",
        action: "Action",
        administration: "Administration",
        economy: "Economy",
        fun: "Fun",
        info: "Info"
    }
}