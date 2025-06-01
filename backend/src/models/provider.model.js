import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  password: String,

  // Service they provide (linked to Service model)
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },

  // Availability
  availability: { type: Boolean, default: true },

  // Location Info
  location: {
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Booking Info
  assignedBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],

  // Ratings & Performance
  ratings: { type: Number, default: 0 },
  totalJobsCompleted: { type: Number, default: 0 },

  // Salary System
  salaryDetails: {
    baseSalary: { type: Number, default: 0 },             // Will fetch from Service
    currentSalary: { type: Number, default: 0 },
    isEligibleThisMonth: { type: Boolean, default: false },
    lastSalaryPaidOn: Date,
    ratingThreshold: { type: Number, default: 4.5 },
    minimumWorkRequired: { type: Number, default: 1 }
  },

  // Monthly Activity
  monthlyActivity: [
    {
      month: String,
      completedJobs: Number,
      eligible: Boolean,
      paid: Boolean
    }
  ],

  // Payment History
  paymentHistory: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
      status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
