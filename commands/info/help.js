const Discord = require("discord.js");
const categoriesModule = require("../../commandCategories.js");
const prefix = require("../../prefix.js");

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
    syntax: {
        es: "{{prefix}}help [comando para ver]",
        en: "{{prefix}}help [command to see]"
    },
    async execute(client, msg, args)
    {
        const lang = client.langs.get(msg.guildId) || "es";
        const serverPrefix = prefix.getPrefix(msg.guildId);

        // Si tiene más de un argumento, significa que el usuario debería haber ingresado un comando para obtener info del mismo 
        if (args.length > 0) {
            const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(args[0]));
            
            // Verificar si mandó también un segundo argumento por si quiere ver información de un subcomando
            if (args[1] && command)
                if (command.subcommands)
                    for (const subcommand of command.subcommands)
                        if (subcommand.name === args[1])
                            if (sendCommandDescription(client, msg, lang, serverPrefix, subcommand, true)) return;

            if (sendCommandDescription(client, msg, lang, serverPrefix, command, false)) return;
        }

        const embed = new Discord.EmbedBuilder()
            .setAuthor({name: "Recery Bot", iconURL: client.user.avatarURL()})
            .setColor('Random')
            .setDescription(messages[lang].description.replace("{{commands}}", client.commands.size.toString()))
            .setFooter({text: "By: Recery", iconURL: "attachment://recery.png"});
        
        const selection = new Discord.StringSelectMenuBuilder()
            .setCustomId("Selection")
            .setPlaceholder(messages[lang].selectionPlaceholder);

        const keys = Object.keys(categoriesModule.categories[lang]);
        for (const key of keys) {
            embed.addFields({
                name: categoriesModule.categoriesEmojis[key] + " `" + categoriesModule.categories[lang][key] + "`",
                value: categoriesModule.categoriesDescriptions[lang][key]
            });

            selection.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(categoriesModule.categories[lang][key])
                    .setEmoji(categoriesModule.categoriesEmojis[key])
                    .setDescription(categoriesModule.categoriesDescriptions[lang][key])
                    .setValue(key)
            );
        }

        embed.addFields({
            name: messages[lang].importantTitle,
            value: "**" + messages[lang].helpWithCommand.replace("{{prefix}}", serverPrefix) + "**\n" +
            "**" + messages[lang].changeLanguage.replace("{{prefix}}", serverPrefix) + "**\n" +
            "**" + messages[lang].prefixHere.replaceAll("{{prefix}}", serverPrefix) + "**\n" +
            "**" + messages[lang].joinServer + "**"
        });

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
            files: [new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "info/recery.png", {name: "recery.png"})],
            components: [row1, row2]
        });

        /// MENSAJE ENVIADO, AHORA MANEJAR INTERACCIONES

        const collector = sentMessage.createMessageComponentCollector({time:300000});
        const messageDeleteListener = (deletedMessage) => {
            if (deletedMessage.id === sentMessage.id)
                collector.stop();
        }
        client.on("messageDelete", messageDeleteListener);
        
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "Delete") {
                collector.stop();
                await interaction.deferUpdate();
                await interaction.message.delete();
                return;
            }
            else if (interaction.customId !== "Selection") return;

            const category = interaction.values[0] || "economy";
            const newEmbed = new Discord.EmbedBuilder()
                .setAuthor({name: "Recery Bot", iconURL: client.user.avatarURL()})
                .setColor("Blue")
                .setTitle(categoriesModule.categoriesEmojis[category] + " " + categoriesModule.categories[lang][category])
                .setFooter({text: "By: Recery", iconURL: "attachment://recery.png"});
            
            const commands = getCommandsByCategory(category, client);

            newEmbed.addFields({
                name: messages[lang].categoryTitle,
                value: "`" + commands.join("` ✦ `") + "`"
            });

            interaction.update({
                embeds: [newEmbed]
            });
        });

        collector.on("end", async () => {
            try {
                await sentMessage.edit({components: []});
            }
            catch (err) {
                console.log("Mensaje desconocido");
            }
            client.off("messageDelete", messageDeleteListener);
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
        description: "Elige una categoría de abajo para ver sus comandos.\n" +
        "Puedes elegir entre `{{commands}}` comandos en total.",
        importantTitle: ":warning: IMPORTANTE :warning:",
        helpWithCommand: "Usa `{{prefix}}help <nombre del comando>` para ver información de un comando específico.",
        changeLanguage: "¿Intentas cambiar mi idioma? Usa `{{prefix}}setlang`.",
        prefixHere: "Mi prefijo aquí es `{{prefix}}`. Puedes cambiarlo con `{{prefix}}setprefix`.",
        joinServer: "¡Unete a mi [servidor de soporte](https://discord.gg/8QFAAHVYGk)!",
        categoryTitle: ":white_medium_small_square: Comandos de esta categoría",
        selectionPlaceholder: "Elige una categoría",
    },
    en: {
        description: "Choose a category from below to see their commands.\n"+
        "You can choose between `{{commands}}` commands in total.",
        importantTitle: ":warning: IMPORTANT :warning:",
        helpWithCommand: "Use `{{prefix}}help <command name>` for information on a specific command.",
        changeLanguage: "Trying to change my language? Use `{{prefix}}setlang`.",
        prefixHere: "My prefix here is `{{prefix}}`. You can change it with `{{prefix}}setprefix`.",
        joinServer: "Join my [support server](https://discord.gg/8QFAAHVYGk)!",
        categoryTitle: ":white_medium_small_square: Commands of this category",
        selectionPlaceholder: "Choose a category",
    }
}


/// MENU DE AYUDA YA TERMINÓ
/// VIENE PARTE DE MOSTRAR INFORMACION DETALLADA DE UN COMANDO SI EL USUARIO INGRESÓ UN COMANDO COMO ARGUMENTO


function sendCommandDescription(client, msg, lang, serverPrefix, command, subcommand = false) {
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
            {name: "**" + cmdDescriptionMsgs[lang].subcommands + "**", value: subcommands}
        );
    }

    // PARTE DE SINTAXIS
    // No hay ninguna verificacion ya que esta parte debe ir SIEMPRE
    const field = {
        name: cmdDescriptionMsgs[lang].syntaxField,
        value: "`" + command.syntax[lang].replace("{{prefix}}", serverPrefix) + "`\n"
    };
    field.value += "__" + cmdDescriptionMsgs[lang].syntaxFieldReference + "__";
    embed.addFields(field);
    // --------

    if (command.examples) {
        let examples = "";
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
            {text: cmdDescriptionMsgs[lang].categoryField + categoriesModule.categories[lang][command.category], iconURL: client.user.avatarURL()}
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
        syntaxField: "**Sintaxis**",
        syntaxFieldReference: "<requerido> [opcional]",
        subcommands: "Subcomandos"
    },
    en: {
        commandTitle: "Command: ",
        noDescription: "It seems this command does not have a description...",
        categoryField: "Category: ",
        aliasField: "**Aliases**",
        examplesField: "**Use examples**",
        syntaxField: "**Syntax**",
        syntaxFieldReference: "<required> [optional]",
        subcommands: "Subcommands"
    }
}