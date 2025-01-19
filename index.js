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


// CARGAR COMANDOS E INTERACCIONES DESDE EL SISTEMA DE ARCHIVOS

const GetJSFiles = require("./getJSFiles.js");

client.commands = new Discord.Collection();
for (const file of GetJSFiles.getJSFiles("./commands")) {
	const command = require("./" + file);
	client.commands.set(command.name, command);
}

client.interactions = new Discord.Collection();
for (const file of GetJSFiles.getJSFiles("./interactions")) {
	const interaction = require("./" + file);
	client.interactions.set(interaction.id, interaction);
}

// -------------------------------------------------------------

const Prefix = require("./prefix.js");
const Langs = require("./langsLoader.js");
client.on(Discord.Events.MessageCreate, (msg) => {
	const prefix = Prefix.get_prefix(msg.guildId);

	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
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

client.on(Discord.Events.InteractionCreate, async (interaction) => {
	console.log(interaction.customId);

	const interactionData = client.interactions.get(interaction.customId);
	if (!interactionData) return;

	try {
		(interactionData.execute(client, interaction));
	}
	catch (error) {
		console.log(error);
	}
});


let token = process.env.TOKEN;
const args = process.argv.slice(2)
for (const arg of args)
	if (arg === "experimental") token = process.env.EXPERIMENTAL_TOKEN;

client.login(token);

client.once(Discord.Events.ClientReady, (readyClient) => {
	console.log(`El bot inició correctamente como ${readyClient.user.tag}.`);
	Langs.load_langs(client);
});