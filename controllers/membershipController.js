const Membership = require('../models/Membership');
const Counter = require('../models/Counter');
const Notification = require('../models/Notification');

exports.applyMembership = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      memberType,
      barCouncilNo,
      enrollmentYear,
      court,
      state,
      city,
      specialization,
      experience,
      seniorAdvocate,
      phone,
      email,
      address,
      pincode,
      nominee,
      relationship,
      declaration,
      bloodGroup,
      emergencyContact
    } = req.body;

    const requiredFields = [
      'fullName',
      'dob',
      'gender',
      'barCouncilNo',
      'enrollmentYear',
      'court',
      'state',
      'phone',
      'email',
      'declaration'
    ];

    const missingFields = requiredFields.filter((field) => {
      return !req.body[field] && req.body[field] !== false;
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }

    // Atomically generate sequential Membership ID: AAFWS-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const counter = await Counter.findOneAndUpdate(
      { year: currentYear },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seqNum = String(counter.seq).padStart(4, '0');
    const membershipId = `AAFWS-${currentYear}-${seqNum}`;

    const profileImage = req.file ? '/uploads/profile-images/' + req.file.filename : '';

    const newMember = await Membership.create({
      fullName,
      dob,
      gender,
      memberType,
      barCouncilNo,
      enrollmentYear,
      court,
      state,
      city,
      specialization,
      experience,
      seniorAdvocate,
      phone,
      email,
      address,
      pincode,
      nominee,
      relationship,
      profileImage,
      declaration: declaration === 'true' || declaration === true,
      membershipId,
      bloodGroup: bloodGroup || '',
      emergencyContact: emergencyContact || '',
      isActive: true
    });

    // Create Admin Notification
    try {
      await Notification.create({
        type: 'new_member',
        referenceId: newMember.membershipId,
        message: `New member registration: ${newMember.fullName} (${newMember.membershipId})`
      });
    } catch (notifErr) {
      console.error('Failed to create admin notification:', notifErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      referenceId: membershipId
    });
  } catch (error) {
    console.error('Membership submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit application at this time'
    });
  }
};

exports.getMembers = async (req, res) => {
  try {
    // Only return active members for the public page directory
    const members = await Membership.find({ isActive: { $ne: false } }, {
      __v: 0,
      email: 0,
      phone: 0,
      address: 0,
      nominee: 0,
      relationship: 0,
      declaration: 0
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      members
    });
  } catch (error) {
    console.error('Fetching members error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch members at this time'
    });
  }
};
