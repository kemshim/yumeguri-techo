import Header from "@/components/Header";

export default function RecordsPage() {
  return (
    <>
      <Header title="訪問記録" />
      <main className="pt-14 px-4">
        <div className="py-6">
          {/* タブ */}
          <div className="flex gap-2 mb-6">
            <button className="flex-1 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg font-medium">
              すべて
            </button>
            <button className="flex-1 py-2 bg-white text-[var(--color-secondary)] text-sm rounded-lg border border-gray-200">
              お気に入り
            </button>
          </div>

          {/* 空の状態 */}
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-2">まだ記録がありません</h3>
            <p className="text-sm text-[var(--color-secondary)] mb-4">
              温泉を訪れたら記録をつけてみましょう
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              温泉を探す
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
