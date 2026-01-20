"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import { isOnboardingCompleted } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);

  useEffect(() => {
    // オンボーディング完了確認
    const completed = isOnboardingCompleted();
    if (!completed) {
      setShowOnboardingPrompt(true);
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <>
        <Header title="湯めぐり手帖" />
        <main className="pt-14 flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="animate-pulse text-[var(--color-secondary)]">読み込み中...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        title="湯めぐり手帖"
        rightElement={
          <button
            onClick={() => router.push("/onboarding")}
            className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
            title="好みを設定"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        }
      />
      <main className="pt-14">
        {/* オンボーディング誘導 */}
        {showOnboardingPrompt && (
          <div className="mx-4 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">好みを設定しませんか？</p>
                <p className="text-xs text-[var(--color-secondary)] mt-1">
                  温度や泉質など、あなたの好みを登録すると、よりぴったりの温泉をおすすめできます
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push("/onboarding")}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs rounded-lg"
                  >
                    設定する
                  </button>
                  <button
                    onClick={() => setShowOnboardingPrompt(false)}
                    className="px-4 py-2 text-[var(--color-secondary)] text-xs"
                  >
                    あとで
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* チャット */}
        <Chat />
      </main>
    </>
  );
}
