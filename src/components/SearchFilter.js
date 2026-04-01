export default function SearchFilter({ search, setSearch, levelFilter, setLevelFilter, paymentFilter, setPaymentFilter }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-1 rounded flex-1 min-w-[150px]"
      />

      <select
        value={levelFilter}
        onChange={(e) => setLevelFilter(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">All Payments</option>
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
      </select>
    </div>
  );
}