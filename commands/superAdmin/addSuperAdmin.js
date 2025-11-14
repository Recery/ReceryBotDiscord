const Discord = require("discord.js");
const superAdmins = require("../../superAdmins.js");

module.exports = {
    name: "addsuperadmin",
    category: "superAdmin",
    description: {
        es: "",
        en: ""
    },
    syntax: {
        es: "",
        en: ""
    },
    examples: [],
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (msg.author.id !== "1069155273182285834") {
            if (!client.superAdmins.has(msg.author.id)) {
                msg.reply(messages[lang].onlyRecery);
                return;
            } else return;
        }

        // Solo yo puedo acceder acá 😎😎

        if (!args[0]) {
            msg.reply(messages[lang].notMention);
            return;
        }

        try {
            const userId = args[0]
                .replace("<", "")
                .replace(">", "")
                .replace("@", "");

            const user = await client.users.fetch(userId);
            if (user) {
                if (client.superAdmins.has(userId)) {
                    msg.reply(messages[lang].alreadySuperAdmin.replace("{{name}}", user.username));
                } else {
                    superAdmins.addSuperAdmin(client, userId);
                    msg.reply(messages[lang].newSuperAdmin.replace("{{name}}", user.username));
                }
            } else {
                msg.reply(messages[lang].notMention);
                return;
            }
        } catch {
            msg.reply(messages[lang].notMention);
            return;
        }
    }
}

const messages = {
    es: {
        onlyRecery: "Solo Recery puede añadir super administradores.",
        notMention: "Papá boludo, tenés que mencionar a alguien para hacer super administrador.",
        alreadySuperAdmin: "**{{name}}** ya es un super administrador.",
        newSuperAdmin: "Hiciste a **{{name}}** un super administrador."
    },
    en: {
        onlyRecery: "Only Recery can add super administrators.",
        notMention: "Stupid dad, you must mention someone to add as super administrator.",
        alreadySuperAdmin: "**{{name}}** is already a super administrator.",
        newSuperAdmin: "You made **{{name}}** a super administrator."
    }
}