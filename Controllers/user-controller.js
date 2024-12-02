const User = require('../Models/User');

class UserController {
    getAllUsers(req, res) {
        User.getAllUsers(res);
    }
    getUserById(req, res) {
       User.getUserById(req.params.userId, res);
    }
    createNewUser(req, res) {
        User.createNewUser(req.body, res);
    }
    addAvatar(req, res) {
        console.log(req.file.path);
        User.addAvatar(req.user.login, req.file.path, res);
    }
    getPostsByUser(req, res) {
        User.getPostByUser(req.params.userId, res);
    }
    changeUser(req, res) {
        User.changeUser(req.body, req.user.id ,req.params.userId, res);
    }
    deleteUser(req, res) {
        User.deleteUser(req.params.userId, res);
    }
}

module.exports = new UserController();