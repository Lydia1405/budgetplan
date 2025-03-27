const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }], // ✅ Store Expense IDs here
});

module.exports = mongoose.model("Budget", BudgetSchema);
