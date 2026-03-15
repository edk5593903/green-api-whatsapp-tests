import { httpClient } from './httpClient';
import { config } from './config';

export type StateInstanceResponse = {
  stateInstance: string;
};

export async function getStateInstance() {
  const url = `/waInstance${config.idInstance}/getStateInstance/${config.apiTokenInstance}`;
  const response = await httpClient.get<StateInstanceResponse>(url);
  return response;
}
export type SendMessageRequest = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

export async function sendMessage(body: SendMessageRequest) {
  const url = `/waInstance${config.idInstance}/sendMessage/${config.apiTokenInstance}`;
  const response = await httpClient.post<SendMessageResponse>(url, body);
  return response;
}
export type GetChatHistoryRequest = {
  chatId: string;
  count?: number;
};

export type ChatHistoryMessage = {
  idMessage: string;
  chatId: string;
  type: string;
  textMessage?: string;
  // можно добавить поля при необходимости
};

export async function getChatHistory(body: GetChatHistoryRequest) {
  const url = `/waInstance${config.idInstance}/getChatHistory/${config.apiTokenInstance}`;
  const response = await httpClient.post<ChatHistoryMessage[]>(url, body);
  return response;
}
