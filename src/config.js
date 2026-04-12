export const WAREHOUSES = [
  {
    id: "ozon-1",
    name: "Домодедово Промышленная Блок 1",
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
