const Discord = require("discord.js");
const { getPrefix } = require("../../prefix.js");

module.exports = {
    name: "guide",
    alias: ["tutorial", "guia"],
    description: {
        es: "Muestra la guía e historia del sistema de economía de Recery Bot.",
        en: "Show the guide and lore of the Recery Bot's economy system."
    },
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const prefix = getPrefix(msg.guildId);

        const embeds = {
            lore: new Discord.EmbedBuilder()
                .setTitle(":green_book: " + messages[lang].loreTitle)
                .setColor("Blue")
                .setDescription(messages[lang].lore.replace("{{user}}", msg.author.displayName)),
            basics: new Discord.EmbedBuilder()
                .setTitle(":notepad_spiral: " + messages[lang].basicsTitle)
                .setColor("Blue")
                .setDescription(messages[lang].basicsContent.replaceAll("{{prefix}}", prefix)),
            hatch: new Discord.EmbedBuilder()
                .setTitle(":egg: " + messages[lang].hatchTitle)
                .setColor("Blue")
                .setDescription(messages[lang].hatchContent.replaceAll("{{prefix}}", prefix)),
            apples: new Discord.EmbedBuilder()
                .setTitle("<:GreenApple:1296171434246410380> " + messages[lang].applesTitle)
                .setColor("Blue")
                .setDescription(messages[lang].applesContent.replaceAll("{{prefix}}", prefix)),
            corral: new Discord.EmbedBuilder()
                .setTitle(":tent: " + messages[lang].corralTitle)
                .setColor("Blue")
                .setDescription(messages[lang].corralContent.replaceAll("{{prefix}}", prefix)),
            barn: new Discord.EmbedBuilder()
                .setTitle(":hut: " + messages[lang].barnTitle)
                .setColor("Blue")
                .setDescription(messages[lang].barnContent.replaceAll("{{prefix}}", prefix))
        }

        const selection = new Discord.StringSelectMenuBuilder()
            .setCustomId("selection")
            .setPlaceholder(messages[lang].selectionPlaceholder)
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].loreTitle)
                    .setEmoji("📗")
                    .setValue("lore"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].basicsTitle)
                    .setEmoji("🗒️")
                    .setValue("basics"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].hatchTitle)
                    .setEmoji("🥚")
                    .setValue("hatch"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].applesTitle)
                    .setEmoji("<:GreenApple:1296171434246410380>")
                    .setValue("apples"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].corralTitle)
                    .setEmoji("⛺")
                    .setValue("corral"),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(messages[lang].barnTitle)
                    .setEmoji("🛖")
                    .setValue("barn")
            )
        
        const selectionRow = new Discord.ActionRowBuilder()
            .addComponents(
                selection
            );

        const sentMessage = await msg.reply({
            embeds: [embeds.lore],
            components: [selectionRow]
        });

        const collector = sentMessage.createMessageComponentCollector({time:300000});

        collector.on("collect", (interaction) => {
            if (interaction.customId !== "selection") return;

            interaction.update({
                embeds: [embeds[interaction.values[0]]]
            });

            collector.resetTimer();
        });

        collector.on("end", () => {
            sentMessage.edit({
                components: []
            });
        });
    }
}

