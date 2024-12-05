require('dotenv').config()
const { Client, Events, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences
  ],
  http: {timeout:60000}
});

const command_files = require('fs').readdirSync("./commands").filter(file => file.endsWith(".js"));
client.commands = new Collection();
for (const file of command_files)
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


const available_interactions = require("./Scripts/available_interactions.js");
const Prefix = require("./prefix.js");

client.once(Events.ClientReady, (readyClient) => {
	console.log(`El bot inició correctamente como ${readyClient.user.tag}.`);
});

client.on(Events.MessageCreate, (msg) => {
	const prefix = Prefix.get_prefix(msg.guildId);
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(msg.content.indexOf(prefix) + 1).trim().split(' ');
	const command_name = args.shift().toLowerCase();

	if (msg.author.id !== "1069155273182285834") return;

	const command = client.commands.get(command_name);
	if (!command) return;

	try {
		command.execute(msg, args);
	}
	catch (error) {
		console.log(error);
	}

});

client.on(Events.InteractionCreate, async (interaction) => {
	for (const interaction_content of available_interactions)
	{
		if (interaction_content.check_activation(interaction.customId))
			interaction_content.execution(interaction);
	}
});

function get_help_message()
{
	let embed = new EmbedBuilder()
		.setColor("#65a7fc")
		.setTitle("Comandos de Recery Bot")
		.addFields(
			{name: "Acción", value: "Comandos para realizar acciones hacia otros miembros o hacia ti mismo."},
			{name: "Apoyo", value: "Comandos para apoyar a Recery, mi creador."},
			{name: "Ayuda", value: "Comandos que te ayudarán."},
			{name: "Diversion", value: "Comandos para divertirte."},
			{name: "Otros", value: "Comandos varios."}
		)

	const delete_button = new ButtonBuilder()
		.setCustomId("delete")
		.setLabel("Cancelar")
		.setStyle(ButtonStyle.Danger);

	const selection = new StringSelectMenuBuilder()
		.setCustomId("help_categories_sel")
		.setPlaceholder("Elige una categoría")
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel("Acción")
				.setDescription("Comandos para realizar acciones hacia otros miembros o hacia ti mismo.")
				.setValue("accion"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Apoyo")
				.setDescription("Comandos para apoyar a Recery, mi creador.")
				.setValue("apoyo"),
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
	
	const row1 = new ActionRowBuilder()
		.addComponents(selection);
	const row2 = new ActionRowBuilder()
		.addComponents(delete_button);

	let message = {
		embeds: [embed],
		components: [row1, row2]
	};
	return message;
}

client.login(process.env.TOKEN);
