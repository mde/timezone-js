# TimezoneJS.Date

A timezone-enabled, drop-in replacement for the stock JavaScript Date. The timezoneJS.Date object is API-compatible with JS Date, with the same getter and setter methods -- it should work fine in any code that works with normal JavaScript Dates.

Mailing list: [http://groups.google.com/group/timezone-js](http://groups.google.com/group/timezone-js)

## Overview

The timezoneJS.Date object gives you full-blown timezone support, independent from the timezone set on the end-user's machine running the browser. It uses the Olson zone info files for its timezone data.

The constructor function and setter methods use proxy JavaScript Date objects behind the scenes, so you can use strings like '10/22/2006' with the constructor. You also get the same sensible wraparound behavior with numeric parameters (like setting a value of 14 for the month wraps around to the next March).

The other significant difference from the built-in JavaScript Date is that timezoneJS.Date also has named properties that store the values of year, month, date, etc., so it can be directly serialized to JSON and used for data transfer.

## Setup

timezoneJS.Date uses data from Olson time zone files (simple structured text data). In order to speed up execution and make sure you have the most recently available timezone data, you'll need to download the Olson files, then run the Node.js powered build script included in this repository. The build script parses and serializes the raw Olson data to JSON, then makes a custom build of timezoneJS.Date that includes your elected timezone regions.

1. The build script requires Node.js, so install if you haven't already. For Mac users, [https://github.com/mxcl/homebrew/wiki/installation](Homebrew) is the easiest way to install Node.

2. Browse to the `timezones/olson_data` folder, then run `wget 'ftp://elsie.nci.nih.gov/pub/tzdata*.tar.gz'` followed by `gzip -dc tzdata*.tar.gz | tar -xf -` to download and extract the files.

3. Go up a directory, back to `timezones`, and run `node build.js`. Follow the prompt to enter a list of regions your timezoneJS.Date build needs to support. The region names you enter should match the names of the Olson files.

4. The build script writes your custom build to `build/timezone.js`.

## Usage

Include the script wherever timezoneJS.Date is utilized:

        <script type="text/javascript" src="/path/to/timezone.js">

Create a timezoneJS.Date the same way as a normal JavaScript Date, but append a timezone parameter on the end:

        var dt = new timezoneJS.Date('10/31/2008', 'America/New_York');
        var dt = new timezoneJS.Date(2008, 9, 31, 11, 45, 'America/Los_Angeles');

Naturally enough, the getTimezoneOffset method returns the timezone offset in minutes based on the timezone you set for the date.

        // Pre-DST-leap
        var dt = new timezoneJS.Date(2006, 9, 29, 1, 59, 'America/Los_Angeles');
        dt.getTimezoneOffset(); => 420

        // Post-DST-leap
        var dt = new timezoneJS.Date(2006, 9, 29, 2, 0, 'America/Los_Angeles');
        dt.getTimezoneOffset(); => 480

Just as you'd expect, the getTime method gives you the UTC timestamp for the given date:

        var dtA = new timezoneJS.Date(2007, 9, 31, 10, 30, 'America/Los_Angeles');
        var dtB = new timezoneJS.Date(2007, 9, 31, 12, 30, 'America/Chicago');

        // Same timestamp
        dtA.getTime(); => 1193855400000
        dtB.getTime(); => 1193855400000

You can set (or reset) the timezone using the setTimezone method:

        var dt = new timezoneJS.Date('10/31/2006', 'America/Juneau');
        dt.getTimezoneOffset(); => 540
        dt.setTimezone('America/Chicago');
        dt.getTimezoneOffset(); => 300
        dt.setTimezone('Pacific/Honolulu');
        dt.getTimezoneOffset(); => 600

The getTimezone method tells you what timezone a timezoneJS.Date is set to:

        var dt = new timezoneJS.Date('12/27/2010', 'Asia/Tokyo');
        dt.getTimezone(); => 'Asia/Tokyo'
        