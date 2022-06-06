const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();

const postController = require("../controllers/post")





router.post("", checkAuth, extractFile, postController.createPost);

router.put("/:id", checkAuth, extractFile, postController.updatePost);

router.get('', postController.getPosts);

router.get("/:id", postController.getPost);

router.delete("/:id", postController.deletePost)

module.exports = router;