const Comment = require('../Models/Comment');
const Like = require('../Models/Like');

class CommentController {
    getCommentById(req, res) {
        Comment.getCommentById(req.params.commentId, res);
    }
    changeComment(req, res) {
        Comment.changeComment(req.params.commentId, req.body, req.user.login, res);
    }
    deleteComment(req, res) {
        Comment.deleteComment(req.params.commentId, req.user.login, res);
    }
    getAllLikes(req, res) {
        Like.getCommLikes(req.params.commentId, res);
    }
    setLike(req, res) {
        Like.setLikeComm(req.params.commentId, req.user.login, res);
    }
    deleteLike(req, res) {
        Like.deleteLikeComm(req.params.commentId, req.user.login, res);
    }
}

module.exports = new CommentController();