const Router = require('express').Router;
const userController = require('../Controllers/user-controller');
const adminMiddleware = require('../Middlewares/admin-middleware');
const authMiddleware = require('../Middlewares/auth-middleware');
const fileMiddleware = require('../Middlewares/file-middleware');

const router = new Router();

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.post('/', adminMiddleware, userController.createNewUser);
router.patch('/avatar', authMiddleware, fileMiddleware.single('avatar'), userController.addAvatar);
router.patch('/:userId', authMiddleware, userController.changeUser);
router.get('/:userId/posts', userController.getPostsByUser);
router.delete('/:userId', adminMiddleware, userController.deleteUser);

module.exports = router;