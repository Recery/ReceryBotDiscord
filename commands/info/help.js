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
    async execute(client, msg, args)
    {
        const lang = client.langs.get(msg.guildId) || "es";

        // Si tiene más de un argumento, significa que el usuario debería haber ingresado un comando para obtener info del mismo 
        if (args.length > 0) {
            const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(args[0]));
            
            // Verificar si mandó también un segundo argumento por si quiere ver información de un subcomando
            if (args[1] && command)
                if (command.subcommands)
                    for (const subcommand of command.subcommands)
                        if (subcommand.name === args[1])
                            if (sendCommandDescription(client, msg, lang, subcommand, true)) return;

            if (sendCommandDescription(client, msg, lang, command)) return;
        }

        const embed = new Discord.EmbedBuilder()
            .setColor("Blue")
            .setTitle(messages[lang].title)
            .setDescription(messages[lang].description.replace("{{commands}}", client.commands.size.toString()))
            .setFooter({text: "By: Recery", iconURL: "https://i.imgur.com/9T6Py5u.png"});
        
        const keys = Object.keys(commandCategories[lang]);
        for (const key of keys) {
            embed.addFields({
                name: "`" + commandCategories[lang][key] + "`",
                value: messages[lang][key]
            });
        }
        
        const selection = new Discord.StringSelectMenuBuilder()
            .setCustomId("Selection")
            .setPlaceholder(messages[lang].selectionPlaceholder)
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["action"])
                    .setEmoji("<:MiniKnife:1335024821876035604>")
                    .setDescription(messages[lang].action)
                    .setValue("action"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["administration"])
                    .setEmoji("<:CogWheel:1334956292124577926>")
                    .setDescription(messages[lang].administration)
                    .setValue("administration"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["economy"])
                    .setEmoji("<:GreenApple:1296171434246410380>")
                    .setDescription(messages[lang].economy)
                    .setValue("economy"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["fun"])
                    .setEmoji("<:ReceryHappy:1334956657041608755>")
                    .setDescription(messages[lang].fun)
                    .setValue("fun"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(commandCategories[lang]["info"])
                    .setEmoji("<:Info:1334967699322962051>")
                    .setDescription(messages[lang].info)
                    .setValue("info")
            );

        const row1 = new Discord.ActionRowBuilder()
            .addComponents(selection);

        const row2 = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("Delete")
                    .setStyle("Danger")
                    .setEmoji("<:Cancel:1335027830412677160>")
            );
            
        const sentMessage = await msg.reply({
            embeds: [embed],
            components: [row1, row2]
        });

        /// MENSAJE ENVIADO, AHORA MANEJAR INTERACCIONES

        const collector = sentMessage.createMessageComponentCollector({time:300000});

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "Delete") {
                interaction.message.delete();
                return;
            }
            else if (interaction.customId !== "Selection") return;

            const category = interaction.values[0] || "economy";
            const newEmbed = new Discord.EmbedBuilder()
                .setColor("Blue")
                .setTitle(commandCategories[lang][category])
                .setFooter({text: "By: Recery", iconURL: "https://i.imgur.com/9T6Py5u.png"});
            
            const commands = getCommandsByCategory(category, client);

            newEmbed.addFields({
                name: messages[lang].categoryTitle,
                value: "`" + commands.join("` `") + "`"
            });

            interaction.update({
                embeds: [newEmbed]
            });
        });

        collector.on("end", () => {
            sentMessage.edit({components: []})
        });
    }
}

function getCommandsByCategory(category, client) {
    const commands = [];

    for (const command of client.commands)
        if (command[1].category === category)
            commands.push(command[1].name);

    if (!commands.length > 0) commands.push("...");

    return commands;
}

const messages = {
    es: {
        title: "Comandos de Recery Bot",
        description: "Selecciona una categoría de abajo para ver sus comandos.\n" +
        "Puedes elegir entre `{{commands}}` comandos en total.",
        categoryTitle: ":white_medium_small_square: Comandos de esta categoría",
        selectionPlaceholder: "Elige una categoría",
        action: "Acciones hacia otros miembros o hacia ti mismo.",
        administration: "Administración del servidor y configurarme.",
        economy: "Interactuar con mi sistema de economía.",
        fun: "Para divertirte.",
        info: "Información sobre mí."
    },
    en: {
        title: "Recery Bot commands",
        description: "Select a category from below to see their commands.\n"+
        "You can choose between `{{commands}}` commands in total.",
        categoryTitle: ":white_medium_small_square: Commands of this category",
        selectionPlaceholder: "Choose a category",
        action: "Perform actions on other members or yourself.",
        administration: "Manage the server and configure myself.",
        economy: "Interact with my economy system.",
        fun: "To have fun.",
        info: "Information of myself."
    }
}


/// MENU DE AYUDA YA TERMINÓ
/// VIENE PARTE DE MOSTRAR INFORMACION DETALLADA DE UN COMANDO SI EL USUARIO INGRESÓ UN COMANDO COMO ARGUMENTO


const prefix = require("../../prefix.js");
function sendCommandDescription(client, msg, lang, command, subcommand = false) {
    if (!command) return false;
    let description = cmdDescriptionMsgs[lang].noDescription;
    if (command.description) 
        description = command.description[lang];

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

    if (command.subcommands) {
        let subcommands = "";
        for (const subcommand of command.subcommands) {
            subcommands += "`" + subcommand.name + "`: " + subcommand.description[lang] + "\n";
        }
        subcommands.trim();

        embed.addFields(
            {name: "**" + cmdDescriptionMsgs[lang].subcommandsField + "**", value: subcommands}
        );
    }

    if (command.examples) {
        let examples = "";
        const serverPrefix = prefix.getPrefix(msg.guildId);
        for (const example of command.examples) {
            examples += "`" + example.replace("{{prefix}}", serverPrefix) + "`\n";
        }
        examples.trim();

        embed.addFields(
            {name: cmdDescriptionMsgs[lang].examplesField, value: examples}
        );
    }

    if (subcommand) {
        embed.setFooter(
            {text: cmdDescriptionMsgs[lang].categoryField + cmdDescriptionMsgs[lang].subcommands, iconURL: client.user.avatarURL()}
        );
    }
    else {
        embed.setFooter(
            {text: cmdDescriptionMsgs[lang].categoryField + commandCategories[lang][command.category], iconURL: client.user.avatarURL()}
        );
    }

    msg.reply( { embeds: [embed]} );

    return true;
}

const cmdDescriptionMsgs = {
    es: {
        commandTitle: "Comando: ",
        noDescription: "Parece que este comando no tiene descripción...",
        categoryField: "Categoría: ",
        aliasField: "**Alias**",
        examplesField: "**Ejemplos de uso**",
        subcommands: "Subcomandos"
    },
    en: {
        commandTitle: "Command: ",
        noDescription: "It seems this command does not have a description...",
        categoryField: "Category: ",
        aliasField: "**Aliases**",
        examplesField: "**Use examples**",
        subcommands: "Subcommands"
    }
}