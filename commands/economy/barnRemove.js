const eco = require("../../economy/economyModule.js");
const slimesModule = require("../../economy/slimesModule.js");

// Para más detalles, ver addToBarn.js que se comporta de manera parecida

module.exports = {
    name: "barnremove", 
    alias: ["bremove"],
    category: "economy",
    description: {
        es: "Elimina un slime de tu granero y lo devuelve al corral.",
        en: "Removes an slime from your barn and returns it to your corral"
    },
    examples: ["{{prefix}}bremove 4 x5", "{{prefix}}barnremove green slime", "{{prefix}}bremove 2"],
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        // Si no tiene un primer argumento, significa que no ingreso nada mas que solo el comando
        if (!args.length > 0) {
            msg.reply(messages[lang].notInput);
            return;
        }

        // Construir nombre del slime ingresado
        let inputName = "";
        let quantityToRemove = 1;
        let quantityFound = false;
        for (const arg of args) {
            if (arg.toLowerCase().startsWith("x")) {
                const inputQuantity = Number(arg.toLowerCase().replace("x", ""));
                if (!isNaN(inputQuantity) && !quantityFound) {
                    quantityToRemove = inputQuantity;
                    quantityFound = true;
                }
                continue;
            }

            inputName += arg + " ";
        }
        inputName = inputName.trim();

        // Obtener el objeto del slime ingresado
        let slimeObj;

        if (isNaN(Number(inputName))) slimeObj = slimesModule.getSlimeByName(inputName);
        else slimeObj = slimesModule.getSlime(inputName);

        console.log(inputName);

        if (!slimeObj) {
            msg.reply(messages[lang].notFound);
            return;
        }

        // Buscar si tiene suficientes slimes
        let hasSlime = false;
        const slimesInBarn = eco.getBarnSlimes(userID);

        for (const slime of slimesInBarn) {
            if (slime.obj.id === slimeObj.id) {
                if (slime.quantity >= quantityToRemove){
                    hasSlime = true;
                    break;
                }
            }
        }

        if (!hasSlime) {
            msg.reply(messages[lang].notEnoughSlimes.replace("{{slime}}", slimeObj.displayName[lang]));
            return;
        }

        for (let i = 0; i < quantityToRemove; i++) {
            eco.removeSlimeFromBarn(userID, slimeObj.id);
            eco.addSlimeToCorral(userID, slimeObj.id);
        }

        msg.reply(messages[lang].removed.replace("{{slime}}", slimeObj.displayName[lang]).replace("{{quantity}}", quantityToRemove.toString()));
    }
}

const messages = {
    es: {
        notInput: "Debes ingresar el nombre/ID de un slime para eliminar de tu granero.",
        notFound: "No se ha encontrado un slime con ese nombre/ID.",
        notEnoughSlimes: "No tienes esa cantidad de {{slime}} en tu granero para eliminarlos.",
        removed: "Has eliminado x{{quantity}} {{slime}} de tu granero."
    },
    en: {
        notInput: "You must enter the name/ID of a slime to remove from your barn.",
        notFound: "Couldn't find an slime with that name/ID",
        notEnoughSlimes: "You don't have enough {{slime}} in your barn to remove them.",
        removed: "You have removed x{{quantity}} {{slime}} from your barn."
    }
}