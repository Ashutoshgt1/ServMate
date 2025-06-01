import mongoose from "mongoose";
const materialSchema = new mongoose.Schema({
  name: String,
  qrCode: { type: String, required: true, unique: true },
  price: Number,
  unit: String // optional, e.g., "per meter", "per kg"
});

module.exports = mongoose.model('Material', materialSchema);
