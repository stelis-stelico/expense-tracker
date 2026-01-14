export default function PieChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
      <p className="text-gray-500 text-sm mb-3">Spending Breakdown</p>

      <div className="w-40 h-40 rounded-full border-8 border-gray-200 flex items-center justify-center text-gray-400">
        Chart
      </div>

      <p className="text-xs text-gray-400 mt-2">
        (chart)
      </p>
    </div>
  );
}
