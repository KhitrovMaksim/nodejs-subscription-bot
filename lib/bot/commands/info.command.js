const Command = require('./command');

class InfoCommand extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.command('info', (context) => context.scene.enter('info'));
  }
}
module.exports = InfoCommand;
