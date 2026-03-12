"use client";

import { useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <form
            onSubmit={onSubmit}
            className="relative flex items-center w-full bg-[#1A1A1A] border border-zinc-800 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-[#d5ab00]/20 rounded-full transition-all duration-300 shadow-sm mx-auto p-1.5"
        >
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message or ask a question... (⌘K)"
                disabled={isLoading}
                autoComplete="off"
                className="flex-1 bg-transparent border-none text-[14px] text-zinc-100 placeholder:text-zinc-500 py-3 px-5 focus:outline-none focus:ring-0 disabled:opacity-50"
            />

            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex shrink-0 items-center justify-center p-3 w-12 h-12 rounded-full transition-all duration-300 mr-0.5
          ${input.trim() && !isLoading
                        ? "bg-gradient-to-br from-amber-400 to-[#d5ab00] text-black shadow-lg hover:shadow-[0_0_20px_rgba(213,171,0,0.4)] hover:brightness-110 active:scale-95"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                    <FiSend className="w-5 h-5 ml-[-2px] mt-[1px]" />
                )}
            </button>
        </form>
    );
}
