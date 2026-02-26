"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FiHome, FiUpload, FiBarChart, FiFileText, FiTrendingUp, FiCheckSquare, FiEdit, FiFileText as FiFile } from "react-icons/fi";

// Gap Analysis Thread Interface
interface GapAnalysisThread {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
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
    id: 'thread-1',
    title: 'Add measurable KPIs for revenue growth',
    status: 'in_progress',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'thread-2',
    title: 'Include customer testimonials',
    status: 'pending',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: 'thread-3',
    title: 'Draft leadership impact statement',
    status: 'completed',
    createdAt: new Date('2024-01-13'),
  },
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Company Overview 2024.pdf',
    uploadDate: new Date('2024-01-15'),
    fileType: 'pdf',
  },
  {
    id: 'doc-2',
    name: 'Financial Summary Q4.xlsx',
    uploadDate: new Date('2024-01-14'),
    fileType: 'xlsx',
  },
  {
    id: 'doc-3',
    name: 'Customer Testimonials.docx',
    uploadDate: new Date('2024-01-13'),
    fileType: 'docx',
  },
];

// Helper function to format date
const formatDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export default function GapAnalysisPage() {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 flex flex-col h-screen w-screen overflow-hidden bg-black">
        {/* Top Bar */}
        <header className="w-full border-b border-zinc-800/60 bg-black/60 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/stevie-awards-banner.png"
                alt="Stevie Awards Banner"
                className="h-12 w-auto object-contain"
              />
              <span className="hidden sm:block text-base font-medium text-zinc-200 tracking-wide">
                Stevie Awards Recommendation System
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Navigation */}
          <aside className="w-80 flex-shrink-0 bg-[#0a0a0a] p-8 flex flex-col border-r border-zinc-900">
            <div className="flex-1">
              <nav className="space-y-2">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                >
                  <FiHome className="h-5 w-5" />
                  Dashboard
                </button>

                <button
                  onClick={() => router.push("/documents")}
                  className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                >
                  <FiUpload className="h-5 w-5" />
                  Upload Doc
                </button>

                <button
                  onClick={() => router.push("/gap-analysis")}
                  className="w-full flex items-center gap-4 px-5 py-4 text-base font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg transition-all"
                  aria-current="page"
                >
                  <FiBarChart className="h-5 w-5" />
                  Gap Analysis
                </button>

                <button
                  onClick={() => router.push("/summary")}
                  className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                >
                  <FiFileText className="h-5 w-5" />
                  Summary
                </button>

                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                >
                  <FiTrendingUp className="h-5 w-5" />
                  Forecast
                </button>

                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                >
                  <FiCheckSquare className="h-5 w-5" />
                  Category Confirmation
                </button>
              </nav>
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-800/70">
              <button className="w-full px-5 py-3 text-sm font-medium text-zinc-400 border border-zinc-800 rounded-xl hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-black p-8 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-100">Gap Analysis</h1>
                <p className="text-zinc-400">Identify missing requirements and generate tasks to improve project coverage</p>
              </div>

              {/* Analysis Summary Card */}
              <div className="rounded-2xl bg-zinc-900 p-6 shadow-sm border border-zinc-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">Analysis Summary</h2>
                    <p className="text-xs text-zinc-400 mt-1">Overview of your gap analysis progress</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all">
                    <FiEdit className="h-4 w-4" />
                    Run Analysis
                  </button>
                </div>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-2xl font-bold text-blue-900">12</p>
                    <p className="text-sm text-blue-700">Tasks Created</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-2xl font-bold text-green-900">4</p>
                    <p className="text-sm text-green-700">Topics Analyzed</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-4">
                    <p className="text-2xl font-bold text-amber-900">68%</p>
                    <p className="text-sm text-amber-700">Avg Coverage</p>
                  </div>
                </div>
              </div>

              {/* Gap Analysis Threads Card */}
              <div className="rounded-2xl bg-zinc-900 p-6 shadow-sm border border-zinc-800">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-zinc-100">Gap Analysis Threads</h2>
                  <button 
                    onClick={() => router.push("/gap-analysis")}
                    className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all"
                  >
                    View All
                  </button>
                </div>
                
                {/* Thread List */}
                {MOCK_THREADS.length > 0 ? (
                  <div className="space-y-3">
                    {MOCK_THREADS.map((thread) => (
                      <div
                        key={thread.id}
                        onClick={() => router.push(`/gap-analysis?threadId=${thread.id}`)}
                        className="rounded-lg border border-zinc-800 p-4 hover:bg-zinc-800/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-semibold text-zinc-100 flex-1">
                            {thread.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                              thread.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : thread.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {thread.status === 'completed'
                              ? 'Completed'
                              : thread.status === 'in_progress'
                              ? 'In Progress'
                              : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm font-medium text-zinc-400">No gap analysis threads yet</p>
                  </div>
                )}
              </div>

              {/* Recent Documents Card */}
              <div className="rounded-2xl bg-zinc-900 p-6 shadow-sm border border-zinc-800">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-zinc-100">Recent Documents</h2>
                  <button 
                    onClick={() => router.push("/documents")}
                    className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all"
                  >
                    Upload New Document
                  </button>
                </div>
                
                {/* Document List */}
                <div className="space-y-2">
                  {MOCK_DOCUMENTS.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <FiFile className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-100 truncate">
                          {document.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {formatDate(document.uploadDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <button 
                    onClick={() => router.push("/documents")}
                    className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-all"
                  >
                    View All Documents →
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
