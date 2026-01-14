import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function ReportPage() {
  const [chartData, setChartData] = useState([]);

  const INCOME_API = "http://localhost:4000/income";
  const EXPENSE_API = "http://localhost:4000/expenses";

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const incomeRes = await fetch(INCOME_API);
      const expenseRes = await fetch(EXPENSE_API);

      const incomes = await incomeRes.json();
      const expenses = await expenseRes.json();

      const monthlyData = {};

      
      incomes.forEach((item) => {
        const month = new Date(item.date).toLocaleString("default", {
          month: "short",
          year: "numeric"
        });

        if (!monthlyData[month]) {
          monthlyData[month] = { month, income: 0, expense: 0 };
        }

        monthlyData[month].income += Number(item.amount);
      });

      
      expenses.forEach((item) => {
        const month = new Date(item.date).toLocaleString("default", {
          month: "short",
          year: "numeric"
        });

        if (!monthlyData[month]) {
          monthlyData[month] = { month, income: 0, expense: 0 };
        }

        monthlyData[month].expense += Number(item.amount);
      });

      
      const result = Object.values(monthlyData).sort(
        (a, b) => new Date(a.month) - new Date(b.month)
      );

      setChartData(result);
    } catch (error) {
      console.error();
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Expenses Report</h2>

      {chartData.length === 0 ? (
        <p className="text-gray-500">
          No data available to display report.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* INCOME LINE */}
            <Line
              type="monotone"
              dataKey="income"
              stroke="#16a34a" 
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* EXPENSE LINE */}
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#dc2626" 
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
