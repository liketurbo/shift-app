import { CONFIG } from "../config";
import { getShiftName } from "../utils";
import styles from "./Legend.module.css";

export default function Legend() {
  return (
    <div className={styles.legend}>
      {CONFIG.groups.map((g) => (
        <span
          key={g.id}
          className={styles.legend__pill}
          style={{ background: g.colorLight, color: g.color }}
        >
          {getShiftName(g)}
        </span>
      ))}
    </div>
  );
}
