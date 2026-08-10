import { getGroupForDate, isSameDay, getDaysInMonth, getFirstDayOfWeek } from "../utils";
import styles from "./Calendar.module.css";
import type { Warehouse } from "../types";

interface CalendarProps {
  year: number;
  month: number;
  today: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  isCurrentMonth: boolean;
  warehouse: Warehouse;
}

export default function Calendar({ year, month, today, selectedDate, onSelectDate, monthLabel, onPrev, onNext, isCurrentMonth, warehouse }: CalendarProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const cells: Array<Date | null> = [];
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

      {/* Month navigation */}
      <div className={styles["month-nav"]}>
        <span className={styles["month-nav__label"]}>{monthLabel}</span>
        <div className={styles["month-nav__buttons"]}>
          {!isCurrentMonth && (
            <button className={styles["month-nav__btn"]} onClick={onPrev}>‹</button>
          )}
          <button className={styles["month-nav__btn"]} onClick={onNext}>›</button>
        </div>
      </div>

      {/* Day grid */}
      <div className={styles.calendar__grid}>
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} />;

          const gId = getGroupForDate(date, warehouse);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isPast = date < today;

          return (
            <button
              key={date.toISOString()}
              className={styles.calendar__cell}
              data-group={isPast ? undefined : gId}
              data-today={isToday || undefined}
              data-selected={isSelected || undefined}
              data-past={isPast || undefined}
              disabled={isPast}
              onClick={() => onSelectDate(date)}
            >
              <span className={styles["calendar__day-number"]}>{date.getDate()}</span>
              {isToday && <div className={styles["calendar__today-line"]} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
