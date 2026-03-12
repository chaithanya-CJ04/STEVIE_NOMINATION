"use client";

import { motion } from "framer-motion";
import { FiFile } from "react-icons/fi";

interface UploadProgressProps {
    fileName: string;
    progress: number; // 0-100
    fileSize: string;
}

export function UploadProgress({ fileName, progress, fileSize }: UploadProgressProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 bg-[#161616] border border-zinc-800 rounded-xl p-4"
        >
            <div className="w-10 h-10 shrink-0 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <FiFile className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-zinc-100 truncate">{fileName}</p>
                <p className="text-[11px] text-zinc-500">{fileSize}</p>
                <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                    />
                </div>
                <p className="text-[10px] text-amber-400 mt-1">{progress}% uploaded</p>
            </div>
        </motion.div>
    );
}
