import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  password: String,
  superAdmin: { type: Boolean, default: false } // Optional: for role hierarchy
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
