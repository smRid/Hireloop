const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
      index: true,
    },
    subscriptionId: {
      type: String,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    provider: {
      type: String,
      default: "stripe",
    },
    providerPaymentId: String,
    transactionId: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
      index: true,
    },
  },
  { timestamps: true, strict: false },
);

module.exports =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
