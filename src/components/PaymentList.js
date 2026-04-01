import { useState } from "react";

export default function PaymentList({ student, onAddPayment }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!amount) return;
    setLoading(true);
    await onAddPayment({ amount: parseFloat(amount), date: new Date().toISOString().split("T")[0], status: "Paid" });
    setAmount("");
    setLoading(false);
  };

  return (
    <div className="mt-2">
      <h3 className="font-semibold">Payments</h3>
      <ul className="list-disc ml-5">
        {student.payments.map((p, idx) => (
          <li key={idx}>{p.amount} USD - {p.date} ({p.status})</li>
        ))}
      </ul>
      <div className="flex mt-2 gap-2">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-1 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}