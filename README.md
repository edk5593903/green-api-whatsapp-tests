# GREEN-API WhatsApp tests (Jest + TypeScript)

Автотесты для методов `sendMessage`, `getChatHistory` и `getStateInstance` сервиса GREEN-API (WhatsApp API), реализованные на Jest + TypeScript.

## Требования

- Node.js 20+
- npm
- Аккаунт GREEN-API (тариф Developer)
- Активный WhatsApp-аккаунт для авторизации инстанса и тестового получателя

## Установка

```bash
git clone https://github.com/edk5593903/green-api-whatsapp-tests.git
cd green-api-whatsapp-tests
npm install

## Настройка `.env`

В корне проекта создайте файл `.env` по образцу:

```env
API_URL=https://api.green-api.com
ID_INSTANCE=your_instance_id
API_TOKEN_INSTANCE=your_api_token
TEST_CHAT_ID=79991234567@c.us
```
ID_INSTANCE и API_TOKEN_INSTANCE берутся из консоли GREEN-API для созданного инстанса.
TEST_CHAT_ID — номер WhatsApp получателя в формате номер@c.us (номер без +).

Файл .env не хранится в репозитории и добавлен в .gitignore.

Текст + код:

text
## Запуск тестов

Все тесты (API + Selenium-шаблон):

```bash
npm test
```
Только API-тесты отправки/получения сообщений:

```bash
npx jest tests/greenApiMessages.test.ts
```
(опционально) Шаблон Selenium-теста UI консоли (помечен skip и не влияет на общий результат):

```bash
npx jest tests/seleniumConsole.test.ts
```
Пример результата прогона всех тестов: 3 test suites (1 skipped, 3 passed), 11 tests (1 skipped, 10 passed).

## Покрытие тестов

### Проверка авторизации инстанса (getStateInstance)

Проверка состояния инстанса выполняется в блоке `beforeAll` файла `tests/greenApiMessages.test.ts`:

- вызывается метод `getStateInstance` клиента GREEN-API;
- проверяется статус-код 200;
- проверяется наличие поля `stateInstance` и значение `authorized`.

Это выполняет требование задания «проверять, что инстанс авторизован с помощью метода getStateInstance».

### Отправка сообщения (sendMessage)

В `tests/greenApiMessages.test.ts` реализованы сценарии для `sendMessage`:

- позитивный сценарий: корректные `chatId` и `message` → ожидается статус-код 200 и наличие поля `idMessage` в ответе;
- негативные сценарии: пустой или некорректный `chatId` / `message` → ожидается статус-код 400, отдельный блок `describe('sendMessage required fields')` проверяет обязательные поля.

### История чата (getChatHistory)

Там же реализованы сценарии для `getChatHistory`:

- позитивный сценарий: корректные `chatId` и `count` → ожидается статус-код 200 и массив сообщений с ожидаемой структурой;
- негативные сценарии: пустой `chatId`, некорректный `count` → ожидается статус-код 400, отдельный блок `describe('getChatHistory required fields')` проверяет обязательные поля.

### Обработка лимитов (429 Too Many Requests)

Для тарифного плана Developer GREEN-API действует лимит запросов; при превышении API возвращает статус 429 `Too Many Requests`.  
В тестах учтён этот статус: при его получении проверки корректно обрабатывают ответ и при необходимости пропускают часть сценариев, чтобы тесты не падали только из-за rate limit.

## Selenium (необязательная часть)

Файл `tests/seleniumConsole.test.ts` содержит шаблон UI-теста на Selenium:

- поднимает браузер Chrome через `selenium-webdriver`;
- открывает консоль GREEN-API;
- ищет статус инстанса по CSS-классу `statusesAuth statusesAuth__auth` и проверяет текст `Авторизован`.

Тест помечен как `it.skip`, чтобы не зависеть от наличия активной UI-сессии и возможных изменений верстки консоли, и служит демонстрацией подхода к UI-автотестам для GREEN-API.

## Структура проекта

- `src/config.ts` — загрузка `.env` через `dotenv` и экспорт конфигурации API.
- `src/httpClient.ts` — axios-клиент с базовым URL и JSON-заголовками.
- `src/greenApiClient.ts` — обёртки над методами GREEN-API: `getStateInstance`, `sendMessage`, `getChatHistory`.
- `tests/smoke.test.ts` — smoke-тест (проверка, что Jest + TypeScript настроены).
- `tests/greenApiMessages.test.ts` — основной набор API-тестов (`getStateInstance` в `beforeAll`, `sendMessage` / `getChatHistory`: 200/400, обязательные поля, обработка 429).
- `tests/seleniumConsole.test.ts` — шаблон UI-теста на Selenium, помеченный `skip`.


## Сертификат

Проект прошёл проверку со стороны GREEN-API — выдан сертификат о выполнении тестового задания (март 2026).
