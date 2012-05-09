describe('Timezone', function () {

  it('should have correct offsets for Chicago DST', function () {
    var testDstLeap = function (arr) {
      var expectedArr = [360, 300, 300, 360];
      var dt;
      var actual;
      var expected;
      for (var i = 0; i < arr.length; i++) {
        dt = timezoneJS.timezone.getTzInfo(parseISO(arr[i]), 'America/Chicago');
        actual = dt.tzOffset;
        expected = expectedArr[i];
        expect(actual).toEqual(expected);
      }
    }
    
    testDstLeap(['2004-04-04', '2004-04-05', '2004-10-31', '2004-11-01']);
    testDstLeap(['2005-04-03', '2005-04-04', '2005-10-30', '2005-10-31']);
    testDstLeap(['2006-04-02', '2006-04-03', '2006-10-29', '2006-10-30']);
    
    // New DST rules started in 2007
    testDstLeap(['2007-03-11', '2007-03-12', '2007-11-04', '2007-11-05']);
    testDstLeap(['2008-03-09', '2008-03-10', '2008-11-02', '2008-11-03']);
    testDstLeap(['2009-03-08', '2009-03-09', '2009-11-01', '2009-11-02']);
    testDstLeap(['2010-03-14', '2010-03-15', '2010-11-07', '2010-11-08']);
    testDstLeap(['2011-03-13', '2011-03-14', '2011-11-06', '2011-11-07']);
  });
  
  it('should have correct offsets for Sao Paulo', function () {
    // Source: http://www.timeanddate.com/worldclock/clockchange.html?n=233
    
    // Standard: GMT-3 from Feb 16 - Nov 1
    // Daylight: GMT-2 from Nov 2 - Feb 16
    
    var dt;
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2008-02-17'), 'America/Sao_Paulo');
    expect(180).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2008-10-11'), 'America/Sao_Paulo');
    expect(180).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2008-10-19'), 'America/Sao_Paulo');
    expect(120).toEqual(dt.tzOffset);
  });
  
  it('should have correct offsets for Jerusalem', function () {
    // Source: http://www.timeanddate.com/worldclock/city.html?n=110
    // Changes every year!
    
    var dt;
    
    // 2008
    dt = timezoneJS.timezone.getTzInfo(parseISO('2008-03-28T01:59:59'), 'Asia/Jerusalem');
    expect(-120).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2008-03-28T03:00:01'), 'Asia/Jerusalem');
    expect(-180).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2008-10-05T00:59:59'), 'Asia/Jerusalem');
    expect(-180).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2008-10-05T03:00:01'), 'Asia/Jerusalem');
    expect(-120).toEqual(dt.tzOffset);
    
    // 2009
    dt = timezoneJS.timezone.getTzInfo(parseISO('2009-03-27T01:59:59'), 'Asia/Jerusalem');
    expect(-120).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2009-03-27T03:00:01'), 'Asia/Jerusalem');
    expect(-180).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2009-09-27T00:59:59'), 'Asia/Jerusalem');
    expect(-180).toEqual(dt.tzOffset);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2009-09-27T03:00:01'), 'Asia/Jerusalem');
    expect(-120).toEqual(dt.tzOffset);
  });
  
  it('should have correct abbreviations', function () {
    var dt;
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-01-01'), 'Europe/Berlin'); // winter time (CET) for sure
    expect('CET').toEqual(dt.tzAbbr);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-07-01'), 'Europe/Berlin'); // summer time (CEST) for sure
    expect('CEST').toEqual(dt.tzAbbr);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-01-01'), 'Europe/London'); // winter time (GMT) for sure
    expect('GMT').toEqual(dt.tzAbbr);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-07-01'), 'Europe/London'); // summer time (BST) for sure
    expect('BST').toEqual(dt.tzAbbr);
  });
  
  it('should have correct timezones when initializing from local and UTC times', function () {
    var dt;
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-28T01:59:59'), 'Europe/Berlin'); // CET, from local time
    expect('CET').toEqual(dt.tzAbbr);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-28T03:00:00'), 'Europe/Berlin'); // CEST, from local time
    expect('CEST').toEqual(dt.tzAbbr);
  
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-28T00:59:59'), 'Europe/Berlin', true); // CET, from UTC
    expect('CET').toEqual(dt.tzAbbr);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-28T01:00:00'), 'Europe/Berlin', true); // CEST, from UTC
    expect('CEST').toEqual(dt.tzAbbr);
  
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-14T01:59:59'), 'America/Chicago'); // CST, from local time
    expect('CST').toEqual(dt.tzAbbr);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-14T03:00:00'), 'America/Chicago'); // CDT, from local time
    expect('CDT').toEqual(dt.tzAbbr);
  
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-14T07:59:59'), 'America/Chicago', true); // CST, from UTC
    expect('CST').toEqual(dt.tzAbbr);
    
    dt = timezoneJS.timezone.getTzInfo(parseISO('2010-03-14T08:00:00'), 'America/Chicago', true); // CDT, from UTC
    expect('CDT').toEqual(dt.tzAbbr);
  });
  
  it('should convert from UTC to another timezone', function () {
    // Regression test for a bug
    
    var dt = new timezoneJS.Date(2011, 6, 10, 0, 0, 0, 'Etc/UTC')
    expect(dt.getTimezoneOffset()).toBe(0);
    dt.setTimezone('America/Chicago')
    expect(dt.getTimezoneOffset()).toNotBe(0);
  });
  
  it('should correctly offset between two timezones', function() { // This won't pass unless the offsets are reversed ...
     
    var dt = new timezoneJS.Date(2011, 6, 10, 0, 0, 10, 'Etc/UTC')
    var dt2= new timezoneJS.Date(2011, 6, 10, 0, 10, 10, 'Etc/UTC')
    
    dt.convertToTimezone('America/New_York')
    dt2.convertToTimezone('America/Los_Angeles')
    
    expect((dt - dt2) === -10*60*1000).toBe(true) // still only 10 minutes off
    expect((dt.getTimezoneOffset() - dt2.getTimezoneOffset()) === -180).toBe(true) // three hour difference
    
  });

  it('should correctly convert aready converted date', function() { // it should be noop
    var dt = new timezoneJS.Date(2011, 6, 10, 0, 0, 10, 'Etc/UTC');
    dt.convertToTimezone('America/New_York');
    var h = dt.getHours();
    var d = dt.getDay();
    dt.convertToTimezone('America/New_York');

    expect(dt.getHours()).toBe(h)
    expect(dt.getDay()).toBe(d)
  });

});