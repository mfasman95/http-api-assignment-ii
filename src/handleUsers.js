const crypto = require('crypto');
const jsonResponses = require('./jsonResponses');

class Users {
  constructor() {
    this.store = {};
    this.etag = crypto.createHash('sha1').update(JSON.stringify(this.store));
    this.digest = this.etag.digest('hex');
  }

  updateHash() {
    this.etag = crypto.createHash('sha1').update(JSON.stringify(this.store));
    this.digest = this.etag.digest('hex');
  }

  addUser(user) {
    this.store[user.name] = user;
    this.updateHash();
  }

  removeUser(name) {
    delete this.store[name];
    this.updateHash();
  }

  updateUserAge(name, age) {
    this.store[name].age = age;
    this.updateHash();
  }
}
const users = new Users();

const getUsersMeta = (req, res) => jsonResponses.respondMeta(304)({
  'Content-Type': 'application/json',
  etag: users.digest,
})(req, res);

const getUsers = (req, res) => {
  if (req.headers['if-none-match'] === users.digest) return getUsersMeta(req, res);
  const responseObject = {
    users: users.store,
    id: 'GotUsers',
    message: 'Succesfully got users',
  };
  const responseHeader = {
    etag: users.digest,
  };
  return jsonResponses.successGet(responseObject, responseHeader)(req, res);
};

const addUser = (req, res, queryParams) => {
  const name = queryParams.get('name');
  const age = queryParams.get('age');
  let responseHeader = {};
  let responseObject = {};
  if (name === 'undefined' || age === 'undefined') {
    return jsonResponses.badReq('Name and age are both required', 'missingParams')(req, res);
  } else if (users.store[name]) {
    users.updateUserAge(name, age);
    responseObject = {
      user: users.store[name],
      id: 'AddedUser',
      message: 'Succesfully added a new user',
    };
    responseHeader = { etag: users.digest };
    return jsonResponses.updatePost(responseObject, responseHeader)(req, res);
  }
  users.addUser({ name, age });
  responseObject = {
    user: users.store[name],
    id: 'AddedUser',
    message: 'Succesfully added a new user',
  };
  responseHeader = {
    etag: users.digest,
  };
  return jsonResponses.successPost(responseObject, responseHeader)(req, res);
};

module.exports = Object.freeze({
  getUsers,
  getUsersMeta,
  addUser,
});
