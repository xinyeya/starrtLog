const Router = require('koa-router');
const logController = require('../controllers/logController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = new Router({ prefix: '/api' });

// Auth routes
router.post('/login', logController.login);
router.post('/logout', logController.logout);
router.get('/auth', logController.checkAuth);

// Public routes (for sharing)
router.get('/public/logs/:token', logController.getPublicLog);

// Log routes
router.get('/logs', isAuthenticated, logController.getAllLogs);
router.post('/logs/:id/share', isAdmin, logController.shareLog);
router.post('/logs/:id/unshare', isAdmin, logController.unshareLog);
router.post('/logs', isAdmin, logController.createLog);
router.put('/logs/:id', isAdmin, logController.updateLog);
router.delete('/logs/:id', isAdmin, logController.deleteLog);

module.exports = router;
