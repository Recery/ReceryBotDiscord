const DB = require("better-sqlite3");
const Discord = require("discord.js");

module.exports = {
    name: "hydrate",
    category: "action",
    alias: ["hidratar"],
    description: {
        es: "",
        en: ""
    },
    examples: ["{{prefix}}hydrate @Gacahi", "{{prefix}}hydrate @Taveko"],
    syntax: {
        es: "{{prefix}}hydrate <mención>",
        en: "{{prefix}}hydrate <mention>"
    },
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
            process.env.FILES_BASE_URL + "action/hydrate1.gif",
            process.env.FILES_BASE_URL + "action/hydrate2.gif"
        ];
        const link = gifLinks[Math.floor(Math.random() * gifLinks.length)];

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setImage("attachment://hydrate.gif");
        
        if (targetId === msg.author.id) {
            embed.setDescription(messages[lang].selfHydrate.replace("{{senderName}}", senderMember.displayName));
        }
        else {
            const db = new DB(process.env.DB_DIR + "action.db");

            const row = db.prepare("SELECT quantity FROM hydrate WHERE userId = ?").get(targetId);

            let newQuantity = 1;
            if (row) newQuantity += row.quantity;

            db.prepare("INSERT OR REPLACE INTO hydrate (userId, quantity) VALUES (?, ?)").run(targetId, newQuantity);

            db.close();

            embed.setDescription(
                messages[lang].hydrated
                    .replace("{{senderName}}", senderMember.displayName)
                    .replaceAll("{{targetName}}", targetMember.displayName)
                    .replace("{{quantity}}", newQuantity.toString())
            );
        }

        msg.reply({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(link, {name: "hydrate.gif"})]
        });
    }
}

const messages = {
    es: {
        notMention: "Debes mencionar a alguien para ofrecerle agua.",
        selfHydrate: "**{{senderName}}** se sirvió un vaso y tomó agua.",
        hydrated: "¡**{{targetName}}** tomó un vaso de agua que **{{senderName}}** le dio!\n" +
        "**{{targetName}}** se ha hidratado **{{quantity}}** veces."
    },
    en: {
        notMention: "You must mention someone to offer water.",
        selfHydrate: "**{{senderName}}** poured themself a glass and drank water.",
        hydrated: "**{{targetName}}** drank a glass of water that **{{senderName}}** gave them!\n" +
        "**{{targetName}}** has hydrated themself **{{quantity}}** times."
    }
}