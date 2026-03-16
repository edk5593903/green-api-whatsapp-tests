# GREEN-API WhatsApp tests — заметки

## Концепция

- API-тестирование = клиент для работы с API + набор сценариев (позитив/негатив) + конфигурация через `.env`.
- Разделение: `src` — клиент и конфиг, `tests` — логика тестов (Jest).
- Цель: проверить методы `sendMessage`, `getChatHistory`, `getStateInstance` в условиях реального тарифа Developer (лимиты, авторизация инстанса).

## Технологии

- Jest + TypeScript для API-тестов и UI-шаблона.
- Axios для HTTP, dotenv для конфигурации, selenium-webdriver для UI.
- TypeScript даёт типы для ответов API (`idMessage`, `stateInstance`) и ловит ошибки до запуска.

## Структура

- `src/config.ts` — читает `.env`, отдаёт `API_URL`, `ID_INSTANCE`, `API_TOKEN_INSTANCE`, `TEST_CHAT_ID`.
- `src/httpClient.ts` — axios-клиент с базовым URL.
- `src/greenApiClient.ts` — методы: `getStateInstance`, `sendMessage`, `getChatHistory`.
- `tests/smoke.test.ts` — проверка настройки Jest + TS.
- `tests/greenApiMessages.test.ts` — основная логика тестов (200/400, обязательные поля, лимит 429, `getStateInstance` в `beforeAll`).
- `tests/seleniumConsole.test.ts` — UI-шаблон, помечен `skip`.

## Логика тестов

- `beforeAll`: вызываем `getStateInstance`, проверяем статус 200 и `stateInstance = 'authorized'`.
- `sendMessage`:
  - позитив: 200 + `idMessage`;
  - негативы: пустой/битый `chatId` / `message` → 400, блок required fields.
- `getChatHistory`:
  - позитив: 200 + массив сообщений;
  - негативы: пустой `chatId`, некорректный `count` → 400, required fields.
- Лимит 429: учитываем `Too Many Requests`, чтобы тесты не падали из-за тарифа.

## Что сказать на собеседовании

- Почему TypeScript: типы для ответов API, меньше ошибок в рантайме, IDE-подсказки по полям.
- Почему клиент в `src`: тесты не зависят от деталей HTTP, меняем клиент — сценарии остаются.
- Чем API-тесты отличаются от UI: быстрее, стабильнее, ближе к контракту; UI здесь — демонстрация подхода.
- Как запускать: `.env` → `npm install` → `npm test` / `npx jest tests/greenApiMessages.test.ts`.
