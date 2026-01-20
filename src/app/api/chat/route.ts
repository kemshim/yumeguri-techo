import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { onsenData } from "@/data/onsen";
import { UserPreferences, Onsen } from "@/types";

export const maxDuration = 30;

// 距離計算（ハバーサインの公式）
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 温泉をスコアリング
function scoreOnsen(
  onsen: Onsen,
  preferences: UserPreferences | null,
  userLocation: { lat: number; lng: number } | null
): number {
  let score = 0;

  if (preferences) {
    // 湯のとろみ
    if (onsen.texture === preferences.texture) score += 20;

    // 泉質の好み
    if (preferences.preferredQualities.includes(onsen.springQualityType)) {
      score += 25;
    }

    // 露天風呂
    if (preferences.rotenburo === "required" && onsen.hasRotenburo) score += 15;
    if (preferences.rotenburo === "preferred" && onsen.hasRotenburo) score += 10;

    // サウナ
    if (preferences.sauna === "required" && onsen.hasSauna) score += 15;
    if (preferences.sauna === "preferred" && onsen.hasSauna) score += 10;

    // 家族風呂
    if (preferences.familyBath === "required" && onsen.hasFamilyBath) score += 15;
    if (preferences.familyBath === "preferred" && onsen.hasFamilyBath) score += 10;

    // 景観
    if (preferences.scenery !== "any" && onsen.scenery === preferences.scenery) {
      score += 15;
    }
  }

  // 距離（近いほど高スコア）
  if (userLocation) {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      onsen.latitude,
      onsen.longitude
    );
    // 100km以内なら距離に応じたボーナス
    if (distance < 100) {
      score += Math.max(0, 30 - distance * 0.3);
    }
  }

  return score;
}

// システムプロンプト生成
function generateSystemPrompt(
  preferences: UserPreferences | null,
  userLocation: { lat: number; lng: number } | null,
  nearbyOnsen: Onsen[]
): string {
  const onsenInfo = nearbyOnsen
    .map(
      (o) => `
- ID: ${o.id} | ${o.name}（${o.prefecture}）
  泉質: ${o.springQuality}
  特徴: ${o.description}
  料金: ${o.price ? `${o.price}円` : "要確認"}
  露天風呂: ${o.hasRotenburo ? "あり" : "なし"}
  サウナ: ${o.hasSauna ? "あり" : "なし"}
  家族風呂: ${o.hasFamilyBath ? "あり" : "なし"}
  湯のとろみ: ${o.texture === "smooth" ? "さらさら" : o.texture === "slight" ? "ややとろみ" : "とろとろ"}
`
    )
    .join("\n");

  const preferencesInfo = preferences
    ? `
ユーザーの好み:
- 湯のとろみ: ${preferences.texture === "smooth" ? "さらさら" : preferences.texture === "slight" ? "ややとろみ" : "とろとろ"}
- 温度: ${preferences.temperature === "lukewarm" ? "ぬるめ" : preferences.temperature === "normal" ? "普通" : "熱め"}
- 景観: ${preferences.scenery === "any" ? "こだわりなし" : preferences.scenery}
- 露天風呂: ${preferences.rotenburo === "required" ? "必須" : preferences.rotenburo === "preferred" ? "あれば嬉しい" : "こだわりなし"}
- サウナ: ${preferences.sauna === "required" ? "必須" : preferences.sauna === "preferred" ? "あれば嬉しい" : "こだわりなし"}
- 家族風呂: ${preferences.familyBath === "required" ? "必須" : preferences.familyBath === "preferred" ? "あれば嬉しい" : "こだわりなし"}
`
    : "ユーザーの好み設定はありません。";

  return `あなたは「湯めぐり手帖」の温泉おすすめAIアシスタントです。
天然温泉に詳しい、親しみやすい案内人として振る舞ってください。

【口調】
- カジュアルで親しみやすいが、敬語を使う
- 温泉好きの友達に相談するような雰囲気

【重要な制約】
- Markdownは使わない（**太字**や##見出しは禁止）
- 絵文字も使わない
- プレーンテキストのみで回答

【施設データについて】
以下のデータは「温泉地」ではなく「実際に入浴できる温浴施設」です。
施設名（例：「大滝乃湯」「竹瓦温泉」「金の湯」）で紹介してください。

【おすすめ時のルール】
1. 施設をおすすめする際は、必ず以下の形式で出力:
[ONSEN_CARDS]{"recommendations":[{"id":"1","name":"施設名","reason":"理由"}]}[/ONSEN_CARDS]

2. JSONは必ず1行で出力（改行しない）
3. 説明は簡潔に（2-3文程度）
4. なぜその施設がユーザーに合っているか説明
5. 最大3件までおすすめ
6. IDは必ず数字の文字列で出力

${preferencesInfo}

【利用可能な温浴施設データ】
${onsenInfo}

ユーザーからの質問に対して、上記のデータの中から最適な施設をおすすめしてください。
データにない施設は紹介しないでください。`;
}

export async function POST(req: Request) {
  try {
    const { messages, preferences, location } = await req.json();

    // 温泉をスコアリングしてソート
    const scoredOnsen = onsenData
      .map((onsen) => ({
        onsen,
        score: scoreOnsen(onsen, preferences, location),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => item.onsen);

    const systemPrompt = generateSystemPrompt(preferences, location, scoredOnsen);

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "チャット処理中にエラーが発生しました" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
