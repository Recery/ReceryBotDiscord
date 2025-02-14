const Discord = require("discord.js");

module.exports = {
    name: "fish",
    category: "fun",
    alias: ["pez"],
    description: {
        es: "¡Muestra imágenes y datos de un pez aleatorio!",
        en:  "Shows images and information about a random fish!"
    },
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        const fishKeys = Object.keys(fishes);
        let key = fishKeys[Math.floor(Math.random() * fishKeys.length)];
        let fish = fishes[key];

        let imageAttachment = new Discord.AttachmentBuilder(fish.image, {name: "fish.png"});

        let embed = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setTitle(fish.name)
            .setImage("attachment://" + imageAttachment.name);

        const descriptionButton = new Discord.ButtonBuilder()
            .setCustomId("showDescription")
            .setStyle("Primary")
            .setEmoji("<:GreatGuppy:1335051957123158078>")
            .setLabel(messages[lang].showDescription)
            
        const row1 = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("newFish")
                    .setStyle("Primary")
                    .setEmoji("<:GreatGuppy:1335051957123158078>")
                    .setLabel(messages[lang].newFish),
                descriptionButton
            );

        const sentMessage = await msg.reply({
            embeds: [embed],
            files: [imageAttachment],
            components: [row1]
        });

        /// MENSAJE ENVIADO, MANEJAR INTERACCIONES AHORA

        const collector = sentMessage.createMessageComponentCollector({time: 300000});

        collector.on("collect", (interaction) => {
            if (interaction.customId === "showDescription") {
                embed.setDescription(fish[lang]);
                
                descriptionButton.setDisabled(true);

                interaction.update({
                    embeds: [embed],
                    components: [row1]
                });

                return;
            }
            else if (interaction.customId !== "newFish") return;

            let newKey;
            do {
                newKey = fishKeys[Math.floor(Math.random() * fishKeys.length)];
            } while (newKey === key);

            key = newKey;
            fish = fishes[key];

            imageAttachment = new Discord.AttachmentBuilder(fish.image, {name: "fish.png"});

            embed = new Discord.EmbedBuilder()
                .setColor("Aqua")
                .setTitle(fish.name)
                .setImage("attachment://" + imageAttachment.name);

                descriptionButton.setDisabled(false);
            
            sentMessage.edit({
                embeds: [embed],
                files: [imageAttachment],
                components: [row1]
            });

            interaction.deferUpdate();
        });

        collector.on("end", () => {
            sentMessage.edit({
                components: []
            });
        });
    }
}

const fishes = {
    corydora: {
        name: "Corydora paleatus",
        image: "https://i.imgur.com/DjOfQIc.jpg",
        es: "La corydora paleatus es un pequeño pez sudamericano. Se la pasa la mayor parte del tiempo en el fondo del acuario. " +
        "Prefiere vivir en cardúmenes de su misma especie, así que es recomendable que haya al menos 6 de ellas en el acuario. " +
        "Es un pez muy pacífico. Si bien la temperatura óptima para ellas es de unos 24C°, se adaptan fácilmente a temperaturas más bajas.",
        en: "Paleatus cory catfish is a south american fish. Most of the time, they swim in the bottom of the tank. " +
        "They prefer living in schools of the same species, so a group of at least 6 of them is recommended in the tank. " +
        "They're a very peaceful fish. While the optimal temperature for them is 24C°, they can easily adapt to lower temperatures."
    },
    betta: {
        name: "Betta",
        image: "https://i.imgur.com/0EuMnHF.jpg",
        es: "El pez betta se caracteriza por la agresividad que hay entre los machos de la especie. No es recomendable tener más de dos machos en el mismo acuario. " +
        "Si bien entre hembras son menos agresivas, también puede haber conflictos entre ellas. Un solo ejemplar puede vivir en un acuario pequeño. " +
        "Poseen un nado lento por el gran tamaño de sus colas. Al ser microdepredadores, prefieren una dieta mayormente carnívora.",
        en: "The betta fish stands out for the aggressiveness between males of the sames species. It's not recommended having more than one male in the same tank. " +
        "While between females they're less aggressive, there can be fights between them too. A single specimen can live in an small tank. " +
        "They've a slow swim because of the huge size of their tails. Being micropredators, they prefer a mostly carnivorous diet."
    },
    goldfish: {
        name: "Goldfish",
        image: "https://i.imgur.com/WYjI3y4.jpg",
        es: "El pez Goldfish, ¡La especie de Recery! ¿Y quizás la mía? Si tan solo no fuera una máquina... " +
        "Son los peces más populares para tener en acuarios. Junto a los peces koi, son los únicos peces que realmente se les puede llamar de agua fría. " +
        "Que sean de agua fría no significa que solo puedan vivir en agua fría; este término es usado para referirse a que pueden vivir en un amplio rango de temperaturas. " +
        "No se deben tener en peceras en forma de bola, a diferencia de la creencia popular. El acuario debe tener, al menos, 40 litros por ejemplar. " +
        "Tener mucho cuidado al alimentarlos ya que estos peces son muy delicados de la vejiga natatoria.",
        en: "The Goldfish, Recery's species! And maybe mine? If only I weren't a machine... " +
        "They're the most popular fishes to have in aquariums. Along with koi fishes, they're the only fishes that they can really be called of cold water. " +
        "Being cold water fishes doesn't mean they can only live in cold water; this term is used to refer that they can live in a big range of temperatures. " +
        "They shouldn't live in ball shaped tanks, unlike popular belief says. The aquarium must have, at least, 40 liters per goldfish. " +
        "Be careful feeding them, as they're really weak of the swim bladder."
    }
};

const messages = {
    es: {
        newFish: "Mostrar otro pez",   
        showDescription: "Mostrar descripción"
    },
    en: {
        newFish: "Show another fish",
        showDescription: "Show description"
    }
};