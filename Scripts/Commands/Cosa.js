const Command = require("./command_cls.js")

class Cosa extends Command
{
  execution(msg)
  {
    var item = this.get_item();
    var message = `${this.get_mention(msg)}, obtuviste ${item.nombre}${item.emote} de rareza ${item.rareza} \n`;
    var green_apples = this.get_bot_state().modify_green_apples(this.get_mention(msg), item.rareza);
    message += `Obtuviste ${item.rareza}<:ManzanaVerde:1296171434246410380>, y ahora tienes un total de ${green_apples}`;

    msg.reply(message);
  }

  // Rarezas van del 1 al 10 (1: muy comun, 10: muy raro)
  item_list = [
    {emote: "<:Piedra:1296180253328408641>", nombre: "Piedra", rareza: 1},
    {emote: "<:Bombucha:1296180276652937259>", nombre: "Bombucha", rareza: 2},
    {emote: "<:Regadera:1296182197362884679>", nombre: "Regadera", rareza: 4},
    {emote: "<:Guadana:1296182186382327898>", nombre: "Guadaña", rareza: 5},
    {emote: "<:Queso:1296180263402868766>", nombre: "Queso", rareza: 5},
    {emote: "<:SombreroBruja:1296182177523830864>", nombre: "Sombrero de bruja", rareza: 8},
    {emote: "<:CositoDeLaPizza:1296179027853447208>", nombre: "Cosito de la pizza", rareza: 10},
    {emote: "<:Linterna:1296180239826944112>", nombre: "Linterna", rareza: 9}
  ];

  get_item()
  {
    let total_weight = 0;
    for (const item of this.item_list)
    {
      total_weight += item.rareza;
    }

    const rand = Math.random() * total_weight;
    let acumulado = 0;

    for (const item of this.item_list)
    {
      acumulado += (11 - item.rareza);
      if (rand < acumulado) return item;
    }

    return null;
  }
}

module.exports = new Cosa("!cosa");