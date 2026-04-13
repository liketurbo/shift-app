import { useState, useMemo, useEffect } from "react";
import { WAREHOUSES, MONTHS_RU, DAYS_RU, MONTHS_RU_GEN } from "./config";
import { getGroupForDate, isSameDay } from "./utils";
import useMonthNav from "./hooks/useMonthNav";
import Calendar from "./components/Calendar";
import Legend from "./components/Legend";
import ShiftCard from "./components/ShiftCard";
import WarehouseDropdown from "./components/WarehouseDropdown";
import styles from "./App.module.css";

export default function ShiftSchedule() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(() => {
    try {
      const saved = localStorage.getItem("shift-app-warehouse-id");
      if (saved && WAREHOUSES.some(w => w.id === saved)) return saved;
    } catch {}
    return WAREHOUSES[0].id;
  });
  const warehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);

  useEffect(() => {
    const { group0, group0Light, group1, group1Light, topbar } = warehouse.palette;
    const root = document.documentElement;
    root.style.setProperty("--group-0",       group0);
    root.style.setProperty("--group-0-light", group0Light);
    root.style.setProperty("--group-1",       group1);
    root.style.setProperty("--group-1-light", group1Light);
    root.style.setProperty("--topbar",        topbar);
  }, [warehouse]);

  const { viewYear, viewMonth, prevMonth, nextMonth } = useMonthNav(today);

  const [selectedDate, setSelectedDate] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

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
        <WarehouseDropdown
          warehouses={WAREHOUSES}
          selectedId={selectedWarehouseId}
          onChange={id => {
            try { localStorage.setItem("shift-app-warehouse-id", id); } catch {}
            setSelectedWarehouseId(id);
            setSelectedDate(null);
          }}
        />
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

        {isSelectedInViewMonth && (
          <ShiftCard
            key={selectedDate.toISOString()}
            shift={shift}
            dateLabel={dateLabel}
            warehouse={warehouse}
            isClosing={isClosing}
            onClose={handleClose}
            onAnimationEnd={handleAnimationEnd}
          />
        )}
      </div>
    </div>
  );
}
