const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    memberType: { type: String },
    barCouncilNo: { type: String, required: true },
    enrollmentYear: { type: String, required: true },
    court: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String },
    specialization: { type: String },
    experience: { type: String },
    seniorAdvocate: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    pincode: { type: String },
    nominee: { type: String },
    relationship: { type: String },
    profileImage: { type: String },
    declaration: { type: Boolean, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Membership', membershipSchema);
