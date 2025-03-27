const express = require("express");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget"); // ✅ Import Budget Model
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add Expense (POST /api/expenses)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { budgetId, name, amount } = req.body;

    // ✅ Validate required fields
    if (!budgetId || !name || !amount) {
      return res.status(400).json({ error: "All fields (budgetId, name, amount) are required." });
    }

    // ✅ Create Expense
    const newExpense = new Expense({ budgetId, name, amount });
    await newExpense.save();

    // ✅ Link Expense to Budget
    await Budget.findByIdAndUpdate(
      budgetId,
      { $push: { expenses: newExpense._id } }, // ✅ Add Expense ID to Budget
      { new: true }
    );

    res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  } catch (err) {
    console.error("Expense Creation Error:", err);
    res.status(500).json({ error: "Server error while adding expense" });
  }
});

// ✅ Get Expenses for a Budget (GET /api/expenses/:budgetId)
router.get("/:budgetId", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ budgetId: req.params.budgetId });
    res.json({ success: true, expenses });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// ✅ Delete Expense (DELETE /api/expenses/:id)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // ✅ Remove Expense from Budget
    await Budget.findByIdAndUpdate(
      deletedExpense.budgetId,
      { $pull: { expenses: deletedExpense._id } }, // ✅ Remove Expense ID from Budget
      { new: true }
    );

    res.json({ message: "Expense deleted successfully", deletedExpense });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
