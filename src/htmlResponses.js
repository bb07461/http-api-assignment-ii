const fs = require('fs');

const getIndex = (request, response) => {
  fs.readFile(`${__dirname}/../client/client.html`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.write('Error loading page');
      response.end();
      return; // ✅ Ensures function exits after response
    }
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });
};

const getCSS = (request, response) => {
  fs.readFile(`${__dirname}/../client/style.css`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.write('Error loading CSS');
      response.end();
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(data);
    response.end();
  });
};

module.exports = {
  getIndex,
  getCSS,
};
