const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  property_name: { type: String, required: true },
  image: { type: [String], required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
  },
  category: { type: String, required: true },
  status: { type: Boolean, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  average_rating: { type: Number, default: 0 },
  verification: {
    type: String,
    enum: ["pending", "verified", "rejected"],
  },
});

module.exports = mongoose.model("Property", PropertySchema);
