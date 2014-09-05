var TestUtils = require('./test-utils')
, timezoneJS = TestUtils.getTimezoneJS();

describe('timezoneJS.Date', function () {
  it('should correctly trim dates when date exceeds format length', function () {
    var date = new timezoneJS.Date(2011, 10, 22);
    expect(date.toString('yy-MM-dd')).toEqual('11-11-22')
  });

  it('should correctly pad dates when date is shorter than the format length', function () {
    var date = new timezoneJS.Date(2011, 3, 2);
    expect(date.toString('yyyy-MM-dd')).toEqual('2011-04-02')
  });

  it('should have correct format when initialized', function () {
    var date = new timezoneJS.Date();
    expect(date.toString()).toMatch(/[\d]{4}(-[\d]{2}){2}T([\d]{2}:){2}[\d]{2}.[\d]{3}/);
  });

  it('should have handled March correctly (not replacing h) when initialized', function () {
    var date = new timezoneJS.Date(2011, 2, 2, 11, 1, 1, 'Etc/UTC');
    expect(date.toString('MMMM')).toEqual('March');
  });

  it('should format string correctly in toISOString', function () {
    var date = new timezoneJS.Date();
    expect(date.toISOString()).toMatch(/[\d]{4}(-[\d]{2}){2}T([\d]{2}:){2}[\d]{2}.[\d]{3}/);
  });

  it('should get date correctly from UTC (2011-10-28T12:44:22.172000000)', function () {
    var date = new timezoneJS.Date(2011, 9, 28, 12, 44, 22, 172,'Etc/UTC');
    expect(date.getTime()).toEqual(1319805862172);
    expect(date.toString()).toEqual('2011-10-28T12:44:22.172');
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

  it('should format the Unix Epoch UTC to different formats and tz correctly', function () {
    var date = new timezoneJS.Date(1970,0,1,0,0,0,0,'Etc/UTC');
    expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'Europe/Kaliningrad')).toEqual('Jan 01 1970 03:00:00 AM MSK');
  });

  it('should use a default format with the given tz', function () {
    var date = new timezoneJS.Date(2012, 7, 30, 10, 56, 0, 0, 'America/Los_Angeles');
    expect(date.toString(null, 'Etc/UTC')).toEqual(date.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'Etc/UTC'));
    expect(date.toString(null, 'America/New_York')).toEqual(date.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'America/New_York'));
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
    expect(dtA.toString()).toEqual('2007-10-31T12:30:00.000');
  });

  it('should convert dates from unix time properly', function () {
    var dtA = new timezoneJS.Date(1193851800000);

    dtA.setTimezone('America/Chicago');
    expect(dtA.getTime()).toEqual(1193851800000);
    expect(dtA.toString()).toEqual('2007-10-31T12:30:00.000');
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

    expect(dt.getTime()).toEqual(0);
  });

  it('should take in Date object as constructor', function () {
    var dtA = new Date(0)
    , dt = new timezoneJS.Date(dtA, 'Asia/Bangkok');

    expect(dt.getTime()).toEqual(0);
  });

  it('should take in String and Asia/Bangkok as constructor', function () {
    //This is a RFC 3339 UTC string format
    var dt = new timezoneJS.Date('2012-01-01T15:00:00.000', 'Asia/Bangkok');

    expect(dt.toString()).toEqual('2012-01-01T22:00:00.000');
    expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'America/New_York')).toEqual('2012-01-01T10:00:00.000');
    expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS')).toEqual('2012-01-01T22:00:00.000');
  });

  it('should take in String and Etc/UTC as constructor', function () {
    var dt = new timezoneJS.Date('2012-01-01T15:00:00.000', 'Etc/UTC');

    expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'America/New_York')).toEqual('2012-01-01T10:00:00.000');
    expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS')).toEqual('2012-01-01T15:00:00.000');

  });

  it('should take in String (other format) and Etc/UTC as constructor', function () {
    var dt = new timezoneJS.Date('2013/06/18 10:37', 'Etc/UTC');

    expect(dt.toString('yyyy/MM/dd HH:mm', 'America/Los_Angeles')).toEqual('2013/06/18 03:37');
  });

  it('should take in String (other format) and Europe/Athens as constructor', function () {
    var dt = new timezoneJS.Date('2013/06/18 10:37', 'Europe/Athens');

    expect(dt.toString('yyyy/MM/dd HH:mm', 'America/Los_Angeles')).toEqual('2013/06/18 00:37');
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
    var dt = new timezoneJS.Date(2012, 2, 2, 5, 0, 0, 0, 'America/Los_Angeles')
    , dt2 = new timezoneJS.Date(2011, 4, 15, 23, 0, 0, 0, 'Asia/Bangkok');

    var hours = dt.getHours();
    dt.setDate(1);
    expect(dt.getHours()).toEqual(hours);

    hours = dt2.getHours();
    dt2.setDate(2);
    expect(dt2.getHours()).toEqual(hours);
  });

  it('should be able to set UTC date without altering others', function () {
    var dt = new timezoneJS.Date(2012, 2, 2, 5, 0, 0, 0, 'America/Los_Angeles');

    var hours = dt.getUTCHours();
    dt.setUTCDate(1);
    expect(dt.getUTCHours()).toEqual(hours);
  });


  it('should adjust daylight saving correctly', function () {
    var dt1 = new timezoneJS.Date(2012, 2, 11, 3, 0, 0, 'America/Chicago');
    expect(dt1.getTimezoneAbbreviation()).toEqual('CDT');
    expect(dt1.getTimezoneOffset()).toEqual(300);
    var dt2 = new timezoneJS.Date(2012, 2, 11, 1, 59, 59, 'America/Chicago');

    expect(dt2.getTimezoneAbbreviation()).toEqual('CST');
    expect(dt2.getTimezoneOffset()).toEqual(360);
  });

  it('should be able to clone itself', function () {
    var dt = new timezoneJS.Date(0, 'America/Chicago')
    , dtA = dt.clone();

    expect(dt.getTime()).toEqual(dtA.getTime());
    expect(dt.toString()).toEqual(dtA.toString());
    expect(dt.getTimezoneOffset()).toEqual(dtA.getTimezoneOffset());
    expect(dt.getTimezoneAbbreviation()).toEqual(dtA.getTimezoneAbbreviation());
  });

  it('should output 1955-10-30 00:00:00 America/New_York as EDT', function () {
    var dt = new timezoneJS.Date(1955, 9, 30, 0, 0, 0, 'America/New_York');
    expect(dt.getTimezoneOffset()).toEqual(240);
  });

  it('should handle Pacific/Apia correctly', function () {
    var dt = new timezoneJS.Date(2011, 11, 29, 23, 59, 59, 'Pacific/Apia');
    var t = dt.getTime() + 1000;
    dt.setTime(t);
    expect(dt.toString()).toEqual('2011-12-31T00:00:00.000');
    expect(dt.getTime()).toEqual(t);
  });

  // Years
  it("accepts an optional parameter for month in setUTCFullYear", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCMonth()).toEqual(11);
    expect(date.getUTCDate()).toEqual(31);
    date.setUTCFullYear(2012, 1);
    //Febuary does not have a 31st, thus we should wrap to march
    expect(date.getUTCMonth()).toEqual(2);
    expect(date.getUTCDate()).toEqual(2);
  });

  it("accepts a second optional parameter for date in setUTCFullYear", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCMonth()).toEqual(11);
    expect(date.getUTCDate()).toEqual(31);
    date.setUTCFullYear(2012, 1, 1);
    //Do not wrap to March because we are setting the date as well
    expect(date.getUTCMonth()).toEqual(1);
    expect(date.getUTCDate()).toEqual(1);
  });

  it("accepts an optional parameter for month in setFullYear", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(31);
    date.setFullYear(2012, 1);
    //Febuary does not have a 31st, thus we should wrap to march
    expect(date.getMonth()).toEqual(2);
    expect(date.getDate()).toEqual(2);
  });

  it("accepts a second optional parameter for date in setFullYear", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(31);
    date.setFullYear(2012, 1, 1);
    //Do not wrap to March because we are setting the date as well
    expect(date.getMonth()).toEqual(1);
    expect(date.getDate()).toEqual(1);
  });

  // Months
  it("accepts an optional parameter for date in setUTCMonths", function() {
    var date = new timezoneJS.Date(2000, 7, 14, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCMonth()).toEqual(7);
    expect(date.getUTCDate()).toEqual(14);
    date.setUTCMonth(1, 5);
    expect(date.getUTCMonth()).toEqual(1);
    expect(date.getUTCDate()).toEqual(5);
    date.setUTCMonth(0, 0);
    expect(date.getUTCMonth()).toEqual(11);
    expect(date.getUTCDate()).toEqual(31);
  });

  it("accepts an optional parameter for date in setMonths", function() {
    var date = new timezoneJS.Date(2000, 7, 14, 0, 0, 0, "America/New_York");
    expect(date.getMonth()).toEqual(7);
    expect(date.getDate()).toEqual(14);
    date.setMonth(1, 5);
    expect(date.getMonth()).toEqual(1);
    expect(date.getDate()).toEqual(5);
    date.setMonth(0, 0);
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(31);
  });

  // Hours
  it("accepts an optional parameter for minutes in setUTCHours", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCMinutes()).toEqual(0);
    date.setUTCHours(0, 1);
    expect(date.getUTCMinutes()).toEqual(1);
    date.setUTCHours(0, 0);
    expect(date.getUTCMinutes()).toEqual(0);
  });

  it("accepts an optional parameter for seconds in setUTCHours", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCSeconds()).toEqual(0);
    date.setUTCHours(0, 1, 2);
    expect(date.getUTCSeconds()).toEqual(2);
    date.setUTCHours(0, 0, 0);
    expect(date.getUTCSeconds()).toEqual(0);
  });

  it("accepts an optional parameter for milliseconds in setUTCHours", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCMilliseconds()).toEqual(0);
    date.setUTCHours(0, 1, 2, 3);
    expect(date.getUTCMilliseconds()).toEqual(3);
    date.setUTCHours(0, 0, 0, 0);
    expect(date.getUTCMilliseconds()).toEqual(0);
  });

  it("accepts an optional parameter for minutes in setHours", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getMinutes()).toEqual(0);
    date.setHours(0, 1);
    expect(date.getMinutes()).toEqual(1);
    date.setHours(0, 0);
    expect(date.getMinutes()).toEqual(0);
  });

  it("accepts an optional parameter for seconds in setHours", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getSeconds()).toEqual(0);
    date.setHours(0, 1, 2);
    expect(date.getSeconds()).toEqual(2);
    date.setHours(0, 0, 0);
    expect(date.getSeconds()).toEqual(0);
  });

  it("accepts an optional parameter for milliseconds in setHours", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getMilliseconds()).toEqual(0);
    date.setHours(0, 1, 2, 3);
    expect(date.getMilliseconds()).toEqual(3);
    date.setHours(0, 0, 0, 0);
    expect(date.getMilliseconds()).toEqual(0);
  });

  // Minutes
  it("accepts an optional parameter for seconds in setUTCMinutes", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCSeconds()).toEqual(0);
    date.setUTCMinutes(0, 1);
    expect(date.getUTCSeconds()).toEqual(1);
    date.setUTCMinutes(0, 0);
    expect(date.getUTCSeconds()).toEqual(0);
  });

  it("accepts an optional parameter for milliseconds in setUTCMinutes", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCMilliseconds()).toEqual(0);
    date.setUTCMinutes(0, 1, 2);
    expect(date.getUTCMilliseconds()).toEqual(2);
    date.setUTCMinutes(0, 0, 0);
    expect(date.getUTCMilliseconds()).toEqual(0);
  });

  it("accepts an optional parameter for seconds in setMinutes", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getSeconds()).toEqual(0);
    date.setMinutes(0, 1);
    expect(date.getSeconds()).toEqual(1);
    date.setMinutes(0, 0);
    expect(date.getSeconds()).toEqual(0);
  });

  it("accepts an optional parameter for milliseconds in setMinutes", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getMilliseconds()).toEqual(0);
    date.setMinutes(0, 1, 2);
    expect(date.getMilliseconds()).toEqual(2);
    date.setMinutes(0, 0, 0);
    expect(date.getMilliseconds()).toEqual(0);
  });

  // Seconds
  it("accepts an optional parameter for milliseconds in setUTCSeconds", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "Etc/UTC");
    expect(date.getUTCMilliseconds()).toEqual(0);
    date.setUTCSeconds(0, 1);
    expect(date.getUTCMilliseconds()).toEqual(1);
    date.setUTCSeconds(0, 0);
    expect(date.getUTCMilliseconds()).toEqual(0);
  });

  it("accepts an optional parameter for milliseconds in setSeconds", function() {
    var date = new timezoneJS.Date(2000, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getMilliseconds()).toEqual(0);
    date.setSeconds(0, 1);
    expect(date.getMilliseconds()).toEqual(1);
    date.setSeconds(0, 0);
    expect(date.getMilliseconds()).toEqual(0);
  });


  it("handles static dst offsets in Zones like '1:00' instead of DST rule references.", function(){
    var date = new timezoneJS.Date(Date.UTC(2012, 2, 1, 0, 0, 0, 0), "Pacific/Apia");
    expect(date.getTimezoneOffset()).toBe(-840);
    expect(date.toString("yyyy-MM-dd HH:mm:ss Z")).toBe("2012-03-01 14:00:00 WSDT");
  });

  it("returns the milis value for setTime", function() {
    var date = new timezoneJS.Date("America/New_York");
    expect(date.setTime(123456789)).toEqual(123456789);
  });

  it("returns the milis value for every set* command", function() {
    milis = 1193851822000
    var date = new timezoneJS.Date(milis, "America/New_York");
    expect(date.setFullYear(date.getFullYear())).toEqual(milis);
    expect(date.setMonth(date.getMonth())).toEqual(milis);
    expect(date.setDate(date.getDate())).toEqual(milis);
    expect(date.setHours(date.getHours())).toEqual(milis);
    expect(date.setMinutes(date.getMinutes())).toEqual(milis);
    expect(date.setSeconds(date.getSeconds())).toEqual(milis);
    expect(date.setMilliseconds(date.getMilliseconds())).toEqual(milis);
  });

  it("returns the milis value for every setUTC* command", function() {
    milis = 1193851822000
    var date = new timezoneJS.Date(milis, "America/New_York");
    expect(date.setUTCFullYear(date.getUTCFullYear())).toEqual(milis);
    expect(date.setUTCMonth(date.getUTCMonth())).toEqual(milis);
    expect(date.setUTCDate(date.getUTCDate())).toEqual(milis);
    expect(date.setUTCHours(date.getUTCHours())).toEqual(milis);
    expect(date.setUTCMinutes(date.getUTCMinutes())).toEqual(milis);
    expect(date.setUTCSeconds(date.getUTCSeconds())).toEqual(milis);
    expect(date.setUTCMilliseconds(date.getUTCMilliseconds())).toEqual(milis);
  });

  it("handles getYear appropriately strangely (to spec)", function() {
    // http://www.ecma-international.org/ecma-262/5.1/#sec-B.2.4
    var date = new timezoneJS.Date(1998, 11, 31, 0, 0, 0, "America/New_York");
    expect(date.getYear()).toEqual(98);
    date.setFullYear(2013);
    expect(date.getYear()).toEqual(113);
  });

  it("handles setYear appropriately strangely (to spec)", function() {
    // http://www.ecma-international.org/ecma-262/5.1/#sec-B.2.5
    var date = new timezoneJS.Date(2001, 11, 31, 0, 0, 0, "America/New_York");
    date.setYear(98)
    expect(date.getFullYear()).toEqual(1998);
    date.setYear(2003);
    expect(date.getFullYear()).toEqual(2003);
  });

  it('Represents hours in 24 hour format', function () {
    for (var i = 0; i < 24; i ++) {
      var time_value = new timezoneJS.Date(2013, 1, 1, i, 0, 0, 0, "America/Chicago");
      expect(time_value.toString("H")).toEqual(i.toString());
    }
  });

  xit('Represents hours in 12 hour format by k side effect', function () {
    for (var i = 0; i < 24; i ++) {
      var ampm  =  i >= 12 ? "PM" : "AM";
      var hour = (i % 12);
      hour = (hour === 0) ? '12' : hour.toString();
      zhour = hour > 9 ? hour.toString() : '0' + hour;

      var time_value = new timezoneJS.Date(2013, 1, 1, i, 0, 0, 0, "America/Chicago");
      expect(time_value.toString("H k")).toEqual(hour + " " + ampm);
      expect(time_value.toString("HH k")).toEqual(zhour + " " + ampm);
    }
  });

  it('Represents hours in single digit 12 hour format', function () {
    for (var i = 0; i < 24; i ++) {
      var ampm  =  i >= 12 ? "PM" : "AM";
      var hour = (i % 12);
      hour = (hour === 0) ? '12' : hour.toString();
      zhour = hour > 9 ? hour.toString() : '0' + hour;

      var time_value = new timezoneJS.Date(2013, 1, 1, i, 0, 0, 0, "America/Chicago");
      expect(time_value.toString("h k")).toEqual(hour + " " + ampm);
      expect(time_value.toString("hh k")).toEqual(zhour + " " + ampm);
    }
  });

  it('should throw an exception when initialized without "new"', function () {
    var init = function() {
      var date = timezoneJS.Date();
    };
    expect(init).toThrow();
  });

  it('should throw an exception when initialized with another Date when missing "new"', function () {
    var d = new timezoneJS.Date();
    var init = function() {
      var k = timezoneJS.Date(d);
    };
    expect(init).toThrow();
  });

  it('should take in year and month as constructor correctly', function () {
    var d = new timezoneJS.Date( 2011, 8, "Etc/UTC");
    expect( d.getMonth()).toEqual(8);
  });

  it('should format string correctly in toDateString', function () {
    var date = new timezoneJS.Date();
    expect(date.toDateString()).toMatch(/^[\w]{3}[\s][\w]{3}[\s][\d]{2}[\s][\d]{4}$/);
  });

  it('should correctly convert date in toDateString', function () {
    var date = new timezoneJS.Date(2011, 3, 2);
    expect(date.toDateString()).toEqual('Sat Apr 02 2011');
  });

  it('should format string correctly in toTimeString', function () {
    var date = new timezoneJS.Date();
    expect(date.toTimeString()).toMatch(/^[\d]{1,2}:[\d]{2}[\s][\w]{2}$/);
  });

  it('should correctly convert date to time in toTimeString', function () {
    var date = new timezoneJS.Date(2011, 3, 2);
    expect(date.toTimeString()).toEqual('0:00 AM');
  });

  it('should work with timezones containing - symbol', function () {
    var d = new timezoneJS.Date(0, "Etc/GMT-5");
    expect(d.getMonth().toString()).not.toEqual('NaN');
  });

  it('should return timezoneOffset as number', function () {
    expect(new timezoneJS.Date(2014, 1, 1, 2, 0, 0, 0, 'Asia/Kolkata').getTimezoneOffset()).toEqual(-330);
  });
});
