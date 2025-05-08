// 민감한 필드 목록
const SENSITIVE_FIELDS = ["passwordHash"];
export type MaskedType<T> = Omit<T, (typeof SENSITIVE_FIELDS)[number]>;

// 민감한 데이터를 제거하는 함수
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function removeSensitiveData<T extends Record<string, any>>(
  data: T | T[]
): MaskedType<T> | MaskedType<T>[] {
  if (Array.isArray(data)) {
    return data.map((item) => removeSensitiveData(item)) as Omit<
      T,
      (typeof SENSITIVE_FIELDS)[number]
    >[];
  }

  const result = { ...data };
  SENSITIVE_FIELDS.forEach((field) => {
    delete result[field];
  });

  return result as MaskedType<T>;
}
