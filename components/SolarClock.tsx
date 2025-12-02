import React, { useMemo, useState, useEffect } from 'react';
import { SOLAR_TERMS } from '../constants';
import { SolarTerm } from '../types';

interface SolarClockProps {
  currentTerm: SolarTerm;
  selectedTerm: SolarTerm;
  onSelectTerm: (term: SolarTerm) => void;
}

// Logic relies on English short names matching 'approxDate' in constants.ts
const LOGIC_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Display uses Gregorian numeric format
const DISPLAY_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Simplified non-leap year

// Helper to get terms for a specific month index (0 = Jan)
const getTermsForMonth = (monthIndex: number) => {
  const monthName = LOGIC_MONTHS[monthIndex];
  return SOLAR_TERMS.filter(term => term.approxDate.startsWith(monthName));
};

// Helper to parse day from "Feb 4"
const getDayFromDate = (dateStr: string) => {
  return parseInt(dateStr.split(' ')[1], 10);
};

const SolarClock: React.FC<SolarClockProps> = ({ currentTerm, selectedTerm, onSelectTerm }) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dimensions - ENLARGED
  const cx = 250;
  const cy = 250;
  
  // Enlarge the disk radii to fill 500x500 space
  const innerRadius = 110; 
  const baseOuterRadius = 230;
  const expandedOuterRadius = 255;

  // Get current calendar date info
  const now = new Date();
  const currentCalendarMonthIndex = now.getMonth();
  const currentDay = now.getDate();

  // Identify which month should be expanded.
  const selectedTermMonthIndex = LOGIC_MONTHS.findIndex(m => selectedTerm.approxDate.startsWith(m));
  
  const effectiveFocusIndex = (selectedTerm.id === currentTerm.id)
    ? currentCalendarMonthIndex
    : selectedTermMonthIndex;

  const activeMonthIndex = hoveredMonth !== null ? hoveredMonth : effectiveFocusIndex;

  // Rotation: Feb (Index 1) at top (0 degrees).
  // Index 0 (Jan) needs to be at -30 deg relative to top.
  const globalRotationOffset = -30;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  const describeArc = (x: number, y: number, innerR: number, outerR: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, outerR, endAngle);
    const end = polarToCartesian(x, y, outerR, startAngle);
    const innerStart = polarToCartesian(x, y, innerR, endAngle);
    const innerEnd = polarToCartesian(x, y, innerR, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  }

  // Generate Month Segments
  const monthSegments = useMemo(() => {
    return DISPLAY_MONTHS.map((monthNameDisplay, index) => {
      const isExpanded = index === activeMonthIndex;
      const termsInMonth = getTermsForMonth(index);
      const isCurrentCalendarMonth = index === currentCalendarMonthIndex;
      
      const startAngle = (index * 30) + globalRotationOffset;
      const endAngle = ((index + 1) * 30) + globalRotationOffset;
      const midAngle = startAngle + 15;

      const outerR = isExpanded ? expandedOuterRadius : baseOuterRadius;
      
      // Determine color based on the FIRST term in the month (kept for logic, though stroke color is overridden now)
      const baseColor = termsInMonth.length > 0 ? termsInMonth[0].color : '#ccc';

      // --- Content Generation ---
      
      // 1. Arc Path
      const arcPath = describeArc(cx, cy, innerRadius, outerR, startAngle, endAngle);

      // 2. Solar Term Labels (Now OUTSIDE the ring)
      const termLabels = termsInMonth.map((term, tIndex) => {
         // Distribute terms within the wedge
         const angleOffset = termsInMonth.length > 1 ? (tIndex === 0 ? -7 : 7) : 0;
         const termAngle = midAngle + angleOffset;
         
         // Logic for text placement radius - Moved OUTSIDE
         // If expanded, push further out to clear ticks
         const labelR = isExpanded ? outerR + 25 : outerR + 15;
         
         const pos = polarToCartesian(cx, cy, labelR, termAngle);
         
         // Normalize angle for text rotation checking (0-360)
         let normalizedAngle = (termAngle + 360) % 360;
         
         // Standard rotation logic
         let textRotate = termAngle - 90;
         if (normalizedAngle > 180 && normalizedAngle < 360) {
             textRotate = termAngle + 90;
         }

         return (
           <g key={term.id} 
              className="pointer-events-none"
              transform={`translate(${pos.x}, ${pos.y})`}>
             <text 
                textAnchor="middle" 
                dominantBaseline="middle"
                transform={`rotate(${textRotate})`}
                className={`font-serif text-[10px] ${isExpanded ? 'fill-stone-800 font-bold' : 'fill-stone-400 font-medium'}`}
             >
               {term.name}
             </text>
           </g>
         );
      });

      // 3. Daily Ticks (Outer Ring)
      let dayTicks = null;
      if (isExpanded) {
        const daysInMonth = MONTH_DAYS[index];
        const anglePerDay = 30 / daysInMonth; 

        dayTicks = Array.from({ length: daysInMonth }).map((_, dIndex) => {
          const day = dIndex + 1;
          const tickAngle = startAngle + (dIndex * anglePerDay) + (anglePerDay / 2);
          
          const matchedTerm = termsInMonth.find(t => getDayFromDate(t.approxDate) === day);
          const isTermDay = !!matchedTerm;
          
          // Check if this tick is "Today"
          const isToday = isCurrentCalendarMonth && day === currentDay;

          // Ticks sit on the outer edge
          const tickLength = isTermDay ? 8 : 4;
          const tickInnerR = outerR - tickLength;
          const tickOuterR = outerR; 
          
          const p1 = polarToCartesian(cx, cy, tickInnerR, tickAngle);
          const p2 = polarToCartesian(cx, cy, tickOuterR, tickAngle);
          
          // Numbers are placed just inside the ticks for readability
          const textPos = polarToCartesian(cx, cy, tickInnerR - 8, tickAngle);

          // Unified Rotation Logic
          let normalizedTickAngle = (tickAngle + 360) % 360;
          let tickRotate = tickAngle - 90;
          if (normalizedTickAngle > 180 && normalizedTickAngle < 360) {
              tickRotate = tickAngle + 90;
          }

          return (
            <g key={day} onClick={(e) => {
                if (matchedTerm) {
                    e.stopPropagation(); 
                    onSelectTerm(matchedTerm);
                }
            }}>
              <line 
                x1={p1.x} y1={p1.y} 
                x2={p2.x} y2={p2.y} 
                stroke={isTermDay ? "#ef4444" : (isToday ? "#16a34a" : "#a8a29e")} 
                strokeWidth={isTermDay || isToday ? 2 : 1}
                className={isTermDay ? "cursor-pointer" : ""}
              />
              
              {/* Highlight "Today" with a pulsing circle at the base of the tick - GREEN */}
              {isToday && (
                 <circle cx={p1.x} cy={p1.y} r={3} fill="#16a34a" className="animate-pulse" />
              )}

              {isTermDay && (
                <g>
                    <text
                        x={textPos.x} y={textPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[9px] fill-red-600 font-bold font-sans pointer-events-none select-none"
                        transform={`rotate(${tickRotate}, ${textPos.x}, ${textPos.y})`}
                    >
                        {day}
                    </text>
                    {matchedTerm.id === selectedTerm.id && (
                        <circle cx={p2.x} cy={p2.y} r={3} fill="#ef4444" className="animate-pulse" />
                    )}
                </g>
              )}
            </g>
          );
        });
      }

      return (
        <g 
            key={monthNameDisplay}
            onMouseEnter={() => setHoveredMonth(index)}
            onMouseLeave={() => setHoveredMonth(null)}
            className="transition-all duration-300"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
            <path
                d={arcPath}
                fill={isExpanded ? '#ffffff' : '#fcfbf8'}
                stroke={isExpanded ? '#ffffff' : '#e5e5e5'}
                strokeWidth={isExpanded ? 3 : 1}
                className={`transition-all duration-300 ${
                    isExpanded 
                    ? 'drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' // White fluorescent effect (Cool blue glow)
                    : 'hover:fill-stone-50'
                }`}
            />
            
            {/* Month Name Label - Now INSIDE the segment */}
            {(() => {
                const labelAngle = midAngle;
                // Place it in the middle of the colored arc
                const labelRadius = (innerRadius + outerR) / 2;
                const labelPos = polarToCartesian(cx, cy, labelRadius, labelAngle);
                
                // Rotate to match the radial line
                let labelRotate = labelAngle - 90;
                let normalizedAngle = (labelAngle + 360) % 360;
                if (normalizedAngle > 180 && normalizedAngle < 360) {
                     labelRotate = labelAngle + 90;
                }

                return (
                    <text
                        x={labelPos.x} y={labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${labelRotate}, ${labelPos.x}, ${labelPos.y})`}
                        className={`text-[12px] tracking-wider select-none pointer-events-none ${
                            isCurrentCalendarMonth 
                                ? 'fill-red-600 font-extrabold' 
                                : (isExpanded ? 'fill-stone-400 font-bold' : 'fill-stone-300 font-bold')
                        }`}
                    >
                        {monthNameDisplay}
                    </text>
                )
            })()}

            {termLabels}
            {dayTicks}
        </g>
      );
    });
  }, [activeMonthIndex, selectedTerm, onSelectTerm, currentCalendarMonthIndex, currentDay]);

  return (
    <div className="relative w-full max-w-3xl aspect-square mx-auto my-6">
      {/* ViewBox adjusted: 0 0 500 500 covers the area centered at 250,250 */}
      <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl overflow-visible">
        <circle cx={cx} cy={cy} r={baseOuterRadius} fill="#fafaf9" className="opacity-50" />
        
        {monthSegments}

        {/* Center Hub */}
        <circle cx={cx} cy={cy} r={innerRadius - 10} fill="#0c0a09" stroke="#333" strokeWidth="2" className="drop-shadow-lg" />
        
        {/* Digital Clock in Center - DSEG7 Classic */}
        <g style={{ transform: `translate(${cx}px, ${cy}px)` }}>
            {/* Real digits (foreground) */}
            <text 
                x="0" y="0" 
                textAnchor="middle" 
                dominantBaseline="central" 
                className="font-lcd text-5xl fill-[#4ade80] select-none tracking-widest drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
            >
                {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
            </text>
        </g>
      </svg>
    </div>
  );
};

export default SolarClock;