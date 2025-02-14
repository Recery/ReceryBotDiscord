const DB = require("better-sqlite3");
const Discord = require("discord.js");

const countingChannels = new Set();

module.exports = {
    name: "count",
    alias: ["contar"],
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!msg.member.permissions.has("Administrator")) {
            msg.reply(messages[lang].notAdmin);
            return;
        }

        const serverId = msg.guildId;
        const channelId = msg.channelId;
        const fullId = serverId + "-" + channelId;

        if (countingChannels.has(fullId)) { // Está contando...
            // Dejar de contar
            msg.reply(messages[lang].stopCounting);
            removeChannelFromCounting(serverId, channelId);
            countingChannels.delete(fullId);
        }
        else { // No está contando...
            // Empezar a contar
            msg.reply(messages[lang].startCounting);
            addChannelToCounting(serverId, channelId);
            countingChannels.add(fullId);
        }
    },
    init(client) {
        const rows = db.prepare("SELECT serverId, channelId FROM count").all();

        for (const row of rows)
            countingChannels.add(row.serverId + "-" + row.channelId);

        client.on(Discord.Events.MessageCreate, (msg) => {
            if (msg.author.bot) return;
            
            const serverId = msg.guildId;
            const channelId = msg.channelId;
            const lang = client.langs.get(serverId) || "es";
            if (!countingChannels.has(serverId + "-" + channelId))
                return;
        
            const currentNumber = getChannelCurrentCounting(serverId, channelId);
            const newNumber = Number(msg.content);
            if (isNaN(newNumber)) return;
        
            if (newNumber === currentNumber + 1) {
                msg.react("✅");
                setChannelCurrentCounting(serverId, channelId, newNumber);
            }
            else {
                msg.react("❌");
                setChannelCurrentCounting(serverId, channelId, 0);
                msg.reply(messages[lang].loss);
            }
        });
    }
}

const db = new DB(process.env.FUN_DB_PATH);

function getChannelCurrentCounting(serverId, channelId) {
    const row = db.prepare("SELECT number FROM count WHERE serverId = ? AND channelId = ?").get(serverId, channelId);

    if (row) return row.number;

    return 0;
}

function setChannelCurrentCounting(serverId, channelId, number) {
    db.prepare("INSERT OR REPLACE INTO count (serverId, channelId, number) VALUES (?, ?, ?)").run(serverId, channelId, number);
}

function addChannelToCounting(serverId, channelId) {
    db.prepare("INSERT OR REPLACE INTO count (serverId, channelId, number) VALUES (?, ?, ?)").run(serverId, channelId, 0);
}

function removeChannelFromCounting(serverId, channelId) {
    db.prepare("DELETE FROM count WHERE serverId = ? AND channelId = ?").run(serverId, channelId);
}

const messages = {
    es: {
        notAdmin: "No tienes los permisos necesarios para iniciar un juego de conteo en este servidor.",
        stopCounting: "En ese caso, este canal dejará de contar.",
        startCounting: "Entonces, que comience el juego de contar. Empiecen con un 1.",
        loss: "¡Han perdido! El contador se reinicia, comiencen de nuevo con 1."
    },
    en: {
        notAdmin: "You don't have enough permissions to start a counting game in this server.",
        stopCounting: "Then this channel will stop counting.",
        startCounting: "Let's start the counting game, then. Start with a 1.",
        loss: "You have lost! The counter resets, start again with 1."
    }
}