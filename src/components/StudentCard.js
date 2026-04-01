import { useState } from "react";
import ClassList from "./ClassList";
import PaymentList from "./PaymentList";
import Loader from "./Loader";

export default function StudentCard({ student, onAddClass, onAddPayment, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [level, setLevel] = useState(student.level);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onEdit(student.id, { name, level });
    setEditing(false);
    setLoading(false);
  };

  const handleAddClass = async (cls) => {
    await onAddClass(student.id, cls);
  };

  const handleAddPayment = async (payment) => {
    await onAddPayment(student.id, payment);
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        {editing ? (
          <div className="flex gap-2 flex-1">
            <input
              className="border p-1 rounded flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-1 rounded flex-1"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-2 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-bold">{student.name} - {student.level}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(student.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <ClassList student={student} onAddClass={handleAddClass} />
      <PaymentList student={student} onAddPayment={handleAddPayment} />
    </div>
  );
}