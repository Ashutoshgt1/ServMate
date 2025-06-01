import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: Number,
  baseSalary: { type: Number, required: true }          // base salary for this service

});

module.exports = mongoose.model('Service', serviceSchema);
