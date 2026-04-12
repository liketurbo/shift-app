import { useState, useMemo, useRef, useEffect } from "react";
import { WAREHOUSES, MONTHS_RU, DAYS_RU, MONTHS_RU_GEN } from "./config";
import { getGroupForDate, getShiftName, isSameDay } from "./utils";
import Calendar from "./components/Calendar";
import Legend from "./components/Legend";
import styles from "./App.module.css";

export default function ShiftSchedule() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(WAREHOUSES[0].id);
  const warehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const shift = isSelectedInViewMonth ? warehouse.groups[getGroupForDate(selectedDate, warehouse)] : null;
  const dayChief = shift?.day.supervisors.find(s => s.isChief);
  const dayOthers = shift?.day.supervisors.filter(s => !s.isChief) ?? [];
  const nightChief = shift?.night.supervisors.find(s => s.isChief);
  const nightOthers = shift?.night.supervisors.filter(s => !s.isChief) ?? [];

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
        <div className={styles.topbar__title}>График смен</div>
        <div className={styles.topbar__dropdown} ref={dropdownRef}>
          <button
            className={styles.topbar__dropdown_btn}
            onClick={() => setDropdownOpen(o => !o)}
          >
            {warehouse.name}
            <span className={styles.topbar__chevron} data-open={dropdownOpen || undefined}>▾</span>
          </button>
          {dropdownOpen && (
            <div className={styles.topbar__dropdown_menu}>
              {WAREHOUSES.map(w => (
                <button
                  key={w.id}
                  className={styles.topbar__dropdown_item}
                  data-active={w.id === selectedWarehouseId || undefined}
                  onClick={() => {
                    setSelectedWarehouseId(w.id);
                    setSelectedDate(null);
                    setDropdownOpen(false);
                  }}
                >
                  {w.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles["calendar-card"]}>
          <Legend warehouse={warehouse} />

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
            warehouse={warehouse}
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
            <div className={styles["shift-card__name"]}>{getShiftName(shift)}</div>

            {/* Day sub-shift */}
            <div className={styles["shift-card__subshift"]}>
              <div className={styles["shift-card__subshift-header"]}>
                <span className={styles["shift-card__subshift-label"]}>День</span>
                <span className={styles["shift-card__hours"]}>{warehouse.dayShiftHours}</span>
              </div>
              <div className={styles["shift-card__supervisors"]}>
                <div className={styles["shift-card__supervisor"]}>
                  <span className={styles["shift-card__supervisor-name"]}>{dayChief.name}</span>
                  <span className={styles["shift-card__chief-badge"]}>ст. смены</span>
                </div>
                {dayOthers.map(s => (
                  <div key={s.name} className={styles["shift-card__supervisor"]}>
                    <span className={styles["shift-card__supervisor-name"]}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Night sub-shift */}
            <div className={styles["shift-card__subshift"]}>
              <div className={styles["shift-card__subshift-header"]}>
                <span className={styles["shift-card__subshift-label"]}>Ночь</span>
                <span className={styles["shift-card__hours"]}>{warehouse.nightShiftHours}</span>
              </div>
              <div className={styles["shift-card__supervisors"]}>
                <div className={styles["shift-card__supervisor"]}>
                  <span className={styles["shift-card__supervisor-name"]}>{nightChief.name}</span>
                  <span className={styles["shift-card__chief-badge"]}>ст. смены</span>
                </div>
                {nightOthers.map(s => (
                  <div key={s.name} className={styles["shift-card__supervisor"]}>
                    <span className={styles["shift-card__supervisor-name"]}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
