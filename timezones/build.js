var fs = require('fs');
var path = require('path');

var tz = {zones: {}, rules: {}};

var stdout = process.stdout;
var stdin = process.openStdin();
var stdio = process.binding('stdio');
stdio.setRawMode();

stdout.write('Enter a comma separated list of zones.\n')
stdout.write('Example: africa, northamerica\n')
stdout.write('Enter zones: ')

var zoneStr = ''
stdin.on('data', function (c) {
  c = c + '';
  switch (c) {
    case '\n': case '\r': case '\u0004':
      stdio.setRawMode(false);
      stdout.write('\n');
      stdin.pause();
      parseZone(zoneStr.split(','));
      break;
    case '\u0003':
      process.exit();
      break;
    default:
      stdout.write(c);
      zoneStr += c;
      break;
  }
});

function parseZone(zones) {
  var zone = zones.pop();
  zone = zone.replace(/^\s*/, '').replace(/\s*$/, '');
  console.log(zone);
  fs.readFile(path.join('olson_data', zone), 'ascii', function(err, str) {
    if (err) {
      console.log('Error: could not read from zone.');
      process.exit();
    } else {
      var s = '';
      var lines = str.split('\n');
      var arr = [];
      var chunk = '';
      var zone = null;
      var rule = null;
      for (var i = 0; i < lines.length; i++) {
        l = lines[i];
        if (l.match(/^\s/)) {
          l = "Zone " + zone + l;
        }
        l = l.split("#")[0];
        if (l.length > 3) {
          arr = l.split(/\s+/);
          chunk = arr.shift();
          switch(chunk) {
            case 'Zone':
              zone = arr.shift();
              if (!tz.zones[zone]) { tz.zones[zone] = [] }
              tz.zones[zone].push(arr);
              break;
            case 'Rule':
              rule = arr.shift();
              if (!tz.rules[rule]) { tz.rules[rule] = [] }
              tz.rules[rule].push(arr);
              break;
            case 'Link':
              // No zones for these should already exist
              if (tz.zones[arr[1]]) {
                console.log('Error: link '+arr[1]);
                process.exit();
              }
              // Create the link
              tz.zones[arr[1]] = arr[0];
              break;
            case 'Leap':
              break;
            default:
              // Fail silently
              break;
          }
        }
      }    
    }
    if (zones.length) {
      parseZone(zones);
    } else {
      fs.readFile(path.join('..', 'src', 'date.js'), 'ascii', function(err, str) {
        if (err) {
          console.log('Error: could not read from date.js source file.');
          process.exit();
        } else {
          str += '\n';
          str += '// Timezone data for: '+zoneStr+'\n';
          str += 'timezoneJS.timezone.zones = '+JSON.stringify(tz.zones)+';\n';
          str += 'timezoneJS.timezone.rules = '+JSON.stringify(tz.rules)+';\n';
          fs.writeFile('../build/timezone.js', str, function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log('Custom timezone build written to build/timezone.js');
            }
          });
        }
      });
    }
  });
}
