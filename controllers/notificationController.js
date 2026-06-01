const Notification = require('../models/Notification');

/**
 * Admin: Get all notifications
 * GET /api/admin/notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .sort({ isRead: 1, createdAt: -1 })
      .limit(100) // Keep it to recent 100
      .lean();

    const unreadCount = await Notification.countDocuments({ isRead: false });

    return res.status(200).json({
      success: true,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
};

/**
 * Admin: Mark a single notification as read
 * PATCH /api/admin/notifications/:id/read
 */
exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notification
    });
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

/**
 * Admin: Mark all notifications as read
 * PATCH /api/admin/notifications/read-all
 */
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    console.error('Mark All Read Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};
