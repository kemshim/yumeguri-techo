import Header from "@/components/Header";

export default function MapPage() {
  return (
    <>
      <Header title="地図で探す" />
      <main className="pt-14">
        <div className="h-[calc(100vh-8rem)] bg-gray-100 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-2">地図機能</h3>
            <p className="text-sm text-[var(--color-secondary)]">
              Phase 3で実装予定
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
