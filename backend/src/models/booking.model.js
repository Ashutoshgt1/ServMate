import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  issueDetails: { type: String, required: true },

  // 🔮 Predicted issues (array of options with prices)
  predictedIssues: [
    {
      title: String,         // e.g., "Leaking Tap"
      estimatedCost: Number, // e.g., 300
      estimatedTime: String, // e.g., "30 minutes"
      requiredWorkers: Number
    }
  ],

  // ✅ Provider-confirmed issue (from predicted list)
  confirmedIssue: {
    title: String,
    cost: Number,
    requiredWorkers: Number
  },

  assignedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }],
  status: { type: String, enum: ['Pending', 'Assigned', 'Completed'], default: 'Pending' },

  // 🧰 Materials if used
  materialsUsed: { type: Boolean, default: false },
  usedMaterials: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  // 🔐 OTP verification & billing
  otp: String,
  finalCost: Number,
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking