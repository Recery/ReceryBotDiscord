const Langs = require("./../langsLoader.js");

module.exports = {
    name: "setlang",
    category: "Administración",
    execute(client, msg, args)
    {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!args.length > 0) 
        {
            msg.reply(messages[lang].invalid_lang);
            return;
        }
        else if (args[0] !== "es" && args[0] !== "en")
        {
            msg.reply(messages[lang].invalid_lang);
            return;
        }

        const serverid = msg.guildId;
        const new_lang = args[0];

        Langs.set_lang(client, serverid, new_lang);

        msg.reply(messages[new_lang].success.replace("{{lang}}", new_lang));
    }
}

const messages = {
    es: {
        invalid_lang: "Debes ingresar un idioma válido.",
        success: "El idioma fue cambiado a `{{lang}}` con éxito."
    },
    en: {
        invalid_lang: "You must enter a valid language.",
        success: "Language has been changed to `{{lang}}` succesfully."
    }
}