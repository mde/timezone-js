var fs = require('fs')
  , path = require('path');

namespace('test', function () {

  desc('Sets up tests by downloading the timezone data.');
  task('init', ['updateTzData'], function () {
    complete();
  }, {async: true});

  task('clobberTzData', function () {
    console.log('Removing old timezone data.');
    jake.rmRf('lib/tz');
  });

  desc('Downloads the newest timezone data.');
  task('updateTzData', ['clobberTzData'], function () {
    var cmds = [
      'echo "Downloading new timezone data ..."'
    , 'curl ftp://ftp.iana.org/tz/tzdata-latest.tar.gz ' +
          '-o lib/tz/tzdata-latest.tar.gz'
    , 'echo "Expanding archive ..."'
    , 'tar -xvvzf lib/tz/tzdata-latest.tar.gz -C lib/tz'
    ];
    jake.mkdirP('lib/tz');
    jake.exec(cmds, function () {
      console.log('Retrieved new timezone data');
      complete();
    }, {printStdout: true});
  }, {async: true});

  task('run', function () {
    if (!path.existsSync('lib/tz')) {
      fail('No timezone data. Please run "jake test:init".');
    }
    jake.exec(['jasmine-node spec'], function () {
      complete();
    }, {printStdout: true});

  }, {async: true});

});

desc('Runs the Jake tests.');
task('test', ['test:run'], function () {});

namespace('doc', function () {
  task('generate', ['doc:clobber'], function () {
    fail('Not implemented');
    /*
    var cmd = '../node-jsdoc-toolkit/app/run.js -n -r=100 ' +
        '-t=../node-jsdoc-toolkit/templates/codeview -d=./doc/ ./lib';
    console.log('Generating docs ...');
    jake.exec([cmd], function () {
      console.log('Done.');
      complete();
    });
    */
  }, {async: true});

  task('clobber', function () {
    var cmd = 'rm -fr ./doc/*';
    jake.exec([cmd], function () {
      console.log('Clobbered old docs.');
      complete();
    });
  }, {async: true});

});

desc('Generate docs for Jake');
task('doc', ['doc:generate']);

var p = new jake.NpmPublishTask('timezone-js', [
  'Jakefile'
, 'README.md'
, 'package.json'
, 'spec/*'
, 'src/*'
]);

jake.Task['npm:definePackage'].invoke();

