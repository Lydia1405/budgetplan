import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewBudgets.css";  // Ensure this line exists

const ViewBudgets = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBudget, setFilteredBudget] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch budgets from the backend
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/budgets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();

      if (response.ok) {
        setBudgets(data.budgets);
      } else {
        setError(data.error || "Failed to fetch budgets");
      }
    } catch (err) {
      setError("Error fetching budgets");
    }
  };

  // ✅ Search Budget (with expense fetching)
  const handleSearchBudget = async () => {
    setError("");
    setFilteredBudget(null);

    const budget = budgets.find((b) => b.name.toLowerCase() === searchTerm.toLowerCase());

    if (!budget) {
      setError("Budget not found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${budget._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();

      if (response.ok) {
        setFilteredBudget({ ...budget, expenses: data.expenses });
      } else {
        setError("Failed to fetch expenses.");
      }
    } catch (err) {
      setError("Error fetching expenses.");
    }
  };

  return (
    <div className="view-budgets-container">
      <h2 className="h2color">Search Budgets</h2>

      {/* Back to Budget Planner Button */}
      <button className="back-btn" onClick={() => navigate("/budget")}>Back to Budget Planner</button>

      {error && <p className="error">{error}</p>}

      {/* Search Budget Input and Button */}
      <div className="budget-search">
        <input
          type="text"
          placeholder="Enter Budget Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearchBudget}>Search</button>
      </div>

      {/* Display Budget Details and Expenses */}
      {filteredBudget ? (
        <div className="budget-card">
          <h3>{filteredBudget.name} - ${filteredBudget.amount.toFixed(2)}</h3>
          <div className="budget-details">
            <h4>Expenses:</h4>
            {filteredBudget.expenses && filteredBudget.expenses.length > 0 ? (
              <ul className="expense-list">
                {filteredBudget.expenses.map((expense, index) => (
                  <li key={index} className="expense-item">
                    <span>{expense.name}</span>
                    <span>${expense.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No expenses found.</p>
            )}
          </div>
        </div>
      ) : searchTerm !== "" ? (
        <p className="no-budget-msg">Budget not found. Try another name.</p>
      ) : null}
    </div>
  );
};

export default ViewBudgets;
