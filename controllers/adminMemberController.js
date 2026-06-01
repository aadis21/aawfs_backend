const mongoose = require('mongoose');
const Membership = require('../models/Membership');

/**
 * Get all members (Admin only, with pagination, search, filters)
 * GET /api/admin/members
 */
exports.getMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, state, memberType, isActive } = req.query;

    const query = {};

    // Search filter (searches in multiple fields)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { membershipId: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { barCouncilNo: searchRegex },
        { city: searchRegex }
      ];
    }

    // Exact match filters
    if (state) {
      query.state = state;
    }
    if (memberType) {
      query.memberType = memberType;
    }
    if (isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true';
    }

    const total = await Membership.countDocuments(query);
    const members = await Membership.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin Get Members Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch members.' });
  }
};

/**
 * Get single member by ID or Membership ID string
 * GET /api/admin/members/:id
 */
exports.getMemberById = async (req, res) => {
  try {
    const idParam = req.params.id;
    let query = {};
    
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      query._id = idParam;
    } else {
      query.membershipId = idParam;
    }

    const member = await Membership.findOne(query);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    return res.status(200).json({ success: true, data: member });
  } catch (error) {
    console.error('Admin Get Member By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch member details.' });
  }
};

/**
 * Update member details
 * PATCH /api/admin/members/:id
 */
exports.updateMember = async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    // Fields allowed to be updated
    const updateFields = [
      'fullName', 'dob', 'gender', 'memberType', 'barCouncilNo',
      'enrollmentYear', 'court', 'state', 'city', 'specialization',
      'experience', 'seniorAdvocate', 'phone', 'email', 'address',
      'pincode', 'nominee', 'relationship', 'bloodGroup', 'emergencyContact'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        member[field] = req.body[field];
      }
    });

    await member.save();

    return res.status(200).json({
      success: true,
      message: 'Member details updated successfully.',
      data: member
    });
  } catch (error) {
    console.error('Admin Update Member Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update member.' });
  }
};

/**
 * Toggle member status (Active/Inactive)
 * PATCH /api/admin/members/:id/toggle-status
 */
exports.toggleMemberStatus = async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    member.isActive = !member.isActive;
    await member.save();

    return res.status(200).json({
      success: true,
      message: `Member status marked as ${member.isActive ? 'Active' : 'Inactive'}.`,
      isActive: member.isActive
    });
  } catch (error) {
    console.error('Admin Toggle Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle member status.' });
  }
};

/**
 * Delete a member
 * DELETE /api/admin/members/:id
 */
exports.deleteMember = async (req, res) => {
  try {
    const member = await Membership.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    return res.status(200).json({ success: true, message: 'Member deleted successfully.' });
  } catch (error) {
    console.error('Admin Delete Member Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete member.' });
  }
};
