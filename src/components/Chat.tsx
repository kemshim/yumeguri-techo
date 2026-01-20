"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { getUserPreferences } from "@/lib/storage";
import { getOnsenById } from "@/data/onsen";
import { UserPreferences } from "@/types";
import OnsenCard from "./OnsenCard";

type OnsenRecommendation = {
  id: string;
  name: string;
  reason: string;
};

function parseOnsenCards(content: string): OnsenRecommendation[] {
  const match = content.match(/\[ONSEN_CARDS\]([\s\S]*?)\[\/ONSEN_CARDS\]/);
  if (!match) return [];

  try {
    // 改行や余分な空白を除去してパース
    const jsonStr = match[1].replace(/\s+/g, ' ').trim();
    const data = JSON.parse(jsonStr);
    return data.recommendations || [];
  } catch {
    return [];
  }
}

function removeOnsenCardTags(content: string): string {
  return content.replace(/\[ONSEN_CARDS\][\s\S]*?\[\/ONSEN_CARDS\]/g, "").trim();
}

export default function Chat() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      preferences,
      location,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "こんにちは！温泉おすすめAIです\n\n今日はどんな温泉をお探しですか？「近くのとろとろ温泉」「露天風呂がある温泉」など、気軽に聞いてくださいね！",
      },
    ],
  });

  // 設定と位置情報を取得
  useEffect(() => {
    const prefs = getUserPreferences();
    setPreferences(prefs);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setLocationError("位置情報を取得できませんでした");
        }
      );
    }
  }, []);

  // メッセージが追加されたらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* 位置情報ステータス */}
      {locationError && (
        <div className="px-4 py-2 bg-yellow-50 text-yellow-700 text-xs">
          {locationError}（全国の温泉からおすすめします）
        </div>
      )}

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.role === "user";
            const recommendations = !isUser ? parseOnsenCards(message.content) : [];
            const textContent = !isUser ? removeOnsenCardTags(message.content) : message.content;

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] ${
                    isUser
                      ? "bg-[var(--color-primary)] text-white rounded-2xl rounded-br-md"
                      : "bg-white border border-gray-100 rounded-2xl rounded-bl-md"
                  } px-4 py-3 shadow-sm`}
                >
                  {/* テキスト */}
                  {textContent && (
                    <p className="text-sm whitespace-pre-wrap">{textContent}</p>
                  )}

                  {/* 温泉カード */}
                  {recommendations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {recommendations.map((rec) => {
                        const onsen = getOnsenById(rec.id);
                        if (!onsen) return null;
                        return (
                          <OnsenCard
                            key={rec.id}
                            onsen={onsen}
                            reason={rec.reason}
                            compact
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ローディング */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-[var(--color-secondary)]">考え中...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <div className="border-t border-gray-100 bg-white p-4">
        <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="例：近くでとろみのある温泉に入りたい"
            className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent max-h-32"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[var(--color-primary)] text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        {/* クイック質問 */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {["近くの温泉を教えて", "露天風呂がある温泉", "とろとろの温泉"].map((q) => (
            <button
              key={q}
              onClick={() => {
                handleInputChange({ target: { value: q } } as React.ChangeEvent<HTMLTextAreaElement>);
              }}
              className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-[var(--color-secondary)] text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
