import { useState, useRef, useEffect } from "react";
import styles from "./WarehouseDropdown.module.css";
import type { Warehouse } from "../types";

interface WarehouseDropdownProps {
  warehouses: Warehouse[];
  selectedId: string;
  onChange: (id: string) => void;
}

export default function WarehouseDropdown({ warehouses, selectedId, onChange }: WarehouseDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = warehouses.find(w => w.id === selectedId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button className={styles.btn} onClick={() => setOpen(o => !o)}>
        <span className={styles.label}>{selected?.name}</span>
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
