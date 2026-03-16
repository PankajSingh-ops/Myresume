'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { decodeJwt } from 'jose';
import { Loader2, AlertCircle } from 'lucide-react';
import { TemplateRenderer } from '@/components/cover-letter/templates/TemplateRenderer';
import type { CoverLetter } from '@/types/coverLetter';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function isTokenValid(token: string): boolean {
    try {
        const payload = decodeJwt(token);
        if (!payload.exp) return false;
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
}

import { Suspense } from 'react';

function CoverLetterRenderInner() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string;
    const token = searchParams?.get('token');

    const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Zero margins on html/body for Puppeteer
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        return () => {
            document.documentElement.style.margin = '';
            document.documentElement.style.padding = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
        };
    }, []);

    useEffect(() => {
        if (!token) {
            setError('Missing export token');
            return;
        }

        if (!isTokenValid(token)) {
            setError('Export token is invalid or expired');
            return;
        }

        const fetchCoverLetter = async () => {
            try {
                const res = await fetch(`${API_URL}/cover-letters/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    setError(`Failed to fetch cover letter (${res.status})`);
                    return;
                }
                const json = await res.json();
                setCoverLetter(json.data);
            } catch {
                setError('Network error fetching cover letter');
            }
        };

        fetchCoverLetter();
    }, [id, token]);

    // Signal to Puppeteer that render is complete
    useEffect(() => {
        const setReady = () => {
            const el = document.getElementById('cover-letter-ready');
            if (el && el.getAttribute('data-ready') !== 'true') {
                el.setAttribute('data-ready', 'true');
                console.log('Render complete signal sent.');
            }
        };

        let timeoutId: NodeJS.Timeout;

        if (coverLetter || error) {
            // Apply small delay for fonts and images to load after data
            timeoutId = setTimeout(setReady, 500);
        }

        // Absolute fallback to prevent Puppeteer 15s timeout crashes
        const fallbackId = setTimeout(setReady, 8000);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(fallbackId);
        };
    }, [coverLetter, error]);

    if (error) {
        return (
            <div
                id="cover-letter-ready"
                className="flex h-screen items-center justify-center bg-white p-8"
            >
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                    <p className="text-sm font-medium text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!coverLetter) {
        return (
            <div
                id="cover-letter-ready"
                className="flex h-screen items-center justify-center bg-white"
            >
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div id="cover-letter-ready" style={{ width: 794, minHeight: 1123 }} className="bg-white">
            <TemplateRenderer coverLetter={coverLetter} />
        </div>
    );
}

export default function CoverLetterRenderPage() {
    return (
        <Suspense fallback={
            <div id="cover-letter-ready" className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        }>
            <CoverLetterRenderInner />
        </Suspense>
    );
}
