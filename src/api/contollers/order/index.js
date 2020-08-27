const get = require('./get/get.controller');
const post = require('./post/post.controller');
const patch = require('./patch/patch.controller');
const delte = require('./delete/delete.controller');

module.exports = {
  get,
  post,
  patch,
  delte
};