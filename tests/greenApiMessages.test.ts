import { config } from '../src/config';
import { getStateInstance, sendMessage, getChatHistory } from '../src/greenApiClient';

describe('GREEN-API sendMessage & getChatHistory', () => {
  let skipTests = false;

  beforeAll(async () => {
    try {
      const stateResponse = await getStateInstance();

      if (stateResponse.status === 429) {
        // слишком много запросов, помечаем, что тесты надо пропустить
        skipTests = true;
        return;
      }

      expect(stateResponse.status).toBe(200);
      expect(stateResponse.data).toHaveProperty('stateInstance');
      expect(stateResponse.data.stateInstance).toBe('authorized');
    } catch (error: any) {
      // если вдруг 429 прилетит как ошибка axios
      if (error.response?.status === 429) {
        skipTests = true;
        return;
      }
      throw error;
    }
  });

  it('sendMessage: returns 200 and idMessage for valid request', async () => {
    if (skipTests) {
      return; // пропускаем, если лимит запросов
    }
    if (!config.testChatId) {
      throw new Error('TEST_CHAT_ID is not set in .env');
    }

    const response = await sendMessage({
      chatId: config.testChatId,
      message: 'Hello from Jest TS test',
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('idMessage');
    expect(typeof response.data.idMessage).toBe('string');
  });

  it('sendMessage: returns 400 when required fields are invalid', async () => {
    if (skipTests) {
      return;
    }

    await expect(
      sendMessage({
        chatId: '' as any,
        message: '' as any,
      }),
    ).rejects.toHaveProperty('response.status', 400);
  });

  it('getChatHistory: returns 200 and array of messages', async () => {
    if (skipTests) {
      return;
    }
    if (!config.testChatId) {
      throw new Error('TEST_CHAT_ID is not set in .env');
    }

    const response = await getChatHistory({
      chatId: config.testChatId,
      count: 10,
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);

        if (response.data.length > 0) {
      const first = response.data[0];
      expect(first).toHaveProperty('type');
      expect(typeof first.type).toBe('string');
      // при желании можно проверить другие поля, которые реально есть:
      // deletedMessageId, editedMessageId, isDeleted, isEdited, typeMessage и т.п.

    }
  });

    it('getChatHistory: returns 400 when required fields are invalid', async () => {
    if (skipTests) {
      return;
    }

    try {
      await getChatHistory({
        chatId: '' as any,
        count: -1 as any,
      });
      throw new Error('Expected getChatHistory to fail with 400, but it succeeded');
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 429) {
        // слишком много запросов — для тестового задания пропускаем проверку
        return;
      }
      expect(status).toBe(400);
    }
  });

     describe('sendMessage required fields', () => {
    const invalidCases = [
      {
        name: 'missing chatId',
        body: { chatId: '' as any, message: 'Hello' },
      },
      {
        name: 'missing message',
        body: { chatId: config.testChatId || '' as any, message: '' as any },
      },
    ];

    it.each(invalidCases)('returns 400 when %s', async ({ body }) => {
      if (!config.testChatId && body.chatId === config.testChatId) {
        // если TEST_CHAT_ID не задан, пропускаем этот кейс
        return;
      }

      // ожидаем, что сервер вернёт 400 (плохой запрос)
      await expect(sendMessage(body as any)).rejects.toHaveProperty('response.status', 400);
    });
  });
    describe('getChatHistory required fields', () => {
    const invalidCases = [
      {
        name: 'missing chatId',
        body: { chatId: '' as any, count: 10 },
      },
      {
        name: 'invalid count (negative)',
        body: { chatId: config.testChatId || '' as any, count: -5 as any },
      },
    ];

        it.each(invalidCases)('returns 400 when %s', async ({ body }) => {
      if (!config.testChatId && body.chatId === config.testChatId) {
        return;
      }

      try {
        await getChatHistory(body as any);
        throw new Error('Expected getChatHistory to fail with 400, but it succeeded');
      } catch (error: any) {
        const status = error.response?.status;
        if (status === 429) {
          // лимит запросов – считаем допустимым для тестового окружения
          return;
        }
        expect(status).toBe(400);
      }
    });

  });

});
