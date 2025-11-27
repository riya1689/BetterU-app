const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead 
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// All routes here require login
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);

module.exports = router;