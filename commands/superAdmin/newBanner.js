const Discord = require("discord.js");
const slimesModule = require("../../economy/slimesModule.js");
const bannersModule = require("../../economy/bannersModule.js");
const DB = require("better-sqlite3");

module.exports = {
    name: "newbanner",
    category: "superAdmin",
    alias: ["nuevobanner", "createbanner"],
    description: {
        es: "",
        en: ""
    },
    syntax: {
        es: "",
        en: ""
    },
    examples: [],
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!args[0] || !args[1]) {
            msg.reply(messages[lang].incorrectArgs);
            return;
        }

        const bannerName = args[0];

        if (isNaN(Number(args[1]))) {
            msg.reply(messages[lang].nonValidDate);
            return;
        } else if (Number(args[1] > 14 || Number(args[1] < 3))) {
            msg.reply(messages[lang].incorrectTime);
            return;
        }

        const msDay = 24 * 60 * 60 * 1000;
        const endDate = Date.now() + (msDay * args[1]);

        msg.reply(messages[lang].correctBanner);

        const slimesIds = [];
        const regularBanner = bannersModule.getBanner("Regular");

        const slimeAddListener = (message) => {
            if (message.author.id !== msg.author.id
                || message.channel.id !== msg.channel.id) return;
            
            const slimeName = message.content.trim().toLowerCase();

            if (slimeName === "end") {
                if (!bannersModule.addBanner(bannerName, endDate, slimesIds.join(";")))
                    console.log("Error añadiendo el banner.");

                message.reply(messages[lang].bannerCreated);
                client.off(Discord.Events.MessageCreate, slimeAddListener);
                return;
            }

            // Intentar conseguir slime primero por id y luego por nombre
            const slime = slimesModule.getSlime(Number(slimeName)) || slimesModule.getSlimeByName(slimeName);

            // validaciones...
            if (!slime) {
                message.reply(messages[lang].incorrectSlime);
                return;
            }
            if (regularBanner.slimesIds.includes(slime.id)) {
                message.reply(messages[lang].inRegularBanner);
                return;
            }
            if (slimesIds.includes(slime.id.toString())) {
                message.reply(messages[lang].dupedSlime);
                return;
            }
            // ----------
            
            slimesIds.push(slime.id.toString());
            message.react("✅");
        };

        client.on(Discord.Events.MessageCreate, slimeAddListener);
    }
}

const messages = {
    es: {
        incorrectArgs: "Debes ingresar el nombre del banner y la duración (en días).",
        nonValidDate: "Debes ingresar un valor numérico en días para la duración del banner (Por ejemplo: 14).",
        incorrectTime: "El máximo de duración de un banner es de 14 días, y el mínimo de 3 días.",
        correctBanner: "Nombre y duración del banner correctos. " + 
        "Comienza a ingresar los slimes (por nombre o ID), uno por uno, en mensajes en este canal. " +
        "Cuando termines, envía 'end'.",
        incorrectSlime: "No se ha encontrado un slime con ese nombre o ID. Intenta de nuevo.",
        inRegularBanner: "Este slime ya se encuentra en el banner regular. Intenta con otro.",
        dupedSlime: "Este slime ya fue añadido al banner. Intenta con otro.",
        bannerCreated: "¡Banner creado exitosamente!"
    },
    en: {
        incorrectArgs: "You must enter the banner's name and the duration (in days).",
        nonValidDate: "You must enter a numeric value in days for the duration of the banner (For example: 14).",
        incorrectTime: "Maximum duration of a banner is of 14 days, and minimum is of 3 days.",
        correctBanner: "Name and duration of the banner are correct. " +
        "Start adding slimes to it (by name or ID), one by one, in messages in this channel. " +
        "When you finish, send 'end'.",
        incorrectSlime: "There's no slime with that name or ID. Try again.",
        inRegularBanner: "This slime is already present in the regular banner. Try with another one.",
        dupedSlime: "This slime has already been added to this banner. Try with another one.",
        bannerCreated: "Banner created succesfully!"
    }
}

/*

Datos de un banner:
- nombre (uno solo, no hay diferencias entre idiomas. primary key del banner, no puedo haber otro que se llame igual)
- slimes disponibles (siempre van a poder salir los del banner regular, pero ademas salen estos que se asignan)
- duracion (el super admin ingresa la duracion expresada en dias, ej: 14 dias que es el maximo. esa duracion en dias
se traduce a tiempo utc, es decir ahora + la cantidad de dias ingresadas)

funcionamiento:
los banners se registran en la base de datos, y cuando se necesita se va consultar 
para ver que banners hay y mostrarle al usuario.
cada vez que se consulta los banners, hay que verificar si la fecha para que termine ya pasó.
de ser así, borrarlo de la base de datos y obviamente que no le salga al usuario.
el banner regular siempre va a estar disponible, 
cuando inicia el bot automaticamente agrega a la tabla el banner regular;
este banner no tiene ningun dato en la columna de slimes, o sea que solo salen las cosas del banner regular.
los banners se obtienen desde el modulo de slimes.
el metodo para obtener los banners, añade automaticamente los slimes del banner regular;
o sea, no hay que decirle manualmente cada slime del banner regular (seria un quilombo)

*/