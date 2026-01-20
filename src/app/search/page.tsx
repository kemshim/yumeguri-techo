import Header from "@/components/Header";

export default function SearchPage() {
  return (
    <>
      <Header title="温泉を探す" />
      <main className="pt-14 px-4">
        <div className="py-6">
          {/* 検索フォーム */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <input
              type="text"
              placeholder="温泉名で検索"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>

          {/* フィルター */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button className="flex-shrink-0 px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-full">
              すべて
            </button>
            <button className="flex-shrink-0 px-4 py-2 bg-white text-[var(--color-secondary)] text-sm rounded-full border border-gray-200">
              単純泉
            </button>
            <button className="flex-shrink-0 px-4 py-2 bg-white text-[var(--color-secondary)] text-sm rounded-full border border-gray-200">
              硫黄泉
            </button>
            <button className="flex-shrink-0 px-4 py-2 bg-white text-[var(--color-secondary)] text-sm rounded-full border border-gray-200">
              塩化物泉
            </button>
            <button className="flex-shrink-0 px-4 py-2 bg-white text-[var(--color-secondary)] text-sm rounded-full border border-gray-200">
              炭酸水素塩泉
            </button>
          </div>

          {/* 検索結果 */}
          <div>
            <p className="text-sm text-[var(--color-secondary)] mb-3">10件の温泉が見つかりました</p>
            <div className="space-y-3">
              <p className="text-center text-[var(--color-secondary)] py-8">
                温泉データはPhase 1で作成予定
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
