const { notFound } = require('./jsonResponses');
const handleUsers = require('./handleUsers');

const handleApiGet = (req, res, reqType, queryParams) => {
  switch (reqType) {
    case 'getUsers': { return handleUsers.getUsers(req, res); }
    case 'getUser': { return handleUsers.getUsers(req, res, queryParams); }
    default: { return notFound(req, res); }
  }
};

const handleApiHead = (req, res, reqType, queryParams) => {
  switch (reqType) {
    case 'getUsers': { return handleUsers.getUsersMeta(req, res); }
    case 'getUser': { return handleUsers.getUserMeta(req, res, queryParams); }
    default: { return notFound(req, res); }
  }
};

const handleApiPost = (req, res, reqType, queryParams) => {
  switch (reqType) {
    case 'addUser': { return handleUsers.addUser(req, res, queryParams); }
    default: { return notFound(req, res); }
  }
};

module.exports = Object.freeze({
  handleApiGet,
  handleApiHead,
  handleApiPost,
});
