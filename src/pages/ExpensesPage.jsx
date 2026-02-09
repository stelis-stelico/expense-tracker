import { useEffect, useState, useMemo } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import Modal from "../components/Modal";

export default function ExpensesPage() {
  const EXPENSE_API = "http://localhost:4000/expenses";
  const CATEGORY_API = "http://localhost:4000/categories";

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const [form, setForm] = useState({
    amount: "",
    item: "",
    category: "",
    notes: "",
    date: ""
  });

  // This automatically updates whenever expenses, selectedCategory, or searchValue changes.
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory = 
        selectedCategory === "all" || expense.category === selectedCategory;
      
      const matchesSearch = 
        searchValue === "" || 
        expense.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        expense.amount.toString().includes(searchValue) ||
        expense.date.includes(searchValue) ||
        (expense.item && expense.item.toLowerCase().includes(searchValue.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchValue]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(EXPENSE_API);
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORY_API);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({ amount: "", item: "", category: "", notes: "", date: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${EXPENSE_API}/${editingId}` : EXPENSE_API;
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      fetchExpenses();
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save expense:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmed) return;

    try {
      await fetch(`${EXPENSE_API}/${id}`, { method: "DELETE" });
      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  // removes the handleSearch
//   const handleSearch = () => {
//   if (!searchValue.trim()) {
//     setDisplayedExpenses(expenses);
//     return;
//   }

//   const filtered = expenses.filter((expense) => {
//     return (
//       expense.category === searchValue ||
//       expense.amount.toString() === searchValue ||
//       expense.date === searchValue
//     );
//   });

//   setDisplayedExpenses(filtered);
// };

// {displayedExpenses.length === 0 && (
//   <p className="text-gray-500 mt-4">
//     No matching transactions found.
//   </p>
// )}



  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Expenses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Category Filter */}
        <div>
          <label className="block mb-1 font-medium">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Real-time Search */}
        <div>
          <label className="block mb-1 font-medium">Search</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Amount, category or date..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full"
            />
            <button
              onClick={() => {setSearchValue(""); setSelectedCategory("all");}}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="p-3 border font-medium">
                  ₦{Number(expense.amount).toLocaleString()}
                </td>
                <td className="p-3 border">{expense.category}</td>
                <td className="p-3 border">{expense.date}</td>
                <td className="p-3 border text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setForm(expense);
                        setEditingId(expense.id);
                        setShowModal(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">No matching transactions found.</p>
        )}
      </div>

      <button onClick={openAddModal} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        + Add Expense
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? "Edit Expense" : "Add Expense"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... existing form fields ... */}
          <div>
            <label className="block mb-1 font-medium">Amount</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 font-medium">What did you spend on?</label>
            <input type="text" name="item" value={form.item} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className="w-full p-2 border rounded-lg">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            {editingId ? "Update Expense" : "Save Expense"}
          </button>
        </form>
      </Modal>
    </div>
  );
}