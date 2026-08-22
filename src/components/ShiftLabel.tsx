import { useState, type CSSProperties } from "react";
import styles from "./ShiftLabel.module.css";
import type { ShiftGroup, Supervisor } from "../types";

function shortName(person?: Supervisor): string {
  if (!person) return "Не назначен";
  return `${person.lastName} ${person.firstName}`;
}

function initials(person?: Supervisor): string {
  if (!person) return "—";
  return `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`;
}

function Avatar({ person, isManager = false }: { person?: Supervisor; isManager?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span
      className={`${styles.avatar}${isManager ? ` ${styles["avatar--manager"]}` : ""}`}
      title={person?.name}
      aria-hidden="true"
    >
      <span className={styles.avatar__fallback}>{initials(person)}</span>
      {person?.photoUrl && !imageFailed && (
        <img
          className={styles.avatar__image}
          src={person.photoUrl}
          alt=""
          onError={() => setImageFailed(true)}
        />
      )}
    </span>
  );
}

function DayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.75" />
      <path d="M12 2.25v2M12 19.75v2M2.25 12h2M19.75 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" />
    </svg>
  );
}

function NightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19.25 15.35A8.25 8.25 0 0 1 8.65 4.75a8.25 8.25 0 1 0 10.6 10.6Z" />
      <path className={styles.nightStar} d="m17.8 3.1.35 1.05 1.05.35-1.05.35-.35 1.05-.35-1.05-1.05-.35 1.05-.35.35-1.05Z" />
    </svg>
  );
}

function Manager({
  type,
  hours,
  supervisors,
  isActive,
}: {
  type: "day" | "night";
  hours: string;
  supervisors: Supervisor[];
  isActive: boolean;
}) {
  const isDay = type === "day";
  const label = isDay ? "Дневная смена" : "Ночная смена";
  const manager = supervisors.find(person => person.isChief);
  const others = supervisors.filter(person => !person.isChief);
  const avatarCount = others.length + 1;

  return (
    <div
      className={`${styles.manager}${isActive ? ` ${styles["manager--active"]}` : ""}`}
      title={`${label}, ${hours}`}
    >
      <span className={isDay ? styles.iconDay : styles.iconNight} aria-label={label}>
        {isDay ? <DayIcon /> : <NightIcon />}
      </span>
      <span
        className={styles.avatarStack}
        style={{ "--avatar-count": avatarCount } as CSSProperties}
      >
        {others.map(person => <Avatar key={person.login} person={person} />)}
        <Avatar person={manager} isManager />
      </span>
      <span className={styles.manager__name}>{shortName(manager)}</span>
      {isActive && <span className={styles.manager__now}>Сейчас</span>}
    </div>
  );
}

export default function ShiftLabel({
  shift,
  dayHours,
  nightHours,
  activePeriod,
}: {
  shift: ShiftGroup;
  dayHours: string;
  nightHours: string;
  activePeriod?: "day" | "night";
}) {
  return (
    <div className={styles.shiftLabel}>
      <Manager type="day" hours={dayHours} supervisors={shift.day.supervisors} isActive={activePeriod === "day"} />
      <Manager type="night" hours={nightHours} supervisors={shift.night.supervisors} isActive={activePeriod === "night"} />
    </div>
  );
}
