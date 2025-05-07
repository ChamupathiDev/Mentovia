// ResourceHub.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL, RESOURCES } from "../../config/apiConfig";

export default function ResourceHub() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch(RESOURCES.LIST, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or failed request");
        return res.json();
      })
      .then(setResources)
      .catch(err => {
        console.error("Failed to load resources:", err);
        alert("Failed to load resources");
      });
  }, []);
  

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">📚 Resource Hub</h1>
      <div className="grid gap-6">
        {resources.map(r => (
          <div key={r.id} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-xl font-semibold text-indigo-300">{r.title}</h2>
            <p className="text-gray-400 mt-2 mb-3">{r.description}</p>
            <div className="flex items-center gap-4">
              <a
                href={`${API_BASE_URL}/resources/file/${encodeURIComponent(r.mediaLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                🔗 Open Resource
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
      </div>
    </div>
  );
}
