const eco = require("../../economy/economyModule.js");
const slimes = require("../../economy/slimes.js");

module.exports = {
    name: "addtobarn",
    alias: ["addb"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;
        
        // Si no tiene un primer argumento, significa que no ingreso nada mas que solo el comando
        if (!args.length > 0) {
            msg.reply("Debes ingresar el nombre/ID del slime que deseas agregar al granero.");
            return;
        }
        
        // Vamos a construir el nombre del slime ingresado por el usuario
        // Para eso hay que agregar cada argumento del array a un string hasta encontrar el argumento de cantidad (si es que hay)
        let inputName = "";
        let quantity = 1; // Por defecto la cantidad de slimes va a ser 1, por si no se ingresa un argumento de cantidad
        for (const arg of args) {
            // El argumento de cantidad empieza con una x
            if (arg.toLowerCase().startsWith("x")) {
                const inputQuantity = Number(arg.toLowerCase().replace("x", ""));
                if (!isNaN(inputQuantity)) quantity = inputQuantity;
                break;
            }

            inputName += arg + " ";
        }
        
        inputName = inputName.trim();

        let slimeObj;

        if (isNaN(Number(inputName))) slimeObj = slimes.getSlimeByName(inputName);
        else slimeObj = slimes.getSlime(Number(inputName))

        if (!slimeObj) {
            msg.reply("No se ha encontrado un slime con ese nombre/ID.");
            return;
        }

        eco.addSlimeToBarn(userID, slimeObj.id);
        msg.reply(`El ${slimeObj.displayName[lang]} ha sido añadido a tu granero.`);
    }
}

