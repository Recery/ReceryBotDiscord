module.exports = {
    name: "abrazar",
    execute(msg, args)
    {
        const hug_target = args.join(" ");

        msg.reply(`<@${msg.author.id}> abrazó a ${hug_target}!`)
    }
}