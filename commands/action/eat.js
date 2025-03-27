const DB = require("better-sqlite3");
const Discord = require("discord.js");

module.exports = {
    name: "eat",
    alias: ["comer"],
    category: "action",
    description: {
        es: "Invitas a alguien a comer, y esa persona puede aceptar.",
        en: "You invite someone to eat, and that person can accept."
    },
    syntax: {
        es: "{{prefix}}eat <mención>",
        en: "{{prefix}}eat <mention>"
    },
    examples: ["{{prefix}}eat @Recery", "{{prefix}}eat @Recery Bot"],
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!args[0]) {
            msg.reply(messages[lang].notMention);
            return;
        }

        const targetId = args[0]
            .replace("<", "")
            .replace(">", "")
            .replace("@", "");
        
        let targetMember;
        let senderMember;
        try {
            targetMember = await msg.guild.members.fetch(targetId);
            senderMember = await msg.guild.members.fetch(msg.author.id);
        }
        catch (err) {
            msg.reply(messages[lang].notMention);
            return;
        }

        const gifLinks = [
            process.env.FILES_BASE_URL + "action/eatrequest1.gif",
            process.env.FILES_BASE_URL + "action/eatrequest2.gif"
        ];
        const link = gifLinks[Math.floor(Math.random() * gifLinks.length)];

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setImage("attachment://eatrequest.gif");
        
        const buttonsRow = new Discord.ActionRowBuilder();

        if (targetId === msg.author.id) {
            embed.setDescription(messages[lang].eatingAlone.replace("{{senderName}}", senderMember.displayName));
        }
        else {
            
            buttonsRow.addComponents(
                new Discord.ButtonBuilder()
                    .setStyle("Success")
                    .setCustomId("accept")
                    .setLabel(messages[lang].acceptLabel)
                    .setEmoji("🧀")
            );

            embed.setDescription(
                messages[lang].eatRequest
                    .replace("{{senderName}}", senderMember.displayName)
                    .replaceAll("{{targetName}}", targetMember.displayName)
            );
        }

        const sentMessage = await msg.reply({
            embeds: [embed],
            components: buttonsRow.components.length > 0 ? [buttonsRow] : [],
            files: [new Discord.AttachmentBuilder(link, {name: "eatrequest.gif"})]
        });

        const collector = sentMessage.createMessageComponentCollector({time: 300000});
        const messageDeleteListener = (deletedMessage) => {
            if (deletedMessage.id === sentMessage.id)
                collector.stop();
        }
        client.on("messageDelete", messageDeleteListener);

        collector.on("collect", (interaction) => {
            if (interaction.customId !== "accept") return;

            if (interaction.user.id !== targetId) {
                interaction.reply({
                    content: messages[lang].notYourInteraction. replace("{{targetName}}", targetMember.displayName),
                    ephemeral: true
                });
                return;
            }

            const [firstId, secondId] = [msg.author.id, targetId].sort();

            const db = new DB(process.env.DB_DIR + "action.db");

            const row = db.prepare("SELECT quantity FROM eat WHERE firstUserId = ? AND secondUserId = ?").get(firstId, secondId);

            let newQuantity = 1;
            if (row) newQuantity += row.quantity;

            db.prepare("INSERT OR REPLACE INTO eat (firstUserId, secondUserId, quantity) VALUES (?, ?, ?)").run(firstId, secondId, newQuantity);

            db.close();

            const gifLinks = [
                process.env.FILES_BASE_URL + "action/eataccept1.gif",
            ];
            const link = gifLinks[Math.floor(Math.random() * gifLinks.length)];

            embed.setDescription(
                messages[lang].eatAccept
                    .replace("{{senderName}}", senderMember.displayName)
                    .replace("{{targetName}}", targetMember.displayName)
                    .replace("{{quantity}}", newQuantity.toString())
            );
            embed.setImage("attachment://eataccept.gif");
            
            try {
                sentMessage.edit({
                    components: []
                });
            }
            catch (err) {
                console.log("Mensaje desconocido");
            }

            interaction.reply({
                embeds: [embed],
                files: [new Discord.AttachmentBuilder(link, {name: "eataccept.gif"})]
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

const messages = {
    es: {
        notMention: "Tienes que mencionar a alguien con quien comer.",
        eatingAlone: "**{{senderName}}** está comiendo sol@...",
        eatRequest: "¡**{{senderName}}** invitó a **{{targetName}}** a comer!\n" +
        "**{{targetName}}**, ¿Aceptas?",
        eatAccept: "¡**{{senderName}}** y **{{targetName}}** están comiendo!\n" +
        "Comieron juntos {{quantity}} veces.",
        acceptLabel: "Aceptar",
        notYourInteraction: "Solo **{{targetName}}** puede contestar a esta interacción."
    },
    en: {
        notMention: "You must mention someone to eat with.",
        eatingAlone: "**{{senderName}}** is eating alone...",
        eatRequest: "¡**{{senderName}}** has invited **{{targetName}}** to eat!\n" +
        "**{{targetName}}**, do you accept?",
        eatAccept: "**{{senderName}}** and **{{targetName}}** are eating!\n" +
        "They have eaten together {{quantity}} times.",
        acceptLabel: "Accept",
        notYourInteraction: "Only **{{targetName}}** can reply to this interaction."
    }
}