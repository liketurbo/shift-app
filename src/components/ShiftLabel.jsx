import styles from "./ShiftLabel.module.css";

function shortName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
}

export default function ShiftLabel({ shift }) {
  const dayChief = shift.day.supervisors.find(s => s.isChief);
  const nightChief = shift.night.supervisors.find(s => s.isChief);
  return (
    <span className={styles.shiftLabel}>
      <span className={styles.shift}>
        <span className={styles.iconDay}>☀</span>
        {shortName(dayChief.name)}
      </span>
      <span className={styles.sep} />
      <span className={styles.shift}>
        <span className={styles.iconNight}>☽</span>
        {shortName(nightChief.name)}
      </span>
    </span>
  );
}
