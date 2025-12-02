export interface SolarTerm {
  id: number;
  name: string;
  pinyin: string;
  translation: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  approxDate: string; // e.g., "Feb 4"
  color: string;
  description: string;
}

export interface GeminiInsightData {
  poem: string;
  advice: string;
  food: string;
}
