import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String },
  address: {
    street: String,
    city: String,
    zip: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
