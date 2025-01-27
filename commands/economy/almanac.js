

module.exports = {
    name: "almanac",
    category: "economy",
    description: {
        es: "Muestra el almanaque de slimes.\n" +
        "Se pueden ver la cantidad de slimes conseguidos de cada tipo.\n" +
        "También muestra los slimes aún no desbloqueados.",
        en: "Shows the slime almanac.\n" +
        "You can see the quantity of slimes obtained from each type.\n" + 
        "Also shows the locked slimes."
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        
    }
}