const { EmbedBuilder } = require("discord.js")
const InteractionContent = require("./interaction_content_cls.js")

class Delete extends InteractionContent {

    async execution(interaction)
    {
        return
        let embed_respuesta = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Feliz navidad Zahira")
            .setDescription("Te hice un dibujo, espero que te guste")
            .setImage("attachment://DibujoDeZahira.png");

        
        interaction.update({
            embeds:[embed_respuesta],
            files: [{ attachment: a, name: path.basename(pez.image) }]
        })
        
        
    }
}

module.exports = new Delete("abrirregalo")