"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FiFileText,
    FiTrash2,
    FiEye,
    FiDownload,
    FiCpu,
    FiList,
    FiAward,
    FiBarChart2,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";

export interface UploadedFile {
    file: File;
    uploadedAt: Date;
    id: string;
}

interface FileCardProps {
    uploadedFile: UploadedFile;
    onRemove: (id: string) => void;
    onPreview: (file: File) => void;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getFileExtension(name: string): string {
    return name.split(".").pop()?.toUpperCase() || "FILE";
}

function getExtensionColor(ext: string): string {
    switch (ext) {
        case "PDF": return "bg-red-500/15 text-red-400 border-red-400/25";
        case "DOC":
        case "DOCX": return "bg-blue-500/15 text-blue-400 border-blue-400/25";
        default: return "bg-zinc-700/50 text-zinc-400 border-zinc-700";
    }
}

const AI_ACTIONS = [
    { icon: FiCpu, label: "Analyze Document", color: "text-amber-400", bg: "hover:bg-amber-400/10 hover:border-amber-400/40" },
    { icon: FiList, label: "Generate Summary", color: "text-sky-400", bg: "hover:bg-sky-400/10 hover:border-sky-400/40" },
    { icon: FiAward, label: "Detect Award Categories", color: "text-violet-400", bg: "hover:bg-violet-400/10 hover:border-violet-400/40" },
    { icon: FiBarChart2, label: "Run Gap Analysis", color: "text-emerald-400", bg: "hover:bg-emerald-400/10 hover:border-emerald-400/40" },
];

export function FileCard({ uploadedFile, onRemove, onPreview }: FileCardProps) {
    const [actionsOpen, setActionsOpen] = useState(false);
    const { file, uploadedAt, id } = uploadedFile;
    const ext = getFileExtension(file.name);
    const extColor = getExtensionColor(ext);

    const handleDownload = () => {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="group bg-[#111] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300"
        >
            {/* Card Header */}
            <div className="flex items-start gap-4 p-5">
                {/* File Type Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border text-[10px] font-black tracking-widest ${extColor}`}>
                    <FiFileText className="w-5 h-5 mb-0.5" />
                    <span>{ext}</span>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-zinc-100 truncate leading-tight">{file.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-zinc-500 font-mono">{formatBytes(file.size)}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="text-[11px] text-zinc-500">{formatDate(uploadedAt)}</span>
                    </div>
                </div>

                {/* Quick action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={() => onPreview(file)}
                        title="Preview"
                        className="p-2 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20 transition-all"
                    >
                        <FiEye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDownload}
                        title="Download"
                        className="p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 border border-transparent hover:border-emerald-400/20 transition-all"
                    >
                        <FiDownload className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onRemove(id)}
                        title="Delete"
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* AI Features Toggle */}
            <div className="border-t border-zinc-800/60">
                <button
                    onClick={() => setActionsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-3 text-[12px] font-semibold text-zinc-400 hover:text-amber-400 hover:bg-[#181818] transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <FiCpu className="w-3.5 h-3.5" />
                        AI Actions
                    </span>
                    {actionsOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>

                {/* Expandable AI actions */}
                <motion.div
                    initial={false}
                    animate={{ height: actionsOpen ? "auto" : 0, opacity: actionsOpen ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-2 gap-2 p-4 pt-1">
                        {AI_ACTIONS.map(({ icon: Icon, label, color, bg }) => (
                            <button
                                key={label}
                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-[#161616] text-[12px] font-medium text-zinc-300 transition-all duration-200 ${bg}`}
                            >
                                <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                                <span className="leading-tight text-left">{label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
