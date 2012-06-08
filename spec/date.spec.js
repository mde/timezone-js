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
    var date = new timezoneJS.Date(2011,9,28,12,44,22,172,'Etc/UTC');
    expect(date.toString('MMM dd yyyy', 'America/New_York')).toEqual('Oct 28 2011');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'America/New_York')).toEqual('Oct 28 2011 08:44:22 AM EDT');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'Asia/Shanghai')).toEqual('Oct 28 2011 08:44:22 PM CST');
  });

  it('should format 2011-02-28T12:44:22.172 UTC (before daylight) to different formats and tz correctly', function () {
    var date = new timezoneJS.Date(2011,1,28,12,44,22,172,'Etc/UTC');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'America/New_York')).toEqual('Feb 28 2011 07:44:22 AM EST');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'Indian/Cocos')).toEqual('Feb 28 2011 07:14:22 PM CCT');
  });

  it('should convert dates from UTC to a timezone correctly', function () {
     var date = new timezoneJS.Date(2011,1,28,12,44,22,172,true);
     date.setTimezone('America/Los_Angeles');
     expect(date.toString('MMM dd yyyy HH:mm:ss k Z')).toEqual('Feb 28 2011 04:44:22 AM PST');
     expect(date.getTime()).toEqual(1298897062000);
     expect(date.getHours()).toEqual(4);
  });

  it('should convert dates from a timezone to UTC correctly', function () {
    var date = new timezoneJS.Date(2007, 9, 31, 10, 30, 22, 'America/Los_Angeles');
    date.setTimezone('Etc/GMT');
    expect(date.getTime()).toEqual(1193851822000);
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z')).toEqual('Oct 31 2007 05:30:22 PM UTC');
    expect(date.getHours()).toEqual(17);
  });

  it('should convert dates from one timezone to another correctly', function () {
    var dtA = new timezoneJS.Date(2007, 9, 31, 10, 30, 'America/Los_Angeles');

    dtA.setTimezone('America/Chicago');
    expect(dtA.getTime()).toEqual(1193851800000);
    expect(dtA.toString()).toEqual('2007-10-31 12:30:00');
  });

  it('should convert dates from unix time properly', function () {
    var dtA = new timezoneJS.Date(1193851800000);

    dtA.setTimezone('America/Chicago');
    expect(dtA.getTime()).toEqual(1193851800000);
    expect(dtA.toString()).toEqual('2007-10-31 12:30:00');
  });

  it('should output toISOString correctly', function () {
    var dtA = new Date()
      , dt = new timezoneJS.Date();

    dtA.setTime(dtA.getTime());
    expect(dt.getTime()).toEqual(dtA.getTime());
    expect(dt.toISOString()).toEqual(dtA.toISOString());
  });

  it('should output toGMTString correctly', function () {
    var dtA = new Date()
      , dt = new timezoneJS.Date();

    dtA.setTime(dtA.getTime());
    expect(dt.getTime()).toEqual(dtA.getTime());
    expect(dt.toGMTString()).toEqual(dtA.toGMTString());
  });


  it('should output toJSON correctly', function () {
    var dtA = new Date()
      , dt = new timezoneJS.Date();

    dtA.setTime(dtA.getTime());
    expect(dt.getTime()).toEqual(dtA.getTime());
    expect(dt.toJSON()).toEqual(dtA.toJSON());
  });

  it('should take in millis as constructor', function () {
    var dtA = new Date(0)
      , dt = new timezoneJS.Date(dtA.getTime());

    expect(dt.getTime()).toEqual(dtA.getTime());
    expect(dt.toJSON()).toEqual(dtA.toJSON());
  });

  it('should take in Date object as constructor', function () {
    var dtA = new Date(0)
      , dt = new timezoneJS.Date(dtA);

    expect(dt.getTime()).toEqual(dtA.getTime());
    expect(dt.toJSON()).toEqual(dtA.toJSON());
  });

  it('should take in Date object as constructor', function () {
    var dtA = new Date(0)
      , dt = new timezoneJS.Date(dtA);

    dt.setHours(6);
    expect(dt.getTime()).toEqual(6 * 60000);
  });


});
