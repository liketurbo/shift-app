import employees1 from "../employees-1.json";
import employees2 from "../employees-2.json";
import shifts1 from "../shifts-1.json";
import shifts2 from "../shifts-2.json";
import type { ShiftGroup, Supervisor, Warehouse, WarehouseConfig } from "./types";

const MANAGER_POSITION = "Менеджер смены хаба доставки";

function buildWarehouse(config: WarehouseConfig): Warehouse {
  if (config.employeeSource.warehouseId !== config.shiftSource.warehouseId) {
    throw new Error(`ID склада не совпадает в employees и shifts для ${config.name}`);
  }

  const employeesByLogin = new Map(
    config.employeeSource.employees.map(employee => [employee.login, employee]),
  );

  const resolveSupervisor = (login: string): Supervisor => {
    const employee = employeesByLogin.get(login);
    if (!employee) {
      throw new Error(`Сотрудник ${login} не найден для склада ${config.name}`);
    }

    return {
      ...employee,
      name: `${employee.lastName} ${employee.firstName}`,
      isChief: employee.employeePosition === MANAGER_POSITION,
    };
  };

  const assignedLogins = config.shiftSource.groups.flatMap(group => [
    group.day.managerLogin,
    ...group.day.employeeLogins,
    group.night.managerLogin,
    ...group.night.employeeLogins,
  ]);
  const uniqueAssignedLogins = new Set(assignedLogins);

  if (uniqueAssignedLogins.size !== assignedLogins.length) {
    throw new Error(`Один сотрудник назначен в несколько смен склада ${config.name}`);
  }

  const missingLogins = config.employeeSource.employees
    .filter(employee => !uniqueAssignedLogins.has(employee.login))
    .map(employee => `${employee.lastName} ${employee.firstName}`);
  if (missingLogins.length > 0) {
    throw new Error(`Не распределены сотрудники склада ${config.name}: ${missingLogins.join(", ")}`);
  }

  const groups: ShiftGroup[] = config.shiftSource.groups.map(group => ({
    id: group.id,
    day: {
      supervisors: [group.day.managerLogin, ...group.day.employeeLogins].map(resolveSupervisor),
    },
    night: {
      supervisors: [group.night.managerLogin, ...group.night.employeeLogins].map(resolveSupervisor),
    },
  }));

  return {
    id: config.employeeSource.warehouseId,
    name: config.name,
    palette: config.palette,
    anchorDate: config.anchorDate,
    anchorGroup: config.anchorGroup,
    dayShiftHours: config.dayShiftHours,
    nightShiftHours: config.nightShiftHours,
    groups,
  };
}

const WAREHOUSE_CONFIGS: WarehouseConfig[] = [
  {
    name: "Домодедово Промышленная Блок 1",
    palette: {
      group0:      "#1a6eb5",
      group0Light: "#edf4fc",
      group1:      "#0f7c58",
      group1Light: "#e8f5ef",
      topbar:      "#2ca5e0",
    },
    anchorDate: "2026-04-11",
    anchorGroup: 0,
    dayShiftHours: "11:00 – 23:00",
    nightShiftHours: "23:00 – 11:00",
    employeeSource: employees1,
    shiftSource: shifts1,
  },
  {
    name: "Домодедово Промышленная Блок 2",
    palette: {
      group0:      "#7c3aed",
      group0Light: "#f0ebff",
      group1:      "#c2410c",
      group1Light: "#fff2eb",
      topbar:      "#7c3aed",
    },
    anchorDate: "2026-04-11",
    anchorGroup: 0,
    dayShiftHours: "11:00 – 23:00",
    nightShiftHours: "23:00 – 11:00",
    employeeSource: employees2,
    shiftSource: shifts2,
  },
];

export const WAREHOUSES: Warehouse[] = WAREHOUSE_CONFIGS.map(buildWarehouse);

export const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTHS_RU_GEN = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
