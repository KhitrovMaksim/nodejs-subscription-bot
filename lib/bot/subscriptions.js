const Mongodb = require('../api/mongo/mongodb');
const logger = require('../../logger');
const Cron = require('../api/cron/cron');
const Weather = require('../api/weather/weather');
const { TOKEN_WEATHER_API } = require('../../config');

class Subscriptions {
  constructor() {
    this.db = new Mongodb();
    this.token = TOKEN_WEATHER_API;
  }

  async saveSubscription(context) {
    const {
      chat: { id },
      session: { userTime, userLocation },
    } = context;

    await this.addCronJob(context);

    await this.db.connect().catch(logger.error);
    if (await this.isSubscriptionExist(id)) {
      await this.db.update({ id }, { userTime, userLocation }).catch(logger.error);
    } else {
      await this.db.create({ id, userTime, userLocation }).catch(logger.error);
    }
    await this.db.close().catch(logger.error);
  }

  async isSubscriptionExist(id) {
    const subscription = await this.db.read({ id }).catch(logger.error);
    return !!subscription;
  }

  async deleteSubscription(id) {
    await this.db.connect().catch(logger.error);
    if (await this.isSubscriptionExist(id)) {
      await this.db.delete({ id }).catch(logger.error);
      await this.db.close().catch(logger.error);
      return true;
    }
    await this.db.close().catch(logger.error);
    return false;
  }

  async getSubscription(id) {
    await this.db.connect().catch(logger.error);
    if (await this.isSubscriptionExist(id)) {
      const subscription = await this.db.read({ id }).catch(logger.error);
      await this.db.close().catch(logger.error);
      return subscription;
    }
    await this.db.close().catch(logger.error);
    return null;
  }

  async addCronJob(context) {
    const {
      session: {
        userTime,
        userLocation: { latitude, longitude },
      },
    } = context;
    const weather = new Weather(this.token, latitude, longitude);

    const job = async () => {
      const res = await weather.getWeatherForeCast();
      context.reply(res);
    };

    new Cron(userTime, job).startJob();
  }
}

module.exports = Subscriptions;
