import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useCreditsStore } from '@/store/creditsStore';
import type { ApiErrorBody } from '@/types/api';

const PUBLIC_PATHS = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/privacy', '/terms', '/contact', '/help', '/cookies', '/faq', '/plans', '/templates', '/cover-templates', '/ats'];
const isPublicPath = (path: string) => {
    return PUBLIC_PATHS.includes(path) || path.startsWith('/r/') || path.startsWith('/c/') || path.startsWith('/blog') || path.startsWith('/resume-render/') || path.startsWith('/cover-letter-render/');
};

// ── Axios instance ───────────────────────────────────────────────────

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    timeout: 30_000,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach Bearer token ─────────────────────────

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Response interceptor: handle 401 / 402 ───────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((p) => {
        if (token) p.resolve(token);
        else p.reject(error);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const code = (error.response?.data as ApiErrorBody)?.code;

        // ── 401 handling ───────────────────────────────────────────────

        if (status === 401) {
            // Hard-fail codes → immediate logout
            if (code === 'INVALID_TOKEN' || code === 'TOKEN_REUSE') {
                useAuthStore.getState().clearAuth();
                if (typeof window !== 'undefined') {
                    const path = window.location.pathname;
                    if (!isPublicPath(path)) {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }

            // Token expired or missing → attempt silent refresh (once)
            if ((code === 'TOKEN_EXPIRED' || code === 'MISSING_TOKEN') && !originalRequest._retry) {
                if (isRefreshing) {
                    // Queue until the in-flight refresh resolves
                    return new Promise<string>((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const { data: refreshRes } = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                        {},
                        { withCredentials: true },
                    );

                    const newToken = refreshRes.data?.accessToken || refreshRes.accessToken;
                    useAuthStore.getState().setAccessToken(newToken);
                    processQueue(null, newToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    useAuthStore.getState().clearAuth();
                    if (typeof window !== 'undefined') {
                        const path = window.location.pathname;
                        if (!isPublicPath(path)) {
                            window.location.href = '/login';
                        }
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        }

        // ── 402 Insufficient Credits ──────────────────────────────────

        if (status === 402 && code === 'INSUFFICIENT_CREDITS') {
            const body = error.response?.data as ApiErrorBody & {
                required?: number;
                balance?: number;
            };
            useCreditsStore
                .getState()
                .openInsufficientModal(body.required ?? 0);
        }

        return Promise.reject(error);
    },
);
