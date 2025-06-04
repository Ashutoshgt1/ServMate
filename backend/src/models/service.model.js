import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: Number,
  baseSalary: { type: Number, required: true }          // base salary for this service

});

const Service= mongoose.model('Service', serviceSchema);

export default Service
