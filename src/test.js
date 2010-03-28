
fleegixMain.test_fleegixDateDate = new function () {
  this.test_americaChicagoDST = function () {
      var testDstLeap = function (arr) {
        var expectedArr = [360, 300, 300, 360];
        var dt;
        var actual;
        var expected;
        for (var i = 0; i < arr.length; i++) {
          dt = new fleegix.date.Date(arr[i], 'America/Chicago');
          actual = dt.getTimezoneOffset();
          expected = expectedArr[i];
          jum.assertEquals(expected, actual);
        }
      };
      testDstLeap(['04/04/2004', '04/05/2004', '10/31/2004', '11/01/2004']);
      testDstLeap(['04/03/2005', '04/04/2005', '10/30/2005', '10/31/2005']);
      testDstLeap(['04/02/2006', '04/03/2006', '10/29/2006', '10/30/2006']);
      // 2007 -- new DST rules start here
      testDstLeap(['03/11/2007', '03/12/2007', '11/04/2007', '11/05/2007']);
      testDstLeap(['03/09/2008', '03/10/2008', '11/02/2008', '11/03/2008']);
      testDstLeap(['03/08/2009', '03/09/2009', '11/01/2009', '11/02/2009']);
      testDstLeap(['03/14/2010', '03/15/2010', '11/07/2010', '11/08/2010']);
      testDstLeap(['03/13/2011', '03/14/2011', '11/06/2011', '11/07/2011']);
  };
  this.test_SaoPaulo = function () {
    // Source: http://www.timeanddate.com/worldclock/clockchange.html?n=233
    // Standard: GMT-3 from Feb 16 - Nov 1
    // Daylight: GMT-2 from Nov 2 - Feb 16
    var dt;
    // 2008
    //dt = new fleegix.date.Date('02/16/2008', 'America/Sao_Paulo');
    //jum.assertEquals(120, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('02/17/2008', 'America/Sao_Paulo');
    jum.assertEquals(180, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('10/11/2008', 'America/Sao_Paulo');
    jum.assertEquals(180, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('10/12/2008', 'America/Sao_Paulo');
    jum.assertEquals(120, dt.getTimezoneOffset());
  };
  this.test_Jerusalem = function () {
    // Source: http://www.timeanddate.com/worldclock/city.html?n=110
    // Changes every year!
    var dt;
    // 2008
    dt = new fleegix.date.Date('03/28/2008 01:59:59', 'Asia/Jerusalem');
    jum.assertEquals(-120, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('03/28/2008 03:00:01', 'Asia/Jerusalem');
    jum.assertEquals(-180, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('10/05/2008 00:59:59', 'Asia/Jerusalem');
    jum.assertEquals(-180, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('10/05/2008 03:00:01', 'Asia/Jerusalem');
    jum.assertEquals(-120, dt.getTimezoneOffset());
    // 2009
    dt = new fleegix.date.Date('03/27/2009 01:59:59', 'Asia/Jerusalem');
    jum.assertEquals(-120, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('03/27/2009 03:00:01', 'Asia/Jerusalem');
    jum.assertEquals(-180, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('09/27/2009 00:59:59', 'Asia/Jerusalem');
    jum.assertEquals(-180, dt.getTimezoneOffset());
    dt = new fleegix.date.Date('09/27/2009 03:00:01', 'Asia/Jerusalem');
    jum.assertEquals(-120, dt.getTimezoneOffset());
  };

};

