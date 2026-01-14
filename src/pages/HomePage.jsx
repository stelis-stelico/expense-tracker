import { useEffect, useState } from "react";

export default function HomePage() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          fetch("http://localhost:4000/income"),
          fetch("http://localhost:4000/expenses"),
        ]);

        const incomeData = await incomeRes.json();
        const expenseData = await expenseRes.json();

        setIncome(incomeData);
        setExpenses(expenseData);

        // normalize transactions
        const incomeTx = incomeData.map((item) => ({
          ...item,
          type: "income",
          signedAmount: Number(item.amount),
        }));

        const expenseTx = expenseData.map((item) => ({
          ...item,
          type: "expense",
          signedAmount: -Number(item.amount),
        }));

        // sort OLDEST → NEWEST for running balance
        const sorted = [...incomeTx, ...expenseTx].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // compute running balance
        let runningBalance = 0;
        const withBalance = sorted.map((tx) => {
          runningBalance += tx.signedAmount;
          return {
            ...tx,
            balance: runningBalance,
          };
        });

        // display NEWEST → OLDEST
        setTransactions(withBalance.reverse());
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchAllData();
  }, []);

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const balance = totalIncome - totalExpenses;

  const getTopSpendingCategory = () => {
  if (expenses.length === 0) return null;

  const totals = {};

  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = Number(expense.amount);

    totals[category] = (totals[category] || 0) + amount;
  });

  let topCategory = null;
  let highestAmount = 0;

  for (const category in totals) {
    if (totals[category] > highestAmount) {
      highestAmount = totals[category];
      topCategory = category;
    }
  }

  return {
    category: topCategory,
    amount: highestAmount,
  };
};


  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-2xl font-bold mt-2">
            ₦{totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-2xl font-bold mt-2">
            ₦{totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Balance</h3>
          <p
            className={`text-2xl font-bold mt-2 ${
              balance < 0 ? "text-red-600" : "text-green-700"
            }`}
          >
            ₦{balance.toLocaleString()}
          </p>
        </div>

        {(() => {
  const topCategory = getTopSpendingCategory();

  return (
    <div className="bg-purple-100 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold">Top Spending Category</h3>

      {topCategory ? (
        <>
          <p className="text-xl font-bold mt-2">
            {topCategory.category}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ₦{topCategory.amount.toLocaleString()}
          </p>
        </>
      ) : (
        <p className="text-gray-500 mt-2">
          No expenses yet
        </p>
      )}
    </div>
  );
})()}

      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Description</th>
                  <th className="py-2 px-2">Amount</th>
                  <th className="py-2 px-2">Balance</th>
                  <th className="py-2 px-2">Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr key={`${tx.type}-${tx.id}`} className="border-b">
                    <td
                      className={`py-2 px-2 font-medium ${
                        tx.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "Income" : "Expense"}
                    </td>

                    <td className="py-2 px-2">
                      {tx.type === "income" ? tx.source : tx.category}
                    </td>

                    <td
                      className={`py-2 px-2 font-semibold ${
                        tx.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₦{Number(tx.amount).toLocaleString()}
                    </td>

                    <td
                      className={`py-2 px-2 font-semibold ${
                        tx.balance < 0
                          ? "text-red-600"
                          : "text-green-700"
                      }`}
                    >
                      ₦{tx.balance.toLocaleString()}
                    </td>

                    <td className="py-2 px-2">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