const messages = {
    es: {
        selectionPlaceholder: "Selecciona una opción...",
        loreTitle: "Historia",
        lore: "El mundo de Slime Shoot está protegido por la deidad goldfish conocida como Recery. " +
        "Esta criatura celestial está compuesta por un 25% slime y 75% goldfish. Algunos slimes alaban a este ángel guardian, y otros simplemente no creen en su existencia.\n\n" +
        "Sin embargo, parece que actualmente Recery está en otros asuntos, y dejó el mundo de Slime Shoot descuidado... " +
        "Yo, Recery Bot, la máxima creación de Recery, fui diseñado para sustituir a mi amo en su ausencia. " +
        "Mi objetivo es simple y claro: Proteger a los slimes y aumentar su población, hasta que establezcan una forma de gobierno y poder dejarlos a su suerte.\n\n" +
        "**¿Cuento contigo para esta misión, `{{user}}`?**",
        basicsTitle: "Lo básico",
        basicsContent: "En este sistema de economía, tu objetivo es coleccionar todos los slimes disponibles. En resumen, es un sistema gacha de slimes.\n\nEs recomendado leer la descripción de cada comando con `{{prefix}}help <comando>` ante cualquier duda o para conocer información valiosa de su uso.",
        hatchTitle: "¿Cómo consigo nuevos slimes?",
        hatchContent: "Una de las cosas más importantes acá es conseguir slimes. Para ello, puedes obtenerlos al eclosionarlos con el comando `{{prefix}}hatchslimes`. " +
        "Cada slime eclosionado tiene un costo de 10 manzanas verdes. El slime que te saldrá al usar el comando es aleatorio.",
        applesTitle: "Obtener manzanas",
        applesContent: "Las manzanas verdes son la moneda del mundo de Slime Shoot. Son necesarias para eclosionar slimes y otras mejoras.\n\n" +
        "La forma más fácil de obtenerlas es mediante el comando `{{prefix}}hourly`. " + 
        "Sin embargo, también se pueden conseguir con el corral, y la forma principal y más eficiente de conseguirlas es produciéndolas en el granero. " +
        "Más adelante se explicará en profundidad el funcionamiento del corral y del granero.",
        corralTitle: "El corral",
        corralContent: "Cuando eclosiones slimes, estos se enviarán al corral. Pero cuidado, el corral no es permanente; cada una hora, el corral se reiniciará, esto significa que todos los slimes del corral desaparecerán al cumplirse el ciclo. " +
        "Sin embargo, por cada slime que desaparezca, obtendrás una compensación de manzanas verdes, dependiendo del valor de generación de manzanas verdes por hora que tenga el slime. " +
        "En general, saldrás perdiendo en manzanas verdes cuando el slime desaparezca.\n\nPuedes ver los slimes del corral (y otros datos) con `{{prefix}}corral`. " +
        "El corral tiene espacio infinito para alojar slimes, no te preocupes por eso. " +
        "Si quieres conservar alguno de tus slimes, debes enviarlo al granero; los slimes que permanezcan allí son permanentes (hasta que decidas quitarlos de ahí). Puedes leer más información del granero en esta misma guía.",
        barnTitle: "El granero",
        barnContent: "El granero de slimes es tu principal fuente de manzanas verdes, y a quien debes acudir si quieres conservar alguno de tus slimes. " +
        "El comando principal del granero es `{{prefix}}barn`; puedes ingresar varios subcomandos para interactuar con el granero, pero si no ingresas ningún subcomando, te mostrará información del granero.\n\n" +
        "En resumen, puedes guardar una cantidad limitada de slimes en el granero, y por cada slime que haya dentro, obtendrás una cantidad de manzanas verdes por hora. " +
        "Puedes ver la cantidad de manzanas verdes que genera un slime (y otros datos del mismo) con `{{prefix}}slimeinfo <nombre o id del slime>`.\n\n" +
        "Como dijimos, el granero tiene espacio limitado para alojar slimes. Puedes mejorar ese espacio con `{{prefix}}barn upgradeslimes` si pagas algunas manzanas verdes. " +
        "Puedes añadir slimes al granero con `{{prefix}}barn add <nombre o id del slime> [cantidad]`, o puedes quitarlos del granero con `{{prefix}}barn remove <nombre o id del slime> [cantidad]`. " +
        "Debes tener el slime en el corral para poder añadirlo al granero. Cuando quitas un slime del granero, este volverá al corral, y desaparecerá cuando se reinicie; tienes algo de tiempo para devolver el slime al granero hasta que se complete el ciclo, si así lo deseas.\n\n" +
        "Pero también hay otra limitación con el granero: El espacio para guardar manzanas verdes generadas por los slimes es limitado. Debes recolectarlas con `{{prefix}}barn collect` para poder usarlas, y de este modo liberar espacio de manzanas del granero y seguir generando más. " +
        "Puedes mejorar la cantidad de manzanas verdes que puede alojar el granero con el comando `{{prefix}}barn upgradeapples`, si pagas manzanas verdes por ello."
    },
    en: {
        selectionPlaceholder: "Select an option...",
        loreTitle: "Lore",
        lore: "The Slime Shoot world is protected by a creature known by Recery. " +
        "This celestial creature is composed of 25% slime and 75% goldfish. Some slimes praise this guardian angel, and other slimes just don't believe in its existence.\n" +
        "However, it seems that Recery is busy with some other stuff now, and left the Slime Shoot world neglected... " +
        "I, Recery Bot, the Recery's maximum creation, was designed to replace my master in its absence. " +
        "My goal is simple and clear: Protect slimes and increase their population, until they establish a form of goverment and can be left to their fate.\n" +
        "**¿Can I count with you for this mission, `{{user}}`?**",
        basicsTitle: "The basics",
        basicsContent: "In this economy system, your objective is to collect all available slimes. To summarize it, it's a slime gacha system.\n\n It's recommended to read each command description with `{{prefix}}help <command>` for valuable information of its use.",
        hatchTitle: "How do I get new slimes?",
        hatchContent: "One of the most important things here is getting slimes. You can hatch them with the `{{prefix}}hatchslimes` command. " +
        "Each hatched slime has a cost of 10 green apples. The slime you'll get is random.",
        applesTitle: "Getting apples",
        applesContent: "Green apples are the Slime Shoot world's currency. They're necessary to hatch slimes and other upgrades.\n\n" +
        "Easiest way to get them is by using the `{{prefix}}hourly` command. " +
        "However, you can also get them in the corral, and the best and most eficient way to get them is producing them in the barn. " +
        "Later, we will explain, in this guide, how the corral and barn works.",
        corralTitle: "The corral",
        corralContent: "When you hatch slime, these will be send to the corral. But be careful, the corral is not permanent; each hour, the corral will be reseted, this means that all slimes from the corral will disappear when the cycle is completed. " +
        "However, for each slime that disappears, you'll get a green apple compensation depending on the generation value of the slime. " +
        "Usually, you'll lose apples when the slime disappears.\n\nYou can see the slimes of the corral (and other information) with `{{prefix}}corral`. " +
        "The corral has infinite size to store slimes, don't worry about that. " +
        "If you want to keep some of your slimes, you must send them to the barn; slimes are permanent there (until you decide to remove them from there). More information about the barn in this guide.",
        barnTitle: "The barn",
        barnContent: "Slime barn is your main green apples source, and where you must store your slimes if you want to keep them. " +
        "Barn's main command is `{{prefix}}barn`; you can enter a handful of subcommands to interact with the barn, but if you don't enter any subcommand, information about the barn will be shown.\n\n" +
        "To summarize it, you can store a limited quantity of slimes in the barn, and for each slime inside, you'll get some green apples per hour. " +
        "You can see the quantity of green apples that an slime generates per hour (and other information of the slime) with `{{prefix}}slimeinfo <name or id of the slime>`.\n\n" +
        "As we said, the barn has a limited size to store slimes. You can upgrade this size with `{{prefix}}barn upgradeslimes` if you pay some green apples. " +
        "You can add slimes to the barn with `{{prefix}}barn add <name or id of the slime> [quantity]`, or you can remove them from the barn with `{{prefix}}barn remove <name or id of the slime> [quantity]` " +
        "You must have the slime in the corral in order to add it to the barn. When you remove a slime from the barn, it will return to the corral, and it will disappear when the corral resets; you have some time to return the slime to barn before the cycle completes, if you want to.\n\n" +
        "But there's another limitation with the barn: The size to store green apples generated by slimes is limited. You must collect them with `{{prefix}}barn collect` in order to use them, and free green apple space from the barn and continue generating them this way. " +
        "You can upgrade the quantity of green apples to store in your barn with the `{{prefix}}barn upgradeapples` command, if you pay green apples for it."
    }
}