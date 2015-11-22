# norigin
A JSONP service to perform Cross-Origin requests.

**Features**:
- Support for both HTTP and HTTPS.
- Support for both JSON and JSONP.
- Free, as in both "free speech" (Apache 2.0) and "free beer": no fee, no tracking whatsoever, etc.
- Scalable: non-blocking I/O using Node.js.

**Usage**:
- CURL:

        $ curl -X GET http://norigin.herokuapp.com?url=http://www.google.co.uk/
        {"contents":"<!doctype html><html[...]</html>"}

- jQuery:

        $.getJSON('http://norigin.herokuapp.com?url='+url+'&callback=?', function(data) {
          console.log(data.contents);
        });

**Set up**:

1. Install Node.js.
2. Install all dependencies by runnning: `npm install`.
3. Start the server by running: `node index.js`.
4. Send requests to: [http://127.0.0.1:1337](http://127.0.0.1:1337)
