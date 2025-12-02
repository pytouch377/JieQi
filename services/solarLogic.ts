import { SOLAR_TERMS } from '../constants';
import { SolarTerm } from '../types';

/**
 * A simplified calculation to find the current solar term.
 * Note: Real solar terms depend on astronomical longitude, but for this UI app,
 * we will use the approximate date ranges defined in constants.
 */
export const getCurrentSolarTerm = (): SolarTerm => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentDay = now.getDate();

  // Convert current date to a comparable number (Month * 100 + Day)
  const currentVal = (currentMonth + 1) * 100 + currentDay;

  // Sort terms by date to find the correct range
  // We need to handle the year wrap-around (Jan is after Dec contextually for the loop)
  // Our constant list starts with Feb (Lichun).
  
  // Let's create a mapped list with date values
  const termsWithVal = SOLAR_TERMS.map(term => {
    const [monthStr, dayStr] = term.approxDate.split(' ');
    const monthMap: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    const val = monthMap[monthStr] * 100 + parseInt(dayStr, 10);
    return { ...term, val };
  });

  // Find the term where currentVal >= term.val
  // Since the array is sorted roughly Feb -> Jan, we need to handle Jan carefully.
  // Standard order in array: Feb, ..., Dec, Jan.
  
  // Re-sort chronologically for search: Jan -> Dec
  const chronological = [...termsWithVal].sort((a, b) => a.val - b.val);

  let currentTerm = chronological[chronological.length - 1]; // Default to last one (late Dec/Jan)

  for (let i = 0; i < chronological.length; i++) {
    if (currentVal < chronological[i].val) {
      // If we haven't reached this term yet, the *previous* one is current.
      // If i is 0 (early Jan before first term), then it's the last term of prev year (Winter Solstice/Major Cold).
      const index = i === 0 ? chronological.length - 1 : i - 1;
      currentTerm = chronological[index];
      break;
    }
    // If it's the last iteration and we haven't broken, it's the last term
    if (i === chronological.length - 1) {
        currentTerm = chronological[i];
    }
  }

  return currentTerm;
};

export const getTermIndex = (termId: number) => {
    return SOLAR_TERMS.findIndex(t => t.id === termId);
}