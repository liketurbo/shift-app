import { useEffect, useState } from "react";
import { WAREHOUSES } from "../config";
import { fetchSchedule } from "../api/scheduleApi";
import type { ScheduleState } from "../types";

const apiUrl = import.meta.env.VITE_SCHEDULE_API_URL?.trim();

export default function useScheduleData() {
  const [state, setState] = useState<ScheduleState>({
    warehouses: WAREHOUSES,
    source: apiUrl ? "loading" : "local",
    message: apiUrl ? "Загружаем график…" : "Локальный график",
  });

  useEffect(() => {
    if (!apiUrl) return undefined;

    const controller = new AbortController();

    fetchSchedule(apiUrl, { signal: controller.signal })
      .then(warehouses => {
        setState({
          warehouses,
          source: "remote",
          message: "График обновлён",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          warehouses: WAREHOUSES,
          source: "fallback",
          message: `${error instanceof Error ? error.message : "Не удалось загрузить график"}. Показан локальный график`,
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}
