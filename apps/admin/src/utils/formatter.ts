export const formatter = {
  formatKoreanPhoneNumber: (value: string): string => {
    if (!value) {
      return '';
    }

    // 숫자만 남기기
    value = value.replace(/[^0-9]/g, '');

    // 결과 저장 배열
    const result = [];

    if (value.startsWith('02')) {
      // 서울 번호 (02)
      result.push(value.substring(0, 2));
      if (value.length > 2) {
        if (value.length <= 6) {
          result.push(value.substring(2)); // 짧은 번호
        } else {
          result.push(value.substring(2, 6));
          result.push(value.substring(6));
        }
      }
    } else if (value.startsWith('050') || value.startsWith('15') || value.startsWith('16')) {
      // 050X, 15XX, 16XX
      result.push(value.substring(0, 4));
      if (value.length > 4) {
        result.push(value.substring(4, 8));
        result.push(value.substring(8));
      }
    } else if (value.startsWith('01')) {
      // 휴대폰 번호 (010, 011 등)
      result.push(value.substring(0, 3));
      if (value.length > 3) {
        result.push(value.substring(3, 7));
        result.push(value.substring(7));
      }
    } else {
      // 일반 유선 전화번호 (지역번호: 3자리 혹은 4자리)
      if (value.length <= 8) {
        result.push(value.substring(0, 4)); // 짧은 번호
        result.push(value.substring(4));
      } else {
        result.push(value.substring(0, 3));
        result.push(value.substring(3, 7));
        result.push(value.substring(7));
      }
    }

    // 결과 합치기
    return result.filter((val) => val).join('-');
  },
  phoneNumberWithInputHyphens: (value: string) => {
    if (!value) {
      return '';
    }

    value = value.replace(/[^0-9]/g, '');
    const result = [];

    let restNumber = '';

    result.push(value.substring(0, 3));
    restNumber = value.substring(3);

    if (restNumber.length === 7) {
      // 7자리만 남았을 때는 xxx-yyyy
      result.push(restNumber.substring(0, 4));
      result.push(restNumber.substring(4));
    } else {
      result.push(restNumber.substring(0, 4));
      result.push(restNumber.substring(4));
    }

    return result.filter((val) => val).join('-');
  },
  contactWithInputHyphens: (value: string) => {
    if (!value) {
      return '';
    }

    value = value.replace(/[^0-9]/g, '');

    const result = [];
    let restNumber = '';

    // 지역번호와 나머지 번호로 나누기
    if (value.startsWith('02')) {
      // 서울 02 지역번호
      result.push(value.substr(0, 2));
      restNumber = value.substring(2);
    } else if (value.startsWith('1')) {
      // 지역 번호가 없는 경우
      // 1xxx-yyyy
      restNumber = value;
    } else {
      // 나머지 3자리 지역번호
      // 0xx-yyyy-zzzz
      result.push(value.substr(0, 3));
      restNumber = value.substring(3);
    }

    if (restNumber.length === 7) {
      // 7자리만 남았을 때는 xxx-yyyy
      result.push(restNumber.substring(0, 3));
      result.push(restNumber.substring(3));
    } else {
      result.push(restNumber.substring(0, 4));
      result.push(restNumber.substring(4));
    }

    return result.filter((val) => val).join('-');
  },
  removePhoneNumberHyphens: (value: string) => {
    if (!value) {
      return '';
    }
    return value.replace(/[^0-9]/g, '');
  },
  onlyNumber: (value: string) => {
    if (!value) {
      return '';
    }
    return value.replace(/[^0-9]/g, '');
  },
  onlyNumberAndDot: (value: string) => {
    if (!value) {
      return '';
    }
    return value.replace(/[^0-9.]/g, '');
  },
  onlyNumberAndMinus: (value: string) => {
    if (!value) {
      return '';
    }
    return value.replace(/[^0-9-]/g, '');
  },
  selectRange: (value: string, beforeValue: string, selectStart: number): number => {
    if (value.startsWith('02')) {
      if (value.length > 2 && beforeValue.length < value.length) {
        if (selectStart === 3 || selectStart === 8) {
          return Number(selectStart) + 1;
        } else {
          return Number(selectStart);
        }
      }
    } else {
      if (value.length > 3 && beforeValue.length < value.length) {
        if (selectStart === 4 || selectStart === 9) {
          return Number(selectStart) + 1;
        } else {
          return Number(selectStart);
        }
      }
    }
    return Number(selectStart);
  },
  timeFormat: (value: string, beforeValue: string) => {
    if (!value) {
      return '';
    }

    if (value.length > 8) {
      return value;
    }

    let newValue = value.replace(/[^0-9]/g, '');

    if (newValue.length === 1) {
      if (Number(newValue) > 2) {
        return '';
      }
    }

    if (Number(newValue.substring(0, 1)) > 2) {
      if (newValue.length === 2) {
        return newValue.substring(0, 1);
      } else {
        return beforeValue;
      }
    }

    if (newValue.length === 3) {
      if (Number(newValue.substring(2)) > 5) {
        return newValue.substring(0, 2);
      }
    }

    if (newValue.length === 5) {
      if (Number(newValue.substring(4)) > 5) {
        newValue = newValue.substring(0, 4);
      }
    }

    const result = [];

    let restNumber = '';
    result.push(newValue.substring(0, 2));
    restNumber = newValue.substring(2);

    if (restNumber.length === 5) {
      // 7자리만 남았을 때는 xxx-yyyy
      result.push(restNumber.substring(0, 2));
      result.push(restNumber.substring(2));
    } else {
      result.push(restNumber.substring(0, 2));
      result.push(restNumber.substring(2));
    }

    return result.filter((val) => val).join(':');
  },
  timeConvert: (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${hours ? String(hours).padStart(2, '0') : '00'}:${minutes ? String(minutes).padStart(2, '0') : '00'}:${
      remainingSeconds ? String(remainingSeconds).padStart(2, '0') : '00'
    }`;

    return formattedTime;
  },
  timeConvertToSeconds: (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds;
  },
  timeFillZero: (value: string) => {
    // 입력값을 파싱하여 시, 분, 초로 분할
    const parts = value.split(':');
    let hours: number | string = 0,
      minutes = 0,
      seconds = 0;

    if (parts.length === 1) {
      hours = parseInt(parts[0], 10);
      if (parts[0].length === 1 && Number(parts[0]) < 3) {
        hours = parts[0] + '0';
      } else {
        hours = hours.toString().padStart(2, '0');
      }
    } else if (parts.length === 2) {
      // 시간과 분만 입력된 경우 (예: "10:0")
      hours = parseInt(parts[0], 10);
      if (parts[0].length === 1 && Number(parts[0]) < 3) {
        hours = parts[0] + '0';
      } else {
        hours = hours.toString().padStart(2, '0');
      }
      minutes = parseInt(parts[1], 10);
    } else if (parts.length === 3) {
      // 시간, 분, 초 모두 입력된 경우 (예: "10:00:00")
      hours = parseInt(parts[0], 10);
      if (parts[0].length === 1 && Number(parts[0]) < 3) {
        hours = parts[0] + '0';
      } else {
        hours = hours.toString().padStart(2, '0');
      }
      minutes = parseInt(parts[1], 10);
      seconds = parseInt(parts[2], 10);
    }

    // 시간, 분, 초를 2자리 숫자로 포맷팅하여 반환
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },
  pathNameParser: (pathName: string) => {
    const pathRegex = /^\/[^?#]+/;
    const result = pathName.match(pathRegex);
    return result ? result[0] : pathName;
  },
  addComma: (value: number | string, unit?: string) => {
    if (!value) {
      return unit ? '0' + unit : '0';
    }
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (unit) {
      return value.replace(/[^0-9]/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') + unit;
    }
    return value.replace(/[^0-9]/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  },
  removeComma: (value: string) => {
    return value.replace(/,/g, '');
  },
  selectContactRange: (newValue: string, oldValue: string, currentCursor: number): number => {
    // '-'의 개수 차이를 계산
    const oldHyphens = (oldValue.match(/-/g) || []).length;
    const newHyphens = (newValue.match(/-/g) || []).length;

    // 길이 차이와 커서 위치 보정
    const diff = newHyphens - oldHyphens;

    // 커서 보정 (중간에서 삭제 시에도 유지)
    return currentCursor + diff;
  },
};
