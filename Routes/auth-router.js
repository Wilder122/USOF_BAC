const Router = require('express').Router;
const authController = require('../Controllers/auth-controller');
const authMiddleware = require('../Middlewares/auth-middleware');
const {body} = require('express-validator');

const router = new Router();

router.post('/register', body('email').isEmail(), body('pass').isLength({min: 3, max: 32}), authController.reqistration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.get('/activate/:link/:id', authController.activate);
router.post('/reset', authController.reset);

module.exports = router