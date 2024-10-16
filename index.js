const { KeepAlive } = require("./Scripts/keep_alive")

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
  console.log(available_commands)
});

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