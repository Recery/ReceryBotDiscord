const { Client, Events, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ],
});

const available_commands = require("./Scripts/available_commands.js")

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (msg) => {
  if (msg.content === "!receryhelp")
  {
    var message = "Comandos de Recery Bot: \n"
    message += "!receryhelp, ";
    for (const command of available_commands)
    {
      message += command.get_activator() + ", ";
    }
    message = message.slice(0, -2);
    msg.reply(get_help_message());
  }
  else
  {
    for (const command of available_commands)
    {
      command.check_activation(msg)
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === "categories") 
	{
		let embed_respuesta = new EmbedBuilder().setColor("#65a7fc");

		let comandos = "";
		for (const command of available_commands)
		{
			comandos += command.get_activator() + "\n";
		}

		switch (interaction.values[0])
		{
			case "ayuda":
				embed_respuesta
					.setTitle("Categoria: Ayuda")
					.addFields(
						{name: "Estos son los comandos de esta categoría:", value: comandos}
					);
				break;
			
			case "diversion":
				embed_respuesta
					.setTitle("Categoria: Diversión")
					.addFields(
						{name: "Estos son los comandos de esta categoría:", value: comandos}
					);
				break;
			
			case "otros":
				embed_respuesta
					.setTitle("Categoria: Otros")
					.addFields(
						{name: "Estos son los comandos de esta categoría:", value: comandos}
					)
				break;
		}

		await interaction.update({embeds:[embed_respuesta]});
	}
});

function get_help_message()
{
	let embed = new EmbedBuilder()
		.setColor("#65a7fc")
		.setTitle("Comandos de Recery Bot")
		.addFields(
			{name: "Ayuda", value: "Hola"},
			{name: "Diversion", value: "Hola"},
			{name: "Otros", value: "Hola"}
		)

	const selection = new StringSelectMenuBuilder()
		.setCustomId("categories")
		.setPlaceholder("Elige una categoría")
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel("Ayuda")
				.setDescription("Comandos que te ayudarán.")
				.setValue("ayuda"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Diversión")
				.setDescription("Comandos para divertirte.")
				.setValue("diversion"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Otros")
				.setDescription("Comandos varios.")
				.setValue("otros"),
		);
	
	const row = new ActionRowBuilder()
		.addComponents(selection);

	let message = {
		embeds: [embed],
		components: [row]
	};
	return message;
}

client.login(process.env.TOKEN);
