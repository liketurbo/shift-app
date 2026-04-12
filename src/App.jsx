import { useState, useMemo } from "react";
import { CONFIG, MONTHS_RU, DAYS_RU, MONTHS_RU_GEN } from "./config";
import { getGroupForDate, getShiftName, formatDateLong, isSameDay } from "./utils";
import Calendar from "./components/Calendar";
import Legend from "./components/Legend";
import styles from "./App.module.css";

export default function ShiftSchedule() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function handleDateSelect(date) {
    setSelectedDate(date);
    setIsClosing(false);
  }

  function handleClose() {
    setIsClosing(true);
  }

  function handleAnimationEnd() {
    if (isClosing) {
      setSelectedDate(null);
      setIsClosing(false);
    }
  }

  const isSelectedInViewMonth =
    selectedDate !== null &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth;

  const shift = isSelectedInViewMonth ? CONFIG.groups[getGroupForDate(selectedDate)] : null;
  const chief = shift?.supervisors.find(s => s.isChief);
  const others = shift?.supervisors.filter(s => !s.isChief) ?? [];

  const isToday = selectedDate && isSameDay(selectedDate, today);
  const dateLabel = isToday
    ? "Сегодня"
    : selectedDate
      ? `${DAYS_RU[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTHS_RU_GEN[selectedDate.getMonth()]}`
      : "";

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div className={styles.app}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.topbar__title}>График смен</div>
          <div className={styles.topbar__subtitle}>Озон — склад</div>
        </div>
        <div className={styles.topbar__date}>{formatDateLong(today)}</div>
      </div>

      <div className={styles.content}>
        <div className={styles["calendar-card"]}>
          <Legend />

          <Calendar
            year={viewYear}
            month={viewMonth}
            today={today}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            monthLabel={`${MONTHS_RU[viewMonth]} ${viewYear}`}
            onPrev={prevMonth}
            onNext={nextMonth}
            isCurrentMonth={isCurrentMonth}
          />
        </div>

        {/* Dim overlay + shift info card */}
        {isSelectedInViewMonth && (
          <div
            className={styles.overlay}
            data-closing={isClosing || undefined}
            onClick={handleClose}
          />
        )}
        {isSelectedInViewMonth && (
          <div
            key={selectedDate.toISOString()}
            className={styles["shift-card"]}
            data-group={shift.id}
            data-closing={isClosing || undefined}
            onAnimationEnd={handleAnimationEnd}
          >
            <div className={styles["shift-card__top"]}>
              <div className={styles["shift-card__date"]}>{dateLabel}</div>
              <button
                className={styles["shift-card__close"]}
                onClick={handleClose}
                aria-label="Закрыть"
              >✕</button>
            </div>
            <div className={styles["shift-card__header"]}>
              <span className={styles["shift-card__name"]}>{getShiftName(shift)}</span>
              <span className={styles["shift-card__hours"]}>{CONFIG.shiftHours}</span>
            </div>
            <div className={styles["shift-card__supervisors"]}>
              <div className={styles["shift-card__supervisor"]}>
                <span className={styles["shift-card__supervisor-name"]}>{chief.name}</span>
                <span className={styles["shift-card__chief-badge"]}>ст. смены</span>
              </div>
              {others.map(s => (
                <div key={s.name} className={styles["shift-card__supervisor"]}>
                  <span className={styles["shift-card__supervisor-name"]}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
