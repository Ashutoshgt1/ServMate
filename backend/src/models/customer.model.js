import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  houseNumber: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String },
  area: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: "India", required: true },
  zip: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  password: { type: String, required: [true, "Password is required"] },
  refreshToken: { type: String },
  addresses: [addressSchema]
}, { timestamps: true });


// 🔐 Hash password before save
customerSchema.pre("save", async function (next) {
  console.log("Hashing password middleware triggered");
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// 🔐 Compare password method
customerSchema.methods.isPasswordCorrect = async function (password) {
  console.log(password)
  return await bcrypt.compare(password, this.password);
};

// 🔐 Generate access token
customerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      phone: this.phone,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

// 🔐 Generate refresh token
customerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
