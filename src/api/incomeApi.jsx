const INCOME_API = "http://localhost:4000/income";

export const getIncome = async () => {
  const res = await fetch(INCOME_API);
  return res.json();
};

export const addIncome = async (data) => {
  const res = await fetch(INCOME_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateIncome = async (id, data) => {
  const res = await fetch(`${INCOME_API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteIncome = async (id) => {
  await fetch(`${INCOME_API}/${id}`, { method: "DELETE" });
};
