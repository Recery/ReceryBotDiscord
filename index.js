const { Client, Events, GatewayIntentBits, Message } = require("discord.js");
const { get_mention } =  require("./Scripts/global_funcs.js")
const { available_commands } = require("./Scripts/available_commands.js")

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
  for (command in available_commands)
  {
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
  else if (msg.content === "!fishfact")
  {
    switch(Math.floor(Math.random() * 3) + 1)
      {
          case 1: msg.reply("Las corydoras no tienen escamas, sino que tienen placas oseas que recubren su cuerpo");
            break;
          case 2: msg.reply("Los peces guppy son muy faciles de reproducir")
            break;
          case 3: msg.reply("Los peces cebrita comparten una gran parte de su ADN con el ser humano");
            break;
      }
  }
  else if (msg.content === "!ping")
  {
    msg.reply("pong... Mi creador es un pelotudo y no sabe como mostrar mi ping, conformate con eso XD");
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