export interface ApiError {
  httpStatusCode: (typeof errorCodes)[keyof typeof errorCodes];
  message: string;
  details?: string;
}

export const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  UNKNOWN: 520,
  NOT_CLASSIFIED: 530,
} as const;

export const unknownError: ApiError = {
  httpStatusCode: errorCodes.UNKNOWN,
  message: "알 수 없는 에러가 발생했습니다.",
};

export const notImplementedError: ApiError = {
  httpStatusCode: errorCodes.NOT_IMPLEMENTED,
  message: "아직 구현되지 않은 기능입니다.",
};

export const notClassifiedError: ApiError = {
  httpStatusCode: errorCodes.NOT_CLASSIFIED,
  message: "분류되지 않은 에러가 발생했습니다.",
};
