const path = require("path");
const { EmbedBuilder } = require("discord.js");
const InteractionContent = require("./interaction_content_cls.js");

class AbrirRegalo extends InteractionContent {

    async execution(interaction)
    {
        let embed_respuesta = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Feliz navidad Zahira")
            .setDescription("Te hice un dibujo, espero que te guste")
            .setImage("attachment://DibujoZahira.png");
        
        const dibujo_path = path.join(__dirname, "../../Images/Dibujo.png");
        
        interaction.update({
            embeds:[embed_respuesta],
            files: [{ attachment: dibujo_path, name: "DibujoZahira.png" }],
            components: []
        });
    }
}

module.exports = new AbrirRegalo("abrirregalo")