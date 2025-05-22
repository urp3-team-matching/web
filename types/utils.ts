/**
 * 이 타입은 비밀번호 해시를 제외한 모든 속성을 포함하는 타입을 나타냅니다.
 */
export type PasswordOmittedType<T> = Omit<T, "passwordHash">;

/**
 * JSON 직렬화된 타입을 나타내는 유틸리티 타입
 * Date, Map, Set, BigInt 등의 특수 타입이 JSON으로 직렬화된 형태로 변환됨
 */
export type JsonSerialized<T> = T extends Date
  ? string
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends Map<infer K, infer V>
  ? Record<string, JsonSerialized<V>>
  : T extends Set<infer V>
  ? JsonSerialized<V>[]
  : T extends bigint
  ? string
  : T extends object
  ? { [K in keyof T]: JsonSerialized<T[K]> }
  : T;

/**
 * 실제 API 응답에서 사용되는 타입
 */
export type PublicType<T> = JsonSerialized<PasswordOmittedType<T>>;

export type PaginatedType<T> = {
  data: Array<T>;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

export type WithCurrentPassword<T> = T & {
  currentPassword: string;
};
