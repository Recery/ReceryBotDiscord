const { Client, Events, GatewayIntentBits, Message } = require("discord.js");

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

var sleep = false
client.on(Events.MessageCreate, (msg) => {
  if (msg.content === "!senkohelp")
  {
    var message = "Comandos de Senko Bot: \n"
    for (const command of available_commands)
    {
      message += command.get_activator() + ", ";
    }
    message = message.slice(0, -2);
    msg.reply(message);
  }
  else if (msg.content === "!senkoawake")
  {
    if (sleep)
    {
      msg.reply("La puta madre para que me despertas... Terrible siesta me estaba haciendo");
      sleep = false
    }
    else
    {
      msg.reply("Ya estoy despierto, no ves que tengo los ojos abiertos?")
    }
  }
  else if (msg.content === "!senkosleep")
  {
    if (sleep)
    {
      msg.reply("Zzz... (Ya estoy dormido pelotudo)");
    }
    else
    {
      msg.reply("Vamos carajo, ya me estaba cansando de vos... A dormir... Zzz")
      sleep = true
    }
  }
  else
  {
    for (const command of available_commands)
    {
      if (command.check_activation(msg))
      {
        command.execution();
        return;
      }
    }
  }
});

client.login(process.env.TOKEN);
