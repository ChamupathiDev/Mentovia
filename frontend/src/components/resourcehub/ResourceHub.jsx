// src/components/ResourceHub.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL, RESOURCES } from "../../config/apiConfig";

export default function ResourceHub() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [error, setError] = useState(null);

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
  }, [resources, searchText, typeFilter]);

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

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

      {/* Single-column Resource cards */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.map(r => (
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
    </div>
  );
}
