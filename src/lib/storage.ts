import { UserPreferences, VisitRecord, Stamp, StampBookSettings } from "@/types";

// ユーザー好み設定
export function getUserPreferences(): UserPreferences | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("userPreferences");
  return data ? JSON.parse(data) : null;
}

export function saveUserPreferences(preferences: UserPreferences): void {
  localStorage.setItem("userPreferences", JSON.stringify(preferences));
}

// オンボーディング完了フラグ
export function isOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("onboardingCompleted") === "true";
}

// 訪問記録
export function getVisitRecords(): VisitRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("visitRecords");
  return data ? JSON.parse(data) : [];
}

export function saveVisitRecord(record: VisitRecord): void {
  const records = getVisitRecords();
  const existingIndex = records.findIndex((r) => r.id === record.id);
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem("visitRecords", JSON.stringify(records));
}

export function deleteVisitRecord(id: string): void {
  const records = getVisitRecords().filter((r) => r.id !== id);
  localStorage.setItem("visitRecords", JSON.stringify(records));
}

// スタンプ
export function getStamps(): Stamp[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("stamps");
  return data ? JSON.parse(data) : [];
}

export function addStamp(stamp: Stamp): void {
  const stamps = getStamps();
  if (!stamps.find((s) => s.onsenId === stamp.onsenId)) {
    stamps.push(stamp);
    localStorage.setItem("stamps", JSON.stringify(stamps));
  }
}

export function hasStamp(onsenId: string): boolean {
  return getStamps().some((s) => s.onsenId === onsenId);
}

// スタンプ帳設定
export function getStampBookSettings(): StampBookSettings {
  if (typeof window === "undefined") return { viewMode: "grid" };
  const data = localStorage.getItem("stampBookSettings");
  return data ? JSON.parse(data) : { viewMode: "grid" };
}

export function saveStampBookSettings(settings: StampBookSettings): void {
  localStorage.setItem("stampBookSettings", JSON.stringify(settings));
}
