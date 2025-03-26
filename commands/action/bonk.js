const DB = require("better-sqlite3");
const Discord = require("discord.js");

module.exports = {
    name: "bonk",
    category: "action",
    description: {
        es: "Bonkea a alguien.",
        en: "Bonks someone."
    },
    syntax: {
        es: "{{prefix}}bonk <mención>",
        en: "{{prefix}}bonk <mention>"
    },
    examples: ["{{prefix}}bonk @Recery", "{{prefix}}bonk @Recery Bot"],
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
            process.env.FILES_BASE_URL + "action/bonk1.gif",
            process.env.FILES_BASE_URL + "action/bonk2.gif"
        ];
        const link = gifLinks[Math.floor(Math.random() * gifLinks.length)];

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setImage("attachment://bonk.gif");

        if (targetId === msg.author.id) {
            embed.setDescription(messages[lang].selfBonk.replace("{{senderName}}", senderMember.displayName));
        }
        else {
            const db = new DB(process.env.DB_DIR + "action.db");

            const row = db.prepare("SELECT quantity FROM bonks WHERE userId = ?").get(targetId);
    
            let newQuantity = 1;
            if (row) newQuantity += row.quantity;
    
            db.prepare("INSERT OR REPLACE INTO bonks (userId, quantity) VALUES (?, ?)").run(targetId, newQuantity);
    
            db.close();

            embed.setDescription(
                messages[lang].bonk
                    .replace("{{senderName}}", senderMember.displayName)
                    .replaceAll("{{targetName}}", targetMember.displayName)
                    .replace("{{quantity}}", newQuantity.toString())
            );
        }

        msg.reply({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(link, {name: "bonk.gif"})]
        });
    }
}

const messages = {
    es: {
        notMention: "Tienes que mencionar a alguien para bonkear.",
        selfBonk: "**{{senderName}}** se bonkeó a si mismo...",
        bonk: "**{{senderName}}** bonkeó a **{{targetName}}**!\n" +
        "**{{targetName}}** fue bonkeado **{{quantity}}** veces."
    },
    en: {
        notMention: "You must mention someone to bonk.",
        selfBonk: "**{{senderName}}** bonked themself...",
        bonk: "**{{senderName}}** has bonked **{{targetName}}**!\n" +
        "**{{targetName}}** has been bonked **{{quantity}}** times."
    }
}