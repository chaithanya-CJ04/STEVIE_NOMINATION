"use client";

import { AnimatePresence } from "framer-motion";
import { CategoryCard, Category } from "@/components/CategoryCard";

interface CategoryListProps {
    categories: Category[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function CategoryList({ categories, selectedId, onSelect }: CategoryListProps) {
    if (!categories.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center rounded-2xl border border-dashed border-zinc-800 bg-[#0e0e0e]">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <p className="text-[14px] font-semibold text-zinc-400">No categories yet</p>
                    <p className="text-[12px] text-zinc-600 mt-1">
                        Upload a document to get AI-powered category recommendations.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {categories.map((cat, i) => (
                    <CategoryCard
                        key={cat.id}
                        category={cat}
                        rank={i + 1}
                        isSelected={selectedId === cat.id}
                        onSelect={onSelect}
                        delay={i * 0.08}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
