function get_mention(msg) {
  return `<@${msg.author.id}>`;
}

module.exports = {get_mention};
