const Discord = require("discord.js");

module.exports = {
    name: "help",
    category: "info",
    execute(client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";

        // Si tiene más de un argumento, significa que el usuario ingresó (o eso debería) un comando para obtener info del mismo 
        if (args.length > 0) {
            const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(args[0]));
            if (sendCommandDescription(msg, lang, command)) return;
        }

        const embed = new Discord.EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle(messages[lang].title);
        
        const selection = new Discord.StringSelectMenuBuilder()
            .setCustomId("helpCategoriesSel")
            .setPlaceholder(messages[lang].selection_placeholder)
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].action_selection_label)
                    .setDescription(messages[lang].action_selection_desc)
                    .setValue("action"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].administration_selection_label)
                    .setDescription(messages[lang].administration_selection_desc)
                    .setValue("administration"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].economy_selection_label)
                    .setDescription(messages[lang].economy_selection_desc)
                    .setValue("economy"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].fun_selection_label)
                    .setDescription(messages[lang].fun_selection_desc)
                    .setValue("fun"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].info_selection_label)
                    .setDescription(messages[lang].info_selection_desc)
                    .setValue("info")
            );

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
        action_selection_desc: "Comandos para realizar acciones hacia otros miembros o hacia ti mismo.",

        administration_selection_label: "Administración",
        administration_selection_desc: "Comandos de administración del servidor y configurarme.",

        economy_selection_label: "Economía",
        economy_selection_desc: "Comandos para interactuar con mi sistema de economía.",

        fun_selection_label: "Diversión",
        fun_selection_desc: "Comandos para divertirte.",

        info_selection_label: "Información",
        info_selection_desc: "Comandos de información sobre mí."
    },
    en: {
        title: "Recery Bot commands",
        selection_placeholder: "Choose a category",

        administration_selection_label: "Administration",
        administration_selection_desc: "Commands to manage the server and configure myself.",

        action_selection_label: "Action",
        action_selection_desc: "Commands to perform actions on other members or yourself.",

        economy_selection_label: "Economy",
        economy_selection_desc: "Commands to interact with my economy system.",

        fun_selection_label: "Fun",
        fun_selection_desc: "Commands to have fun.",

        info_selection_label: "Info",
        info_selection_desc: "Commands about information of myself."
    }
}

const prefix = require("../../prefix.js");
function sendCommandDescription(msg, lang, command) {
    if (!command) return false;
    if (!command.description) return false;

    const embed = new Discord.EmbedBuilder()
        .setTitle(cmdDescriptionMsgs[lang].commandTitle + command.name)
        .setDescription(command.description[lang])
        .setColor("#65a7fc");

    if (command.alias) {
        let aliases = ""
        for (const alias of command.alias) {
            aliases += "`" + alias + "` ";
        }
        aliases.trim();

        embed.addFields(
            {name: cmdDescriptionMsgs[lang].aliasField, value: aliases}
        )
    }

    if (command.examples) {
        let examples = "";
        for (const example of command.examples) {
            examples += "`" + example.replace("{{prefix}}", prefix.get_prefix(msg.guildId)) + "`\n";
        }
        examples.trim();

        embed.addFields(
            {name: cmdDescriptionMsgs[lang].examplesField, value: examples}
        )
    }

    embed.setFooter({text: cmdDescriptionMsgs[lang].categoryField + command.category})

    msg.reply( { embeds: [embed]} );

    return true;
}

const cmdDescriptionMsgs = {
    es: {
        commandTitle: "Comando: ",
        categoryField: "Categoría: ",
        aliasField: "**Alias**",
        examplesField: "**Ejemplos de uso**"
    },
    en: {
        commandTitle: "Command: ",
        categoryField: "Category: ",
        aliasField: "**Aliases**",
        examplesField: "**Use examples**"
    }
}