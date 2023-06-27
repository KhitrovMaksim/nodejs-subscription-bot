const { BaseScene } = require('telegraf');
const isValidTime24Format = require('../../helpers/isValidTime24Format');
const logger = require('../../../logger');
const { sendValidTime, sendTime } = require('../botMessages');

class TimeScene {
  constructor() {
    this.time = new BaseScene('time');
  }

  getTime() {
    this.time.enter((context) => context.reply(sendTime).catch((err) => logger.error(err)));
    this.time.on('text', async (context) => {
      if (isValidTime24Format(context.message.text)) {
        const { session, scene } = context;
        session.userTime = context.message.text;
        await scene.enter('save');
      } else {
        await context.reply(sendValidTime).catch((err) => logger.error(err));
      }
    });
    this.time.on('message', (context) => context.reply(sendTime).catch((err) => logger.error(err)));
    return this.time;
  }
}

module.exports = TimeScene;
