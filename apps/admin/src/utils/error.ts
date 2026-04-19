// 서버에러인지 클라이언트에러인지 체크
export const isCustomError = (error: any): string => {
  return typeof error === 'string' ? error : '네트워크 에러가 발생했습니다';
};
