
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const checkAuth = require('../middleware/auth-check');
const extractFile = require('../middleware/files');

  router.post('', checkAuth, extractFile, postsController.createPost);

  router.get('', postsController.getPosts);
// added above

  router.get('/:id', postsController.getpost);

  router.put('/:id', checkAuth,extractFile , postsController.updatePost);

  router.delete('/:id', checkAuth, postsController.deletePost);

module.exports = router;
