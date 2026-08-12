import { useState, useMemo, useEffect } from "react";
import { WAREHOUSES, MONTHS_RU } from "./config";
import useMonthNav from "./hooks/useMonthNav";
import Calendar from "./components/Calendar";
import Legend from "./components/Legend";
import WarehouseDropdown from "./components/WarehouseDropdown";
import styles from "./App.module.css";

export default function ShiftSchedule() {
  const warehouses = WAREHOUSES;
  const firstWarehouse = warehouses[0];

  if (!firstWarehouse) throw new Error("Список складов пуст");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(() => {
    try {
      const saved = localStorage.getItem("shift-app-warehouse-id");
      if (saved && warehouses.some(w => w.id === saved)) return saved;
    } catch {
      // Storage can be unavailable in private browsing modes.
    }
    return firstWarehouse.id;
  });
  const activeWarehouseId = warehouses.some(w => w.id === selectedWarehouseId)
    ? selectedWarehouseId
    : firstWarehouse.id;
  const warehouse = warehouses.find(w => w.id === activeWarehouseId) ?? firstWarehouse;

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

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div className={styles.app}>
      <div className={styles.topbar}>
        <div className={styles.topbar__title}>Ozon Календарь</div>
        <WarehouseDropdown
          warehouses={warehouses}
          selectedId={activeWarehouseId}
          onChange={id => {
            try {
              localStorage.setItem("shift-app-warehouse-id", id);
            } catch {
              // The selection still works for the current session.
            }
            setSelectedWarehouseId(id);
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
            monthLabel={`${MONTHS_RU[viewMonth]} ${viewYear}`}
            onPrev={prevMonth}
            onNext={nextMonth}
            isCurrentMonth={isCurrentMonth}
            warehouse={warehouse}
          />
        </div>
      </div>

      <footer className={styles.footer}>
        © {today.getFullYear()} Ozon Календарь
      </footer>
    </div>
  );
}
