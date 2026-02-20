"use client";

import { useCallback, useRef, useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toast, useToast } from "@/components/Toast";

export default function DocumentsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [fileCategories, setFileCategories] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, showToast, removeToast } = useToast();

  const categories = [
    { id: "all", label: "All Documents" },
    { id: "supporting", label: "Supporting Materials" },
    { id: "company", label: "Company Info" },
    { id: "achievement", label: "Achievement Evidence" },
    { id: "other", label: "Other" },
  ];

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    const validFiles = fileArray.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        showToast({ message: `${file.name}: Invalid file type. Only PDF and DOC files are allowed.`, type: "error" });
        return false;
      }
      
      if (file.size > maxSize) {
        showToast({ message: `${file.name}: File too large. Maximum size is 10MB.`, type: "error" });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      showToast({ message: `${validFiles.length} file(s) uploaded successfully`, type: "success" });
      
      // TODO: Send files to backend API
    } catch (err: any) {
      showToast({ message: err?.message || "Failed to upload files", type: "error" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [showToast]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
  }, [processFiles]);

  const handleRemoveFile = useCallback((index: number) => {
    const fileName = uploadedFiles[index].name;
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFileCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[fileName];
      return newCategories;
    });
    showToast({ message: "File removed", type: "success" });
  }, [uploadedFiles, showToast]);

  const handleCategoryChange = useCallback((fileName: string, category: string) => {
    setFileCategories(prev => ({ ...prev, [fileName]: category }));
  }, []);

  const handleDownloadAll = useCallback(() => {
    if (uploadedFiles.length === 0) return;
    
    uploadedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    showToast({ message: `Downloaded ${uploadedFiles.length} file(s)`, type: "success" });
  }, [uploadedFiles, showToast]);

  const filteredFiles = uploadedFiles.filter(file => {
    if (selectedCategory === "all") return true;
    return fileCategories[file.name] === selectedCategory;
  });

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  return (
    <ErrorBoundary>
      <div className="flex h-full flex-col">
        {/* Toast notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}

        {/* Documents section */}
        <section className="flex h-full flex-1 min-h-[420px] rounded-[32px] border border-zinc-800/70 bg-black/80 px-6 py-8 text-zinc-100 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="w-full flex flex-col gap-8 overflow-auto">
            {/* Upload Section - Centered */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-3xl">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  aria-label="Upload documents"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed px-12 py-16 transition-all focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-400/50 ${
                      isDragging
                        ? "border-amber-400 bg-amber-400/10 scale-105"
                        : "border-zinc-700/50 bg-zinc-900/30 hover:border-amber-400/50 hover:bg-zinc-900/50"
                    }`}
                  >
                    {/* Folder Icon with Background */}
                    <div className="flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_8px_32px_rgba(251,191,36,0.3)]">
                      <svg 
                        className="w-16 h-16 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
                        />
                      </svg>
                    </div>
                    
                    {/* Upload Text */}
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-zinc-200">
                        {isUploading ? "Uploading..." : isDragging ? "Drop files here" : "Upload Task Related Documents*"}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-400">
                        {isDragging ? "Release to upload" : "Click to browse or drag and drop files here"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Supported: PDF, DOC, DOCX (Max 10MB per file)
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Uploaded Documents Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-lg font-semibold text-zinc-200">
                  Uploaded Documents
                </h2>
                
                {uploadedFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 border border-zinc-700/70 px-4 py-2 text-xs font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                    Download All ({uploadedFiles.length})
                  </button>
                )}
              </div>
              
              {/* Category Filter */}
              {uploadedFiles.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                        selectedCategory === cat.id
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/50"
                          : "bg-zinc-800/30 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800/50 hover:text-zinc-300"
                      }`}
                    >
                      {cat.label}
                      {cat.id !== "all" && (() => {
                        const count = uploadedFiles.filter(f => fileCategories[f.name] === cat.id).length;
                        return count > 0 ? ` (${count})` : "";
                      })()}
                    </button>
                  ))}
                </div>
              )}
              
              {filteredFiles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {isUploading && (
                    // Loading skeleton
                    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/50 p-4 animate-pulse">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 bg-zinc-800 rounded shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-zinc-800 rounded w-3/4" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {filteredFiles.map((file, index) => {
                    const actualIndex = uploadedFiles.indexOf(file);
                    return (
                    <div
                      key={`${file.name}-${actualIndex}`}
                      className="flex flex-col gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/70"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <svg 
                            className="w-8 h-8 text-amber-400 shrink-0 mt-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-200 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(actualIndex)}
                          className="text-zinc-500 hover:text-red-400 transition-colors focus:outline-none focus:text-red-400 shrink-0"
                          aria-label={`Remove ${file.name}`}
                        >
                          <svg 
                            className="w-5 h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M6 18L18 6M6 6l12 12" 
                            />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Category Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-500">Category</label>
                        <select
                          value={fileCategories[file.name] || "other"}
                          onChange={(e) => handleCategoryChange(file.name, e.target.value)}
                          className="w-full rounded-lg border border-zinc-700/70 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                        >
                          {categories.filter(c => c.id !== "all").map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-zinc-800/50">
                        <button
                          type="button"
                          onClick={() => setPreviewFile(file)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(file);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.name;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-center py-16 rounded-xl border border-zinc-800/50 bg-zinc-950/30">
                  {/* Empty State Illustration */}
                  <div className="relative">
                    <svg 
                      className="w-24 h-24 text-zinc-700" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400/20 animate-pulse" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-amber-400/10 animate-pulse" style={{ animationDelay: "0.5s" }} />
                  </div>
                  
                  <div className="max-w-sm">
                    <p className="text-lg font-semibold text-zinc-300 mb-2">No documents uploaded yet</p>
                    <p className="text-sm text-zinc-500">
                      Upload your first document to get started. You can add supporting materials, company information, or achievement evidence.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      
      {/* File Preview Modal */}
      {previewFile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-6 py-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-zinc-200 truncate">{previewFile.name}</h3>
                <p className="text-sm text-zinc-500">{(previewFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none"
                aria-label="Close preview"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {previewFile.type === "application/pdf" ? (
                <iframe
                  src={URL.createObjectURL(previewFile)}
                  className="w-full h-[600px] rounded-lg border border-zinc-800"
                  title={`Preview of ${previewFile.name}`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <svg className="w-16 h-16 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-zinc-300">Preview not available</p>
                    <p className="text-sm text-zinc-500 mt-1">This file type cannot be previewed in the browser</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = URL.createObjectURL(previewFile);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = previewFile.name;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/30 px-5 py-2.5 text-sm font-medium text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
