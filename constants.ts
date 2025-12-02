import { SolarTerm } from './types';

// Colors representing the gradient of seasons
const SPRING_COLOR = "#86efac"; // green-300
const SUMMER_COLOR = "#fca5a5"; // red-300
const AUTUMN_COLOR = "#fde047"; // yellow-300
const WINTER_COLOR = "#93c5fd"; // blue-300

export const SOLAR_TERMS: SolarTerm[] = [
  // Spring
  { id: 1, name: "立春", pinyin: "Lìchūn", translation: "春季开始", season: "Spring", approxDate: "Feb 4", color: "#bef264", description: "春回大地，万物复苏。" },
  { id: 2, name: "雨水", pinyin: "Yǔshuǐ", translation: "降雨开始", season: "Spring", approxDate: "Feb 19", color: "#a3e635", description: "降雨增多，草木萌动。" },
  { id: 3, name: "惊蛰", pinyin: "Jīngzhé", translation: "春雷乍动", season: "Spring", approxDate: "Mar 5", color: "#84cc16", description: "春雷始鸣，惊醒蛰伏昆虫。" },
  { id: 4, name: "春分", pinyin: "Chūnfēn", translation: "昼夜平分", season: "Spring", approxDate: "Mar 20", color: "#65a30d", description: "昼夜等长，春色正浓。" },
  { id: 5, name: "清明", pinyin: "Qīngmíng", translation: "气清景明", season: "Spring", approxDate: "Apr 4", color: "#4d7c0f", description: "天朗气清，春耕开始。" },
  { id: 6, name: "谷雨", pinyin: "Gǔyǔ", translation: "雨生百谷", season: "Spring", approxDate: "Apr 20", color: "#3f6212", description: "雨水充足，利于谷物生长。" },

  // Summer
  { id: 7, name: "立夏", pinyin: "Lìxià", translation: "夏季开始", season: "Summer", approxDate: "May 5", color: "#fca5a5", description: "万物生长，夏日初长。" },
  { id: 8, name: "小满", pinyin: "Xiǎomǎn", translation: "物致于此小得盈满", season: "Summer", approxDate: "May 21", color: "#f87171", description: "麦类灌浆，小得盈满。" },
  { id: 9, name: "芒种", pinyin: "Mángzhòng", translation: "有芒之谷不可不种", season: "Summer", approxDate: "Jun 5", color: "#ef4444", description: "有芒作物开始播种。" },
  { id: 10, name: "夏至", pinyin: "Xiàzhì", translation: "白昼最长", season: "Summer", approxDate: "Jun 21", color: "#dc2626", description: "炎热将至，白昼最长。" },
  { id: 11, name: "小暑", pinyin: "Xiǎoshǔ", translation: "小热", season: "Summer", approxDate: "Jul 7", color: "#b91c1c", description: "天气开始炎热，但未极点。" },
  { id: 12, name: "大暑", pinyin: "Dàshǔ", translation: "大热", season: "Summer", approxDate: "Jul 22", color: "#991b1b", description: "一年中最热的时期。" },

  // Autumn
  { id: 13, name: "立秋", pinyin: "Lìqiū", translation: "秋季开始", season: "Autumn", approxDate: "Aug 7", color: "#fcd34d", description: "凉风至，秋季开始。" },
  { id: 14, name: "处暑", pinyin: "Chǔshǔ", translation: "出暑", season: "Autumn", approxDate: "Aug 23", color: "#fbbf24", description: "炎热暑气即将结束。" },
  { id: 15, name: "白露", pinyin: "Báilù", translation: "露凝而白", season: "Autumn", approxDate: "Sep 7", color: "#f59e0b", description: "天气转凉，夜间露水凝结。" },
  { id: 16, name: "秋分", pinyin: "Qiūfēn", translation: "昼夜平分", season: "Autumn", approxDate: "Sep 23", color: "#d97706", description: "昼夜平分，秋意渐浓。" },
  { id: 17, name: "寒露", pinyin: "Hánlù", translation: "露水寒冷", season: "Autumn", approxDate: "Oct 8", color: "#b45309", description: "露水寒冷，将欲凝结。" },
  { id: 18, name: "霜降", pinyin: "Shuāngjiàng", translation: "气肃而凝", season: "Autumn", approxDate: "Oct 23", color: "#92400e", description: "天气渐冷，初霜出现。" },

  // Winter
  { id: 19, name: "立冬", pinyin: "Lìdōng", translation: "冬季开始", season: "Winter", approxDate: "Nov 7", color: "#93c5fd", description: "万物收藏，冬季开始。" },
  { id: 20, name: "小雪", pinyin: "Xiǎoxuě", translation: "小雪纷飞", season: "Winter", approxDate: "Nov 22", color: "#60a5fa", description: "气温下降，开始降雪。" },
  { id: 21, name: "大雪", pinyin: "Dàxuě", translation: "瑞雪兆丰年", season: "Winter", approxDate: "Dec 7", color: "#3b82f6", description: "降雪量增多，地面积雪。" },
  { id: 22, name: "冬至", pinyin: "Dōngzhì", translation: "极致之冬", season: "Winter", approxDate: "Dec 21", color: "#2563eb", description: "白昼最短，寒冷将至。" },
  { id: 23, name: "小寒", pinyin: "Xiǎohán", translation: "寒冷", season: "Winter", approxDate: "Jan 5", color: "#1d4ed8", description: "气候开始寒冷。" },
  { id: 24, name: "大寒", pinyin: "Dàhán", translation: "极寒", season: "Winter", approxDate: "Jan 20", color: "#1e40af", description: "一年中最寒冷的时候。" },
];