const Discord = require("discord.js");
const superAdmins = require("../../superAdmins.js");

module.exports = {
    name: "removesuperadmin",
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
                if (!client.superAdmins.has(userId)) {
                    msg.reply(messages[lang].notSuperAdmin.replace("{{name}}", user.username));
                } else {
                    superAdmins.removeSuperAdmin(client, userId);
                    msg.reply(messages[lang].removedSuperAdmin.replace("{{name}}", user.username));
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
        onlyRecery: "Solo Recery puede eliminar super administradores.",
        notMention: "Papá boludo, tenés que mencionar a alguien para eliminar como super administrador.",
        notSuperAdmin: "**{{name}}** no es un super administrador.",
        removedSuperAdmin: "Le sacaste a **{{name}}** el rol de super administrador."
    },
    en: {
        onlyRecery: "Only Recery can remove super administrators.",
        notMention: "Stupid dad, you must mention someone to remove as super administrator.",
        notSuperAdmin: "**{{name}}** is not a super administrator.",
        removedSuperAdmin: "You removed **{{name}}**'s super administrator role."
    }
}