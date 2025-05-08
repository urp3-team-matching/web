import { ApiError } from "@/services/error";
import { MaskedType } from "@/services/guard";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  data: T;
}
interface ErrorResponse {
  data: null;
  error: ApiError;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
type SuccessListResponse<T> = {
  data: T[];
  pagination: Pagination;
};
type ErrorListResponse = {
  data: null;
  pagination: null;
  error: ApiError;
};

export type CreateResponse<T> = ApiResponse<MaskedType<T>>;
export type RetrieveResponse<T> = ApiResponse<MaskedType<T>>;
export type ListResponse<T> =
  | SuccessListResponse<MaskedType<T>>
  | ErrorListResponse;
export type UpdateResponse<T> = ApiResponse<MaskedType<T>>;
export type DeleteResponse = ApiResponse<null>;
