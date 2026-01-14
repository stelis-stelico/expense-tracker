const EXPENSES_API = "http://localhost:4000/expenses";

export const getExpenses = async () => {
  const res = await fetch(EXPENSES_API);
  return res.json();
};

export const addExpense = async (data) => {
  const res = await fetch(EXPENSES_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateExpense = async (id, data) => {
  const res = await fetch(`${EXPENSES_API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteExpense = async (id) => {
  await fetch(`${EXPENSES_API}/${id}`, { method: "DELETE" });
};
