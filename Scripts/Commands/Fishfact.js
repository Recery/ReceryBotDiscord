const Command = require("./command_cls.js")

class Fishfact extends Command
{
  facts = [
    "Las corydoras no tienen escamas, sino que tienen placas oseas que recubren su cuerpo.",
    "Los peces guppy son muy faciles de reproducir.",
    "Los peces cebrita comparten una gran parte de su ADN con el ser humano.",
    "Los goldfish no tienen memoria de 5 minutos... Eso es totalmente falso.",
    "El ajo es un buen antiparasitario para los peces.",
    "A los peces monjitas (O tetra negro) no les gusta mucho la luz.",
    "A los goldfish a menudo se los llama peces de agua fría... Sin embargo, esto no significa que no puedan vivir en temperaturas más calidas, como los 20C°."
  ]

  execution(msg)
  {
    msg.reply(this.facts[Math.floor(Math.random() * this.facts.length)]);
  }
}

module.exports = new Fishfact("!fishfact", "diversion");