module.exports = {
    name: "abrazar",
    execute(client, msg, args)
    {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!args.length > 0)
        {
            msg.reply(messages[lang].self_hug.replace("{{userid}}", msg.author.id));
            return;
        }

        const hug_target = args.join(" ");

        msg.reply(messages[lang].hug.replace("{{userid}}", msg.author.id).replace("{{target}}", hug_target));
    }
}

const messages = {
    es: {
        self_hug: "<@{{userid}}> se abrazó a si mismo...",
        hug: "<@{{userid}}> abrazó a {{target}}!"
    },
    en: {
        self_hug: "<@{{userid}}> hugged themself...",
        hug: "<@{{userid}}> hugged {{target}}!"
    }
}