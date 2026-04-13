export const WAREHOUSES = [
  {
    id: "ozon-1",
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
    groups: [
      {
        id: 0,
        day: {
          supervisors: [
            { name: "Долматов Сергей", isChief: true },
            { name: "Кривоногов Дмитрий", isChief: false },
          ],
        },
        night: {
          supervisors: [
            { name: "Жуков Руслан", isChief: true },
            { name: "Онопченко Яна", isChief: false },
          ],
        },
      },
      {
        id: 1,
        day: {
          supervisors: [
            { name: "Генералов Артем", isChief: true },
            { name: "Митин Максим", isChief: false },
          ],
        },
        night: {
          supervisors: [
            { name: "Кузьмин Максим", isChief: true },
            { name: "Тихонов Герман", isChief: false },
          ],
        },
      },
    ],
  },
  {
    id: "ozon-2",
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
    groups: [
      {
        id: 0,
        day: {
          supervisors: [
            { name: "Генералов Александр", isChief: true },
          ],
        },
        night: {
          supervisors: [
            { name: "Петров Александр", isChief: true },
          ],
        },
      },
      {
        id: 1,
        day: {
          supervisors: [
            { name: "Беляев Сергей", isChief: true },
            { name: "Ирина", isChief: false },
          ],
        },
        night: {
          supervisors: [
            { name: "Сергей", isChief: true },
          ],
        },
      },
    ],
  },
];

export const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTHS_RU_GEN = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
