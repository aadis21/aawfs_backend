const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

/**
 * Public: Submit Donation
 * POST /api/donations
 */
exports.submitDonation = async (req, res) => {
  try {
    const { donorName, mobile, email, membershipId, amountINR, utrNumber } = req.body;

    if (!donorName || !mobile || !amountINR || !utrNumber) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: Donor Name, Mobile, Amount, and UTR Number.'
      });
    }

    const screenshotPath = req.file ? '/uploads/donations/' + req.file.filename : '';

    const donation = await Donation.create({
      donorName,
      mobile,
      email: email || '',
      membershipId: membershipId || '',
      amountINR: Number(amountINR),
      utrNumber,
      screenshotPath,
      status: 'pending'
    });

    // Create Admin Notification for the donation
    try {
      await Notification.create({
        type: 'new_donation',
        referenceId: donation._id.toString(),
        message: `New donation of ₹${amountINR} from ${donorName}`
      });
    } catch (notifErr) {
      console.error('Failed to create notification for new donation:', notifErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Donation details submitted successfully. Admin will verify shortly.',
      data: donation
    });
  } catch (error) {
    console.error('Submit Donation Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit donation.' });
  }
};

/**
 * Admin: Get all donations (paginated, filterable by status)
 * GET /api/donations
 */
exports.getDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;

    const query = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { donorName: searchRegex },
        { mobile: searchRegex },
        { utrNumber: searchRegex },
        { membershipId: searchRegex }
      ];
    }

    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: donations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Donations Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve donations.' });
  }
};

/**
 * Admin: Review Donation (Approve / Reject)
 * PATCH /api/donations/:id/review
 */
exports.reviewDonation = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const donationId = req.params.id;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status is required and must be either "approved" or "rejected".'
      });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found.' });
    }

    donation.status = status;
    donation.adminNote = adminNote || '';
    donation.reviewedAt = new Date();
    donation.reviewedBy = req.admin.id;

    await donation.save();

    return res.status(200).json({
      success: true,
      message: `Donation status marked as ${status}.`,
      data: donation
    });
  } catch (error) {
    console.error('Review Donation Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to review donation.' });
  }
};
