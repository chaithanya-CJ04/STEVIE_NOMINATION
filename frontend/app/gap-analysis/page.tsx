"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiEdit3,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";

// Gap Analysis Thread Interface
interface GapAnalysisThread {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: Date;
}

// Document Interface
interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  fileType: string;
}

// Mock Data
const MOCK_THREADS: GapAnalysisThread[] = [
  {
    id: "thread-1",
    title: "Add measurable KPIs for revenue growth",
    status: "in_progress",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "thread-2",
    title: "Include customer testimonials",
    status: "pending",
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "thread-3",
    title: "Draft leadership impact statement",
    status: "completed",
    createdAt: new Date("2024-01-13"),
  },
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    name: "Company Overview 2024.pdf",
    uploadDate: new Date("2024-01-15"),
    fileType: "pdf",
  },
  {
    id: "doc-2",
    name: "Financial Summary Q4.xlsx",
    uploadDate: new Date("2024-01-14"),
    fileType: "xlsx",
  },
  {
    id: "doc-3",
    name: "Customer Testimonials.docx",
    uploadDate: new Date("2024-01-13"),
    fileType: "docx",
  },
];

const formatDate = (date: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const FILE_ICON: Record<string, string> = { pdf: "📄", xlsx: "📊", docx: "📝" };

const STATUS_MAP: Record<
  GapAnalysisThread["status"],
  { label: string; cls: string }
> = {
  completed: { label: "Completed", cls: "badge-completed" },
  in_progress: { label: "In Progress", cls: "badge-in-progress" },
  pending: { label: "Pending", cls: "badge-pending" },
};

export default function GapAnalysisPage() {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white">
        <Sidebar />

        {/* Main scroll area */}
        <main className="flex-1 overflow-y-auto bg-[#0b0b0b] border-t border-l border-white/[0.04] rounded-tl-2xl">
          {/* Ambient glow */}
          <div className="pointer-events-none fixed top-24 right-16 w-[420px] h-[420px] rounded-full bg-amber-400/[0.03] blur-[120px]" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-10">

            {/* ── Page Header ── */}
            <motion.header
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-wrap items-start justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <FiBarChart2 className="w-5 h-5 text-amber-400" />
                  </div>
                  <h1 className="page-title">Gap Analysis</h1>
                </div>
                <p className="page-subtitle max-w-lg">
                  Identify missing requirements and generate action tasks to improve your nomination coverage.
                </p>
              </div>

              <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/70 text-[13px] font-semibold text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 hover:bg-zinc-800 transition-all duration-200">
                <FiRefreshCw className="w-4 h-4" />
                Run Analysis
              </button>
            </motion.header>

            {/* ── Summary Stats ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <p className="section-label mb-4">Analysis Summary</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "12", label: "Tasks Created", accent: "text-[#60a5fa]", dot: "bg-[#60a5fa]" },
                  { value: "4", label: "Topics Analyzed", accent: "text-emerald-400", dot: "bg-emerald-400" },
                  { value: "68%", label: "Avg Coverage", accent: "text-amber-400", dot: "bg-amber-400" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                    className="stat-card-dark"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        {stat.label}
                      </span>
                    </div>
                    <p className={`text-3xl font-black tracking-tight ${stat.accent}`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── Gap Analysis Threads ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="section-label flex-1">Gap Analysis Threads</p>
                <button
                  onClick={() => router.push("/gap-analysis")}
                  className="ml-4 text-[12px] font-semibold text-amber-400/70 hover:text-amber-400 transition-colors shrink-0"
                >
                  View All →
                </button>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                {MOCK_THREADS.length > 0 ? (
                  <div className="divide-y divide-white/[0.04]">
                    {MOCK_THREADS.map((thread, i) => {
                      const statusInfo = STATUS_MAP[thread.status];
                      return (
                        <motion.div
                          key={thread.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
                          onClick={() => router.push(`/gap-analysis?threadId=${thread.id}`)}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-400/[0.08] border border-amber-400/[0.12] flex items-center justify-center shrink-0">
                            <FiEdit3 className="w-3.5 h-3.5 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                              {thread.title}
                            </p>
                            <p className="text-[11px] text-zinc-600 mt-0.5">{formatDate(thread.createdAt)}</p>
                          </div>
                          <span className={`${statusInfo.cls} px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap`}>
                            {statusInfo.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <FiBarChart2 className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className="text-sm font-medium text-zinc-500">No gap analysis threads yet</p>
                    <p className="text-xs text-zinc-700 max-w-xs">Run an analysis to generate improvement threads for your nomination.</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* ── Recent Documents ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="pb-10"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="section-label flex-1">Recent Documents</p>
                <button
                  onClick={() => router.push("/documents")}
                  className="ml-4 flex items-center gap-1.5 text-[12px] font-semibold text-amber-400/70 hover:text-amber-400 transition-colors shrink-0"
                >
                  Upload New →
                </button>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/[0.04]">
                  {MOCK_DOCUMENTS.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.06, duration: 0.35 }}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-base">
                        {FILE_ICON[doc.fileType] ?? "📁"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-zinc-600 mt-0.5">{formatDate(doc.uploadDate)}</p>
                      </div>
                      <FiFileText className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
