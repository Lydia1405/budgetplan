import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BudgetPlanner.css";

const BudgetPlanner = () => {
  const [budgets, setBudgets] = useState([]);
  const [activeBudgetId, setActiveBudgetId] = useState(null);
  const [budgetName, setBudgetName] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [viewExpense, setViewExpense] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch all budgets on page load
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/budgets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();

      if (response.ok && data.budgets.length > 0) {
        setBudgets(data.budgets);
        setActiveBudgetId(data.budgets[0]._id);
        setBudgetName(data.budgets[0].name);
        setTotalBudget(data.budgets[0].amount);
        fetchExpenses(data.budgets[0]._id);
      } else {
        setError("No budget found. Please create one.");
      }
    } catch (err) {
      setError("Error fetching budgets.");
    }
  };

  // ✅ Fetch expenses for the selected budget
  const fetchExpenses = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();

      if (data.success) {
        setExpenses(data.expenses);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch expenses.");
    }
  };

  // ✅ Create Budget
  const handleCreateBudget = async () => {
    if (!budgetName || !totalBudget) {
      setError("Please enter budget name and amount.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: budgetName, amount: parseFloat(totalBudget) }),
      });

      const data = await response.json();
      if (response.ok) {
        setBudgets([...budgets, data.budget]);
        setActiveBudgetId(data.budget._id);
        setBudgetName("");
        setTotalBudget("");
        fetchExpenses(data.budget._id);
        setError("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create budget.");
    }
    setLoading(false);
  };

  // ✅ Delete Budget
  const handleDeleteBudget = async () => {
    if (!activeBudgetId) {
      setError("No budget selected to delete.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/budgets/${activeBudgetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const updatedBudgets = budgets.filter((budget) => budget._id !== activeBudgetId);
        setBudgets(updatedBudgets);

        if (updatedBudgets.length > 0) {
          setActiveBudgetId(updatedBudgets[0]._id);
          setBudgetName(updatedBudgets[0].name);
          setTotalBudget(updatedBudgets[0].amount);
          fetchExpenses(updatedBudgets[0]._id);
        } else {
          setActiveBudgetId(null);
          setBudgetName("");
          setTotalBudget("");
          setExpenses([]);
        }
      } else {
        setError("Failed to delete budget.");
      }
    } catch (err) {
      setError("Error deleting budget.");
    }
  };

  // ✅ Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");

    if (!activeBudgetId) {
      setError("Please create a budget first.");
      return;
    }
    if (!expenseName || !expenseAmount) {
      setError("Expense name and amount are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          budgetId: activeBudgetId,
          name: expenseName,
          amount: parseFloat(expenseAmount),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setExpenses([...expenses, data.expense]);
        setExpenseName("");
        setExpenseAmount("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to add expense.");
    }
  };
  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense._id !== id));
      } else {
        setError("Failed to delete expense.");
      }
    } catch (err) {
      setError("Error deleting expense.");
    }
  };
  return (
    <div className="a">
    <div className="budget-planner-container spacious">
      {/* Navigation Bar */}
      <div className="navbar">
        <h2>Budget Planner</h2>
        <button className="logout-btn small" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Budget Selection */}
      <div className="budget-selector">
        <label>Select Budget:</label>
        <select onChange={(e) => setActiveBudgetId(e.target.value)}>
          {budgets.map((budget) => (
            <option key={budget._id} value={budget._id}>
              {budget.name} - ${budget.amount}
            </option>
          ))}
        </select>
      </div>

      {/* Budget Setup */}
      <div className="budget-setup">
        <input type="text" placeholder="Enter New Budget Name" value={budgetName} onChange={(e) => setBudgetName(e.target.value)} />
        <input type="number" placeholder="Enter Total Budget" value={totalBudget} onChange={(e) => setTotalBudget(parseFloat(e.target.value) || "")} />

        {/* Budget Actions - Create & Delete */}
        <div className="budget-actions">
          <button className="create-budget-btn" onClick={handleCreateBudget} disabled={loading}>
            {loading ? "Creating..." : "Create Budget"}
          </button>
          <button className="delete-budget-btn" onClick={handleDeleteBudget}>
            Delete Budget
          </button>
        </div>
      </div>

      {/* Expense Form */}
      {activeBudgetId && (
        <form className="expense-form" onSubmit={handleAddExpense}>
          <h3>Add Expense</h3>
          <input type="text" placeholder="Expense Name" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} required />
          <input type="number" placeholder="Expense Amount" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required />
          <button type="submit">Add Expense</button>
        </form>
      )}

      {/* Expense List */}
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense._id} className="expense-item">
            <span>{expense.name}: ${expense.amount.toFixed(2)}</span>
            <button className="delete" onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* View Budgets Button - Added Back */}
      <button className="view-budgets-btn" onClick={() => navigate("/view-budgets")}>
        View Budgets
      </button>
    </div>
    </div>
  );
};

export default BudgetPlanner;
