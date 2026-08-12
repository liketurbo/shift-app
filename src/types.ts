export interface Employee {
  login: string;
  firstName: string;
  lastName: string;
  employeePosition: string;
  photoUrl: string;
  wasEmployeeOnShift: boolean;
  avgRating: number;
}

export interface WarehouseEmployees {
  warehouseId: string;
  employees: Employee[];
}

export interface ShiftAssignment {
  managerLogin: string;
  employeeLogins: string[];
}

export interface ShiftGroupConfig {
  id: number;
  day: ShiftAssignment;
  night: ShiftAssignment;
}

export interface WarehouseShifts {
  warehouseId: string;
  groups: ShiftGroupConfig[];
}

export interface Supervisor extends Employee {
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

export interface WarehouseConfig {
  name: string;
  palette: WarehousePalette;
  anchorDate: string;
  anchorGroup: number;
  dayShiftHours: string;
  nightShiftHours: string;
  employeeSource: WarehouseEmployees;
  shiftSource: WarehouseShifts;
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
