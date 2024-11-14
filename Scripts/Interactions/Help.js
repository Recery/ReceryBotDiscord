const InteractionContent = require("./interaction_content_cls.js")
const { EmbedBuilder } = require("discord.js")

const available_commands = require("../available_commands.js")

class Help extends InteractionContent {

    async execution(interaction)
    {
        let embed_respuesta = new EmbedBuilder().setColor("#65a7fc");

		let comandos = "";
		for (const command of available_commands)
		{
			if (command.category !== interaction.values[0]) continue;

			comandos += command.get_activator() + "\n";
		}

        let categoria_str = ""
		switch (interaction.values[0])
		{
			case "apoyo": 
                categoria_str = "Apoyo";
				break;
			case "ayuda":
                categoria_str = "Ayuda";
				break;
			case "accion":
                categoria_str = "Acción";
				break;
			case "diversion":
                categoria_str = "Diversión";
				break;
			case "economia":
                categoria_str = "Economía";
				break;

			case "otros":
                categoria_str = "Otros";
				break;
		}

        embed_respuesta
            .setTitle("Categoria: " + categoria_str)
            .addFields({name: "Estos son los comandos de esta categoría:", value: comandos});

		await interaction.update({embeds:[embed_respuesta]});
    }
}

module.exports = new Help("categories")