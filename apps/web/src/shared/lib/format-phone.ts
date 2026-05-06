export function formatKoreanPhoneNumber(value?: string | null): string {
  if (!value) {
    return "";
  }

  const digits = value.replace(/[^0-9]/g, "");
  const result: string[] = [];

  if (digits.startsWith("02")) {
    result.push(digits.substring(0, 2));
    if (digits.length > 2) {
      if (digits.length <= 6) {
        result.push(digits.substring(2));
      } else {
        result.push(digits.substring(2, 6));
        result.push(digits.substring(6));
      }
    }
  } else if (digits.startsWith("15") || digits.startsWith("16")) {
    result.push(digits.substring(0, 4));
    if (digits.length > 4) {
      result.push(digits.substring(4, 8));
      result.push(digits.substring(8));
    }
  } else if (digits.startsWith("0507")) {
    result.push(digits.substring(0, 4));
    if (digits.length === 11) {
      result.push(digits.substring(4, 7));
      result.push(digits.substring(7));
    } else if (digits.length === 12) {
      result.push(digits.substring(4, 8));
      result.push(digits.substring(8));
    }
  } else if (digits.startsWith("01")) {
    result.push(digits.substring(0, 3));
    if (digits.length > 3) {
      result.push(digits.substring(3, 7));
      result.push(digits.substring(7));
    }
  } else if (digits.length <= 8) {
    result.push(digits.substring(0, 3));
    result.push(digits.substring(3));
  } else {
    result.push(digits.substring(0, 3));
    result.push(digits.substring(3, 6));
    result.push(digits.substring(6));
  }

  return result.filter(Boolean).join("-");
}
