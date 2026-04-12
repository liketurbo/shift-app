import { CONFIG } from "../config";
import { getGroupForDate, isSameDay, getDaysInMonth, getFirstDayOfWeek } from "../utils";
import styles from "./Calendar.module.css";

export default function Calendar({ year, month, today, selectedDate, onSelectDate }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div>
      {/* Weekday headers */}
      <div className={styles.calendar__weekdays}>
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d, i) => (
          <div key={d} className={`${styles.calendar__weekday}${i >= 5 ? ` ${styles["calendar__weekday--weekend"]}` : ""}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className={styles.calendar__grid}>
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} />;

          const gId = getGroupForDate(date);
          const g = CONFIG.groups[gId];
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isPast = date < today && !isToday;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          const cellStyle = isPast
            ? { background: "#f0f0f0" }
            : {
                background: isSelected ? g.color : g.colorLight,
                ...(isToday && !isSelected && { outline: `2px solid ${g.color}`, outlineOffset: "-2px" }),
              };

          const numberColor = isPast ? "#bbb" : isSelected ? "#fff" : isToday ? g.color : isWeekend ? "#c0392b" : "#333";
          const isBold = isToday || isSelected;

          return (
            <button
              key={date.toISOString()}
              className={styles.calendar__cell}
              style={cellStyle}
              disabled={isPast}
              onClick={() => onSelectDate(date)}
            >
              <span
                className={`${styles["calendar__day-number"]}${isBold ? ` ${styles["calendar__day-number--bold"]}` : ""}`}
                style={{ color: numberColor }}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
