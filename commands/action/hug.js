const DB = require("better-sqlite3");
const Discord = require("discord.js");

module.exports = {
    name: "hug",
    category: "action",
    description: {
        es: "Abraza a alguien.",
        en: "Hugs someone."
    },
    syntax: {
        es: "{{prefix}}hug <mención>",
        en: "{{prefix}}hug <mention>"
    },
    examples: ["{{prefix}}hug @Recery", "{{prefix}}hug @Recery Bot"],
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!args.length > 0) {
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
            process.env.FILES_BASE_URL + "action/hug1.gif",
            process.env.FILES_BASE_URL + "action/hug2.gif",
            process.env.FILES_BASE_URL + "action/hug3.gif"
        ];
        const link = gifLinks[Math.floor(Math.random() * gifLinks.length)];

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setImage("attachment://hug.gif");
        
        if (targetId === msg.author.id) {
            embed.setDescription(messages[lang].selfHug.replace("{{senderName}}", senderMember.displayName));
        }
        else {
            const db = new DB(process.env.DB_DIR + "action.db");

            const row = db.prepare("SELECT quantity FROM hugs WHERE userId = ?").get(targetId);

            let newQuantity = 1;
            if (row) newQuantity += row.quantity;

            db.prepare("INSERT OR REPLACE INTO hugs (userId, quantity) VALUES (?, ?)").run(targetId, newQuantity);

            db.close();

            embed.setDescription(messages[lang].hug
                .replace("{{senderName}}", senderMember.displayName)
                .replaceAll("{{targetName}}", targetMember.displayName)
                .replace("{{quantity}}", newQuantity.toString())
            );
        }

        msg.reply({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(link, {name: "hug.gif"})]
        });
    }
}

const messages = {
    es: {
        notMention: "Tienes que mencionar a alguien para abrazar.",
        selfHug: "**{{senderName}}** se abrazó a si mismo...",
        hug: "**{{senderName}}** abrazó a **{{targetName}}**!\n" +
        "**{{targetName}}** fue abrazado **{{quantity}}** veces."
    },
    en: {
        notMention: "You must mention someone to hug.",
        selfHug: "**{{senderName}}** hugged themself...",
        hug: "**{{senderName}}** hugged **{{targetName}}**!\n" +
        "**{{targetName}}** has been hugged **{{quantity}}** times."

    }
}