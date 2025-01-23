const eco = require("../../economy/economyModule.js");
const slimesModule = require("../../economy/slimesModule.js");

module.exports = {
    name: "barnadd",
    alias: ["badd"],
    category: "economy",
    description: {
        es: "Añade un slime a tu granero.\nDebes tener el slime en el corral.",
        en: "Adds a slime to your barn.\nYou must have the slime in your corral."
    },
    examples: ["{{prefix}}barnadd 1 x2", "{{prefix}}badd creamy slime x3", "{{prefix}}badd 2"],
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;
        
        // Si no tiene un primer argumento, significa que no ingreso nada mas que solo el comando
        if (!args.length > 0) {
            msg.reply(messages[lang].notInput);
            return;
        }
        
        // Vamos a construir el nombre del slime ingresado por el usuario
        // Para eso hay que agregar cada argumento del array a un string hasta encontrar el argumento de cantidad (si es que hay)
        let inputName = "";
        let quantityToAdd = 1; // Por defecto la cantidad de slimes va a ser 1, por si no se ingresa un argumento de cantidad
        for (const arg of args) {
            // El argumento de cantidad empieza con una x
            if (arg.toLowerCase().startsWith("x")) {
                const inputQuantity = Number(arg.toLowerCase().replace("x", ""));
                if (!isNaN(inputQuantity)) quantityToAdd = inputQuantity;
                break;
            }

            inputName += arg + " ";
        }
        inputName = inputName.trim();

        if (quantityToAdd + eco.getBarnSlimesAmount(userID) > eco.getBarnSize(userID)) {
            msg.reply(messages[lang].notEnoughSize);
            return;
        }

        // Buscar si el nombre/ID del slime ingresado existe en los slimes existentes
        let slimeObj;

        if (isNaN(Number(inputName))) slimeObj = slimesModule.getSlimeByName(inputName);
        else slimeObj = slimesModule.getSlime(Number(inputName))

        if (!slimeObj) {
            msg.reply(messages[lang].notFound);
            return;
        }

        // Para guardar slimes tiene que tener la cantidad necesaria en el corral, vamos a verificar eso
        let hasSlime = false;
        const slimesInCorral = eco.getCorralSlimes(userID);

        for (const slime of slimesInCorral) {
            if (slime.obj.id === slimeObj.id) {
                if (slime.quantity >= quantityToAdd) {
                    hasSlime = true
                    break;
                }
            }
        }

        if (!hasSlime) {
            msg.reply(messages[lang].notEnoughSlimes.replace("{{slime}}", slimeObj.displayName[lang]));
            return;
        }


        for (let i = 0; i < quantityToAdd; i++) {
            eco.addSlimeToBarn(userID, slimeObj.id);
            eco.removeSlimeFromCorral(userID, slimeObj.id);
        }

        msg.reply(messages[lang].added.replace("{{quantity}}", quantityToAdd.toString()).replace("{{slime}}", slimeObj.displayName[lang]));
    }
}

const messages = {
    es: {
        notInput: "Debes ingresar el nombre/ID de un slime para añadir a tu granero.",
        notEnoughSize: "No tienes suficiente espacio en tu granero para guardar esa cantidad de slimes.",
        notFound: "No se ha encontrado un slime con ese nombre/ID.",
        notEnoughSlimes: "No tienes esa cantidad de {{slime}} en tu corral.\nConsigue más slimes con `hatchslimes`.",
        added: "¡Has añadido x{{quantity}} {{slime}} a tu granero!"
    },
    en: {
        notInput: "You must enter the name/ID of a slime to add to your barn.",
        notEnoughSize: "You don't have enough space to add this amount of slimes in your barn.",
        notFound: "Couldn't find an slime with that name/ID",
        notEnoughSlimes: "You don't have enough {{slime}} in your corral.\nGet more slimes with `hatchslimes`.",
        added: "You have added x{{quantity}} {{slime}} to your barn!"
    }
}