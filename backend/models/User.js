const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  blockNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // This was already correctly in place
  },
  phone: {
    type: String,
    required: true,
    unique: true, // <-- ADD THIS LINE
    match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number'],
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);