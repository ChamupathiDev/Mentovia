import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RESOURCES, API_BASE_URL } from "../../../config/apiConfig";
import { useToast } from "../../common/Toast";
import { FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";

export default function ResourceList() {
  const [list, setList] = useState([]);
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

  return (
    <div className="min-h-screen bg-gray-900 p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/profile" 
          className="flex items-center text-gray-400 hover:text-indigo-400 transition-colors duration-300 ease-in-out group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
          Back to Profile
        </Link>
        <Link
          to="/admin/resources/create"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center shadow-lg hover:shadow-indigo-500/30"
        >
          + New Resource
        </Link>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 transition-all duration-300 ease-in-out">
        <table className="w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400 transition-colors duration-300">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400 transition-colors duration-300">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400 transition-colors duration-300">Description</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400 transition-colors duration-300">Media</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-400 transition-colors duration-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {list.map((r) => (
              <tr 
                key={r.id} 
                className="hover:bg-gray-750 transition-colors duration-200 ease-in-out"
              >
                <td className="px-6 py-4 text-sm text-gray-100 font-medium transition-colors duration-300">{r.title}</td>
                <td className="px-6 py-4 text-sm transition-colors duration-300">
                  <span className="px-3 py-1 bg-indigo-900/30 text-indigo-200 rounded-full text-xs font-medium transition-all duration-300 ease-in-out">
                    {r.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate hover:text-clip transition-all duration-300 ease-in-out">
                  {r.description}
                </td>
                <td className="px-6 py-4 transition-colors duration-300">
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                  </a>
                </td>
                <td className="px-6 py-4 flex items-center space-x-4 transition-colors duration-300">
                  <Link
                    to={`/admin/resources/edit/${r.id}`}
                    className="text-indigo-400 hover:text-indigo-300 transition-all duration-300 ease-in-out p-1.5 hover:bg-indigo-900/20 rounded-lg"
                    title="Edit"
                  >
                    <FiEdit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-400 hover:text-red-300 transition-all duration-300 ease-in-out p-1.5 hover:bg-red-900/20 rounded-lg"
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

      {list.length === 0 && (
        <div className="text-center py-12 text-gray-500 transition-opacity duration-300 ease-in-out">
          No resources found. Create your first resource!
        </div>
      )}
    </div>
  </div>

  );
}