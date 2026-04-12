import { getShiftName } from "../utils";
import styles from "./Legend.module.css";

export default function Legend({ warehouse }) {
  return (
    <div className={styles.legend}>
      {warehouse.groups.map((g) => (
        <span key={g.id} className={styles.legend__pill} data-group={g.id}>
          {getShiftName(g)}
        </span>
      ))}
    </div>
  );
}
