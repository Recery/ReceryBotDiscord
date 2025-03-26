require('dotenv').config();
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


const Prefix = require("./prefix.js");
const Langs = require("./langsLoader.js");
client.on(Discord.Events.MessageCreate, (msg) => {
	if (process.env.EXPERIMENTAL)
		if (msg.author.id !== "1069155273182285834" && msg.author.id !== "1296846133489963049" && msg.author.id !== "387938134396239883") return;


	const channel = msg.guild.channels.cache.get(msg.channelId);
	if (!(channel && msg.guild.members.me.permissionsIn(channel).has('SendMessages'))) return;

	const cleanText = Prefix.cleanPrefix(msg, client.user.id);
	if (!cleanText || msg.author.bot) return;
  
	const args = cleanText.split(/\s+/);
	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
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
	require('./databases.js').initDbs();
	Langs.loadLangs(client);

	client.user.setPresence({
		status: "idle",
		activities: [{
			name: "Feeding the slimes",
			type: Discord.ActivityType.Playing,
			url: "https://recery.itch.io/slime-shoot"
		}]
	});

	// CARGAR COMANDOS DESDE EL SISTEMA DE ARCHIVOS
	client.commands = new Discord.Collection();
	for (const file of require("./getJSFiles.js").getJSFiles("./commands")) {
		const command = require("./" + file);
		client.commands.set(command.name, command);
		if (command.init) command.init(client);
	}

	console.log(`El bot inició correctamente como ${readyClient.user.tag}.`);
});