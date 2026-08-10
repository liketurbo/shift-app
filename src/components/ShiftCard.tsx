import ShiftLabel from "./ShiftLabel";
import styles from "./ShiftCard.module.css";
import type { ShiftGroup, Warehouse } from "../types";

interface ShiftCardProps {
  shift: ShiftGroup;
  dateLabel: string;
  warehouse: Warehouse;
  isClosing: boolean;
  onClose: () => void;
  onAnimationEnd: () => void;
}

export default function ShiftCard({ shift, dateLabel, warehouse, isClosing, onClose, onAnimationEnd }: ShiftCardProps) {
  const dayChief = shift.day.supervisors.find(s => s.isChief);
  const dayOthers = shift.day.supervisors.filter(s => !s.isChief);
  const nightChief = shift.night.supervisors.find(s => s.isChief);
  const nightOthers = shift.night.supervisors.filter(s => !s.isChief);

  return (
    <>
      <div
        className={styles.overlay}
        data-closing={isClosing || undefined}
        onClick={onClose}
      />
      <div
        className={styles.card}
        data-group={shift.id}
        data-closing={isClosing || undefined}
        onAnimationEnd={onAnimationEnd}
      >
        <div className={styles.top}>
          <div className={styles.date}>{dateLabel}</div>
          <button className={styles.close} onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        <div className={styles.name}><ShiftLabel shift={shift} /></div>

        <div className={styles.subshift}>
          <div className={styles.subshiftHeader}>
            <span className={styles.subshiftLabel}>☀ День</span>
            <span className={styles.hours}>{warehouse.dayShiftHours}</span>
          </div>
          <div className={styles.supervisors}>
            <div className={styles.supervisor}>
              <span className={styles.supervisorName}>{dayChief?.name}</span>
              <span className={styles.chiefBadge}>нач. смены</span>
            </div>
            {dayOthers.map(s => (
              <div key={s.name} className={styles.supervisor}>
                <span className={styles.supervisorName}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.subshift}>
          <div className={styles.subshiftHeader}>
            <span className={styles.subshiftLabel}>☽ Ночь</span>
            <span className={styles.hours}>{warehouse.nightShiftHours}</span>
          </div>
          <div className={styles.supervisors}>
            <div className={styles.supervisor}>
              <span className={styles.supervisorName}>{nightChief?.name}</span>
              <span className={styles.chiefBadge}>нач. смены</span>
            </div>
            {nightOthers.map(s => (
              <div key={s.name} className={styles.supervisor}>
                <span className={styles.supervisorName}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
