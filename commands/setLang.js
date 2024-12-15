const Langs = require("./../langsLoader.js");

module.exports = {
    name: "setlang",
    category: "Administración",
    execute(client, msg, args)
    {
        if (!args.length > 0) 
        {
            msg.reply("Debes ingresar un idioma válido.");
            return;
        }
        else if (args[0] !== "es" && args[0] !== "en")
        {
            msg.reply("Debes ingresar un idioma válido.");
            return;
        }

        const serverid = msg.guildId;
        const new_lang = args[0];

        Langs.set_lang(client, serverid, new_lang);

        msg.reply("El idioma fue cambiado a `" + new_lang + "` con éxito.");
    }
}