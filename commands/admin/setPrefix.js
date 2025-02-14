const Prefix = require("../../prefix.js");

module.exports = {
    name: "setprefix",
    category: "administration",
    description: {
        es: "Cambia el prefijo usado para mis comandos en este servidor.",
        en: "Changes the prefix used for my commands in this server."
    },
    examples: ["{{prefix}}setprefix r!", "{{prefix}}setprefix -", "{{prefix}}setprefix abc"],
    execute(client, msg, args)
    {
        if (!msg.member.permissions.has("Administrator")) {
            msg.reply(messages[lang].noPermissions);
            return;
        }

        const serverID = msg.guildId;
        const lang = client.langs.get(serverID) || "es";

        if (!args.length > 0) {
            msg.reply(messages[lang].noPrefix.replace("{{prefix}}", Prefix.getPrefix(serverID)));
            return;
        }
        else if (args[0].length > 5) {
            msg.reply(messages[lang].longPrefix);
            return;
        }

        const newPrefix = args[0];

        Prefix.setPrefix(serverID, newPrefix);

        msg.reply(messages[lang].prefixUpdated.replace("{{prefix}}", newPrefix));
    }
}

const messages = {
    es: {
        noPermissions: "No tienes los permisos necesarios para cambiarme el prefijo en este servidor.",
        noPrefix: "Mi prefijo en este servidor es `{{prefix}}`.",
        longPrefix: "El prefijo no puede tener mas de 5 caracteres.",
        prefixUpdated: "El prefijo fue cambiado a `{{prefix}}` con éxito."
    },
    en: {
        noPermissions: "You don't have enough permissions to change my prefix in this server.",
        noPrefix: "My prefix in this server is `{{prefix}}`.",
        longPrefix: "Prefix cannot have more than 5 characters.",
        prefixUpdated: "Prefix was succesfully changed to `{{prefix}}`."
    }
}