import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, lowercase: true, trim: true },
  password: { type: String, required: [true, "Password is required"] },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },

  availability: { type: Boolean, default: true },

  location: {
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  assignedBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],

  ratings: { type: Number, default: 0 },
  totalJobsCompleted: { type: Number, default: 0 },

  salaryDetails: {
    baseSalary: { type: Number, default: 0 },
    currentSalary: { type: Number, default: 0 },
    isEligibleThisMonth: { type: Boolean, default: false },
    lastSalaryPaidOn: Date,
    ratingThreshold: { type: Number, default: 4.5 },
    minimumWorkRequired: { type: Number, default: 1 }
  },

  monthlyActivity: [
    {
      month: String,
      completedJobs: Number,
      eligible: Boolean,
      paid: Boolean
    }
  ],

  paymentHistory: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
      status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
    }
  ],

  refreshToken: { type: String }

}, { timestamps: true });


// 🔐 Hash password before saving
providerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Password verification method
providerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔐 Generate access token
providerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone,
      name: this.name,
      email: this.email,
      role: "provider"
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

// 🔐 Generate refresh token
providerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id ,
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

const Provider = mongoose.model("Provider", providerSchema);
export default Provider;
