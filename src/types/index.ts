// 泉質タイプ
export type SpringQualityType =
  | 'simple'        // 単純泉
  | 'chloride'      // 塩化物泉
  | 'bicarbonate'   // 炭酸水素塩泉
  | 'sulfur'        // 硫黄泉
  | 'sulfate'       // 硫酸塩泉
  | 'iron'          // 鉄泉
  | 'acidic'        // 酸性泉
  | 'radioactive';  // 放射能泉

// 温泉マスターデータ
export type Onsen = {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  latitude: number;
  longitude: number;
  springQuality: string;
  springQualityType: SpringQualityType;
  effects: string[];
  price: number | null;
  openingHours: string;
  closedDays: string;
  sourceName: string;
  temperature: number | null;
  flowRate: number | null;
  url: string | null;
  imageUrl: string | null;
  texture: 'smooth' | 'slight' | 'thick' | null;
  scenery: string | null;
  hasSauna: boolean;
  hasRotenburo: boolean;
  hasFamilyBath: boolean;
  description: string;
};

// ユーザー好み設定
export type UserPreferences = {
  id: string;
  texture: 'smooth' | 'slight' | 'thick';
  temperature: 'lukewarm' | 'normal' | 'hot';
  scenery: 'mountain' | 'sea' | 'river' | 'town' | 'any';
  sauna: 'required' | 'preferred' | 'unnecessary';
  rotenburo: 'required' | 'preferred' | 'unnecessary';
  familyBath: 'required' | 'preferred' | 'unnecessary';
  preferredQualities: SpringQualityType[];
  createdAt: string;
  updatedAt: string;
};

// 訪問記録
export type VisitRecord = {
  id: string;
  onsenId: string;
  visitDate: string;
  rating: number;
  memo: string;
  photos: string[];
  isFavorite: boolean;
  springQualityMemo: string;
  priceMemo: string;
  createdAt: string;
  updatedAt: string;
};

// スタンプ
export type Stamp = {
  id: string;
  onsenId: string;
  onsenName: string;
  springQualityType: SpringQualityType;
  stampedAt: string;
};

// スタンプ帳の表示設定
export type StampBookSettings = {
  viewMode: 'page' | 'grid';
};

// 泉質タイプのラベルマッピング
export const springQualityLabels: Record<SpringQualityType, string> = {
  simple: '単純泉',
  chloride: '塩化物泉',
  bicarbonate: '炭酸水素塩泉',
  sulfur: '硫黄泉',
  sulfate: '硫酸塩泉',
  iron: '鉄泉',
  acidic: '酸性泉',
  radioactive: '放射能泉',
};

// 泉質タイプのカラーマッピング
export const springQualityColors: Record<SpringQualityType, string> = {
  simple: '#7DD3FC',
  chloride: '#3B82F6',
  bicarbonate: '#22C55E',
  sulfur: '#FACC15',
  sulfate: '#A855F7',
  iron: '#A16207',
  acidic: '#F97316',
  radioactive: '#EAB308',
};
