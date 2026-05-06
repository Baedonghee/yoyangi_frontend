import { isAxiosError } from 'axios';

const fallbackMessage = '네트워크 에러가 발생했습니다';

const formatMessage = (message: unknown): string | null => {
  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (Array.isArray(message)) {
    const messages = message.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    return messages.length ? messages.join('\n') : null;
  }

  return null;
};

// 서버에러인지 클라이언트에러인지 체크
export const isCustomError = (error: unknown): string => {
  const stringMessage = formatMessage(error);

  if (stringMessage) {
    return stringMessage;
  }

  if (isAxiosError(error)) {
    const responseData = error.response?.data;

    if (responseData && typeof responseData === 'object') {
      const serverMessage = formatMessage((responseData as { message?: unknown }).message);

      if (serverMessage) {
        return serverMessage;
      }
    }

    return formatMessage(error.message) || fallbackMessage;
  }

  if (error instanceof Error) {
    return formatMessage(error.message) || fallbackMessage;
  }

  return fallbackMessage;
};
