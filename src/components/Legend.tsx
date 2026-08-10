import ShiftLabel from "./ShiftLabel";
import styles from "./Legend.module.css";
import type { Warehouse } from "../types";

export default function Legend({ warehouse }: { warehouse: Warehouse }) {
  return (
    <div key={warehouse.id} className={styles.legend}>
      {warehouse.groups.map((g) => (
        <span key={g.id} className={styles.legend__pill} data-group={g.id}>
          <ShiftLabel shift={g} />
        </span>
      ))}
    </div>
  );
}
