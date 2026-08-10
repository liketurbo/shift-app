import styles from "./ShiftLabel.module.css";
import type { ShiftGroup } from "../types";

function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const lastName = parts[0] ?? "";
  const firstName = parts[1];
  return firstName ? `${lastName} ${firstName[0]}.` : lastName;
}

export default function ShiftLabel({ shift }: { shift: ShiftGroup }) {
  const dayChief = shift.day.supervisors.find(s => s.isChief);
  const nightChief = shift.night.supervisors.find(s => s.isChief);
  return (
    <span className={styles.shiftLabel}>
      <span className={styles.shift}>
        <span className={styles.iconDay}>☀</span>
        {shortName(dayChief?.name ?? "")}
      </span>
      <span className={styles.sep} />
      <span className={styles.shift}>
        <span className={styles.iconNight}>☽</span>
        {shortName(nightChief?.name ?? "")}
      </span>
    </span>
  );
}
