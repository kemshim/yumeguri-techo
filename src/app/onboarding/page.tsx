"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { UserPreferences, SpringQualityType, springQualityLabels } from "@/types";

type Step = {
  id: keyof Omit<UserPreferences, "id" | "createdAt" | "updatedAt">;
  title: string;
  description: string;
  options: { value: string; label: string; emoji: string }[];
  multiple?: boolean;
};

const steps: Step[] = [
  {
    id: "texture",
    title: "お湯のとろみ",
    description: "好みのお湯の質感を教えてください",
    options: [
      { value: "smooth", label: "さらさら", emoji: "💧" },
      { value: "slight", label: "ややとろみ", emoji: "🫧" },
      { value: "thick", label: "とろとろ", emoji: "🍯" },
    ],
  },
  {
    id: "temperature",
    title: "お湯の温度",
    description: "好みの温度帯を教えてください",
    options: [
      { value: "lukewarm", label: "ぬるめ (38-40℃)", emoji: "🌡️" },
      { value: "normal", label: "普通 (40-42℃)", emoji: "♨️" },
      { value: "hot", label: "熱め (42℃以上)", emoji: "🔥" },
    ],
  },
  {
    id: "scenery",
    title: "景観",
    description: "どんなロケーションが好きですか？",
    options: [
      { value: "mountain", label: "山", emoji: "🏔️" },
      { value: "sea", label: "海", emoji: "🌊" },
      { value: "river", label: "渓流", emoji: "🏞️" },
      { value: "town", label: "街中", emoji: "🏘️" },
      { value: "any", label: "こだわらない", emoji: "✨" },
    ],
  },
  {
    id: "rotenburo",
    title: "露天風呂",
    description: "露天風呂へのこだわりは？",
    options: [
      { value: "required", label: "必須", emoji: "🌙" },
      { value: "preferred", label: "あれば嬉しい", emoji: "👍" },
      { value: "unnecessary", label: "なくてもOK", emoji: "🙆" },
    ],
  },
  {
    id: "sauna",
    title: "サウナ",
    description: "サウナへのこだわりは？",
    options: [
      { value: "required", label: "必須", emoji: "🧖" },
      { value: "preferred", label: "あれば嬉しい", emoji: "👍" },
      { value: "unnecessary", label: "なくてもOK", emoji: "🙆" },
    ],
  },
  {
    id: "familyBath",
    title: "家族風呂",
    description: "家族風呂へのこだわりは？",
    options: [
      { value: "required", label: "必須", emoji: "👨‍👩‍👧" },
      { value: "preferred", label: "あれば嬉しい", emoji: "👍" },
      { value: "unnecessary", label: "なくてもOK", emoji: "🙆" },
    ],
  },
  {
    id: "preferredQualities",
    title: "好みの泉質",
    description: "気になる泉質を選んでください（複数可）",
    options: Object.entries(springQualityLabels).map(([value, label]) => ({
      value,
      label,
      emoji: getSpringQualityEmoji(value as SpringQualityType),
    })),
    multiple: true,
  },
];

function getSpringQualityEmoji(type: SpringQualityType): string {
  const emojis: Record<SpringQualityType, string> = {
    simple: "💧",
    chloride: "🌊",
    bicarbonate: "🫧",
    sulfur: "💨",
    sulfate: "💎",
    iron: "🫖",
    acidic: "🍋",
    radioactive: "✨",
  };
  return emojis[type];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    preferredQualities: [],
  });

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSelect = (value: string) => {
    if (step.multiple) {
      const current = (answers[step.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [step.id]: updated });
    } else {
      setAnswers({ ...answers, [step.id]: value });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 保存してホームへ
      const preferences: UserPreferences = {
        id: crypto.randomUUID(),
        texture: answers.texture as UserPreferences["texture"],
        temperature: answers.temperature as UserPreferences["temperature"],
        scenery: answers.scenery as UserPreferences["scenery"],
        sauna: answers.sauna as UserPreferences["sauna"],
        rotenburo: answers.rotenburo as UserPreferences["rotenburo"],
        familyBath: answers.familyBath as UserPreferences["familyBath"],
        preferredQualities: answers.preferredQualities as SpringQualityType[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      localStorage.setItem("onboardingCompleted", "true");
      router.push("/");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    if (step.multiple) {
      return (answers[step.id] as string[])?.length > 0;
    }
    return !!answers[step.id];
  };

  return (
    <>
      <Header
        title="好みの設定"
        showBack={currentStep > 0}
        onBack={handleBack}
      />
      <main className="pt-14 px-4">
        <div className="py-6">
          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-[var(--color-secondary)] mb-2">
              <span>ステップ {currentStep + 1} / {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 質問 */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">{step.title}</h2>
            <p className="text-[var(--color-secondary)] text-sm">
              {step.description}
            </p>
          </div>

          {/* 選択肢 */}
          <div className="space-y-3 mb-8">
            {step.options.map((option) => {
              const isSelected = step.multiple
                ? (answers[step.id] as string[])?.includes(option.value)
                : answers[step.id] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className={`font-medium ${isSelected ? "text-[var(--color-primary)]" : ""}`}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-[var(--color-primary)] ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 次へボタン */}
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {currentStep < steps.length - 1 ? "次へ" : "設定を完了"}
          </button>

          {/* スキップ */}
          {currentStep === 0 && (
            <button
              onClick={() => {
                localStorage.setItem("onboardingCompleted", "true");
                router.push("/");
              }}
              className="w-full py-3 text-[var(--color-secondary)] text-sm mt-3"
            >
              スキップして始める
            </button>
          )}
        </div>
      </main>
    </>
  );
}
