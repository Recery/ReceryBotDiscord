const { Client, Events, GatewayIntentBits, Message } = require("discord.js");
const { get_mention } =  require("./Scripts/global_funcs.js")
const available_commands = require("./Scripts/available_commands.js")

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  console.log(available_commands)
});

client.on(Events.MessageCreate, (msg) => {
  for (const command of available_commands)
  {
    console.log(command);
    if (command.check_activation(msg))
    {
      command.execution();
      return;
    }
  }

  if (msg.content === "!invadirperu")
  {
    msg.reply("estamos invadiendo peru");
  }
  else if (msg.content === "!terraria")
  {
    msg.reply("el mejor juego de la historia")
  }
  else if (msg.content === "!pelotudo")
  {
    msg.reply("pelotudo sos vos forro")
  }
  else if (msg.content === "!zahira")
  {
    msg.reply("zanahoria")
  }
  else if (msg.content === "!dado")
  {
    var num = Math.floor(Math.random() * 10) + 1;
    msg.reply("Tiraste el dado y salio: " + num)
  }
  else if (msg.content === "!amongus")
  {
    msg.reply(
      {
        content: "Sus",
        files: ["Gifs/amongus.gif"]
      });
  }
  else if (msg.content === "!help")
  {
    msg.reply("Comandos de Senko Bot:" + commands)
  }
  else if (msg.content === "!pez")
  {
    msg.reply(
      {
        content: "Un pez",
        files: ["Images/goldfish.jpg"]
      });
  }
  else if (msg.content === "!senkobot")
  {
    msg.reply(`Hola ${get_mention(msg)}` + ", soy Senko Bot, un bot creado por SenkoSan12543. Soy argentino y me gustan los peces. Tengo una obsesión por el Terraria.")
  }
  else if (msg.content === "!comergalleta")
  {
    msg.reply(
      {
        content: "> Te comiste una galleta... Y es gratis, no como las de Nekotina",
        files: ["Gifs/Galleta1.gif"]
      }
    );
  }
  
});

client.login(process.env.TOKEN);

var commands = "!invadirperu, !terraria, !pelotudo, !zahira, !dado, !amongus, !pez, !saludar, !fishfact, !ping, !senkobot"