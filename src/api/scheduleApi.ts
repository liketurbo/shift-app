const DEFAULT_TIMEOUT_MS = 8_000;
import type { Warehouse } from "../types";

function assertSchedulePayload(payload: unknown): Warehouse[] {
  if (typeof payload !== "object" || payload === null || !("warehouses" in payload)) {
    throw new Error("API вернул график в неподдерживаемом формате");
  }

  const { warehouses } = payload;
  if (!Array.isArray(warehouses) || warehouses.length === 0) {
    throw new Error("API вернул график в неподдерживаемом формате");
  }

  for (const warehouse of warehouses) {
    if (
      typeof warehouse?.id !== "string" ||
      typeof warehouse?.name !== "string" ||
      !Array.isArray(warehouse?.groups) ||
      warehouse.groups.length < 2
    ) {
      throw new Error("В ответе API отсутствуют обязательные поля склада");
    }
  }

  return warehouses as Warehouse[];
}

/**
 * Loads the already-normalized public schedule from the user's own backend.
 * No Ozon credentials are accepted here so they cannot leak into the Vite bundle.
 *
 * Expected response: { warehouses: Warehouse[] }
 */
export async function fetchSchedule(
  apiUrl: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Warehouse[]> {
  if (!apiUrl) throw new Error("Адрес API не настроен");

  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), DEFAULT_TIMEOUT_MS);
  const abort = () => timeoutController.abort();
  signal?.addEventListener("abort", abort, { once: true });

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      throw new Error(`API вернул HTTP ${response.status}`);
    }

    return assertSchedulePayload(await response.json());
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abort);
  }
}
