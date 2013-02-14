var TestUtils = require('./test-utils')
  , parseISO = TestUtils.parseISO
  , date = require('../src/date')
  , timezoneJS = TestUtils.getTimezoneJS({
    defaultZoneFile: 'asia'
  });
describe('TimezoneJS', function () {
  it('should preload everything correctly', function () {
    expect(timezoneJS.timezone.loadingScheme).toEqual(date.timezone.loadingSchemes.LAZY_LOAD);
    expect(timezoneJS.timezone.loadedZones.asia).toBe(true);
    sampleTz = timezoneJS.timezone.getTzInfo(new Date(), 'Asia/Bangkok');
    expect(sampleTz).toBeDefined();
    expect(sampleTz.tzAbbr).toEqual('ICT');
  });
});
