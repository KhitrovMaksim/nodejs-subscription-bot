const { TOKEN_BOT } = require('./config');

const { WeatherForecastSubscribeBot } = require('./lib/weatherForecastSubscribeBot');

const bot = new WeatherForecastSubscribeBot(TOKEN_BOT);
bot.init();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
