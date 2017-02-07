# TimezoneJS.Date

[![Build Status](https://secure.travis-ci.org/mde/timezone-js.png)](https://secure.travis-ci.org/mde/timezone-js)

A timezone-enabled, drop-in replacement for the stock JavaScript Date. The `timezoneJS.Date` object is API-compatible with JS Date, with the same getter and setter methods -- it should work fine in any code that works with normal JavaScript Dates.

[Mailing list](http://groups.google.com/group/timezone-js)

## Overview

The `timezoneJS.Date` object gives you full-blown timezone support, independent from the timezone set on the end-user's machine running the browser. It uses the Olson zoneinfo files for its timezone data.

The constructor function and setter methods use proxy JavaScript Date objects behind the scenes, so you can use strings like '10/22/2006' with the constructor. You also get the same sensible wraparound behavior with numeric parameters (like setting a value of 14 for the month wraps around to the next March).

The other significant difference from the built-in JavaScript Date is that `timezoneJS.Date` also has named properties that store the values of year, month, date, etc., so it can be directly serialized to JSON and used for data transfer.

## Setup

This section shows the most common way of setting up timezone-js. In the 'Customizing' section below you can find alternative approaches.

First you'll need to include the code on your page. Both `timezoneJS.Date`, and the supporting code it needs in `timezoneJS.timezone` are bundled in the `date.js` file in `src` directory. Include the code on your page with a normal JavaScript script include, like so:

	<script type="text/javascript" src="/js/timezone-js/src/date.js">

Next you'll need the Olson time zone files -- `timezoneJS.Date` uses the raw Olson data to calculate timezone offsets. The Olson region files are simple, structured text data, which download quickly and parse easily. (They also compress to a very small size.)

Here is an example of how to get the Olson time zone files:

``` bash
##!/bin/bash

# NOTE: Run from your webroot

# Create the /tz directory
mkdir tz

# Download the latest Olson files
curl ftp://ftp.iana.org/tz/tzdata-latest.tar.gz -o tz/tzdata-latest.tar.gz

# Expand the files
tar -xvzf tz/tzdata-latest.tar.gz -C tz

# Optionally, you can remove the downloaded archives.
rm tz/tzdata-latest.tar.gz
```

Then you'll need to make the files available to the `timezoneJS.timezone` code, and initialize the code to parse your default region. (This will be North America if you don't change it). No sense in downloading and parsing timezone data for the entire world if you're not going to be using it.

Put your directory of Olson files somewhere under your Web server root, and point `timezoneJS.timezone.zoneFileBasePath` to it. Then call the init function. Your code will look something like this:

``` js
timezoneJS.timezone.zoneFileBasePath = '/tz';
timezoneJS.timezone.init({ callback: cb });
```

If you use `timezoneJS.Date` with `Fleegix.js`, `jQuery` or `jQuery`-compatible libraries (like `Zepto.js`), there's nothing else you need to do -- timezones for North America will be loaded and parsed on initial page load, and others will be downloaded and parsed on-the-fly, as needed. If you want to use this code with some other JavaScript toolkit, you'll need to overwrite your own transport method by setting `timezoneJS.timezone.transport = someFunction` method. Take a look at `test-utils.js` in `spec` for an example.

**NOTE**: By default `init()` is async so you'll need to specify a callback function such as `init({ callback: cb })`. Otherwise set `init({ async: false })` to turn off async.

## Usage

The `timezoneJS.Date` constructor is compatible to the normal JavaScript Date constructor, but additional allows to pass an optional `tz` (timezone). In the following cases the passed date/time is unambiguous:

``` js
timezoneJS.Date(millis, [tz])
timezoneJS.Date(Date, [tz])
timezoneJS.Date(dt_str_tz, [tz])
```

`dt_str_tz` is a date string containing timezone information, i.e. containing `Z`, `T` or a timezone offset matching the regular expression `/[+-][0-9]{4}/` (e.g. `+0200`). The [one-stop shop for cross-browser JavaScript Date parsing behavior](http://dygraphs.com/date-formats.html) provides detailed information about JavaScript date formats.

In the following cases the date is assumed to be a date in timezone `tz` or a locale date if `tz` is not provided:

``` js
timezoneJS.Date(year, mon, day, [hour], [min], [second], [tz])
timezoneJS.Date(dt_str, [tz])
```

`dt_str` is a date string containing no timezone information.

### Examples

Create a `timezoneJS.Date` the same way as a normal JavaScript Date, but append a timezone parameter on the end:

``` js
var dt = new timezoneJS.Date('10/31/2008', 'America/New_York');
var dt = new timezoneJS.Date(2008, 9, 31, 11, 45, 'America/Los_Angeles');
```

Naturally enough, the `getTimezoneOffset` method returns the timezone offset in minutes based on the timezone you set for the date.

``` js
// Pre-DST-leap
var dt = new timezoneJS.Date(2006, 9, 29, 1, 59, 'America/Los_Angeles');
dt.getTimezoneOffset(); => 420
// Post-DST-leap
var dt = new timezoneJS.Date(2006, 9, 29, 2, 0, 'America/Los_Angeles');
dt.getTimezoneOffset(); => 480
```

Just as you'd expect, the `getTime` method gives you the UTC timestamp for the given date:

``` js
var dtA = new timezoneJS.Date(2007, 9, 31, 10, 30, 'America/Los_Angeles');
var dtB = new timezoneJS.Date(2007, 9, 31, 12, 30, 'America/Chicago');
// Same timestamp
dtA.getTime(); => 1193855400000
dtB.getTime(); => 1193855400000
```

You can set (or reset) the timezone using the `setTimezone` method:

``` js
var dt = new timezoneJS.Date('10/31/2006', 'America/Juneau');
dt.getTimezoneOffset(); => 540
dt.setTimezone('America/Chicago');
dt.getTimezoneOffset(); => 300
dt.setTimezone('Pacific/Honolulu');
dt.getTimezoneOffset(); => 600
```

The `getTimezone` method tells you what timezone a `timezoneJS.Date` is set to:

``` js
var dt = new timezoneJS.Date('12/27/2010', 'Asia/Tokyo');
dt.getTimezone(); => 'Asia/Tokyo'
```

You can use `getTimezoneAbbreviation` method to get timezone abbreviation:

``` js
var dt = new timezoneJS.Date('10/31/2008', 'America/New_York');
dt.getTimezoneAbbreviation(); => 'EDT'
```

## Customizing

If you don't change it, the timezone region that loads on
 initialization is North America (the Olson 'northamerica' file). To change that to another reqion, set `timezoneJS.timezone.defaultZoneFile` to your desired region, like so:
 ``` js
timezoneJS.timezone.zoneFileBasePath = '/tz';
timezoneJS.timezone.defaultZoneFile = 'asia';
timezoneJS.timezone.init();
```

If you want to preload multiple regions, set it to an array, like this:

``` js
timezoneJS.timezone.zoneFileBasePath = '/tz';
timezoneJS.timezone.defaultZoneFile = ['asia', 'backward', 'northamerica', 'southamerica'];
timezoneJS.timezone.init();
```

By default the `timezoneJS.Date` timezone code lazy-loads the timezone data files, pulling them down and parsing them only as needed.

For example, if you go with the out-of-the-box setup, you'll have all the North American timezones pre-loaded -- but if you were to add a date with a timezone of 'Asia/Seoul,' it would grab the 'asia' Olson file and parse it before calculating the timezone offset for that date.

You can change this behavior by changing the value of `timezoneJS.timezone.loadingScheme`. The three possible values are:

1. `timezoneJS.timezone.loadingSchemes.PRELOAD_ALL` -- this will preload all the timezone data files for all reqions up front. This setting would only make sense if you know your users will be using timezones from all around the world, and you prefer taking the up-front load time to the small on-the-fly lag from lazy loading.
2. `timezoneJS.timezone.loadingSchemes.LAZY_LOAD` -- the default. Loads some amount of data up front, then lazy-loads any other needed timezone data as needed.
3. `timezoneJS.timezone.loadingSchemes.MANUAL_LOAD` -- Preloads no data, and does no lazy loading. Use this setting if you're loading pre-parsed JSON timezone data.

## Ready-made tzdata NPM modules

If you use NPM, and you want to load the time zone data synchronously, you can use one or more of the tzdata* NPM modules. That way, you do not have to download the IANA zone files manually, you can just run `npm update` to get the latest data.

The [tzdata](https://www.npmjs.com/package/tzdata) module contains all time zones. There are other modules, e.g. [tzdata-northamerica](https://www.npmjs.com/package/tzdata-northamerica) that contain subsets of the zones.

First, install timezone-js and one or more of the tzdata modules.
```bash
npm install timezone-js tzdata
```

Then, initialize timezone-js with the data:
```javascript
var timezoneJS = require("timezone-js");
var tzdata = require("tzdata");

var _tz = timezoneJS.timezone;
_tz.loadingScheme = _tz.loadingSchemes.MANUAL_LOAD;
_tz.loadZoneDataFromObject(tzdata);

var dt = new timezoneJS.Date(2006, 9, 29, 1, 59, 'America/Los_Angeles');
```

## Pre-Parsed JSON Data

If you know beforehand what specific cities your users are going to be using, you can reduce load times specifically by creating a pre-parsed JSON data file containing only the timezone info for those specific cities.

The src directory contains 2 command-line JavaScript scripts that can generate this kind of JSON data:

- `node-preparse.js`: Uses Node to preparse and populate data.
- `preparse.js`: This script requires the Rhino (Java) JavaScript engine to run, since the stock SpiderMonkey (C) engine doesn't come with file I/O capabilities.

Use the script like this:

``` bash
rhino preparse.js zoneFileDirectory [exemplarCities] > outputfile.json
```

Or:

``` bash
node node-preparse.js zoneFileDirectory [exemplarCities] > outputfile.json
```

The first parameter is the directory where the script can find the Olson zoneinfo files. The second (optional) param should be a comma-delimited list of timzeone cities to create the JSON data for. If that parameter isn't passed, the script will generate the JSON data for all the files.

``` bash
rhino preparse.js olson_files \
"Asia/Tokyo, America/New_York, Europe/London" \
> major_cities.json

rhino preparse.js olson_files > all_cities.json
```

Or:

``` bash
node node-preparse.js olson_files \
"Asia/Tokyo, America/New_York, Europe/London" \
> major_cities.json

node node-preparse.js olson_files > all_cities.json
```

Once you have your file of JSON data, set your loading scheme to `timezoneJS.timezone.loadingSchemes.MANUAL_LOAD`, and load the JSON data with `loadZoneJSONData`, like this:

``` js
var _tz = timezoneJS.timezone;
_tz.loadingScheme = _tz.loadingSchemes.MANUAL_LOAD;
_tz.loadZoneJSONData('/major_cities.json', true);
```

Since the limited set of data will be much smaller than any of the zoneinfo files, and the JSON data is deserialized with `eval` or `JSON.parse`, this method is significantly faster than the default setup. However, it only works if you know beforehand exactly what timezones you want to use.

## Compressing

The Olson timezone data files are simple, space- and linefeed-delimited data. The abundance of whitespace means they compress very, very well.

If you plan to use `timezoneJS.Date` in a production Web app, it's highly recommended that you first strip the copious comments found in every Olson file, and serve compressed versions of the files to all browsers that can handle it. **(Note that IE6 reports itself as able to work with gzipped data, but has numerous problems with it.)**

Just to give you an idea of the difference -- merely stripping out the comments from the 'northamerica' file reduces its size by two-thirds -- from 103K to 32K. Gzipping the stripped file reduces it down to 6.5K -- probably smaller than most of the graphics in your app.

The `src` directory has a sample Ruby script that you can use to strip comments from Olson data files.

## Development
This project use [Jake](https://github.com/mde/jake) to build. In order to see available tasks, do `jake -T`. The build sequence is:

- `jake test:init`: Download and extract tz files to `lib/tz`.
- `jake test`: Run `jasmine-node`.

Feel free to fork and modify at your own will.
The source code is annotated and doc can be generated with `jake doc`.

## License


Copyright 2010 Matthew Eernisse (mde@fleegix.org) and Open Source Applications Foundation.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Credits: Ideas included from incomplete JS implementation of Olson parser, "XMLDAte" by Philippe Goetz (philippe.goetz@wanadoo.fr)

Contributions:

- Jan Niehusmann
- Ricky Romero
- Preston Hunt (prestonhunt@gmail.com)
- Dov. B Katz (dov.katz@morganstanley.com)
- Peter Bergström (pbergstr@mac.com)
- Long Ho (@longlho)
- Eugeny Loy (eugeny.loy@gmail.com)
