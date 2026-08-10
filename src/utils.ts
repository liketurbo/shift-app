import { MONTHS_RU_GEN } from "./config";
import type { ShiftGroup, Warehouse } from "./types";

export function getGroupForDate(date: Date, warehouse: Warehouse): number {
  const anchor = new Date(warehouse.anchorDate);
  anchor.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - anchor.getTime()) / 86400000);
  // 3-on / 3-off cycle length = 6
  const slot = ((diffDays % 6) + 6) % 6;
  // anchorGroup works days 0-2, other group works days 3-5
  if (slot < 3) return warehouse.anchorGroup;
  return 1 - warehouse.anchorGroup;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateLong(date: Date): string {
  return `${date.getDate()} ${MONTHS_RU_GEN[date.getMonth()] ?? ""} ${date.getFullYear()}`;
}

function lastName(fullName: string): string {
  return fullName.trim().split(/\s+/).at(0) ?? "";
}

export function getShiftName(group: ShiftGroup): string {
  const dayChief = group.day.supervisors.find(s => s.isChief);
  const nightChief = group.night.supervisors.find(s => s.isChief);
  return `${lastName(dayChief?.name ?? "")} / ${lastName(nightChief?.name ?? "")}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  // Monday-first: 0=Mon..6=Sun
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}
