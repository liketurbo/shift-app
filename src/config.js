export const CONFIG = {
  // Any date when you know which shift was working.
  // Format: YYYY-MM-DD
  anchorDate: "2025-04-01",
  // Which shift worked on anchorDate (0 = Смена А, 1 = Смена Б)
  anchorGroup: 0,

  groups: [
    {
      id: 0,
      supervisors: [
        { name: "Алексей Иванов", nameGen: "Алексея Иванова", isChief: true },
        { name: "Мария Сидорова", isChief: false },
        { name: "Дмитрий Козлов", isChief: false },
      ],
    },
    {
      id: 1,
      supervisors: [
        { name: "Наталья Петрова", nameGen: "Натальи Петровой", isChief: true },
        { name: "Олег Волков", isChief: false },
      ],
    },
  ],

  shiftHours: "08:00 – 20:00",
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
