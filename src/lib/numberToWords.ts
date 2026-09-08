/**
 * Chuyển đổi số tiền thành chữ tiếng Việt (VNĐ)
 * Ví dụ: 680000 -> "Sáu trăm tám mươi nghìn đồng chẵn"
 */

const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readThreeDigits(threeDigits: number, showZeroHundred: boolean): string {
  const hundred = Math.floor(threeDigits / 100);
  const remainder = threeDigits % 100;
  const ten = Math.floor(remainder / 10);
  const unit = remainder % 10;

  let result = '';

  if (hundred > 0 || showZeroHundred) {
    result += `${DIGITS[hundred]} trăm `;
  }

  if (ten > 1) {
    result += `${DIGITS[ten]} mươi `;
    if (unit === 1) {
      result += 'mốt ';
    } else if (unit === 5) {
      result += 'lăm ';
    } else if (unit > 0) {
      result += `${DIGITS[unit]} `;
    }
  } else if (ten === 1) {
    result += 'mười ';
    if (unit === 5) {
      result += 'lăm ';
    } else if (unit > 0) {
      result += `${DIGITS[unit]} `;
    }
  } else if (ten === 0 && unit > 0) {
    if (hundred > 0 || showZeroHundred) {
      result += 'lẻ ';
    }
    result += `${DIGITS[unit]} `;
  }

  return result.trim();
}

export function numberToVietnameseWords(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return 'Không đồng';
  }

  let num = Math.abs(Math.round(amount));
  const groups: number[] = [];

  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  const UNITS = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  const words: string[] = [];

  for (let i = groups.length - 1; i >= 0; i--) {
    const groupVal = groups[i];
    if (groupVal > 0) {
      const showZero = i < groups.length - 1;
      const readGroup = readThreeDigits(groupVal, showZero);
      if (readGroup) {
        words.push(readGroup);
        if (UNITS[i]) {
          words.push(UNITS[i]);
        }
      }
    }
  }

  if (words.length === 0) {
    return 'Không đồng';
  }

  let text = words.join(' ').trim();
  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return `${text} đồng chẵn`;
}
