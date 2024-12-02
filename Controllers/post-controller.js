const Post = require('../Models/Post');
const Like = require('../Models/Like');
const Comment = require('../Models/Comment');
const TokenService = require('../services/tocken-service')

class PostController {
    createPost(req, res) {
        Post.createPost(req.user.login, req.user.id, req.body, res);
    }
    getAllPosts(req, res) {
        let adminFlag = false;
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const accessToken = authorizationHeader.split(' ')[1];
            const userData = TokenService.validateAccessToken(accessToken);
            if(userData) {
                if (userData.roles == 'admin') {
                    adminFlag = true;
                }
            }
        }
        let page = req.query.page ? Number(req.query.page) : 1;
        Post.getAllPost(page, req.query.category, req.query.date, req.query.sort, req.query.search, adminFlag, res);
    }
    getPostById(req, res) {
        Post.getPostById(req.params.postId, res);
    }
    getPostCategories(req, res) {
        Post.getPostCategories(req.params.postId, res);
    }
    getPostLikes(req, res) {
        Like.getPostLike(req.params.postId, res);
    }
    setLike(req, res) {
        Like.setLikePost(req.params.postId, req.user.login, res);
    }
    deleteLike(req, res) {
        Like.deleteLikePost(req.params.postId, req.user.login, res);
    }
    changePost(req, res) {
        Post.changePost(req.params.postId, req.user.login, req.user.roles, req.body, res);
    }
    deletePost(req, res) {
        Post.deletePost(req.params.postId, req.user.login, req.user.roles, res);
    }
    addComment(req, res) {
        Comment.createComment(req.params.postId, req.user.id, req.body, req.user.login, res);
    }
    showComments(req, res) {
        Comment.getAllComments(req.params.postId, res);
    }
}

module.exports = new PostController();