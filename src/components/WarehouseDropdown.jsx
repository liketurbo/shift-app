import { useState, useRef, useEffect } from "react";
import styles from "./WarehouseDropdown.module.css";

export default function WarehouseDropdown({ warehouses, selectedId, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = warehouses.find(w => w.id === selectedId);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button className={styles.btn} onClick={() => setOpen(o => !o)}>
        {selected.name}
        <span className={styles.chevron} data-open={open || undefined}>▾</span>
      </button>
      {open && (
        <div className={styles.menu}>
          {warehouses.map(w => (
            <button
              key={w.id}
              className={styles.item}
              data-active={w.id === selectedId || undefined}
              onClick={() => { onChange(w.id); setOpen(false); }}
            >
              {w.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
