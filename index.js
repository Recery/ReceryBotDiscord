require('dotenv').config()
const { Client, Events, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ],
});

const Canvas = require("canvas")

const available_commands = require("./Scripts/available_commands.js")
const available_interactions = require("./Scripts/available_interactions.js")

client.once(Events.ClientReady, (readyClient) => {
	for (const command of available_commands)
		command.set_client(client);

	console.log(`El bot inició correctamente como ${readyClient.user.tag}.`);
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
	for (const interaction_content of available_interactions)
	{
		if (interaction_content.check_activation(interaction.customId))
			interaction_content.execution(interaction);
	}
});

client.on("guildMemberAdd", async (member) => {
	const canvas = Canvas.createCanvas(800,240);
	const ctx = canvas.getContext("2d");

	const background = await Canvas.loadImage("https://i.imgur.com/R5z3Xn9.jpeg")
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

	const img = await Canvas.loadImage(
		member.displayAvatarURL({extension: "png", size: 128})
	);
	ctx.drawImage(img, 40, 40, 160, 160);

	ctx.font = '50px "Arial"'
	ctx.fillStyle = "#ffffff"
	ctx.fillText("¡Bienvenido al server!", 260, 90)

	ctx.font = '60px "Arial"'
	ctx.fillStyle = "#ff7700"
	ctx.fillText(`${member.user.username}`, 300, 170)

	const attachment = new AttachmentBuilder(canvas.toBuffer(), "avatar.png")

	client.channels.cache.get("1311085473657127016").send({files:[attachment]})
})

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
			{name: "Economía", value: "Comandos de la economía de Recery Bot."},
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
				.setLabel("Economía")
				.setDescription("Comandos de la economía de Recery Bot.")
				.setValue("economia"),
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
