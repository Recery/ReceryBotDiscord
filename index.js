const { Client, Events, GatewayIntentBits, Message, EmbedBuilder, ButtonBuilder } = require("discord.js");

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
	
	let button = new ButtonBuilder()
		.setLabel("Seleccionar categoría");

	let message = {
		embeds: [embed],
		components: [button]
	};
	return message;
}

client.login(process.env.TOKEN);
