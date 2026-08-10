const DEFAULT_TIMEOUT_MS = 8_000;

/**
 * The browser talks only to a trusted proxy. The proxy is responsible for
 * calling Ozon Job and must never return authorization headers or cookies.
 *
 * @typedef {{ name: string, isChief: boolean }} Supervisor
 * @typedef {{ supervisors: Supervisor[] }} Subshift
 * @typedef {{ id: number, day: Subshift, night: Subshift }} ShiftGroup
 * @typedef {{
 *   id: string,
 *   name: string,
 *   palette: {
 *     group0: string,
 *     group0Light: string,
 *     group1: string,
 *     group1Light: string,
 *     topbar: string
 *   },
 *   anchorDate: string,
 *   anchorGroup: number,
 *   dayShiftHours: string,
 *   nightShiftHours: string,
 *   groups: ShiftGroup[]
 * }} Warehouse
 */

function assertSchedulePayload(payload) {
  if (!payload || !Array.isArray(payload.warehouses) || payload.warehouses.length === 0) {
    throw new Error("API вернул график в неподдерживаемом формате");
  }

  for (const warehouse of payload.warehouses) {
    if (
      typeof warehouse?.id !== "string" ||
      typeof warehouse?.name !== "string" ||
      !Array.isArray(warehouse?.groups) ||
      warehouse.groups.length < 2
    ) {
      throw new Error("В ответе API отсутствуют обязательные поля склада");
    }
  }

  return payload.warehouses;
}

/**
 * Loads the already-normalized public schedule from the user's own backend.
 * No Ozon credentials are accepted here so they cannot leak into the Vite bundle.
 *
 * Expected response: { warehouses: Warehouse[] }
 */
export async function fetchSchedule(apiUrl, { signal } = {}) {
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

