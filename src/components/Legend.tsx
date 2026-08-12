import ShiftLabel from "./ShiftLabel";
import styles from "./Legend.module.css";
import type { Warehouse } from "../types";
import { getGroupForDate } from "../utils";

function shiftStartHour(hours: string): number {
  const match = hours.match(/^(\d{1,2}):/);
  return match ? Number(match[1]) : 0;
}

export default function Legend({ warehouse }: { warehouse: Warehouse }) {
  const now = new Date();
  const dayStart = shiftStartHour(warehouse.dayShiftHours);
  const nightStart = shiftStartHour(warehouse.nightShiftHours);
  const hour = now.getHours();
  const activePeriod = hour >= dayStart && hour < nightStart ? "day" : "night";
  const scheduleDate = new Date(now);
  // После полуночи всё ещё продолжается ночная смена предыдущего рабочего дня.
  if (activePeriod === "night" && hour < dayStart) scheduleDate.setDate(scheduleDate.getDate() - 1);
  const activeGroup = getGroupForDate(scheduleDate, warehouse);
  const orderedGroups = [...warehouse.groups].sort((a, b) =>
    Number(b.id === activeGroup) - Number(a.id === activeGroup),
  );

  return (
    <section key={warehouse.id} className={styles.managerBlock} aria-label="Менеджеры смен">
      <div className={styles.legend}>
        {orderedGroups.map((g) => (
          <div
            key={g.id}
            className={`${styles.legend__groupRow}${g.id !== activeGroup ? ` ${styles["legend__groupRow--inactive"]}` : ""}`}
            data-group={g.id}
            data-active={g.id === activeGroup || undefined}
          >
            <ShiftLabel
              shift={g}
              dayHours={warehouse.dayShiftHours}
              nightHours={warehouse.nightShiftHours}
              activePeriod={g.id === activeGroup ? activePeriod : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
