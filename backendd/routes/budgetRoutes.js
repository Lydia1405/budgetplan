const express = require("express");
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Fetch All Budgets (Ensure Expenses Are Populated)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId }).populate("expenses"); // ✅ Ensure expenses are populated
    res.json({ success: true, budgets });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// ✅ Create Budget (Ensure Unique Name)
router.post("/", authMiddleware, async (req, res) => {
  const { name, amount } = req.body;

  if (!name || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingBudget = await Budget.findOne({ name, userId: req.userId });
  if (existingBudget) {
    return res.status(400).json({ error: "Budget name must be unique." });
  }

  try {
    const newBudget = new Budget({ name, amount, userId: req.userId, expenses: [] }); // ✅ Ensure expenses array is initialized
    await newBudget.save();
    res.status(201).json({ message: "Budget created", budget: newBudget });
  } catch (err) {
    res.status(500).json({ error: "Failed to create budget" });
  }
});

// ✅ Delete Budget
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json({ message: "Budget deleted", deletedBudget });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

module.exports = router;
