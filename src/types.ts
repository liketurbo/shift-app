export interface Supervisor {
  name: string;
  isChief: boolean;
}

export interface Subshift {
  supervisors: Supervisor[];
}

export interface ShiftGroup {
  id: number;
  day: Subshift;
  night: Subshift;
}

export interface WarehousePalette {
  group0: string;
  group0Light: string;
  group1: string;
  group1Light: string;
  topbar: string;
}

export interface Warehouse {
  id: string;
  name: string;
  palette: WarehousePalette;
  anchorDate: string;
  anchorGroup: number;
  dayShiftHours: string;
  nightShiftHours: string;
  groups: ShiftGroup[];
}
