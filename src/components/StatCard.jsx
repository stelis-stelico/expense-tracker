export default function StatCard({ title, amount, color }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>
        ₦{amount}
      </h2>

    </div>
  );
}
