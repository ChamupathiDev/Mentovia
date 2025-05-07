import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { RESOURCES, API_BASE_URL } from "../../../config/apiConfig";
import { useToast } from "../../common/Toast";
import { FiEdit, FiTrash2, FiArrowLeft, FiBookOpen, FiSearch } from "react-icons/fi";

export default function ResourceList() {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { addToast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch(RESOURCES.LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setList(data);
    } catch (err) {
      addToast("Failed to load resources", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      const res = await fetch(RESOURCES.DELETE(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setList(prev => prev.filter(r => r.id !== id));
      addToast("Deleted successfully", "success");
    } catch (err) {
      addToast("Delete failed", "error");
    }
  };

  // derive unique types
  const types = useMemo(() => {
    const set = new Set(list.map(r => r.type));
    return ["All", ...Array.from(set)];
  }, [list]);

  // filtered list
  const filteredList = useMemo(() => {
    return list.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase())
        || r.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || r.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [list, searchTerm, filterType]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with title, search, and filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center text-white">
            <FiBookOpen className="w-8 h-8 text-indigo-400 mr-2" />
            <h1 className="text-3xl font-bold">Learning Resource Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="py-2 px-4 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Link
              to="/admin/resources/create"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center shadow-lg hover:shadow-indigo-500/30"
            >
              + New Resource
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mb-4">
          <Link 
            to="/profile" 
            className="flex items-center text-gray-400 hover:text-indigo-400 transition-colors duration-300 ease-in-out group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
            Back to Profile
          </Link>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 transition-all duration-300 ease-in-out">
          <table className="w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400">Media</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredList.map((r) => (
                <tr 
                  key={r.id} 
                  className="hover:bg-gray-750 transition-colors duration-200 ease-in-out"
                >
                  <td className="px-6 py-4 text-sm text-gray-100 font-medium">{r.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-indigo-900/30 text-indigo-200 rounded-full text-xs font-medium">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate hover:text-clip">
                    {r.description}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`${API_BASE_URL}/resources/file/${encodeURIComponent(r.mediaLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 ease-in-out flex items-center"
                    >
                      <span className="mr-2">Preview</span>
                      <svg 
                        className="w-4 h-4 transition-transform duration-300 hover:scale-110" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2..."
                        />
                      </svg>
                    </a>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <Link
                      to={`/admin/resources/edit/${r.id}`}
                      className="text-indigo-400 hover:text-indigo-300 p-1.5 hover:bg-indigo-900/20 rounded-lg"
                      title="Edit"
                    >
                      <FiEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-900/20 rounded-lg"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Empty state */}
        {filteredList.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No resources found. Create your first resource!
          </div>
        )}
      </div>
    </div>
  );
}
