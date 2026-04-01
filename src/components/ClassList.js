import { useState } from "react";

export default function ClassList({ student, onAddClass }) {
  const [newClass, setNewClass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newClass) return;
    setLoading(true);
    await onAddClass(newClass);
    setNewClass("");
    setLoading(false);
  };

  return (
    <div className="mt-2">
      <h3 className="font-semibold">Classes</h3>
      <ul className="list-disc ml-5">
        {student.classes.map((cls, idx) => (
          <li key={idx}>{cls}</li>
        ))}
      </ul>
      <div className="flex mt-2 gap-2">
        <input
          type="text"
          placeholder="New Class"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          className="border p-1 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}