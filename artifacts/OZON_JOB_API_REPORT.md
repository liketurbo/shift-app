# Ozon Job 2.23.0 — статический отчёт по API

Источник: `ru.ozon.hire`, versionCode `186`, versionName `2.23.0-GMS+HMS-release`.

Анализ выполнен по Retrofit-аннотациям и Kotlin/Moshi metadata в `classes.dex` и `classes6.dex`. Ниже перечислены относительные маршруты, непосредственно подтверждённые APK. Конкретный production base URL назначается сетевой конфигурацией во время работы приложения; по DNS-наблюдениям основные кандидаты — `api.ozon.ru` и `ojob.ozon.ru`.

## Получение графика и смен

| Метод | Маршрут | Метод интерфейса | Ответ |
|---|---|---|---|
| GET | `/v1/staff/shift/schedule` | `StaffApi.getScheduleStaff()` | `ScheduleStaffResponse` |
| GET | `/v1/employee/shifts` | `ShiftsApi.getShifts()` | `ShiftListResponse` |
| GET | `/v1/employee/shifts/{shiftId}` | `ShiftsApi.getEmployeeShiftsById()` | `EmployeeShiftResponse` |
| POST | `/v1/employee/shifts/{shiftId}/confirm` | `ShiftsApi.confirmShift(shiftId)` | пустой успешный ответ |
| POST | `/v1/shifts/{shiftId}/cancel` | `ShiftsApi.cancellationShift(shiftId)` | пустой успешный ответ |
| POST | `/v1/employee/shifts/cancel` | `BookingApi.cancelShifts(body)` | `CancelShiftsResponse` |

`ScheduleStaffResponse` содержит:

- список `ShiftStaffResponse`;
- объект `WarehouseStaffResponse`;
- у элемента `ShiftStaffResponse` есть секции `overtime` и `standard`.

`ShiftListResponse` содержит:

- `approveBookBeforeHours`: nullable integer;
- `hasPromotionShifts`: nullable boolean;
- `shifts`: список `ShiftResponse`;
- `staffShifts`: объект `StaffShiftsResponse`.

У `ShiftResponse` подтверждены поля:

```text
shiftId
interval
banner
isLearning
isNight
objectInformation
probability
process
promotionId
state
promoName
transportation
tripId
relocationUuid
shiftConstraints
```

Точные JSON-ключи `ShiftResponse`:

```text
id
interval
banner
isLearning
isNight
object
probability
process
promotionId
state
promoName
transportation
relocationId
relocationUuid
shiftConstraints
```

Обратите внимание на отличия модели от JSON: свойство Kotlin `shiftId` сериализуется как `id`, `objectInformation` как `object`, а `tripId` как `relocationId`.

Интервал смены представлен `ShiftIntervalResponse` с двумя строковыми значениями (вероятно, начало и конец; точные JSON-имена требуют выборочного разбора Moshi-адаптера).

Точная верхнеуровневая форма ответа рабочего графика:

```json
{
  "shifts": [
    {
      "overtime": {},
      "standard": {}
    }
  ],
  "warehouse": {}
}
```

У `standard` подтверждены свойства модели `completed`, `from`, `isNight`, `to`.

## Календарь и бронирование

| Метод | Маршрут | Path/body | Ответ |
|---|---|---|---|
| POST | `/v1/calendar/object/{id}/process/{processId}` | `id`, `processId`, `CalendarRequest` | `CalendarResponse` |
| POST | `/v1/calendar/object/{id}/process/{processId}/slots` | `id`, `processId`, `SelectedScheduleRequest` | `ShiftTimeSlotsResponse` |
| POST | `/v1/calendar/object/{id}/process/{processId}/conflicts` | `id`, `processId`, `ShiftConflictsRequest` | `ShiftConflictsResponse` |
| POST | `/v1/calendar/object/{id}/process/{processId}/book` | `id`, `processId`, `BookScheduleParamsRequest` | `BookScheduleResponse` |
| POST | `/v3/shifts/book` | `BookParamsRequest` | пустой успешный ответ |

Подтверждённая структура моделей на уровне типов:

```text
CalendarRequest(
  date: DateRequest
)

DateRequest(
  nullableInteger,
  integer,
  integer
)

BookParamsRequest(
  string,
  shifts: List<BookShiftRequest>,
  string
)

BookShiftRequest(
  string,
  boolean,
  string
)

BookScheduleParamsRequest(
  boolean,
  intervals: List<TimeIntervalRequest>,
  config: SelectedScheduleConfigRequest
)

CancelShiftsRequest(
  shiftIds: Set<String>
)
```

Названия, обозначенные по смыслу, но не подтверждённые Moshi-адаптером, нельзя использовать как готовые JSON-ключи без дополнительной проверки.

## Первичное оформление сотрудника

| Метод | Маршрут | Параметры |
|---|---|---|
| GET | `/v1/profile/contracts/available` | нет |
| GET | `/v1/staff/objects/{objectId}/positions` | `objectId` |
| GET | `/v1/staff/objects/{objectId}/positions/{positionGuid}` | `objectId`, `positionGuid` |
| POST | `/v1/staff/objects/{objectId}/positions/{positionGuid}/calendar` | path + `ScheduleInfoRequest` |
| POST | `/v1/staff/onboarding-shift/book` | `SlotRegistrationRequest` |
| POST | `/v1/staff/payout_period` | `PayoutPeriodRequest` |
| POST | `/v1/staff/contract/extend` | `AgreementSignInRequest` |

## Прочие подтверждённые маршруты

```text
GET  /v1/profile/barcode?isRefresh={boolean}
GET  /v1/profile
GET  /v2/profile
GET  /v1/employee/contracts
GET  /v1/employee/relocations
GET  /v1/employee/state
GET  /v1/object/list/for-staff
GET  /v1/oj-rating/list
GET  /v1/oj-rating/count
GET  /v1/oj-rating/{ratingId}
GET  /v1/regions
GET  /v2/relocations
```

WebSocket:

```text
wss://ws.ojob.ozon.ru/chat-notification.bx/ws/v3/common/bx?namespace={namespace}
```

## Что нельзя восстановить только из статического анализа

- действующие authorization/cookie значения пользователя;
- серверные обязательные заголовки и их актуальные значения;
- динамически получаемый production base URL для каждого API-клиента;
- точные ответы сервера и бизнес-ограничения;
- часть JSON-ключей обфусцированных моделей без разбора сгенерированных Moshi-адаптеров.

Не следует подставлять токены из чужой сессии или публиковать сохранённые mitmproxy/HAR-файлы: они могут содержать данные аккаунта.
