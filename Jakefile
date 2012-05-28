var fs = require('fs')
  , path = require('path');

desc('Runs the Jake tests.');
task('test', function () {
  jake.exec(['jasmine-node spec'], function () {
    complete();
  });
}, {async: true});

namespace('doc', function () {
  task('generate', ['doc:clobber'], function () {
    var cmd = '../node-jsdoc-toolkit/app/run.js -n -r=100 ' +
        '-t=../node-jsdoc-toolkit/templates/codeview -d=./doc/ ./lib';
    console.log('Generating docs ...');
    jake.exec([cmd], function () {
      console.log('Done.');
      complete();
    });
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

var p = new jake.NpmPublishTask('jake', [
  'Jakefile'
, 'README.md'
, 'package.json'
, 'src/*'
]);

//jake.Task['npm:definePackage'].invoke();

