"use client";

import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiFolder } from "react-icons/fi";

interface UploadDropzoneProps {
    isDragging: boolean;
    isUploading: boolean;
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: (files: FileList) => void;
}

export function UploadDropzone({
    isDragging,
    isUploading,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileSelect,
}: UploadDropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                onFileSelect(e.target.files);
                e.target.value = "";
            }
        },
        [onFileSelect]
    );

    return (
        <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer group rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
        ${isDragging
                    ? "border-amber-400 bg-amber-400/5 scale-[1.01]"
                    : "border-zinc-700 bg-[#111] hover:border-amber-400/60 hover:bg-[#161616]"
                }`}
        >
            {/* Animated background gradient on drag */}
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                }}
            />

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleChange}
                className="hidden"
                aria-label="Upload documents"
            />

            <div className="relative flex flex-col items-center justify-center gap-5 py-16 px-8">
                {/* Icon */}
                <motion.div
                    animate={isDragging ? { scale: 1.15, rotate: -4 } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${isDragging
                            ? "bg-gradient-to-br from-amber-400 to-amber-600"
                            : "bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/40 group-hover:bg-zinc-800/80"
                        }`}
                >
                    {isDragging ? (
                        <FiFolder className="w-9 h-9 text-black" />
                    ) : (
                        <FiUploadCloud className={`w-9 h-9 transition-colors duration-300 ${isDragging ? "text-black" : "text-amber-400"}`} />
                    )}
                </motion.div>

                {/* Text */}
                <div className="text-center space-y-2">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={isDragging ? "drag" : "normal"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="text-[17px] font-semibold text-zinc-100"
                        >
                            {isUploading
                                ? "Uploading..."
                                : isDragging
                                    ? "Drop files to upload"
                                    : "Drag & drop files here"}
                        </motion.p>
                    </AnimatePresence>
                    <p className="text-[13px] text-zinc-400">
                        or{" "}
                        <span className="text-amber-400 underline underline-offset-2 cursor-pointer hover:text-amber-300">
                            browse from your computer
                        </span>
                    </p>
                    <p className="text-[11px] text-zinc-600 tracking-wide pt-1">
                        Supports PDF, DOC, DOCX — Max 10 MB per file
                    </p>
                </div>

                {/* File type badges */}
                <div className="flex items-center gap-2.5 mt-1">
                    {["PDF", "DOC", "DOCX"].map((type) => (
                        <span
                            key={type}
                            className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-400"
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
