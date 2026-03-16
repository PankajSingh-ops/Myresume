import { AxiosError } from 'axios';

/** RFC 7807 Problem Details shape returned by the backend */
export interface ApiErrorBody {
    status: number;
    title: string;
    detail: string;
    code?: string;
    errors?: Record<string, string[]>;
}

/** Typed Axios error with our API error body */
export type ApiError = AxiosError<ApiErrorBody>;

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
