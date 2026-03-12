"use client";

import { AnimatePresence } from "framer-motion";
import { FileCard, UploadedFile } from "./FileCard";
import { FiInbox } from "react-icons/fi";

interface FileListProps {
    files: UploadedFile[];
    onRemove: (id: string) => void;
    onPreview: (file: File) => void;
}

export function FileList({ files, onRemove, onPreview }: FileListProps) {
    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center rounded-2xl border border-dashed border-zinc-800 bg-[#0e0e0e]">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <FiInbox className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                    <p className="text-[14px] font-semibold text-zinc-400">No documents yet</p>
                    <p className="text-[12px] text-zinc-600 mt-1">
                        Upload your first file to get started with AI analysis.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
                {files.map((uf) => (
                    <FileCard
                        key={uf.id}
                        uploadedFile={uf}
                        onRemove={onRemove}
                        onPreview={onPreview}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
