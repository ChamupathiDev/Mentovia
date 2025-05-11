import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RESOURCES } from "../../../config/apiConfig";
import { useToast } from "../../common/Toast";
import { FiSave, FiFileText, FiAlignLeft, FiFile, FiArrowLeft } from "react-icons/fi";

export default function ResourceEdit() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({ title: "", desc: "" });
  const { addToast } = useToast();
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  // Validation rules
  const validateTitle = (value) => {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    if (!value.trim()) return "Title is required.";
    if (wordCount > 20) return "Title must be below 20 words.";
    return "";
  };

  const validateDesc = (value) => {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    if (!value.trim()) return "Description is required.";
    if (wordCount > 100) return "Description must be below 100 words.";
    return "";
  };

  // Fetch existing data
  useEffect(() => {
    fetch(`${RESOURCES.LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((r) => {
        setData(r);
        setTitle(r.title);
        setDesc(r.description);
      })
      .catch(() => addToast("Cannot load resource", "error"));
  }, [id, token, addToast]);

  // Validate on change
  useEffect(() => {
    setErrors((prev) => ({ ...prev, title: validateTitle(title) }));
  }, [title]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, desc: validateDesc(desc) }));
  }, [desc]);

  const handleSave = () => {
    // Final validation before submit
    const titleError = validateTitle(title);
    const descError = validateDesc(desc);
    if (titleError || descError) {
      setErrors({ title: titleError, desc: descError });
      addToast("Please fix validation errors before saving.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("type", data.type);
    if (file) formData.append("file", file);

    fetch(RESOURCES.UPDATE_UPLOAD(id), {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((r) => (r.ok ? nav("/admin/resources") : Promise.reject()))
      .catch(() => addToast("Update failed", "error"));
  };

  const isFormValid = !errors.title && !errors.desc && title.trim() && desc.trim();

  if (!data)
    return <div className="text-center text-gray-400 mt-8">Loading resource details...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center">
      {/* Back Navigation */}
      <div className="w-full max-w-2xl mb-6 flex justify-end">
        <Link
          to="/admin/resources"
          className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center group"
        >
          <span className="mr-2">Back to Dashboard</span>
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center gap-3">
          <FiFileText className="w-8 h-8" />
          Edit Learning Resource
        </h2>

        <div className="space-y-6">
          {/* Title Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiFileText className="inline mr-2 w-4 h-4" /> Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
              placeholder="Enter resource title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Description Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiAlignLeft className="inline mr-2 w-4 h-4" /> Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 h-32 resize-none transition-all"
              placeholder="Add detailed description..."
            />
            {errors.desc && <p className="mt-1 text-sm text-red-500">{errors.desc}</p>}
          </div>

          {/* File Update Section */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiFile className="inline mr-2 w-4 h-4" /> Update File
            </label>
            <div className="text-gray-400 text-sm mb-2">
              Current File: {data.mediaLink}
            </div>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiFile className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    {file ? file.name : "Click to select new file"}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className={`w-full ${
                isFormValid
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-600 cursor-not-allowed"
              } text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
            >
              <FiSave className="w-5 h-5" /> Update Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
