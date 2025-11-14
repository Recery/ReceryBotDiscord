const Discord = require("discord.js");
const Canvas = require("canvas");
const slimesModule = require("../../economy/slimesModule.js");
const bannersModule = require("../../economy/bannersModule.js");
const timeModule = require("../../economy/timeModule.js");

module.exports = {
    name: "setbanner",
    category: "economy",
    alias: ["banner", "changebanner"],
    description: {
        es: "",
        en: ""
    },
    syntax: {
        es: "{{prefix}}setbanner <nombre del banner>",
        en: "{{prefix}}setbanner <banner's name>"
    },
    examples: ["{{prefix}}setbanner regular", "{{prefix}}banner vocaloid"],
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userId = msg.author.id;

        let validBanner = false;
        if (args[0])
            validBanner = bannersModule.setPlayerBanner(userId, args[0]);

        if (validBanner) {
            msg.reply(messages[lang].validBanner.replace("{{bannerName}}", args[0]));
            return;
        }

        // llegado este punto, significa que el usuario no ingreso ningun banner valido
        // hay que mostrar los banners disponibles

        let page = 0;
        const banners = await bannersModule.getBanners();

        const images = []; // guardar las imagenes de cada banner
        for (const banner of banners) {
            const image = await banner.imageBuffer;
            images.push(new Discord.AttachmentBuilder(image, {name: banner.name + ".png"}));
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(messages[lang].bannersListTitle)
            .setImage(`attachment://${images[page].name}`)
            .setColor("Random");
        
        const leftButton = new Discord.ButtonBuilder()
            .setCustomId("slideLeft")
            .setEmoji("<:LeftArrow:1334663458687287296>")
            .setStyle("Primary")
            .setDisabled(true);
        const selectBanner = new Discord.ButtonBuilder()
            .setCustomId("selectBanner")
            .setLabel(messages[lang].chooseBanner.replace("{{bannerName}}", banners[page].name))
            .setStyle("Success")
            .setDisabled(bannersModule.getPlayerBanner(userId).name === banners[page].name);
        const rightButton = new Discord.ButtonBuilder()
            .setCustomId("slideRight")
            .setEmoji("<:RightArrow:1334663426043154472>")
            .setStyle("Primary")
            .setDisabled(page >= images.length - 1);
        
        const buttonsRow = new Discord.ActionRowBuilder()
            .addComponents(
                leftButton,
                selectBanner,
                rightButton
            );

        const sentMessage = await msg.reply({
            embeds: [embed],
            files: [images[page]],
            components: [buttonsRow]
        });
    
        const collector = sentMessage.createMessageComponentCollector({time: 120000});
        const messageDeleteListener = (deletedMessage) => {
            if (deletedMessage.id === sentMessage.id)
                collector.stop();
        }
        client.on("messageDelete", messageDeleteListener);

        collector.on("collect", (interaction) => {
            if (interaction.customId === "slideLeft") page -= 1;
            else if (interaction.customId === "slideRight") page += 1;
            else if (interaction.customId === "selectBanner") {
                bannersModule.setPlayerBanner(userId, banners[page].name);
                interaction.reply({
                    content: messages[lang].validBanner.replace("{{bannerName}}", banners[page].name),
                    ephemeral: true
                });
                collector.stop();
                return;
            }

            leftButton.setDisabled(page <= 0);
            selectBanner.setLabel(messages[lang].chooseBanner.replace("{{bannerName}}", banners[page].name));
            selectBanner.setDisabled(bannersModule.getPlayerBanner(userId).name === banners[page].name);
            rightButton.setDisabled(page >= images.length - 1);

            embed.setImage(`attachment://${images[page].name}`);
            if (banners[page].name !== "Regular") {
                const timeLeft = timeModule.getTimeMinimumExpressedUnit(banners[page].endDate - Date.now());
                embed.setFooter({ text: `${timeLeft.time.toString()} ${timeModule.units[lang][timeLeft.unit]}` });
            } else {
                embed.setFooter(null);
            }

            interaction.update({
                embeds: [embed],
                files: [images[page]],
                components: [buttonsRow]
            });
        });

        collector.on("end", async () => {
            try {
                await sentMessage.edit({ components: [] });
            } catch (err) {
                console.log("Mensaje desconocido");
            }
            client.off("messageDelete", messageDeleteListener);
        });
    }
}

const messages = {
    es: {
        validBanner: "Haz seleccionado el banner `{{bannerName}}` exitosamente.",
        chooseBanner: "Seleccionar banner: {{bannerName}}",
        bannersListTitle: "Banners disponibles"
    },
    en: {
        validBanner: "Banner `{{bannerName}}` chosen successfully.",
        chooseBanner: "Select banner: {{bannerName}}",
        bannersListTitle: "Available banners"
    }
}