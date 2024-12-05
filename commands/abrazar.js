module.exports = {
    name: "abrazar",
    execute(client, msg, args)
    {
        if (!args.length > 0)
        {
            msg.reply(`<@${msg.author.id}> se abrazó a si mismo...`);
            return;
        }

        const hug_target = args.join(" ");

        msg.reply(`<@${msg.author.id}> abrazó a ${hug_target}!`);
    }
}