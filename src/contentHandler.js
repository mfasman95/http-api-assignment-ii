const fs = require('fs');
const { notFound } = require('./jsonResponses');

const respondContent = filePath => header => (req, res) => {
  fs.readFile(filePath, 'utf8', (err, file) => {
    if (err) notFound(req, res);
    else {
      res.writeHead(200, header);
      res.end(file);
    }
  });
};

module.exports = respondContent;
