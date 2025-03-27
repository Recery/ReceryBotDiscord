const DB = require("better-sqlite3");
const Discord = require("discord.js");


module.exports = {
    name: "fishmutation",
    category: "action",
    alias: ["fishmut", "pezmutar"],
    examples: ["{{prefix}}fishmutation @Taveko", "{{prefix}}fishmut @Recery"],
    description: {
        es: "Transforma a alguien en un pez.",
        en: "Turns someone into a fish."
    },
    syntax: {
        es: "{{prefix}}fishmutation <mención>",
        en: "{{prefix}}fishmutation <mention>"
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
            process.env.FILES_BASE_URL + "action/fishmutation1.gif",
            process.env.FILES_BASE_URL + "action/fishmutation2.gif",
            process.env.FILES_BASE_URL + "action/fishmutation3.gif",
            process.env.FILES_BASE_URL + "action/fishmutation4.gif"
        ];
        const link = gifLinks[Math.floor(Math.random() * gifLinks.length)];

        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setImage("attachment://fishmutation.gif");

        if (targetId === msg.author.id) {
            embed.setDescription(messages[lang].selfFish.replace("{{senderName}}", senderMember.displayName));
        }
        else {
            const db = new DB(process.env.DB_DIR + "action.db");

            const row = db.prepare("SELECT quantity FROM fishmutations WHERE userId = ?").get(targetId);

            let newQuantity = 1;
            if (row) newQuantity += row.quantity;

            db.prepare("INSERT OR REPLACE INTO fishmutations (userId, quantity) VALUES (?, ?)").run(targetId, newQuantity);

            db.close();

            embed.setDescription(
                messages[lang].fishTurned
                    .replace("{{senderName}}", senderMember.displayName)
                    .replaceAll("{{targetName}}", targetMember.displayName)
                    .replace("{{quantity}}", newQuantity.toString())
            );
        }
        
        msg.reply({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(link, {name: "fishmutation.gif"})]
        });
    }
}

const messages = {
    es: {
        notMention: "Debes mencionar a alguien a quien convertir en pez.",
        selfFish: "**{{senderName}}** se convirtió a si mismo en un pez.\n" +
        "No te juzgo, yo también quisiera ser uno.",
        fishTurned: "¡**{{senderName}}** convirtió a **{{targetName}}** en un pez!\n" +
        "**{{targetName}}** fue convertido a un pez **{{quantity}}** veces."
    },
    en: {
        notMention: "You must mention someone to turn into a fish.",
        selfFish: "**{{senderName}}** has turned themself into a fish.\n" +
        "I don't judge you, I would like to be one too.",
        fishTurned: "**{{senderName}}** has turned **{{targetName}}** into a fish!\n" +
        "**{{targetName}}** has been turned into a fish **{{quantity}}** times."
    }
}