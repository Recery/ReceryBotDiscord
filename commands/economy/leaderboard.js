const DB = require("better-sqlite3");
const Discord = require("discord.js");

module.exports = {
    name: "leaderboard",
    category: "economy",
    alias: ["ranking", "rank"],
    description: {
        es: "Muestra una lista con los distintos rankings de usuarios disponibles.\n" +
        "Con `allow`, puedes alternar entre aparecer en los rankings o no.\n" +
        "Por defecto, no aparecerás en los rankings.",
        en: "Shows a list of the different user leaderboards available.\n" +
        "With `allow`, you can toggle between appearing in the leaderboards or not.\n" +
        "By default, you will not appear on the leaderboards."
    },
    syntax: {
        es: "{{prefix}}leaderboard [allow]",
        en: "{{prefix}}leaderboard [allow]"
    },
    examples: ["{{prefix}}leaderboard", "{{prefix}}leaderboard allow", "{{prefix}}ranking allow"],
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userId = msg.author.id;

        if (args[0] && args[0] === "allow") {
            // Está permitido, así que vamos a desactivarlo
            if (leaderboardAllowed(userId)) {
                toggleLeaderboardAllow(userId, false);
                msg.reply(messages[lang].notAllowed);
            }
            // No está permitido, hay que activarlo
            else {
                toggleLeaderboardAllow(userId, true);
                msg.reply(messages[lang].allowed);
            }
            return;
        }
        
        const embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setThumbnail("attachment://thumbnail.png")
            .setAuthor({name: messages[lang].leaderboard, iconURL: client.user.avatarURL()})
            .setFooter({
                text: leaderboardAllowed(userId) ? messages[lang].currentlyAllowed : messages[lang].currentlyNotAllowed,
                iconURL: msg.author.avatarURL()
            });

        const rankingChooser = new Discord.StringSelectMenuBuilder()
            .setCustomId("rankingChoosed")
            .setPlaceholder(messages[lang].selectionPlaceholder);

        for (const key of Object.keys(leaderboards)) {
            embed.addFields(
                {name: leaderboards[key].emoji + " " + leaderboards[key].title[lang], value: leaderboards[key].desc[lang]}
            );

            rankingChooser.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setValue(key)
                    .setLabel(leaderboards[key].title[lang])
                    .setDescription(leaderboards[key].desc[lang])
                    .setEmoji(leaderboards[key].emoji)
            );
        }

        const selectionRow = new Discord.ActionRowBuilder()
            .addComponents(rankingChooser);

        const sentMessage = await msg.reply({
            embeds: [embed],
            components: [selectionRow],
            files: [new Discord.AttachmentBuilder(process.env.FILES_BASE_URL + "slimeImages/cheese.png", {name: "thumbnail.png"})]
        });

        const collector = sentMessage.createMessageComponentCollector({time:300000});
        
        collector.on("collect", async (interaction) => {
            if (interaction.customId !== "rankingChoosed") return;

            let leaderboard;
            let iconURL;
            switch (interaction.values[0]) {
                case "slimes":
                    leaderboard = await getLeaderboardEmbed(leaderboards.slimes.getRanking(), "slimes", client, lang);
                    iconURL = leaderboards.slimes.icon;
                    break;
                case "apples":
                    leaderboard = await getLeaderboardEmbed(leaderboards.apples.getRanking(), "apples", client, lang);
                    iconURL = leaderboards.apples.icon;
                    break;
                default:
                    leaderboard = await getLeaderboardEmbed(leaderboards.slimes.getRanking(), "slimes", client, lang);
                    iconURL = leaderboards.slimes.icon;
                    break;
            }

            interaction.update({
                embeds: [leaderboard],
                files: [new Discord.AttachmentBuilder(iconURL, {name: "icon.png"})]
            });
        });
    }
}

function leaderboardAllowed(userId) {
    const db = new DB(process.env.DB_DIR + "economy.db");

    const row = db.prepare("SELECT allowed FROM leaderboardsAllows WHERE userId = ?").get(userId);

    db.close();

    if (row) return Boolean(row.allowed);

    return false;
}

