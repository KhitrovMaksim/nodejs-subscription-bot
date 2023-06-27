const { BaseScene } = require('telegraf');
const Subscriptions = require('../subscriptions');
const logger = require('../../../logger');
const { userNotSubscribed } = require('../botMessages');

class InfoScene {
  constructor() {
    this.subscriptions = new Subscriptions();
  }

  getSubscription() {
    const info = new BaseScene('info');
    info.enter(async (context) => {
      const {
        chat: { id },
      } = context;
      const subscription = await this.subscriptions.getSubscription(id);
      if (subscription) {
        const {
          userTime,
          userLocation: { latitude, longitude },
        } = subscription;
        await context
          .reply(
            `Location:\n latitude - ${latitude}\n longitude - ${longitude} \nTime:  ${userTime}`,
          )
          .catch((err) => logger.error(err));
      } else {
        await context.reply(userNotSubscribed).catch((err) => logger.error(err));
      }
      await context.scene.leave();
    });
    return info;
  }
}

module.exports = InfoScene;
