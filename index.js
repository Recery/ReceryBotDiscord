const { Client, Events, GatewayIntentBits, Message } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (msg) => {
  for (const command of available_commands)
  {
    if (command.check_activation(msg))
    {
      command.execution();
      return;
    }
  }
});

client.login(process.env.TOKEN);
