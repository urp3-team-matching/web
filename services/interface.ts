import { ApiError } from "@/services/error";
import { Pagination } from "@/services/pagination";

type MaskedType<T> = Omit<T, "passwordHash">;

export interface SuccessResponse<T> {
  data: T;
  error: null;
}
export interface ErrorResponse {
  data: null;
  error: ApiError;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type CreateResponse<T> = ApiResponse<MaskedType<T>>;
export type RetrieveResponse<T> = ApiResponse<MaskedType<T>>;
export type SuccessListResponse<T> = {
  data: MaskedType<T>[];
  pagination: Pagination;
  error: null;
};
export type ErrorListResponse = {
  data: null;
  pagination: null;
  error: ApiError;
};
export type ListResponse<T> = SuccessListResponse<T> | ErrorListResponse;
export type UpdateResponse<T> = ApiResponse<MaskedType<T>>;
export type DeleteResponse = ApiResponse<null>;
