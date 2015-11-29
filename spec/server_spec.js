describe('NOrigin server', function() {
  var server = require('../index');
  var request = require('request');

  var rootUrl = 'http://localhost:' + server.port;

  it('should bind HTTP port on 1337 by default', function() {
    expect(server.port).toEqual(1337);
  });

  it('should return a HTTP 200 with the HTML for the page specified by ?url= as a JSON string', function(done) {
    request.get(rootUrl + '?url=https://httpbin.org/html', function(error, response, data) {
      expect(response.statusCode).toEqual(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(error).toBeNull();
      expect(data).toContain('"<!DOCTYPE html>');
      expect(data).toContain('<h1>Herman Melville - Moby-Dick</h1>');
      expect(data).toContain('and all of them a care-killing competency.');
      expect(data).toContain('</html>"');
      expect(data).not.toContain('/**/ typeof');
      done();
    });
  });

  it('should return a HTTP 200 with the HTML for the page specified by ?url= as JavaScript when callback= is provided', function(done) {
    request.get(rootUrl + '?url=https://httpbin.org/html&callback=cb', function(error, response, data) {
      expect(response.statusCode).toEqual(200);
      expect(response.headers['content-type']).toContain('text/javascript');
      expect(error).toBeNull();
      expect(data).toContain('/**/ typeof cb === \'function\' && cb(');
      expect(data).toContain('"<!DOCTYPE html>');
      expect(data).toContain('<h1>Herman Melville - Moby-Dick</h1>');
      expect(data).toContain('and all of them a care-killing competency.');
      expect(data).toContain('</html>");');
      done();
    });
  });

  it('should return a HTTP 400 with "Please provide a valid URL." as a JSON string when no url= is provided', function(done) {
    request.get(rootUrl, function(error, response, data) {
      expect(response.statusCode).toEqual(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(error).toBeNull();
      expect(data).toEqual('"Please provide a valid URL."');
      done();
    });
  });

  it('should return a HTTP 400 with "Please provide a valid URL." as JavaScript when no url= is provided and when callback= is provided', function(done) {
    request.get(rootUrl + '?callback=cb', function(error, response, data) {
      expect(response.statusCode).toEqual(400);
      expect(response.headers['content-type']).toContain('text/javascript');
      expect(error).toBeNull();
      expect(data).toEqual('/**/ typeof cb === \'function\' && cb("Please provide a valid URL.");');
      done();
    });
  });

  it('should return a HTTP 404 with the original content as a JSON string', function(done) {
    request.get(rootUrl + '?url=https://httpbin.org/doesnotexist', function(error, response, data) {
      expect(response.statusCode).toEqual(404);
      expect(response.headers['content-type']).toContain('application/json');
      expect(error).toBeNull();
      expect(data).toEqual('"<!DOCTYPE HTML PUBLIC \\"-//W3C//DTD HTML 3.2 Final//EN\\">\\n<title>404 Not Found</title>\\n<h1>Not Found</h1>\\n<p>The requested URL was not found on the server.  If you entered the URL manually please check your spelling and try again.</p>\\n"');
      done();
    });
  });

  it('should return a HTTP 404 with the original content as JavaScript when callback= is provided', function(done) {
    request.get(rootUrl + '?url=https://httpbin.org/doesnotexist&callback=cb', function(error, response, data) {
      expect(response.statusCode).toEqual(404);
      expect(response.headers['content-type']).toContain('text/javascript');
      expect(error).toBeNull();
      expect(data).toEqual('/**/ typeof cb === \'function\' && cb("<!DOCTYPE HTML PUBLIC \\"-//W3C//DTD HTML 3.2 Final//EN\\">\\n<title>404 Not Found</title>\\n<h1>Not Found</h1>\\n<p>The requested URL was not found on the server.  If you entered the URL manually please check your spelling and try again.</p>\\n");');
      done();
    });
  });

  it('should return a HTTP 400 with the original content as a JSON string when URL is invalid', function(done) {
    request.get(rootUrl + '?url=https://httpbin.org/status/400', function(error, response, data) {
      expect(response.statusCode).toEqual(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(error).toBeNull();
      expect(data).toEqual('""');
      done();
    });
  });

  it('should return a HTTP 400 with the original content as JavaScript when callback= is provided and when URL is invalid', function(done) {
    request.get(rootUrl + '?url=https://httpbin.org/status/400&callback=cb', function(error, response, data) {
      expect(response.statusCode).toEqual(400);
      expect(response.headers['content-type']).toContain('text/javascript');
      expect(error).toBeNull();
      expect(data).toEqual('/**/ typeof cb === \'function\' && cb("");');
      done();
    });
  });

  it('should return a HTTP 500 with the original content as a JSON string', function(done) {
    request.get(rootUrl + '?url=https://thispagedoesnotexist.com', function(error, response, data) {
      expect(response.statusCode).toEqual(500);
      expect(response.headers['content-type']).toContain('application/json');
      expect(error).toBeNull();
      expect(data).toEqual('{"code":"ECONNREFUSED","errno":"ECONNREFUSED","syscall":"connect","address":"50.63.202.57","port":443}');
      done();
    });
  });

  it('should return a HTTP 500 with the original content as JavaScript when callback= is provided', function(done) {
    request.get(rootUrl + '?url=https://thispagedoesnotexist.com&callback=cb', function(error, response, data) {
      expect(response.statusCode).toEqual(500);
      expect(response.headers['content-type']).toContain('text/javascript');
      expect(error).toBeNull();
      expect(data).toEqual('/**/ typeof cb === \'function\' && cb({"code":"ECONNREFUSED","errno":"ECONNREFUSED","syscall":"connect","address":"50.63.202.57","port":443});');
      done();
    });
  });
});
