

module.exports = {
    name: "ping",
    alias: ["latencia"],
    category: "info",
    description: {
        es: "Muestra mi ping/latencia.\n" +
        "Si tengo mucho ping, es culpa del wifi de mi creador.\n" +
        "Dónenle en Ko-fi así se compra mejor wifi.",
        en: "Shows my ping.\n" +
        "If I have too much ping, it's my creator's wifi fault.\n" +
        "Donate him some money in Ko-fi, so he buys a better wifi."
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        msg.reply(messages[lang].replace("{{ping}}", client.ws.ping));
    }
}

const messages = {
    es: "Mi ping es de {{ping}}ms.",
    en: "My ping is of {{ping}}ms."
}