"use client";

import Link from "next/link";
import { Onsen, springQualityLabels, springQualityColors } from "@/types";

type OnsenCardProps = {
  onsen: Onsen;
  reason?: string;
  compact?: boolean;
};

export default function OnsenCard({ onsen, reason, compact = false }: OnsenCardProps) {
  return (
    <Link
      href={`/onsen/${onsen.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex gap-3">
          {/* 画像プレースホルダー */}
          <div
            className={`${compact ? "w-16 h-16" : "w-20 h-20"} bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0`}
            style={{ backgroundColor: `${springQualityColors[onsen.springQualityType]}20` }}
          >
            <svg
              className={`${compact ? "w-6 h-6" : "w-8 h-8"}`}
              style={{ color: springQualityColors[onsen.springQualityType] }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {/* 情報 */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium ${compact ? "text-sm" : ""} truncate`}>
              {onsen.name}
            </h4>
            <p className="text-xs text-[var(--color-secondary)] mt-0.5">
              {onsen.prefecture} / {springQualityLabels[onsen.springQualityType]}
            </p>

            {/* タグ */}
            <div className="flex flex-wrap gap-1 mt-2">
              {onsen.hasRotenburo && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                  露天
                </span>
              )}
              {onsen.hasSauna && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                  サウナ
                </span>
              )}
              {onsen.hasFamilyBath && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                  家族風呂
                </span>
              )}
              {onsen.texture === "thick" && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                  とろとろ
                </span>
              )}
            </div>

            {/* おすすめ理由 */}
            {reason && !compact && (
              <p className="text-xs text-[var(--color-secondary)] mt-2 line-clamp-2">
                {reason}
              </p>
            )}
          </div>

          {/* 料金 */}
          {!compact && onsen.price && (
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-[var(--color-primary)]">
                ¥{onsen.price.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
