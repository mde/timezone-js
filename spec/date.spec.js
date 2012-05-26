var TestUtils = require('./test-utils')
  , timezoneJS = TestUtils.getTimezoneJS();

describe('timezoneJS.Date', function () {
  it('should have correct format when initialized', function () {
    var date = new timezoneJS.Date();
    expect(date.toString()).toMatch(/[\d]{4}(-[\d]{2}){2} ([\d]{2}:){2}[\d]{2}/);
  });

  it('should format string correctly in toString', function () {
    var date = new timezoneJS.Date();
    expect(date.toISOString()).toMatch(/[\d]{4}(-[\d]{2}){2}T([\d]{2}:){2}[\d]{2}.[\d]{3}/);
  });

  it('should get date correctly from UTC (2011-10-28T12:44:22.172000000)', function () {
    var date = new timezoneJS.Date(2011,9,28,12,44,22,172,true);
    expect(date.getTime()).toEqual(1319805862000);
    expect(date.toString()).toEqual('2011-10-28 12:44:22');
    expect(date.toString('yyyy-MM-dd')).toEqual('2011-10-28');
  });

  it('should format 2011-10-28T12:44:22.172 UTC to different formats correctly', function () {
    var date = new timezoneJS.Date(2011,9,28,12,44,22,172,true);
    expect(date.toString('MMM dd yyyy')).toEqual('Oct 28 2011');
    expect(date.toString('MMM dd yyyy HH:mm:ss k')).toEqual('Oct 28 2011 12:44:22 PM');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z')).toEqual('Oct 28 2011 12:44:22 PM UTC');
  });

  it('should format 2011-10-28T12:44:22.172 UTC to different formats and tz correctly', function () {
    var date = new timezoneJS.Date(2011,9,28,12,44,22,172,true);
    expect(date.toString('MMM dd yyyy', 'America/New_York')).toEqual('Oct 28 2011');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'America/New_York')).toEqual('Oct 28 2011 08:44:22 AM EDT');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'Asia/Bangkok')).toEqual('Oct 28 2011 07:44:22 PM ICT');
  });

  it('should format 2011-02-28T12:44:22.172 UTC (before daylight) to different formats and tz correctly', function () {
    var date = new timezoneJS.Date(2011,1,28,12,44,22,172,true);
    expect(date.toString('MMM dd yyyy', 'America/New_York')).toEqual('Feb 28 2011');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'America/New_York')).toEqual('Feb 28 2011 07:44:22 AM EST');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'Asia/Bangkok')).toEqual('Feb 28 2011 07:44:22 PM ICT');
  });
});