function toggleLeaderboardAllow(userId, allowed) {
    const db = new DB(process.env.DB_DIR + "economy.db");

    // Guardamos un 1 o 0 para representar true o false ya que no podemos guardar booleanos en la base de datos
    db.prepare("INSERT OR REPLACE INTO leaderboardsAllows (userId, allowed) VALUES (?, ?)").run(userId, allowed ? 1 : 0);

    db.close();
}

async function getLeaderboardEmbed(dataRows, type, client, lang) {
    const embed = new Discord.EmbedBuilder()
        .setColor('Random')
        .setFooter({text: leaderboards[type].desc[lang]})
        .setAuthor({
            name: leaderboards[type].title[lang],
            iconURL: "attachment://icon.png"
        });

    let pos = 1;
    for (const row of dataRows) {
        try {
            const user = await client.users.fetch(row.userId);

            if (pos === 1) {
                embed.setThumbnail(user.avatarURL());
                embed.setTitle(`:trophy: ${user.displayName}`);
                embed.setDescription(`${leaderboards[type].emoji} **\`${row.quantity}\`**`);
            }
            else {
                embed.addFields({
                    name: `**${pos}**- ${user.displayName}`,
                    value: `${leaderboards[type].emoji} **\`${row.quantity}\`**`
                });
            }
            pos++;
        } catch {
            // Probablemente da error porque discord no encuentra al usuario, no hacer un ningun log
        }
    }

    if (pos === 1)
        embed.setDescription(messages[lang].noUsers);

    return embed;
}

const messages = {
    es: {
        allowed: "Ahora aparecerás en los rankings.\n" +
        "Usá `allow` de nuevo para no aparecer.",
        notAllowed: "Ya no aparecerás en los rankings.\n" +
        "Usá `allow` de nuevo para volver a aparecer.",
        currentlyNotAllowed: "No participas de los rankings.\nUsá allow para participar.",
        currentlyAllowed: "Estás participando en los rankings.\nUsá allow para dejar de participar.",
        leaderboard: "Ranking",
        noUsers: "Parece que no hay nadie en este ranking...",
        selectionPlaceholder: "Selecciona un ranking..."
    },
    en: {
        allowed: "You will appear in the leaderboards now.\n" +
        "Use `allow` again to not appear.",
        notAllowed: "You will not appear in the leaderboards anymore.\n" +
        "Use `allow` to appear again.",
        currentlyNotAllowed: "You're not participating in leaderboards.\nUse allow to participate.",
        currentlyAllowed: "You're participating in leaderboards.\nUse allow to not participate anymore.",
        leaderboard: "Leaderboard",
        noUsers: "It seems there is no one in this ranking...",
        selectionPlaceholder: "Choose a leaderboard..."
    }
}

const leaderboards = {
    slimes: {
        title: {
            es: "Ranking de slimes",
            en: "Slimes leaderboard"
        },
        desc: {
            es: "Mayor cantidad de slimes eclosionados",
            en: "Most quantity of slimes hatched"
        },
        icon: process.env.FILES_BASE_URL + "slimeImages/slimeIcon.png",
        emoji: "<:slimeIcon:1355275105948795061>",
        getRanking: () => {
            const db = new DB(process.env.DB_DIR + "economy.db");

            const rows = db.prepare(`
                SELECT userId, SUM(quantity) AS quantity
                FROM totalSlimes
                WHERE userId IN (SELECT userId FROM leaderboardsAllows WHERE allowed = ?)
                GROUP BY userId
                ORDER BY quantity DESC
                LIMIT ?
            `).all(1, 10);
            db.close();

            return rows;
        }
    },
    apples: {
        title: {
            es: "Ranking de manzanas verdes",
            en: "Green apples ranking"
        },
        desc: {
            es: "Mayor cantidad de manzanas verdes",
            en: "Most quantity of stored green apples"
        }, 
        icon: process.env.FILES_BASE_URL + "slimeImages/greenAppleIcon.png",
        emoji: "<:GreenApple:1296171434246410380>",
        getRanking: () => {
            const db = new DB(process.env.DB_DIR + "economy.db");

            const rows = db.prepare(`
                SELECT userId, apples AS quantity
                FROM greenApples
                WHERE userId IN (SELECT userId FROM leaderboardsAllows WHERE allowed = ?)
                ORDER BY apples DESC
                LIMIT ?
            `).all(1, 10);
            db.close();

            return rows;
        }
    }
}