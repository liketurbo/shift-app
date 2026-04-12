import { CONFIG, MONTHS_RU_GEN } from "./config";

export function getGroupForDate(date) {
  const anchor = new Date(CONFIG.anchorDate);
  anchor.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - anchor) / 86400000);
  // 3-on / 3-off cycle length = 6
  let slot = ((diffDays % 6) + 6) % 6;
  // anchorGroup works days 0-2, other group works days 3-5
  if (slot < 3) return CONFIG.anchorGroup;
  return 1 - CONFIG.anchorGroup;
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateLong(date) {
  return `${date.getDate()} ${MONTHS_RU_GEN[date.getMonth()]} ${date.getFullYear()}`;
}

export function getShiftName(group) {
  const chief = group.supervisors.find(s => s.isChief);
  const lastName = chief.name.split(" ")[1] ?? chief.name;
  return `Смена ${lastName}`;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year, month) {
  // Monday-first: 0=Mon..6=Sun
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}
