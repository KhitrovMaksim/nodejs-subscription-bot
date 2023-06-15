const getCronJobString = (timeIn24HoursFormat) => {
  const [hours, minutes] = timeIn24HoursFormat.split(':');
  return `0 ${minutes} ${hours} * * *`;
};

module.exports = getCronJobString;
