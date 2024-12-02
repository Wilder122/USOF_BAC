const Router = require('express').Router;
const PostController = require('../Controllers/post-controller');
const adminMiddleware = require('../Middlewares/admin-middleware');
const authMiddleware = require('../Middlewares/auth-middleware');

const router = new Router();

router.post('/', authMiddleware, PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:postId', PostController.getPostById);
router.get('/:postId/categories', PostController.getPostCategories);
router.get('/:postId/like', PostController.getPostLikes);
router.post('/:postId/like', authMiddleware, PostController.setLike);
router.delete('/:postId/like', authMiddleware, PostController.deleteLike);
router.patch('/:postId', authMiddleware, PostController.changePost);
router.delete('/:postId', authMiddleware, PostController.deletePost);
router.post('/:postId/comments', authMiddleware, PostController.addComment);
router.get('/:postId/comments', PostController.showComments);

module.exports = router;