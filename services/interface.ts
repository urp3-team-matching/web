import { ApiError } from "@/services/error";
import { Pagination } from "@/services/pagination";

type MaskedType<T> = Omit<T, "passwordHash">;

// 공통 에러 타입 정의

// 기본 응답 인터페이스 - 성공/실패 판별을 위한 success 필드 포함
interface BaseResponse {
  success: boolean;
}
export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
  error: null;
}
export interface ErrorResponse extends BaseResponse {
  success: false;
  data: null;
  error: ApiError;
}

// 유니온 타입으로 응답 정의
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// 구체적인 API 작업에 대한 응답 타입
export type CreateResponse<T> = ApiResponse<MaskedType<T>>;
export type RetrieveResponse<T> = ApiResponse<MaskedType<T>>;
export type UpdateResponse<T> = ApiResponse<MaskedType<T>>;
export type DeleteResponse<T> = ApiResponse<null>;

// 리스트 응답 타입
export interface SuccessListResponse<T> extends BaseResponse {
  success: true;
  data: MaskedType<T>[];
  pagination: Pagination;
  error: null;
}

export interface ErrorListResponse extends BaseResponse {
  success: false;
  data: null;
  pagination: null;
  error: ApiError;
}

export type ListResponse<T> = SuccessListResponse<T> | ErrorListResponse;
