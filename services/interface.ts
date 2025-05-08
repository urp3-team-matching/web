import { ApiError } from "@/services/error";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type MaskedType<T> = Omit<T, "passwordHash">;

export interface SuccessResponse<T> {
  data: T;
}
interface ErrorResponse {
  data: null;
  error: ApiError;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
type SuccessListResponse<T> = {
  data: MaskedType<T>[];
  pagination: Pagination;
};
type ErrorListResponse = {
  data: null;
  pagination: null;
  error: ApiError;
};

export type CreateResponse<T> = ApiResponse<MaskedType<T>>;
export type RetrieveResponse<T> = ApiResponse<MaskedType<T>>;
export type ListResponse<T> = SuccessListResponse<T> | ErrorListResponse;
export type UpdateResponse<T> = ApiResponse<MaskedType<T>>;
export type DeleteResponse = ApiResponse<null>;
