import { useEffect, useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import Modal from "../components/Modal";

const toSentenceCase = (text = "") => {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export default function IncomePage() {
  const API_URL = "http://localhost:4000/income";

  const [incomes, setIncomes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    source: "",
    notes: "",
    date: ""
  });

  const fetchIncomes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setIncomes(data);
    } catch (error) {
      console.error("Failed to fetch income:", error);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({ amount: "", source: "", notes: "", date: "" });
    setEditingId(null);
    setShowModal(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }

      fetchIncomes();
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save income:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this income?"
    );
    if (!confirmed) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setIncomes((prev) => prev.filter((inc) => inc.id !== id));
    } catch (error) {
      console.error("Failed to delete income:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Income</h2>

      {incomes.length === 0 ? (
        <p className="text-gray-500">No income added yet.</p>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border text-center">Action</th>
                <th className="p-3 border">Source</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">
                    ₦{Number(income.amount).toLocaleString()}
                  </td>
                  <td className="p-3 border text-center">
                    {toSentenceCase(income.source)}
                  </td>
                  <td className="p-3 border">{income.date}</td>
            <td className="p-3 border text-center">
            <div className="flex items-center justify-center gap-3">
            <button
            onClick={() => {
              setForm({
              amount: income.amount,
              source: income.source,
              notes: income.notes,
              date: income.date,
              });
              setEditingId(income.id);
              }}
              className="text-yellow-600 hover:text-yellow-800"
              title="Edit">
              ✏️
              </button>

                <button
                  onClick={() => handleDelete(income.id)}
                  className="text-red-600 hover:text-red-800 px-5"
                  title="Delete">
                  <TrashIcon className="w-5 h-5" />
                </button>
                </div>
              </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD BUTTON */}
      <button
        onClick={openAddModal}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        + Add Income
      </button>

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Income" : "Add Income"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Source</label>
            <input
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {editingId ? "Update Income" : "Save Income"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
