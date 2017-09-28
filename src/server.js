const http = require('http');
const { URL } = require('url');
const path = require('path');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const contentHandler = require('./contentHandler');
const jsonResponses = require('./jsonResponses');
const { handleApiGet, handleApiHead, handleApiPost } = require('./apiHandler');

const reqHandlers = Object.freeze({
  GET: (req, res, urlData) => {
    switch (urlData.endPoint) {
      case '': { return contentHandler(path.join(__dirname, './../client/client.html'))({ 'Content-Type': 'text/html' })(req, res); }
      case 'public': {
        const filePath = urlData.pathname.replace('/public', './../client');
        const fileName = urlData.pathParts[urlData.pathParts.length - 1];
        const fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1);

        let contentType = 'text/html';
        switch (fileExtension) {
          case 'html': { contentType = 'text/html'; break; }
          case 'css': { contentType = 'text/css'; break; }
          case 'js': { contentType = 'application/javascript'; break; }
          case 'ico': { contentType = 'image/x-icon'; break; }
          // Throw an internal server error if the file extension is not recognized
          default: { return jsonResponses.internalError(req, res); }
        }
        return contentHandler(path.join(__dirname, filePath))({ 'Content-Type': contentType })(req, res);
      }
      case 'api': { return handleApiGet(req, res, urlData.pathParts[1], urlData.searchParams); }
      default: { return jsonResponses.notFound(req, res); }
    }
  },
  HEAD: (req, res, urlData) => {
    // Only handle request if it was sent to the api endpoint
    if (urlData.endPoint === 'api') return handleApiHead(req, res, urlData.pathParts[1], urlData.searchParams);
    return jsonResponses.badReq('This is not a valid api endpoint', 'invalidEndpoint')(req, res);
  },
  POST: (req, res, urlData) => {
    // Only handle request if it was sent to the api endpoint
    if (urlData.endPoint === 'api') return handleApiPost(req, res, urlData.pathParts[1], urlData.searchParams);
    return jsonResponses.badReq('This is not a valid api endpoint', 'invalidEndpoint')(req, res);
  },
});

const onRequest = (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}/`);
  const { searchParams, pathname } = url;
  const pathParts = pathname.split('/');
  pathParts.splice(0, 1); // remove the unneeded first part which will always be ''
  const endPoint = pathParts[0];

  // Take all the parsed data and put it into an object to be sent to the appropriate handler
  const urlData = { searchParams, pathname, pathParts, endPoint };
  return reqHandlers[req.method](req, res, urlData);
};

http.createServer(onRequest).listen(PORT, () => { console.dir(`Server listening at localhost:${PORT}`); });
