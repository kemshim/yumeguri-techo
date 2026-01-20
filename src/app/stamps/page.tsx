"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function StampsPage() {
  const [viewMode, setViewMode] = useState<"page" | "grid">("grid");

  return (
    <>
      <Header
        title="スタンプ帳"
        rightElement={
          <button
            onClick={() => setViewMode(viewMode === "page" ? "grid" : "page")}
            className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          >
            {viewMode === "page" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
          </button>
        }
      />
      <main className="pt-14 px-4">
        <div className="py-6">
          {/* 統計 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--color-primary)]">0</p>
                <p className="text-xs text-[var(--color-secondary)]">収集したスタンプ</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--color-secondary)]">コンプリート率</p>
                <p className="text-lg font-bold">0%</p>
              </div>
            </div>
          </div>

          {/* スタンプ帳 */}
          <div className="washi-texture rounded-xl p-6 min-h-[400px]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-3 gap-4">
                {/* サンプルスタンプ（未取得） */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white/50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                  >
                    <div className="text-center opacity-30">
                      <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--color-secondary)]">ページめくり表示</p>
                <p className="text-sm text-[var(--color-secondary)] mt-2">（Phase 5で実装予定）</p>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-[var(--color-secondary)] mt-4">
            温泉を訪れてスタンプを集めよう！
          </p>
        </div>
      </main>
    </>
  );
}
