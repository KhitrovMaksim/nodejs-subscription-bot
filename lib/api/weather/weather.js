const logger = require('../../../logger');
const httpsGetJson = require('../../helpers/httpsGetJson');
const serializerArrayOfObjects = require('../../helpers/serializerArrayOfObjects');

class Weather {
  constructor(token, latitude, longitude) {
    this.url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${token}&units=metric`;
  }

  async getHttpResponse() {
    return httpsGetJson(this.url).catch((error) => {
      logger.error(`Error occurred while sending request. ${error}`);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  jsonResponseParser(json) {
    if (Object.prototype.hasOwnProperty.call(json, 'error')) return { error: json.error };

    const { weather, main, name, sys } = json;
    const { description } = weather[0];
    const { country } = sys;
    const { temp } = main;

    return {
      error: null,
      weather: [
        { Country: country },
        { Place: name },
        { Temperature: temp },
        { Description: description },
      ],
    };
  }

  async getWeatherForeCast() {
    const json = await this.getHttpResponse().catch((error) => {
      logger.error(`Error occurred while sending request. ${error}`);
    });
    const parsedJson = this.jsonResponseParser(json);
    if (parsedJson.error) {
      logger.error(`Callback query data error: ${parsedJson.error}`);
      return 'Response error';
    }
    return serializerArrayOfObjects(parsedJson.weather);
  }
}

module.exports = Weather;
