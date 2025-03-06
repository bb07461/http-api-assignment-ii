const http = require('http');
const url = require('url');

const query = require('querystring');
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();

    try {
      request.body = JSON.parse(bodyString);
    } catch (e) {
      request.body = query.parse(bodyString);
    }

    handler(request, response);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(request, response, jsonHandler.addUser);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getUsers') {
    if (request.method === 'HEAD') {
      jsonHandler.getUsersHead(request, response);
      return;
    }
    jsonHandler.getUsers(request, response);
    return;
  }

  if (parsedUrl.pathname === '/notReal') {
    if (request.method === 'HEAD') {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end();
      return;
    }
    jsonHandler.notFound(request, response);
    return;
  }

  if (parsedUrl.pathname === '/') { // The root route
    htmlHandler.getIndex(request, response); // Serve the HTML page
  }

  // If none of the routes match, return 404
 //htmlHandler.notFoundPage(request, response);
};

const onRequest = (request, response) => {
  // const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  const parsedUrl = url.parse(request.url, true);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
    return;
  } if (request.method === 'GET' || request.method === 'HEAD') {
    handleGet(request, response, parsedUrl);
    return;
  }

  jsonHandler.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
