const Membership = require('../models/Membership');

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
      declaration
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

    const referenceId = `AAFWS-${Math.floor(100000 + Math.random() * 900000)}`;

    await Membership.create({
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
      declaration
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      referenceId
    });
  } catch (error) {
    console.error('Membership submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit application at this time'
    });
  }
};
