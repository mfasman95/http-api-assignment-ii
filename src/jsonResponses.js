const respondJson = status => (object, headers) => (req, res) => {
  const finalHeaders = Object.assign({ 'Content-Type': 'application/json' }, headers);
  res.writeHead(status, finalHeaders);
  res.end(JSON.stringify(object));
};

const respondMeta = status => headers => (req, res) => {
  const finalHeaders = Object.assign({ 'Content-Type': 'application/json' }, headers);
  res.writeHead(status, finalHeaders);
  res.end();
};

const successGet = (data, headers) => (req, res) => respondJson(200)(data, headers)(req, res);
const successPost = (data, headers) => (req, res) => respondJson(201)(data, headers)(req, res);
const updatePost = (data, headers) => (req, res) => respondJson(204)(data, headers)(req, res);

const badReq = (message, id) => (req, res) => respondJson(400)({ message, id })(req, res);

const unauthReq = (req, res) => respondJson(401)({
  message: 'You are not authorized to request this content',
  id: 'unauthorized',
})(req, res);

const forbiddenReq = (req, res) => respondJson(403)({
  message: 'You do not have access to this content',
  id: 'forbidden',
})(req, res);

const notImplemented = (req, res) => respondJson(403)({
  message: `A ${req.method} request for this page has not been implemented yet, check again later for updated content`,
  id: 'notImplemented',
})(req, res);

const notFound = (req, res) => respondJson(404)({
  message: 'The page you are looking for was not found',
  id: 'notFound',
})(req, res);

const notFoundMeta = (req, res) => respondMeta(404)({})(req, res);

const internalError = (req, res) => respondJson(500)({
  message: 'Internal server Error, something went wrong',
  id: 'internalError',
})(req, res);

module.exports = Object.freeze({
  successGet,
  successPost,
  updatePost,
  badReq,
  notFound,
  unauthReq,
  forbiddenReq,
  internalError,
  notImplemented,
  respondMeta,
  notFoundMeta,
});
