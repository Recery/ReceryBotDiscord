const Discord = require("discord.js");
const { commandCategories } = require("../../langsLoader.js");

module.exports = {
    name: "help",
    alias: ["ayuda"],
    category: "info",
    description: {
        es: "Muestra un menú para ver los comandos disponibles.\n" +
        "Ingresa un comando como argumento para ver sus detalles.",
        en: "Shows a menu to see all available commands.\n" +
        "Enter a command as an argument to see their details.",
    },
    examples: ["{{prefix}}help", "{{prefix}}help 8ball", "{{prefix}}help hs"],
    execute(client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";

        // Si tiene más de un argumento, significa que el usuario ingresó (o eso debería) un comando para obtener info del mismo 
        if (args.length > 0) {
            const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(args[0]));
            if (sendCommandDescription(client, msg, lang, command)) return;
        }

        const embed = new Discord.EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle(messages[lang].title);
        
        const selection = new Discord.StringSelectMenuBuilder()
            .setCustomId("helpCategoriesSel")
            .setPlaceholder(messages[lang].selectionPlaceholder)
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["action"])
                    .setDescription(messages[lang].actionSelectionDesc)
                    .setValue("action"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["administration"])
                    .setDescription(messages[lang].administrationSelectionDesc)
                    .setValue("administration"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["economy"])
                    .setDescription(messages[lang].economySelectionDesc)
                    .setValue("economy"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["fun"])
                    .setDescription(messages[lang].funSelectionDesc)
                    .setValue("fun"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["info"])
                    .setDescription(messages[lang].infoSelectionDesc)
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
        selectionPlaceholder: "Elige una categoría",
        actionSelectionDesc: "Comandos para realizar acciones hacia otros miembros o hacia ti mismo.",
        administrationSelectionDesc: "Comandos de administración del servidor y configurarme.",
        economySelectionDesc: "Comandos para interactuar con mi sistema de economía.",
        funSelectionDesc: "Comandos para divertirte.",
        infoSelectionDesc: "Comandos de información sobre mí."
    },
    en: {
        title: "Recery Bot commands",
        selectionPlaceholder: "Choose a category",
        administrationSelectionDesc: "Commands to manage the server and configure myself.",
        actionSelectionDesc: "Commands to perform actions on other members or yourself.",
        economySelectionDesc: "Commands to interact with my economy system.",
        funSelectionDesc: "Commands to have fun.",
        infoSelectionDesc: "Commands about information of myself."
    }
}

const prefix = require("../../prefix.js");
function sendCommandDescription(client, msg, lang, command) {
    if (!command) return false;
    let description = cmdDescriptionMsgs[lang].noDescription;
    if (command.description) 
        description = command.description;

    const embed = new Discord.EmbedBuilder()
        .setTitle(cmdDescriptionMsgs[lang].commandTitle + command.name)
        .setDescription(description)
        .setColor("#65a7fc");

    if (command.alias) {
        let aliases = "";
        for (const alias of command.alias) {
            aliases += "`" + alias + "` ";
        }
        aliases.trim();

        embed.addFields(
            {name: cmdDescriptionMsgs[lang].aliasField, value: aliases}
        );
    }

    if (command.examples) {
        let examples = "";
        for (const example of command.examples) {
            examples += "`" + example.replace("{{prefix}}", prefix.getPrefix(msg.guildId)) + "`\n";
        }
        examples.trim();

        embed.addFields(
            {name: cmdDescriptionMsgs[lang].examplesField, value: examples}
        );
    }

    embed.setFooter(
        {text: cmdDescriptionMsgs[lang].categoryField + commandCategories[lang][command.category], iconURL: client.user.avatarURL()}
    );

    msg.reply( { embeds: [embed]} );

    return true;
}

const cmdDescriptionMsgs = {
    es: {
        commandTitle: "Comando: ",
        noDescription: "Parece que este comando no tiene descripción...",
        categoryField: "Categoría: ",
        aliasField: "**Alias**",
        examplesField: "**Ejemplos de uso**"
    },
    en: {
        commandTitle: "Command: ",
        noDescription: "It seems this command does not have a description...",
        categoryField: "Category: ",
        aliasField: "**Aliases**",
        examplesField: "**Use examples**"
    }
}