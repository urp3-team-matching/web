export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("010")) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[^0-9]/g, "");
};

export const validateKoreanPhone = (phone: string): boolean => {
  const cleaned = cleanPhoneNumber(phone);
  return /^01[0-9]\d{8}$/.test(cleaned);
};
