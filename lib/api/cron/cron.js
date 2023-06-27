const { CronJob } = require('cron');
const getCronJobString = require('../../helpers/time24formatToCron');

class Cron {
  constructor(time, job) {
    this.time = getCronJobString(time);
    this.job = job;
    this.cron = new CronJob(this.time, this.job, null, false, null, null, null, 0);
  }

  startJob() {
    this.cron.start();
  }
}

module.exports = Cron;
