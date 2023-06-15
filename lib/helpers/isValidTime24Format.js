// from '00:01' to '23:59'
const isValidTime24Format = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

module.exports = isValidTime24Format;
