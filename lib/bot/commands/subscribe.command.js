const Command = require('./command');

class SubscribeCommand extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.command('subscribe', (context) => context.scene.enter('location'));
  }
}
module.exports = SubscribeCommand;
