class Command
{
  constructor (init_activator)
  {
    this.activator = init_activator;
  }

  check_activation(msg)
  {
    if (msg.content === this.activator)
      this.execution(msg);
  }

  execution(msg){}
}

module.exports = Command