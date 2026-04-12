export const WAREHOUSES = [
  {
    id: "ozon-1",
    name: "Озон — склад 1",
    anchorDate: "2025-04-01",
    anchorGroup: 0,
    dayShiftHours: "11:00 – 23:00",
    nightShiftHours: "23:00 – 11:00",
    groups: [
      {
        id: 0,
        day: {
          supervisors: [
            { name: "Алексей Иванов", isChief: true },
            { name: "Мария Сидорова", isChief: false },
          ],
        },
        night: {
          supervisors: [
            { name: "Дмитрий Козлов", isChief: true },
          ],
        },
      },
      {
        id: 1,
        day: {
          supervisors: [
            { name: "Наталья Петрова", isChief: true },
          ],
        },
        night: {
          supervisors: [
            { name: "Олег Волков", isChief: true },
          ],
        },
      },
    ],
  },
  {
    id: "ozon-2",
    name: "Озон — склад 2",
    anchorDate: "2025-04-01",
    anchorGroup: 1,
    dayShiftHours: "11:00 – 23:00",
    nightShiftHours: "23:00 – 11:00",
    groups: [
      {
        id: 0,
        day: {
          supervisors: [
            { name: "Игорь Смирнов", isChief: true },
          ],
        },
        night: {
          supervisors: [
            { name: "Анна Белова", isChief: true },
          ],
        },
      },
      {
        id: 1,
        day: {
          supervisors: [
            { name: "Павел Морозов", isChief: true },
          ],
        },
        night: {
          supervisors: [
            { name: "Елена Новикова", isChief: true },
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
