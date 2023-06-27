const Command = require('./command');

class UnsubscribeCommand extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.command('unsubscribe', (ctx) => ctx.scene.enter('unsubscribe'));
  }
}
module.exports = UnsubscribeCommand;
