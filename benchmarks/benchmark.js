var timezoneJS = require('../src/date')
  , fs = require('fs');

timezoneJS.timezone.transport = function (opts) {
  // No success handler, what's the point?
  if (opts.async) {
    if (typeof opts.success !== 'function') return;
    opts.error = opts.error || console.error;
    return fs.readFile(opts.url, 'utf8', function (err, data) {
      return err ? opts.error(err) : opts.success(data);
    });
  }
  return fs.readFileSync(opts.url, 'utf8');
};

//Set up again
timezoneJS.timezone.zoneFileBasePath = 'lib/tz';
timezoneJS.timezone.init({ async: false });

console.time('Convert 5000 dates');
var start = Date.now()
, yearToMillis = 5 * 365 * 24 * 3600 * 1000
, date;
for (var i = 0; i < 5000; i++) {
  date = new timezoneJS.Date(start - Math.random() * yearToMillis, 'America/New_York');
  date.setTimezone('Europe/Minsk');
}
console.timeEnd('Convert 5000 dates');

console.time('Get 5000 same tzInfo');
for (var i = 0; i < 5000; i++) {
  timezoneJS.timezone.getTzInfo(new Date(), 'America/Chicago');
}
console.timeEnd('Get 5000 same tzInfo');