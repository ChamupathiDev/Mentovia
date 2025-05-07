import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RESOURCES } from "../../../config/apiConfig";
import { useToast } from "../../common/Toast";
import { FiSave, FiFileText, FiAlignLeft, FiFile, FiType, FiArrowLeft } from "react-icons/fi";

export default function ResourceForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("PDF");
  const [file, setFile] = useState(null);
  const { addToast } = useToast();
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async e => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("description", desc);
    form.append("type", type);
    form.append("file", file);

    try {
      const response = await fetch(RESOURCES.UPLOAD, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      addToast("Resource created successfully!", "success");
      nav("/admin/resources");
    } catch (error) {
      addToast("Failed to create resource", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center">
      {/* Back Navigation Outside Form */}
      <div className="w-full max-w-2xl mb-6">
        <Link
          to="/admin/resources"
          className="inline-flex items-center text-gray-400 hover:text-indigo-400 transition-colors duration-300 group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center gap-3">
          <FiFileText className="w-8 h-8" />
          New Learning Resource
        </h2>

        <div className="space-y-6">
          {/* Title Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiFileText className="inline mr-2 w-4 h-4" />
              Title
            </label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
              placeholder="Enter resource title"
            />
          </div>

          {/* Description Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiAlignLeft className="inline mr-2 w-4 h-4" />
              Description
            </label>
            <textarea
              required
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 h-32 resize-none transition-all"
              placeholder="Add detailed description..."
            />
          </div>

          {/* Type Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiType className="inline mr-2 w-4 h-4" />
              Resource Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
            >
              <option className="bg-gray-800">PDF</option>
              <option className="bg-gray-800">VIDEO</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiFile className="inline mr-2 w-4 h-4" />
              Upload File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiFile className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    {file ? file.name : "Click to select file"}
                  </p>
                </div>
                <input
                  type="file"
                  required
                  onChange={e => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiSave className="w-5 h-5" />
              Submit Resource
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


