const { BaseScene } = require('telegraf');
const Subscriptions = require('../subscriptions');
const logger = require('../../../logger');
const { successfullySubscribed } = require('../botMessages');

class SaveScene {
  constructor() {
    this.save = new BaseScene('save');
    this.subscriptions = new Subscriptions();
  }

  saveSubscription() {
    this.save.enter(async (context) => {
      await this.subscriptions.saveSubscription(context);
      await context.reply(successfullySubscribed).catch((err) => logger.error(err));
      await context.scene.leave();
    });
    return this.save;
  }
}

module.exports = SaveScene;
