const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {
      id: { type: String }, // Payment ID (e.g., Square payment ID)
      amountMoney: {
        amount: { type: Number }, // Store as Number (in cents, as integer)
        currency: { type: String },
      },
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"], // Fixed typo in "delivered"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
