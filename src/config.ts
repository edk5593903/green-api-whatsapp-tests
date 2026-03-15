import dotenv from 'dotenv';

dotenv.config();

const apiUrl = process.env.API_URL;
const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;
const testChatId = process.env.TEST_CHAT_ID;

if (!apiUrl || !idInstance || !apiTokenInstance) {
  throw new Error('Missing required environment variables for GREEN-API (API_URL, ID_INSTANCE, API_TOKEN_INSTANCE)');
}

export const config = {
  apiUrl,
  idInstance,
  apiTokenInstance,
  testChatId,
};
