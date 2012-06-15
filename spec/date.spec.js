var TestUtils = require('./test-utils')
  , timezoneJS = TestUtils.getTimezoneJS();

describe('timezoneJS.Date', function () {
  it('should have correct format when initialized', function () {
    var date = new timezoneJS.Date();
    expect(date.toString()).toMatch(/[\d]{4}(-[\d]{2}){2} ([\d]{2}:){2}[\d]{2}/);
  });

  it('should format string correctly in toISOString', function () {
    var date = new timezoneJS.Date();
    expect(date.toISOString()).toMatch(/[\d]{4}(-[\d]{2}){2}T([\d]{2}:){2}[\d]{2}.[\d]{3}/);
  });

  it('should get date correctly from UTC (2011-10-28T12:44:22.172000000)', function () {
    var date = new timezoneJS.Date(2011,9,28,12,44,22,172,'Etc/UTC');
    expect(date.getTime()).toEqual(1319805862172);
    expect(date.toString()).toEqual('2011-10-28 12:44:22');
    expect(date.toString('yyyy-MM-dd')).toEqual('2011-10-28');
  });

  it('should format 2011-10-28T12:44:22.172 UTC to different formats correctly', function () {
    var date = new timezoneJS.Date(2011,9,28,12,44,22,172,'Etc/UTC');
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
     var date = new timezoneJS.Date(2011,1,28,12,44,22,172,'Etc/UTC');
     date.setTimezone('America/Los_Angeles');
     expect(date.toString('MMM dd yyyy HH:mm:ss k Z')).toEqual('Feb 28 2011 04:44:22 AM PST');
     expect(date.getTime()).toEqual(1298897062172);
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

  it('should take in millis and tz as constructor', function () {
    var dtA = new Date(0)
      , dt = new timezoneJS.Date(dtA.getTime(), 'Asia/Bangkok');

    expect(dt.getTime()).toEqual(-7 * 3600 * 1000);
  });

  it('should take in Date object as constructor', function () {
    var dtA = new Date(0)
      , dt = new timezoneJS.Date(dtA, 'Asia/Bangkok');

    expect(dt.getTime()).toEqual(-7 * 3600 * 1000);
  });

  it('should take in String and Asia/Bangkok as constructor', function () {
    var dt = new timezoneJS.Date('2012-01-01T15:00:00.000', 'Asia/Bangkok');

    expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'America/New_York')).toEqual('2012-01-01T03:00:00.000');
  });

  it('should take in String and Etc/UTC as constructor', function () {
    var dt = new timezoneJS.Date('2012-01-01T15:00:00.000', 'Etc/UTC');

    expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'America/New_York')).toEqual('2012-01-01T10:00:00.000');
  });

  it('should take in String as constructor', function () {
    var dtA = new Date()
      , dt = new timezoneJS.Date(dtA.toJSON());

    expect(dt.toJSON()).toEqual(dtA.toJSON());
  });


  it('should be able to set hours', function () {
    var dtA = new Date(0)
      , dt = new timezoneJS.Date(0, 'Etc/UTC');

    dt.setHours(6);
    expect(dt.getHours()).toEqual(6);
  });

  it('should be able to set date without altering others', function () {
    var dt = new timezoneJS.Date('America/New_York');

    var hours = dt.getHours();
    dt.setDate(1);
    expect(dt.getHours()).toEqual(hours);
  });

  //Will have to fix this. Disabled for now
  /*
  it('should adjust daylight saving correctly', function () {
    var dt1 = new timezoneJS.Date('2012-03-11 02:00:00', 'America/New_York');
    expect(dt1.getTimezoneAbbreviation()).toEqual('EDT');
    dt1 = new timezoneJS.Date('2012-03-11 01:59:59', 'America/New_York');
    expect(dt1.getTimezoneAbbreviation()).toEqual('EST');
  });
 */

  it('should be able to clone itself', function () {
    var dt = new timezoneJS.Date(0, 'America/Chicago')
      , dtA = dt.clone();

    expect(dt.getTime()).toEqual(dtA.getTime());
    expect(dt.toString()).toEqual(dtA.toString());
    expect(dt.getTimezoneOffset()).toEqual(dtA.getTimezoneOffset());
    expect(dt.getTimezoneAbbreviation()).toEqual(dtA.getTimezoneAbbreviation());
  });


});
