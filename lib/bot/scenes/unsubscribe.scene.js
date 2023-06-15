const { BaseScene } = require('telegraf');
const Subscriptions = require('../subscriptions');
const logger = require('../../../logger');
const { subscriptionDeleted, userNotSubscribed } = require('../botMessages');

class UnsubscribeScene {
  constructor() {
    this.unsubscribe = new BaseScene('unsubscribe');
    this.subscriptions = new Subscriptions();
  }

  deleteSubscription() {
    this.unsubscribe.enter(async (context) => {
      const {
        chat: { id },
        session: { cronJobStore },
      } = context;
      if (await this.subscriptions.deleteSubscription(id, cronJobStore)) {
        await context.reply(subscriptionDeleted).catch((err) => logger.error(err));
      } else {
        await context.reply(userNotSubscribed).catch((err) => logger.error(err));
      }
      await context.scene.leave();
    });
    return this.unsubscribe;
  }
}

module.exports = UnsubscribeScene;
