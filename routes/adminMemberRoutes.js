const express = require('express');
const router = express.Router();
const adminMemberController = require('../controllers/adminMemberController');
const { verifyAdmin } = require('../middleware/auth');

// All routes here are protected and require admin validation
router.use(verifyAdmin);

router.get('/', adminMemberController.getMembers);
router.get('/:id', adminMemberController.getMemberById);
router.patch('/:id', adminMemberController.updateMember);
router.patch('/:id/toggle-status', adminMemberController.toggleMemberStatus);
router.delete('/:id', adminMemberController.deleteMember);

module.exports = router;
