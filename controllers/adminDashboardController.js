const Membership = require('../models/Membership');
const Donation = require('../models/Donation');

/**
 * Admin: Get Dashboard Stats and Lists
 * GET /api/admin/dashboard/stats
 */
exports.getStats = async (req, res) => {
  try {
    // 1. Total Members
    const totalMembers = await Membership.countDocuments({});

    // 2. New Registrations this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newMembersThisMonth = await Membership.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // 3. Total Donations Received (Sum of approved donation amounts)
    const approvedDonations = await Donation.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, totalAmount: { $sum: '$amountINR' } } }
    ]);
    const totalDonationsReceived = approvedDonations.length > 0 ? approvedDonations[0].totalAmount : 0;

    // 4. Pending Donations Count
    const pendingDonationsCount = await Donation.countDocuments({ status: 'pending' });

    // 5. Recent 5 registrations
    const recentMembers = await Membership.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 6. Recent 5 pending donations
    const recentPendingDonations = await Donation.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        newMembersThisMonth,
        totalDonationsReceived,
        pendingDonationsCount
      },
      recentMembers,
      recentPendingDonations
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve dashboard stats.' });
  }
};
