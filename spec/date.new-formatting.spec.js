var TestUtils = require('./test-utils');
var timezoneJS = TestUtils.getTimezoneJS({
  newFormatting: {
    enabled: true
  }
});
function createDate(year, month, day, hour, minute, timeZoneName) {
  month = month - 1; //because month in timezoneJS begins from 0
  var date = new timezoneJS.Date(year, month, day, hour, minute, 0, 0, timeZoneName);
  return date;
}
var TZ_GMT = "Etc/GMT+1";
var TZ_EUROPE_MOSCOW = "Europe/Moscow";
var DEFAULT_MASK = "dd.MM.yyyy HH:mm:ss.SSS";
var DEFAULT_DATE = createDate(2015, 12, 14, 8, 20, TZ_EUROPE_MOSCOW);
var DEFAULT_DATE_AS_STRING = "14.12.2015 08:20:00.000";

describe('timezoneJS.Date new formatting', function () {
  it('new formatting code should not impact not changed part of formatting code', function () {
    expect(DEFAULT_DATE.toString(DEFAULT_MASK)).toEqual(DEFAULT_DATE_AS_STRING);
  });

  it('time zone literals (z, Z, X)', function () {
    var tzLiterals = ["z", "zz", "zzz", "zzzz", "Z", "ZZ", "X", "XX", "XXX", "XXXX"];
    var tzERs = ["MSK", "MSK", "MSK", TZ_EUROPE_MOSCOW, "+0300", "+0300", "+03", "+0300", "+03:00", "+03:00"];
    for (var i = 0; i < tzLiterals.length; ++i) {
      expect(DEFAULT_DATE.toString(DEFAULT_MASK + " " + tzLiterals[i])).toEqual(DEFAULT_DATE_AS_STRING + " " + tzERs[i]);
    }
  });

  it('time zone literals (z, Z, X) in case of GMT', function () {
    var date = createDate(2015, 12, 14, 8, 20, TZ_GMT)
    var tzLiterals = ["z", "zz", "zzz", "zzzz", "Z", "ZZ", "X", "XX", "XXX", "XXXX"];
    var tzERs = ["GMT+1", "GMT+1", "GMT+1", TZ_GMT, "+0100", "+0100", "+01", "+0100", "+01:00", "+01:00"];
    for (var i = 0; i < tzLiterals.length; ++i) {
      expect(date.toString(DEFAULT_MASK + " " + tzLiterals[i])).toEqual(DEFAULT_DATE_AS_STRING + " " + tzERs[i]);
    }
  });

  it("user should not add non date literals outside of ''", function () {
    expect(function(){DEFAULT_DATE.toString(DEFAULT_MASK + " q")})
      .toThrow(new Error("Illegal format \"" + DEFAULT_MASK + " q" + "\". It contains non date literals (" + "q" + ") outside of ''"));
  });

  it("escaping text in ''", function () {
    expect(DEFAULT_DATE.toString(DEFAULT_MASK + "'escape text'")).toEqual(DEFAULT_DATE_AS_STRING + "escape text");
    expect(DEFAULT_DATE.toString(DEFAULT_MASK + "'a''''b''c'")).toEqual(DEFAULT_DATE_AS_STRING + "a''b'c");
    expect(DEFAULT_DATE.toString(DEFAULT_MASK + "'zzz'")).toEqual(DEFAULT_DATE_AS_STRING + "zzz");
    expect(DEFAULT_DATE.toString(DEFAULT_MASK + " _ __ _")).toEqual(DEFAULT_DATE_AS_STRING + " _ __ _");
  });
});