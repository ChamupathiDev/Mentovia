// src/components/ResourceHub.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL, RESOURCES } from "../../config/apiConfig";

export default function ResourceHub() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 3; // Number of cards per page

  // Fetch resources once
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(RESOURCES.LIST, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or failed request");
        return res.json();
      })
      .then(data => {
        setResources(data);
        setFiltered(data);
      })
      .catch(err => {
        console.error("Failed to load resources:", err);
        setError("Failed to load resources");
      });
  }, []);

  // Recompute filtered list whenever searchText or typeFilter changes
  useEffect(() => {
    let list = resources;
    if (typeFilter !== "ALL") {
      list = list.filter(r => r.type.toUpperCase() === typeFilter);
    }
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(lower));
    }
    setFiltered(list);
    setCurrentPage(1); // Reset to first page on filter change
  }, [resources, searchText, typeFilter]);

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentResources = filtered.slice(startIdx, startIdx + pageSize);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">📚 Resource Hub</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="w-48 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">All Types</option>
          <option value="PDF">PDF</option>
          <option value="VIDEO">VIDEO</option>
        </select>
      </div>

      {/* Paginated Resource cards */}
      <div className="grid grid-cols-1 gap-6">
        {currentResources.map(r => (
          <div
            key={r.id}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 h-48 flex flex-col justify-between w-full"
          >
            <div>
              <h2 className="text-xl font-semibold text-indigo-300">{r.title}</h2>
              <p className="text-gray-400 mt-2 line-clamp-3">
                {r.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`${API_BASE_URL}/resources/file/${encodeURIComponent(r.mediaLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                🔗 Open
              </a>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${API_BASE_URL}/resources/file/${encodeURIComponent(r.mediaLink)}`
                  )
                }
                className="text-sm bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
              >
                Copy URL
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400">
            No resources match your filters.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${
                page === currentPage ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
