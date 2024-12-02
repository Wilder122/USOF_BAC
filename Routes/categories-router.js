const Router = require('express').Router;
const CategoriesController = require('../Controllers/categories-controller');
const adminMiddleware = require('../Middlewares/admin-middleware');
const authMiddleware = require('../Middlewares/auth-middleware');

const router = new Router();

router.post('/', authMiddleware, CategoriesController.createCategory);
router.get('/', CategoriesController.getAllCategorise);
router.get('/:categoryId', CategoriesController.getCategoryById);
router.get('/:categoryId/posts', CategoriesController.getPostsByCategory);
router.patch('/:categoryId', CategoriesController.changeCategories);
router.delete('/:categoryId', CategoriesController.deleteCategories);

module.exports = router