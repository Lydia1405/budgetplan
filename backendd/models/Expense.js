const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: "Budget", required: true }, // ✅ Reference to Budget
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }, // ✅ Automatically adds expense date
});

module.exports = mongoose.model("Expense", ExpenseSchema);
