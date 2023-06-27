const Command = require('./command');
const { startedMessage } = require('../botMessages');
const logger = require('../../../logger');

class StartCommand extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.start((context) => context.reply(startedMessage).catch((err) => logger.error(err)));
  }
}
module.exports = StartCommand;
