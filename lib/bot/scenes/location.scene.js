const { BaseScene } = require('telegraf');
const { sendLocation } = require('../botMessages');
const logger = require('../../../logger');

class LocationScene {
  constructor() {
    this.location = new BaseScene('location');
  }

  getLocation() {
    this.location.enter((context) => context.reply(sendLocation).catch((err) => logger.error(err)));
    this.location.on('location', async (context) => {
      const { session, scene } = context;
      session.userLocation = context.message.location;
      await scene.enter('time');
    });
    this.location.on('message', (context) =>
      context.reply(sendLocation).catch((err) => logger.error(err)),
    );
    return this.location;
  }
}

module.exports = LocationScene;
