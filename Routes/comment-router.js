const Router = require('express').Router;
const CommentController = require('../Controllers/comment-controller');
const adminMiddleware = require('../Middlewares/admin-middleware');
const authMiddleware = require('../Middlewares/auth-middleware');

const router = new Router();

router.get('/:commentId', CommentController.getCommentById);
router.patch('/:commentId', authMiddleware, CommentController.changeComment);
router.delete('/:commentId', authMiddleware, CommentController.deleteComment);
router.post('/:commentId/like', authMiddleware, CommentController.setLike);
router.delete('/:commentId/like', authMiddleware, CommentController.deleteLike);
router.get('/:commentId/like', CommentController.getAllLikes);

module.exports = router