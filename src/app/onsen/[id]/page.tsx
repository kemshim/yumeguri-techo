"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getOnsenById } from "@/data/onsen";
import { addStamp, hasStamp } from "@/lib/storage";
import { Onsen, springQualityLabels, springQualityColors, Stamp } from "@/types";

export default function OnsenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [onsen, setOnsen] = useState<Onsen | null>(null);
  const [isStamped, setIsStamped] = useState(false);
  const [showStampAnimation, setShowStampAnimation] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const data = getOnsenById(id);
    setOnsen(data || null);

    if (data) {
      setIsStamped(hasStamp(data.id));
    }
  }, [params.id]);

  const handleStamp = () => {
    if (!onsen || isStamped) return;

    const stamp: Stamp = {
      id: crypto.randomUUID(),
      onsenId: onsen.id,
      onsenName: onsen.name,
      springQualityType: onsen.springQualityType,
      stampedAt: new Date().toISOString(),
    };

    addStamp(stamp);
    setIsStamped(true);
    setShowStampAnimation(true);

    setTimeout(() => setShowStampAnimation(false), 1500);
  };

  if (!onsen) {
    return (
      <>
        <Header title="温泉詳細" showBack onBack={() => router.back()} />
        <main className="pt-14 px-4">
          <div className="py-12 text-center text-[var(--color-secondary)]">
            温泉が見つかりませんでした
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title={onsen.name} showBack onBack={() => router.back()} />
      <main className="pt-14 pb-24">
        {/* ヒーローエリア */}
        <div
          className="h-48 flex items-center justify-center"
          style={{ backgroundColor: `${springQualityColors[onsen.springQualityType]}30` }}
        >
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-2"
              style={{ backgroundColor: springQualityColors[onsen.springQualityType] }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span
              className="px-3 py-1 rounded-full text-sm text-white"
              style={{ backgroundColor: springQualityColors[onsen.springQualityType] }}
            >
              {springQualityLabels[onsen.springQualityType]}
            </span>
          </div>
        </div>

        <div className="px-4 -mt-4">
          {/* 基本情報カード */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <h1 className="text-xl font-bold mb-1">{onsen.name}</h1>
            <p className="text-sm text-[var(--color-secondary)]">{onsen.prefecture}</p>

            {/* タグ */}
            <div className="flex flex-wrap gap-2 mt-3">
              {onsen.hasRotenburo && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">露天風呂あり</span>
              )}
              {onsen.hasSauna && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">サウナあり</span>
              )}
              {onsen.hasFamilyBath && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">家族風呂あり</span>
              )}
              {onsen.texture && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {onsen.texture === "smooth" ? "さらさら" : onsen.texture === "slight" ? "ややとろみ" : "とろとろ"}
                </span>
              )}
            </div>

            {/* 説明 */}
            <p className="text-sm mt-4 leading-relaxed">{onsen.description}</p>
          </div>

          {/* 詳細情報 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <h2 className="font-bold mb-3">詳細情報</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex">
                <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">住所</dt>
                <dd>{onsen.address}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">泉質</dt>
                <dd>{onsen.springQuality}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">効能</dt>
                <dd>{onsen.effects.join("、")}</dd>
              </div>
              {onsen.temperature && (
                <div className="flex">
                  <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">源泉温度</dt>
                  <dd>{onsen.temperature}℃</dd>
                </div>
              )}
              {onsen.sourceName && (
                <div className="flex">
                  <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">源泉名</dt>
                  <dd>{onsen.sourceName}</dd>
                </div>
              )}
              <div className="flex">
                <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">料金</dt>
                <dd>{onsen.price ? `${onsen.price.toLocaleString()}円` : "要確認"}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">営業時間</dt>
                <dd>{onsen.openingHours}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 text-[var(--color-secondary)] flex-shrink-0">定休日</dt>
                <dd>{onsen.closedDays}</dd>
              </div>
            </dl>
          </div>

          {/* アクション */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleStamp}
              disabled={isStamped}
              className={`p-4 rounded-xl border-2 transition-all ${
                isStamped
                  ? "border-[var(--color-accent)] bg-orange-50"
                  : "border-gray-200 bg-white hover:border-[var(--color-accent)]"
              }`}
            >
              <div className="text-center">
                <div className={`text-2xl mb-1 ${showStampAnimation ? "animate-bounce" : ""}`}>
                  {isStamped ? "🎉" : "📕"}
                </div>
                <p className="text-sm font-medium">
                  {isStamped ? "スタンプ済み" : "スタンプを押す"}
                </p>
              </div>
            </button>
            <button
              onClick={() => router.push(`/onsen/${onsen.id}/record`)}
              className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[var(--color-primary)] transition-all"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📝</div>
                <p className="text-sm font-medium">記録を書く</p>
              </div>
            </button>
          </div>
        </div>

        {/* スタンプアニメーション */}
        {showStampAnimation && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-ping">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-4xl"
                style={{ backgroundColor: `${springQualityColors[onsen.springQualityType]}40` }}
              >
                📕
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
