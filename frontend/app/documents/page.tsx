"use client";

import { useCallback, useRef, useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toast, useToast } from "@/components/Toast";

export default function DocumentsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, showToast, removeToast } = useToast();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
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
      // const formData = new FormData();
      // validFiles.forEach(file => formData.append('files', file));
      // await fetch('/api/upload', { method: 'POST', body: formData });
    } catch (err: any) {
      showToast({ message: err?.message || "Failed to upload files", type: "error" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [showToast]);

  const handleRemoveFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    showToast({ message: "File removed", type: "success" });
  }, [showToast]);

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
        <section className="flex h-full flex-1 min-h-[420px] rounded-[32px] border border-zinc-800/70 bg-black/80 px-10 py-12 text-zinc-100 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
          <div className="w-full flex flex-col gap-8">
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
                    className="flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-zinc-700/50 bg-zinc-900/30 px-12 py-16 transition-all hover:border-amber-400/50 hover:bg-zinc-900/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-400/50"
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
                        {isUploading ? "Uploading..." : "Upload Task Related Documents*"}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-400">
                        Click to browse or drag and drop files here
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
              <h2 className="text-lg font-semibold text-zinc-200">
                Uploaded Documents
              </h2>
              
              {uploadedFiles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
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
                          onClick={() => handleRemoveFile(index)}
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-center py-12 rounded-xl border border-zinc-800/50 bg-zinc-950/30">
                  <svg 
                    className="w-12 h-12 text-zinc-600" 
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
                  <div>
                    <p className="text-base font-medium text-zinc-400">No documents uploaded yet</p>
                    <p className="text-sm text-zinc-500 mt-1">Upload your first document to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}
