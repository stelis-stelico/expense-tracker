const CATEGORIES_API = "http://localhost:4000/categories";

export const getCategories = async () => {
  const res = await fetch(CATEGORIES_API);
  return res.json();
};

export const addCategory = async (data) => {
  const res = await fetch(CATEGORIES_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateCategory = async (id, data) => {
  const res = await fetch(`${CATEGORIES_API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteCategory = async (id) => {
  await fetch(`${CATEGORIES_API}/${id}`, { method: "DELETE" });
};
