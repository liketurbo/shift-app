export const CONFIG = {
  // Any date when you know which shift was working.
  // Format: YYYY-MM-DD
  anchorDate: "2025-04-01",
  // Which shift worked on anchorDate (0 = Смена А, 1 = Смена Б)
  anchorGroup: 0,

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

  dayShiftHours: "11:00 – 23:00",
  nightShiftHours: "23:00 – 11:00",
};

export const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTHS_RU_GEN = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
