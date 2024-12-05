require('dotenv').config()
const Discord = require("discord.js");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessages,
	Discord.GatewayIntentBits.GuildMembers,
	Discord.GatewayIntentBits.GuildPresences
  ],
  http: {timeout:60000}
});

const command_files = require('fs').readdirSync("./commands").filter(file => file.endsWith(".js"));
client.commands = new Discord.Collection();
for (const file of command_files)
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const Prefix = require("./prefix.js");
client.on(Discord.Events.MessageCreate, (msg) => {
	const prefix = Prefix.get_prefix(msg.guildId);
	
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command_name = args.shift().toLowerCase();

	if (msg.author.id !== "1069155273182285834") return;

	const command = client.commands.get(command_name);
	if (!command) return;

	try {
		command.execute(client, msg, args);
	}
	catch (error) {
		console.log(error);
	}

});

client.login(process.env.TOKEN);

client.once(Discord.Events.ClientReady, (readyClient) => {
	console.log(`El bot inició correctamente como ${readyClient.user.tag}.`);
});