# norigin
A simple JSONP proxy to perform Cross-Origin requests (a-la AnyOrigin or WhateverOrigin).

**Features**:
- Support for both HTTP and HTTPS.
- Support for both JSON and JSONP.
- Simple: 55 lines of JavaScript code.
- Scalable: non-blocking I/O using Node.js.
- Free, as in both "free speech" (Apache 2.0) and "free beer": no fee, no tracking whatsoever, etc.

**Usage**:
- CURL:

        $ curl -X GET http://norigin.herokuapp.com?url=https://httpbin.org/html
        "<!DOCTYPE html>\n<html>[...]</html>"

        $ curl -X GET 'http://norigin.herokuapp.com/?url=https://httpbin.org/html&callback=YourCallback'
        /**/ typeof YourCallback === 'function' && YourCallback("<!DOCTYPE html>\n<html>[...]</html>");

- jQuery:

        $.getJSON('http://norigin.herokuapp.com?url='+url+'&callback=?', function(data) {
          console.log(data);
        });

**Set up**:

1. Install Node.js.
2. Install all dependencies by runnning: `npm install`.
3. Start the server by running: `npm start`.
4. Send HTTP GET requests to: [http://127.0.0.1:1337](http://127.0.0.1:1337)
