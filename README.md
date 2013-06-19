## bpl-rest
This module provides a simplified API to Bloomberg's [node-blp](https://github.com/bloomberg/node-blpapi) using [clues.js](https://github.com/ZJONSSON/clues) backed by [promises](http://promises-aplus.github.io/promises-spec/).
The module.exports exposes a function that solves for results of a particular command with supplied inputs. The only command 
so far is `refdata` and the inputs should be `ticker` and `field` (or `inputs` as a JSON object in native form).   Results are narrowed down, depending on the input parameters.   If only one ticker and one field is supplied, the result will be the particular result value.  If multiple fields are chosen the
results will be an associative array with the field names as keys.

To install the package run:
```
$ npm install blp-rest
```

A simple REST example is included (requires [express](https://npmjs.org/package/express)).  
To start the server on port 3000 execute from the package directory:
```
node example.js
```

For the last price of Apple as a simple number:

> [http://localhost:3000/blp/refdata?ticker=AAPL EQUITY&field=PX_LAST](http://localhost:3000/blp/refdata?ticker=AAPL%20EQUITY&field=PX_LAST)

For an associative array, showing both last price and volume:

> [http://localhost:3000/blp/refdata?ticker=AAPL EQUITY&field=PX_LAST,VOLUME](http://localhost:3000/blp/refdata?ticker=AAPL%20EQUITY&field=PX_LAST,VOLUME)

And finally, inputs can also be defined in the SDK native form:

> [http://localhost:3000/blp/refdata?inputs={"securities":["AAPL EQUITY"],"fields":["PX_LAST","VOLUME"]}](http://localhost:3000/blp/refdata?inputs={%22securities%22:[%22AAPL%20EQUITY%22],%22fields%22:[%22PX_LAST%22,%22VOLUME%22]})

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">blp-rest</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.   Commercial options available.