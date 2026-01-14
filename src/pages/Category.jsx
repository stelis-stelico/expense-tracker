import { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);


  const API_URL = "http://localhost:4000/categories";

useEffect(() => {
  fetchCategories();
  fetchExpenses();
}, []);


  const fetchCategories = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setCategories(data);
  };

  const fetchExpenses = async () => {
  try {
    const res = await fetch("http://localhost:4000/expenses");
    const data = await res.json();
    setExpenses(data);
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
  }
};


  const toSentenceCase = (text) => {
    if (!text) return "";
    const trimmed = text.trim();
    return (
      trimmed.charAt(0).toUpperCase() +
      trimmed.slice(1).toLowerCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    const formattedName = toSentenceCase(categoryName);

    const alreadyExists = categories.some(
      (cat) =>
        cat.name.toLowerCase() === formattedName.toLowerCase()
    );

    if (alreadyExists) {
      alert("Category already exists");
      return;
    }

    setLoading(true);

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formattedName })
      });

      setCategoryName("");
      setOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    setCategories((prev) =>
      prev.filter((cat) => cat.id !== id)
    );
  };

  const getCategoryTotal = (categoryName) => {
  return expenses
    .filter((expense) => expense.category === categoryName)
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
};


  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">
        Categories
      </h2>

      {/* CATEGORY LIST */}
      {categories.length === 0 ? (
        <p className="text-gray-500">
          No categories added yet.
        </p>
      ) : (
        
        <ul className="space-y-3">
          {categories.map((cat) => (
          <li
            key={cat.id}
            className="grid grid-cols-3 gap-4 items-center p-3 border rounded-lg bg-gray-50"
          >
              <span className="font-medium">{cat.name}</span>

              <span className="text-sm text-gray-600">
              ₦{getCategoryTotal(cat.name).toLocaleString()}
              </span>

              <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-600 hover:text-red-800 justify-self-end"
              >
              Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ADD CATEGORY BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="mt-6 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        + Add Category
      </button>

      {/* MODAL */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add Category"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) =>
                setCategoryName(e.target.value)
              }
              className="w-full p-2 border rounded-lg"
              placeholder=""
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Save Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
