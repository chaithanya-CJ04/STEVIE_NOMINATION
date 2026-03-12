"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toast, useToast } from "@/components/Toast";
import { Sidebar } from "@/components/Sidebar";
import { UploadDropzone } from "@/components/UploadDropzone";
import { UploadProgress } from "@/components/UploadProgress";
import { FileList } from "@/components/FileList";
import type { UploadedFile } from "@/components/FileCard";
import { FiUploadCloud, FiFolder, FiTrash2 } from "react-icons/fi";

const VALID_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

interface ProgressEntry {
  id: string;
  name: string;
  size: number;
  progress: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DocumentsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [progressItems, setProgressItems] = useState<ProgressEntry[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  // ── Drag event handlers ─────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── File processing ─────────────────────────────────────
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const valid = fileArray.filter((f) => {
        if (!VALID_TYPES.includes(f.type)) {
          showToast({ message: `${f.name}: unsupported file type.`, type: "error" });
          return false;
        }
        if (f.size > MAX_SIZE) {
          showToast({ message: `${f.name}: exceeds 10 MB limit.`, type: "error" });
          return false;
        }
        return true;
      });

      if (!valid.length) return;

      // Build initial progress entries
      const newEntries: ProgressEntry[] = valid.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        progress: 0,
      }));

      setProgressItems((prev) => [...prev, ...newEntries]);

      // Simulate progress for each file
      await Promise.all(
        newEntries.map(async (entry) => {
          for (let p = 10; p <= 100; p += 10) {
            await new Promise((r) => setTimeout(r, 80));
            setProgressItems((prev) =>
              prev.map((e) => (e.id === entry.id ? { ...e, progress: p } : e))
            );
          }
          // Move to uploaded list
          const file = valid.find((f) => f.name === entry.name)!;
          setUploadedFiles((prev) => [
            { file, uploadedAt: new Date(), id: entry.id },
            ...prev,
          ]);
          // Remove progress entry
          setProgressItems((prev) => prev.filter((e) => e.id !== entry.id));
        })
      );

      showToast({
        message: `${valid.length} file(s) uploaded successfully`,
        type: "success",
      });
    },
    [showToast]
  );

  const handleFileSelect = useCallback(
    (files: FileList) => processFiles(files),
    [processFiles]
  );

  const handleRemove = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
    showToast({ message: "All files removed", type: "success" });
  }, [showToast]);

  return (
    <ErrorBoundary>
      {/* Toasts */}
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
      ))}

      <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0b0b0b] border-t border-l border-zinc-900 rounded-tl-2xl">
          {/* Subtle ambient glow */}
          <div className="pointer-events-none absolute top-20 right-20 w-96 h-96 rounded-full bg-amber-400/5 blur-[120px]" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-10">
            {/* ── Page Header ── */}
            <header className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
                    <FiUploadCloud className="w-5 h-5 text-amber-400" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    Document Upload
                  </h1>
                </div>
                <p className="text-[13px] text-zinc-500 max-w-lg">
                  Upload supporting materials, company information, or achievement evidence. Our AI will analyze your documents and suggest the best Stevie Award categories.
                </p>
              </div>

              {/* Stats chip */}
              {uploadedFiles.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[12px] font-semibold text-zinc-300">
                    <FiFolder className="w-4 h-4 text-amber-400" />
                    {uploadedFiles.length} {uploadedFiles.length === 1 ? "Document" : "Documents"}
                  </div>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-900/50 bg-red-900/10 text-[12px] font-semibold text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              )}
            </header>

            {/* ── Dropzone ── */}
            <UploadDropzone
              isDragging={isDragging}
              isUploading={progressItems.length > 0}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
            />

            {/* ── Upload Progress Items ── */}
            <AnimatePresence>
              {progressItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 px-1">
                    Uploading…
                  </p>
                  {progressItems.map((item) => (
                    <UploadProgress
                      key={item.id}
                      fileName={item.name}
                      fileSize={formatBytes(item.size)}
                      progress={item.progress}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Uploaded Documents ── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-zinc-300 uppercase tracking-wider">
                  Uploaded Documents
                </h2>
                {uploadedFiles.length > 0 && (
                  <span className="text-[11px] text-zinc-600 font-mono">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <FileList
                files={uploadedFiles}
                onRemove={handleRemove}
                onPreview={setPreviewFile}
              />
            </section>
          </div>
        </main>
      </div>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-[#101010] border border-zinc-800 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-[14px] font-semibold text-zinc-100 truncate">{previewFile.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{formatBytes(previewFile.size)}</p>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
                {previewFile.type === "application/pdf" ? (
                  <iframe
                    src={URL.createObjectURL(previewFile)}
                    className="w-full h-[600px] rounded-xl border border-zinc-800 bg-zinc-900"
                    title={`Preview: ${previewFile.name}`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                      <FiUploadCloud className="w-7 h-7 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-zinc-300">Preview not available</p>
                      <p className="text-[12px] text-zinc-500 mt-1">
                        DOC/DOCX files cannot be previewed in the browser.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const url = URL.createObjectURL(previewFile);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = previewFile.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[13px] font-semibold text-amber-400 hover:bg-amber-400/20 transition"
                    >
                      Download File
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
