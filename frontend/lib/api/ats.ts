import { api } from '@/lib/api';
import type {
    ATSScanResult,
    ATSJobMatchResult,
    ATSScan,
} from '@/types/ats';

// ─── Response wrappers (match backend JSON envelope) ─────────

interface ScanResponse {
    success: boolean;
    data: ATSScanResult;
    scanId: string;
    credits: { deducted: number; newBalance: number };
}

interface MatchResponse {
    success: boolean;
    data: ATSJobMatchResult;
    scanId: string;
    credits: { deducted: number; newBalance: number };
}

interface PaginatedScansResponse {
    success: boolean;
    data: ATSScan[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface SingleScanResponse {
    success: boolean;
    data: ATSScan;
}

// ─── API functions ───────────────────────────────────────────

export async function scanResume(
    file: File
): Promise<{ data: ATSScanResult; scanId: string; credits: { deducted: number; newBalance: number } }> {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post<ScanResponse>(
        '/ats/scan-resume',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120_000 }
    );

    return { data: response.data.data, scanId: response.data.scanId, credits: response.data.credits };
}

export async function matchJobDescription(
    file: File,
    jobDescription: string
): Promise<{ data: ATSJobMatchResult; scanId: string; credits: { deducted: number; newBalance: number } }> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    const response = await api.post<MatchResponse>(
        '/ats/match-job',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120_000 }
    );

    return { data: response.data.data, scanId: response.data.scanId, credits: response.data.credits };
}

export async function getUserScans(
    page: number = 1,
    limit: number = 10
): Promise<{ scans: ATSScan[]; total: number }> {
    const response = await api.get<PaginatedScansResponse>('/ats/scans', {
        params: { page, limit },
    });

    return {
        scans: response.data.data,
        total: response.data.pagination.total,
    };
}

export async function getScanById(scanId: string): Promise<ATSScan> {
    const response = await api.get<SingleScanResponse>(
        `/ats/scans/${scanId}`
    );

    return response.data.data;
}
