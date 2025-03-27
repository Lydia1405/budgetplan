import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BudgetPlanner from "./components/BudgetPlanner";
import ViewBudgets from "./components/ViewBudgets"; // ✅ Import ViewBudgets page
import "./App.css";
const App = () => {
  const isLoggedIn = true; // Replace this with actual authentication logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/budget" element={isLoggedIn ? <BudgetPlanner /> : <Login />} />
        <Route path="/view-budgets" element={isLoggedIn ? <ViewBudgets /> : <Login />} /> {/* ✅ Ensure auth check */}
      </Routes>
    </Router>
  );
};

export default App;
