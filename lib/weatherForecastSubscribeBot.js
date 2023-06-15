const { Telegraf, session, Stage } = require('telegraf');
const StartCommand = require('./bot/commands/start.command');
const SubscribeCommand = require('./bot/commands/subscribe.command');
const UnsubscribeCommand = require('./bot/commands/unsubscribe.command');
const InfoCommand = require('./bot/commands/info.command');
const LocationScene = require('./bot/scenes/location.scene');
const TimeScene = require('./bot/scenes/time.scene');
const SaveScene = require('./bot/scenes/save.scene');
const UnsubscribeScene = require('./bot/scenes/unsubscribe.scene');
const InfoScene = require('./bot/scenes/info.scene');
const botCommands = require('./bot/botCommands');
const logger = require('../logger');

class WeatherForecastSubscribeBot {
  commands = [];

  constructor(token) {
    this.bot = new Telegraf(token);
    this.bot.telegram.setMyCommands(botCommands).catch((err) => logger.error(err));
    this.stage = new Stage([
      new LocationScene().getLocation(),
      new TimeScene().getTime(),
      new SaveScene().saveSubscription(),
      new UnsubscribeScene().deleteSubscription(),
      new InfoScene().getSubscription(),
    ]);
    this.bot.use(session());
    this.bot.use(async (context, next) => {
      context.session.cronJobStore = new Map();
      return next();
    });
    this.bot.use(this.stage.middleware());
  }

  init() {
    this.commands = [
      new StartCommand(this.bot),
      new SubscribeCommand(this.bot),
      new UnsubscribeCommand(this.bot),
      new InfoCommand(this.bot),
    ];
    this.commands.forEach((command) => {
      command.handle();
    });
    this.bot.launch().catch((err) => logger.error(err));
  }

  stop(terminationSignal) {
    this.bot.stop(terminationSignal);
  }
}

module.exports = { WeatherForecastSubscribeBot };
