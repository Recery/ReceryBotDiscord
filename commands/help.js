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
        
        const selection = new Discord.StringSelectMenuBuilder()
            .setCustomId("helpCategoriesSel")
            .setPlaceholder(messages[lang].selection_placeholder)
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].action_selection_label)
                    .setDescription(messages[lang].action_selection_label)
                    .setValue("help_action_option")
            )

        const row1 = new Discord.ActionRowBuilder()
            .addComponents(selection);

        msg.reply({embeds: [embed], components: [row1]});
    }
}

const messages = {
    es: {
        title: "Comandos de Recery Bot",
        selection_placeholder: "Elige una categoría",
        action_selection_label: "Acción",
        action_selection_desc: "Comandos para realizar acciones hacia otros miembros o hacia ti mismo."
    },
    en: {
        title: "Recery Bot commands",
        selection_placeholder: "Choose a category",
        action_selection_label: "Action",
        action_selection_desc: "Commands to perform actions on other members or yourself."
    }
}